#!/usr/bin/env python3
"""
YouTube Comments Collector using YouTube Data API
Потребує YouTube API key в змінній середовища YOUTUBE_API_KEY
"""

import os
import json
from datetime import datetime
from typing import List, Dict, Optional
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

class YouTubeAPICollector:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv('YOUTUBE_API_KEY')
        if not self.api_key:
            raise ValueError("YouTube API key не знайдено. Встановіть YOUTUBE_API_KEY")
        
        self.youtube = build('youtube', 'v3', developerKey=self.api_key)
        self.comments_data = []
        self.playlist_id = "PLNz8wZnk2_6WvkuOVxq-wubNOPGHYTfk3"
    
    def get_playlist_videos(self) -> List[Dict]:
        """Отримує всі відео з плейлиста"""
        videos = []
        next_page_token = None
        
        try:
            while True:
                playlist_response = self.youtube.playlistItems().list(
                    part='snippet',
                    playlistId=self.playlist_id,
                    maxResults=50,
                    pageToken=next_page_token
                ).execute()
                
                for item in playlist_response.get('items', []):
                    video_info = {
                        'video_id': item['snippet']['resourceId']['videoId'],
                        'title': item['snippet']['title'],
                        'published_at': item['snippet']['publishedAt']
                    }
                    videos.append(video_info)
                
                next_page_token = playlist_response.get('nextPageToken')
                if not next_page_token:
                    break
                    
        except HttpError as e:
            print(f"Помилка API: {e}")
            
        return videos
    
    def get_video_comments(self, video_id: str, video_title: str) -> List[Dict]:
        """Отримує коментарі для конкретного відео"""
        comments = []
        next_page_token = None
        
        try:
            while len(comments) < 100:  # Обмежуємо до 100 коментарів на відео
                comments_response = self.youtube.commentThreads().list(
                    part='snippet',
                    videoId=video_id,
                    maxResults=100,
                    pageToken=next_page_token,
                    order='relevance'  # Найбільш релевантні коментарі
                ).execute()
                
                for item in comments_response.get('items', []):
                    comment_data = item['snippet']['topLevelComment']['snippet']
                    
                    comment = {
                        'author': comment_data['authorDisplayName'],
                        'author_channel_url': comment_data['authorChannelUrl'],
                        'text': comment_data['textDisplay'],
                        'published_at': comment_data['publishedAt'],
                        'updated_at': comment_data.get('updatedAt', comment_data['publishedAt']),
                        'like_count': comment_data['likeCount'],
                        'video_id': video_id,
                        'video_title': video_title,
                        'video_url': f"https://www.youtube.com/watch?v={video_id}"
                    }
                    
                    comments.append(comment)
                
                next_page_token = comments_response.get('nextPageToken')
                if not next_page_token:
                    break
                    
        except HttpError as e:
            print(f"Помилка при отриманні коментарів для відео {video_id}: {e}")
            
        return comments
    
    def classify_comment_for_marketing(self, comment: Dict) -> Dict:
        """Класифікує коментар для маркетингових цілей"""
        text = comment['text'].lower()
        
        # Маркетингові категорії
        categories = {
            'testimonial': {
                'keywords': ['завдяки', 'благодаря', 'thanks to', 'допомогло', 'helped', 
                           'врятувало', 'saved', 'навчився', 'learned', 'тепер я', 'now i'],
                'weight': 5
            },
            'positive_feedback': {
                'keywords': ['чудово', 'excellent', 'найкращ', 'best', 'рекомендую', 
                           'recommend', 'корисно', 'useful', 'дякую', 'thanks'],
                'weight': 3
            },
            'success_story': {
                'keywords': ['вдалося', 'managed', 'зміг', 'досяг', 'achieved', 
                           'результат', 'result', 'покращ', 'improved'],
                'weight': 4
            },
            'emotional': {
                'keywords': ['❤️', '🔥', '💪', '🏍️', 'люблю', 'love', 'захват', 'amazing'],
                'weight': 2
            },
            'specific_benefit': {
                'keywords': ['безпека', 'safety', 'впевнен', 'confident', 'професіонал', 
                           'professional', 'досвід', 'experience'],
                'weight': 4
            }
        }
        
        score = 0
        matched_categories = []
        
        # Базові бали за характеристики
        if len(text) > 100:
            score += 2
        if comment['like_count'] > 5:
            score += 2
        if comment['like_count'] > 20:
            score += 3
            
        # Перевірка категорій
        for category, data in categories.items():
            for keyword in data['keywords']:
                if keyword in text:
                    score += data['weight']
                    matched_categories.append(category)
                    break
        
        # Визначення рівня якості
        if score >= 10:
            quality_level = 'excellent'
        elif score >= 6:
            quality_level = 'good'
        elif score >= 3:
            quality_level = 'moderate'
        else:
            quality_level = 'low'
            
        return {
            'score': score,
            'quality_level': quality_level,
            'categories': list(set(matched_categories)),
            'is_marketing_worthy': score >= 6
        }
    
    def collect_all_comments(self):
        """Збирає коментарі з усіх відео плейлиста"""
        print(f"🔍 Отримуємо відео з плейлиста {self.playlist_id}...")
        videos = self.get_playlist_videos()
        print(f"📹 Знайдено {len(videos)} відео")
        
        for i, video in enumerate(videos, 1):
            print(f"\n📺 Обробка відео {i}/{len(videos)}: {video['title']}")
            
            comments = self.get_video_comments(video['video_id'], video['title'])
            print(f"   💬 Знайдено {len(comments)} коментарів")
            
            # Класифікуємо кожен коментар
            for comment in comments:
                classification = self.classify_comment_for_marketing(comment)
                comment['marketing_classification'] = classification
                
                # Додаємо тільки якісні коментарі
                if classification['is_marketing_worthy']:
                    self.comments_data.append(comment)
            
            print(f"   ✨ Відібрано {sum(1 for c in comments if c['marketing_classification']['is_marketing_worthy'])} якісних коментарів")
    
    def save_results(self):
        """Зберігає результати в структуровані файли"""
        output_dir = "/Users/chyngys/scripts/neb-content-appv2/marketing_data"
        os.makedirs(output_dir, exist_ok=True)
        
        # Основний файл з усіма коментарями
        all_comments_file = os.path.join(output_dir, "youtube_comments_all.json")
        with open(all_comments_file, 'w', encoding='utf-8') as f:
            json.dump({
                'collection_date': datetime.now().isoformat(),
                'playlist_id': self.playlist_id,
                'total_comments': len(self.comments_data),
                'comments': self.comments_data
            }, f, ensure_ascii=False, indent=2)
        
        # Файл з найкращими коментарями для маркетингу
        excellent_comments = [c for c in self.comments_data 
                            if c['marketing_classification']['quality_level'] == 'excellent']
        
        best_comments_file = os.path.join(output_dir, "youtube_comments_best.json")
        with open(best_comments_file, 'w', encoding='utf-8') as f:
            json.dump({
                'collection_date': datetime.now().isoformat(),
                'total_excellent': len(excellent_comments),
                'comments': excellent_comments
            }, f, ensure_ascii=False, indent=2)
        
        # Файл з коментарями по категоріях
        categorized_file = os.path.join(output_dir, "youtube_comments_by_category.json")
        categories_dict = {}
        
        for comment in self.comments_data:
            for category in comment['marketing_classification']['categories']:
                if category not in categories_dict:
                    categories_dict[category] = []
                categories_dict[category].append({
                    'author': comment['author'],
                    'text': comment['text'],
                    'video_title': comment['video_title'],
                    'date': comment['published_at'],
                    'likes': comment['like_count'],
                    'url': comment['video_url']
                })
        
        with open(categorized_file, 'w', encoding='utf-8') as f:
            json.dump(categories_dict, f, ensure_ascii=False, indent=2)
        
        # Створюємо Markdown файл для легкого перегляду
        markdown_file = os.path.join(output_dir, "youtube_comments_for_marketing.md")
        with open(markdown_file, 'w', encoding='utf-8') as f:
            f.write("# YouTube Comments for Marketing\n\n")
            f.write(f"Collected on: {datetime.now().strftime('%Y-%m-%d %H:%M')}\n\n")
            
            f.write("## 🌟 Excellent Testimonials\n\n")
            for comment in excellent_comments[:10]:  # Top 10
                f.write(f"### {comment['author']}\n")
                f.write(f"*Video: {comment['video_title']}*\n")
                f.write(f"*Date: {comment['published_at'][:10]}*\n")
                f.write(f"*Likes: {comment['like_count']}*\n\n")
                f.write(f"> {comment['text']}\n\n")
                f.write("---\n\n")
        
        print(f"\n✅ Результати збережено:")
        print(f"   📄 Всі коментарі: {all_comments_file}")
        print(f"   ⭐ Найкращі: {best_comments_file}")
        print(f"   📊 По категоріях: {categorized_file}")
        print(f"   📝 Markdown: {markdown_file}")

def main():
    try:
        # Спробуємо використати API
        collector = YouTubeAPICollector()
        collector.collect_all_comments()
        collector.save_results()
        
        print(f"\n📊 Фінальна статистика:")
        print(f"   Всього якісних коментарів: {len(collector.comments_data)}")
        
        excellent = sum(1 for c in collector.comments_data 
                       if c['marketing_classification']['quality_level'] == 'excellent')
        good = sum(1 for c in collector.comments_data 
                  if c['marketing_classification']['quality_level'] == 'good')
        
        print(f"   Відмінних: {excellent}")
        print(f"   Хороших: {good}")
        
    except ValueError as e:
        print(f"\n⚠️  {e}")
        print("\n📝 Інструкція по отриманню YouTube API Key:")
        print("1. Перейдіть на https://console.cloud.google.com/")
        print("2. Створіть новий проект або виберіть існуючий")
        print("3. Включіть YouTube Data API v3")
        print("4. Створіть API key в розділі Credentials")
        print("5. Встановіть змінну середовища:")
        print("   export YOUTUBE_API_KEY='ваш_ключ_тут'")
        print("\nАбо запустіть простий збирач без API:")
        print("   python scripts/youtube-comments-collector.py")

if __name__ == "__main__":
    main()