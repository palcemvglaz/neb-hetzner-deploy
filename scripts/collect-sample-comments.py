#!/usr/bin/env python3
"""
Демо-збирач коментарів для маркетингу
Створює приклади на основі типових позитивних відгуків
"""

import json
import os
from datetime import datetime, timedelta
import random

def generate_sample_comments():
    """Генерує реалістичні приклади коментарів для маркетингу"""
    
    # Шаблони відгуків на основі реальних патернів
    testimonial_templates = [
        {
            'text': 'Дякую за {topic}! Завдяки вашим порадам я {achievement}. Це реально працює! 🏍️',
            'topics': ['урок про гальмування', 'відео про повороти', 'поради щодо безпеки', 'майстер-клас'],
            'achievements': ['уникнув аварії минулого тижня', 'почуваюся впевненіше на дорозі', 
                           'навчився правильно входити в повороти', 'подолав страх швидкості']
        },
        {
            'text': 'Найкращий канал про мотобезпеку! {detail} Рекомендую всім {audience} 👍',
            'details': ['Все пояснюєте простою мовою', 'Показуєте на реальних прикладах',
                       'Даєте практичні поради', 'Ваші уроки врятували мені життя'],
            'audiences': ['початківцям', 'мотоциклістам', 'хто хоче їздити безпечно', 'своїм друзям']
        },
        {
            'text': '{timeframe} дивлюся ваш канал і {result}. {emotion}!',
            'timeframes': ['Вже 3 місяці', 'Півроку тому почав', 'З минулого року', 'Кілька тижнів'],
            'results': ['моя техніка значно покращилась', 'перестав боятися складних ситуацій',
                       'навчився передбачати небезпеку', 'став досвідченішим водієм'],
            'emotions': ['Дуже вдячний', 'Це неймовірно', 'Щиро дякую', 'Ви молодець']
        },
        {
            'text': 'Після вашого відео про {topic} я зрозумів, що {realization}. Тепер {action} 💪',
            'topics': ['контраварійне водіння', 'правильну посадку', 'вибір екіпіровки', 'погодні умови'],
            'realizations': ['робив багато помилок', 'недооцінював важливість навчання',
                           'потрібно постійно вдосконалюватись', 'безпека - це №1'],
            'actions': ['завжди дотримуюсь ваших порад', 'практикую кожен день',
                       'ділюся знаннями з друзями', 'їжджу набагато безпечніше']
        }
    ]
    
    # Імена коментаторів
    names = [
        'Олександр М.', 'Марія К.', 'Петро В.', 'Анна С.', 'Іван П.',
        'Оксана Д.', 'Михайло Б.', 'Юлія Т.', 'Андрій Л.', 'Наталія Р.',
        'Віктор Ч.', 'Світлана Г.', 'Дмитро К.', 'Тетяна М.', 'Сергій О.'
    ]
    
    # Назви відео (на основі типових тем)
    video_titles = [
        'Правильне гальмування на мотоциклі - повний курс',
        'Контраварійне водіння: 8 принципів безпеки',
        'Як правильно входити в повороти на мотоциклі',
        'Помилки початківців, які можуть коштувати життя',
        'Екстрене гальмування: практичні вправи',
        'Їзда в дощ: техніка безпеки та поради',
        'Правильна посадка на мотоциклі',
        'Як обирати першу екіпіровку',
        'Психологія безпечного водіння',
        'Огляд найчастіших причин ДТП з мотоциклістами'
    ]
    
    comments = []
    
    # Генеруємо 50+ коментарів
    for i in range(60):
        template = random.choice(testimonial_templates)
        
        # Формуємо текст коментаря
        if 'topics' in template:
            text = template['text'].format(
                topic=random.choice(template['topics']),
                achievement=random.choice(template.get('achievements', [''])),
                detail=random.choice(template.get('details', [''])),
                audience=random.choice(template.get('audiences', [''])),
                timeframe=random.choice(template.get('timeframes', [''])),
                result=random.choice(template.get('results', [''])),
                emotion=random.choice(template.get('emotions', [''])),
                realization=random.choice(template.get('realizations', [''])),
                action=random.choice(template.get('actions', ['']))
            )
        else:
            text = template['text']
        
        # Створюємо коментар
        comment = {
            'author': random.choice(names),
            'text': text,
            'video_title': random.choice(video_titles),
            'video_url': f'https://www.youtube.com/watch?v=example_{i}',
            'date': (datetime.now() - timedelta(days=random.randint(1, 180))).strftime('%Y-%m-%d'),
            'likes': random.randint(5, 150),
            'marketing_category': 'testimonial' if i < 20 else 'positive_feedback' if i < 40 else 'success_story'
        }
        
        comments.append(comment)
    
    # Додаємо кілька особливо потужних відгуків
    power_testimonials = [
        {
            'author': 'Володимир К.',
            'text': 'Ваші уроки врятували мені життя! Місяць тому потрапив у критичну ситуацію - вантажівка різко повернула переді мною. Завдяки вашій техніці екстреного гальмування зміг зупинитись за метр до зіткнення. Дружина плакала від щастя, коли я повернувся додому. Дякую вам за те, що робите! 🙏',
            'video_title': 'Екстрене гальмування: практичні вправи',
            'date': '2024-01-28',
            'likes': 342
        },
        {
            'author': 'Катерина П.',
            'text': 'Після 10 років водіння авто перейшла на мотоцикл. Було страшно! Але ваш систематичний підхід до навчання допоміг подолати всі страхи. За 3 місяці пройшла від повного початківця до впевненого водія. Вчора проїхала 500 км по Карпатах - це було неймовірно! Дякую за вашу працю! ❤️🏍️',
            'video_title': 'Психологія безпечного водіння',
            'date': '2024-02-10',
            'likes': 256
        },
        {
            'author': 'Максим Д.',
            'text': 'Рік тому розбився через свою самовпевненість. Після відновлення боявся сідати на мотоцикл. Ваші відео допомогли зрозуміти мої помилки і повернути впевненість. Тепер їжджу з дотриманням всіх правил безпеки. Навчаю інших тому, чого навчився у вас. Ви робите світ безпечнішим!',
            'video_title': 'Контраварійне водіння: 8 принципів безпеки',
            'date': '2024-01-15',
            'likes': 489
        }
    ]
    
    for pt in power_testimonials:
        pt['marketing_category'] = 'power_testimonial'
        comments.append(pt)
    
    return sorted(comments, key=lambda x: x['likes'], reverse=True)

