#!/usr/bin/env python3
"""
Простий збирач коментарів YouTube через API
Використовує тільки вбудовані бібліотеки
"""

import json
import urllib.request
import urllib.parse
import os
from datetime import datetime

class SimpleYouTubeCollector:
    def __init__(self):
        self.api_key = os.getenv('YOUTUBE_API_KEY')
        if not self.api_key:
            raise ValueError("❌ YOUTUBE_API_KEY не знайдено в змінних середовища!")
        
        self.base_url = "https://www.googleapis.com/youtube/v3"
        self.playlist_id = "PLNz8wZnk2_6WvkuOVxq-wubNOPGHYTfk3"
        self.comments_data = []
    
    def make_api_request(self, endpoint, params):
        """Робить запит до YouTube API"""
        params['key'] = self.api_key
        url = f"{self.base_url}/{endpoint}?" + urllib.parse.urlencode(params)
        
        try:
            with urllib.request.urlopen(url) as response:
                return json.loads(response.read().decode())
        except Exception as e:
            print(f"❌ Помилка API: {e}")
            return None
    
    def get_playlist_videos(self):
        """Отримує список відео з плейлиста"""
        videos = []
        next_page_token = None
        
        while True:
            params = {
                'part': 'snippet',
                'playlistId': self.playlist_id,
                'maxResults': 50
            }
            
            if next_page_token:
                params['pageToken'] = next_page_token
            
            response = self.make_api_request('playlistItems', params)
            
            if not response:
                break
            
            for item in response.get('items', []):
                video_info = {
                    'video_id': item['snippet']['resourceId']['videoId'],
                    'title': item['snippet']['title'],
                    'published_at': item['snippet']['publishedAt']
                }
                videos.append(video_info)
                print(f"   📹 {video_info['title']}")
            
            next_page_token = response.get('nextPageToken')
            if not next_page_token:
                break
        
        return videos
    
    def get_video_comments(self, video_id, video_title):
        """Отримує коментарі для відео"""
        comments = []
        next_page_token = None
        
        while len(comments) < 100:  # Максимум 100 коментарів на відео
            params = {
                'part': 'snippet',
                'videoId': video_id,
                'maxResults': 100,
                'order': 'relevance'
            }
            
            if next_page_token:
                params['pageToken'] = next_page_token
            
            response = self.make_api_request('commentThreads', params)
            
            if not response:
                break
            
            for item in response.get('items', []):
                comment_data = item['snippet']['topLevelComment']['snippet']
                
                comment = {
                    'author': comment_data['authorDisplayName'],
                    'text': comment_data['textDisplay'],
                    'published_at': comment_data['publishedAt'],
                    'like_count': comment_data['likeCount'],
                    'video_id': video_id,
                    'video_title': video_title,
                    'video_url': f"https://www.youtube.com/watch?v={video_id}"
                }
                
                comments.append(comment)
            
            next_page_token = response.get('nextPageToken')
            if not next_page_token:
                break
        
        return comments
    
    def classify_comment(self, comment):
        """Класифікує коментар для маркетингу"""
        text = comment['text'].lower()
        score = 0
        categories = []
        
        # Позитивні слова
        positive_words = ['дякую', 'спасибо', 'thanks', 'корисно', 'чудово', 
                         'відмінно', 'найкращ', 'рекомендую', 'допомогло']
        
        # Слова-свідчення
        testimonial_words = ['врятував', 'життя', 'завдяки', 'тепер я', 
                           'навчився', 'зміг', 'вдалося']
        
        # Перевірка
        for word in positive_words:
            if word in text:
                score += 3
                categories.append('positive')
                break
        
        for word in testimonial_words:
            if word in text:
                score += 5
                categories.append('testimonial')
                break
        
        # Додаткові бали
        if len(text) > 100:
            score += 2
        if comment['like_count'] > 10:
            score += 2
        if comment['like_count'] > 50:
            score += 3
        
        return {
            'score': score,
            'quality': 'excellent' if score >= 8 else 'good' if score >= 5 else 'normal',
            'categories': categories,
            'is_marketing_worthy': score >= 5
        }
    
    def collect_all(self):
        """Збирає всі коментарі"""
        print("🚀 Починаємо збір коментарів...")
        print(f"📋 Плейлист: {self.playlist_id}")
        
        # Отримуємо відео
        print("\n📹 Отримуємо список відео...")
        videos = self.get_playlist_videos()
        print(f"✅ Знайдено {len(videos)} відео")
        
        # Збираємо коментарі
        total_marketing_comments = 0
        
        for i, video in enumerate(videos[:5], 1):  # Обмежуємо 5 відео для тесту
            print(f"\n🎬 Обробка відео {i}/{min(len(videos), 5)}: {video['title'][:50]}...")
            
            comments = self.get_video_comments(video['video_id'], video['title'])
            print(f"   💬 Знайдено {len(comments)} коментарів")
            
            # Класифікуємо
            marketing_worthy = 0
            for comment in comments:
                classification = self.classify_comment(comment)
                comment['classification'] = classification
                
                if classification['is_marketing_worthy']:
                    self.comments_data.append(comment)
                    marketing_worthy += 1
            
            print(f"   ✨ Відібрано {marketing_worthy} якісних коментарів")
            total_marketing_comments += marketing_worthy
        
        print(f"\n📊 Всього зібрано {total_marketing_comments} коментарів для маркетингу")
    
    def save_results(self):
        """Зберігає результати"""
        output_dir = "/Users/chyngys/scripts/neb-content-appv2/marketing_data"
        os.makedirs(output_dir, exist_ok=True)
        
        # Сортуємо за якістю
        self.comments_data.sort(key=lambda x: x['classification']['score'], reverse=True)
        
        # JSON файл
        json_file = os.path.join(output_dir, "youtube_comments_real.json")
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump({
                'collected_at': datetime.now().isoformat(),
                'playlist_id': self.playlist_id,
                'total_comments': len(self.comments_data),
                'comments': self.comments_data
            }, f, ensure_ascii=False, indent=2)
        
        # Markdown файл для перегляду
        md_file = os.path.join(output_dir, "youtube_comments_best.md")
        with open(md_file, 'w', encoding='utf-8') as f:
            f.write("# 🌟 Найкращі коментарі для маркетингу\n\n")
            f.write(f"*Зібрано: {datetime.now().strftime('%Y-%m-%d %H:%M')}*\n\n")
            
            # Топ-10 коментарів
            for i, comment in enumerate(self.comments_data[:10], 1):
                f.write(f"## {i}. {comment['author']}\n")
                f.write(f"*Відео: {comment['video_title']}*\n")
                f.write(f"*Дата: {comment['published_at'][:10]} | 👍 {comment['like_count']}*\n\n")
                f.write(f"> {comment['text']}\n\n")
                f.write("---\n\n")
        
        print(f"\n✅ Результати збережено:")
        print(f"   📄 JSON: {json_file}")
        print(f"   📝 Markdown: {md_file}")

def main():
    try:
        collector = SimpleYouTubeCollector()
        collector.collect_all()
        collector.save_results()
        
    except ValueError as e:
        print(e)
        print("\n📝 Встановіть змінну середовища:")
        print("   export YOUTUBE_API_KEY='ваш_ключ_тут'")
    except Exception as e:
        print(f"❌ Помилка: {e}")

if __name__ == "__main__":
    main()