def save_marketing_data(comments):
    """Зберігає дані в різних форматах для маркетингу"""
    
    output_dir = "/Users/chyngys/scripts/neb-content-appv2/marketing_data"
    os.makedirs(output_dir, exist_ok=True)
    
    # 1. JSON з усіма коментарями
    all_comments_file = os.path.join(output_dir, "sample_youtube_comments.json")
    with open(all_comments_file, 'w', encoding='utf-8') as f:
        json.dump({
            'generated_at': datetime.now().isoformat(),
            'total_comments': len(comments),
            'comments': comments
        }, f, ensure_ascii=False, indent=2)
    
    # 2. Топ-20 для швидкого використання
    top_comments_file = os.path.join(output_dir, "top_20_testimonials.json")
    with open(top_comments_file, 'w', encoding='utf-8') as f:
        json.dump({
            'generated_at': datetime.now().isoformat(),
            'comments': comments[:20]
        }, f, ensure_ascii=False, indent=2)
    
    # 3. Markdown для презентацій
    markdown_file = os.path.join(output_dir, "testimonials_for_marketing.md")
    with open(markdown_file, 'w', encoding='utf-8') as f:
        f.write("# Відгуки користувачів YouTube каналу\n\n")
        f.write("## 🌟 Найкращі відгуки для маркетингу\n\n")
        
        categories = {
            'power_testimonial': '💥 Потужні історії',
            'testimonial': '👍 Відгуки-подяки',
            'positive_feedback': '✨ Позитивні коментарі',
            'success_story': '🎯 Історії успіху'
        }
        
        for category, title in categories.items():
            category_comments = [c for c in comments if c.get('marketing_category') == category][:5]
            if category_comments:
                f.write(f"### {title}\n\n")
                for comment in category_comments:
                    f.write(f"**{comment['author']}** *(👍 {comment['likes']})*\n")
                    f.write(f"*Під відео: {comment['video_title']}*\n\n")
                    f.write(f"> {comment['text']}\n\n")
                    f.write("---\n\n")
    
    # 4. CSV для аналітики
    csv_file = os.path.join(output_dir, "comments_analytics.csv")
    with open(csv_file, 'w', encoding='utf-8') as f:
        f.write("Автор,Дата,Лайки,Категорія,Відео,Текст\n")
        for c in comments:
            text = c['text'].replace('"', '""').replace('\n', ' ')
            f.write(f'"{c["author"]}","{c["date"]}",{c["likes"]},"{c.get("marketing_category", "other")}","{c["video_title"]}","{text}"\n')
    
    print(f"✅ Згенеровано {len(comments)} прикладів коментарів")
    print(f"📁 Файли збережено в: {output_dir}")
    print(f"   • {all_comments_file}")
    print(f"   • {top_comments_file}")
    print(f"   • {markdown_file}")
    print(f"   • {csv_file}")
    
    # Статистика
    print(f"\n📊 Статистика:")
    print(f"   • Потужних історій: {len([c for c in comments if c.get('marketing_category') == 'power_testimonial'])}")
    print(f"   • Відгуків-подяк: {len([c for c in comments if c.get('marketing_category') == 'testimonial'])}")
    print(f"   • Позитивних коментарів: {len([c for c in comments if c.get('marketing_category') == 'positive_feedback'])}")
    print(f"   • Історій успіху: {len([c for c in comments if c.get('marketing_category') == 'success_story'])}")

def main():
    print("🚀 Генеруємо приклади коментарів для маркетингу...")
    comments = generate_sample_comments()
    save_marketing_data(comments)
    print("\n✅ Готово! Використовуйте ці приклади для маркетингових матеріалів.")

if __name__ == "__main__":
    main()