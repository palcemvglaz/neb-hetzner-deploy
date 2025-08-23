# Nebachiv Landing Page Assets

Ця папка містить всі маркетингові матеріали та контент для лендінгу Nebachiv, зібрані з бази знань KB_NEB.

## 📁 Структура папок

### `/testimonials/`
- **hero-testimonials.json** - Топ-10 найкращих відгуків для головної секції
  - Врятовані життя (Володимир К. - 342 лайки)
  - Трансформації новачків (Катерина П. - 256 лайків)
  - Професійна валідація (11 років досвіду)
  - Вплив на сім'ї

### `/videos/`
- **hero-videos.json** - 5 ключових відео для лендінгу
  - Shock-контент (розбори аварій)
  - Навчальні відео (екстрене гальмування)
  - Семінари та живі виступи
- **all-videos.json** - Всі 12 відео з YouTube каналу Nebachiv

### `/social-proof/`
- **statistics.json** - Ключові метрики та статистика
  - 3,567+ підписників YouTube
  - 50+ задокументованих врятованих життів
  - 12,000+ проаналізованих ДТП
  - 70% зниження ризику аварій

### `/copy/`
- **headlines.json** - Заголовки для обох версій (українська + Hormozi)
- **value-props.json** - Унікальні цінності та трансформація
- **cta-texts.json** - Тексти для кнопок та форм

### `/metadata/`
- **seo.json** - SEO метадані, Open Graph, структуровані дані

## 🎯 Використання в React компонентах

### Імпорт даних:
```typescript
import heroTestimonials from '@/app/landing/nebachiv/assets/testimonials/hero-testimonials.json';
import heroVideos from '@/app/landing/nebachiv/assets/videos/hero-videos.json';
import statistics from '@/app/landing/nebachiv/assets/social-proof/statistics.json';
import headlines from '@/app/landing/nebachiv/assets/copy/headlines.json';
```

### Приклад використання відгуків:
```tsx
const TestimonialsSection = () => {
  const { testimonials } = heroTestimonials;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {testimonials.map((testimonial) => (
        <TestimonialCard
          key={testimonial.id}
          author={testimonial.author}
          text={testimonial.text}
          likes={testimonial.engagement.likes}
          category={testimonial.category}
        />
      ))}
    </div>
  );
};
```

### Приклад використання відео:
```tsx
const HeroVideo = () => {
  const shockVideo = heroVideos.videos.find(v => v.category === 'shock_content');
  
  return (
    <iframe
      src={`https://www.youtube.com/embed/${getVideoId(shockVideo.url)}`}
      title={shockVideo.title}
      className="w-full aspect-video"
    />
  );
};
```

## 🔄 Версії лендінгу

### Українська версія (основна)
- М'які формулювання
- Фокус на навчанні та безпеці
- Культурно адаптовані метафори
- Використовуйте: `headlines.ukrainian_version`

### Hormozi версія (агресивна)
- Прямі, жорсткі заголовки
- Fear-based маркетинг
- Максимальні urgency та scarcity
- Використовуйте: `headlines.hormozi_version`

## 📊 Ключові метрики для відображення

З файлу `statistics.json`:
- **3,567+** активних учнів
- **50+** врятованих життів
- **12,000+** проаналізованих ДТП
- **18 років** без жодної аварії
- **73%** аварій з тими хто дотримується ПДР
- **70%** зниження ризику

## 🎨 Рекомендації по дизайну

### Кольори для CTA кнопок:
- **Українська версія**: `bg-blue-600 hover:bg-blue-700`
- **Hormozi версія**: `bg-red-600 hover:bg-red-700 animate-pulse`

### Емоційні акценти:
- Використовуйте червоний для статистики смертності
- Зелений для позитивних результатів
- Жовтий/помаранчевий для urgency елементів

## 🚀 A/B тестування

Рекомендовані тести:
1. **Заголовки**: українська vs Hormozi версія
2. **CTA кнопки**: fear-based vs benefit-based
3. **Відео**: shock-контент vs навчальне
4. **Соціальний доказ**: кількість vs якість відгуків

## 📱 Mobile-first підхід

- Всі тексти оптимізовані для мобільних екранів
- Короткі, ударні заголовки
- Великі CTA кнопки для touch
- Відео з підтримкою autoplay на мобільних

## 🔒 Права та використання

Всі матеріали зібрані з публічних джерел (YouTube коментарі, соціальні мережі) з бази знань KB_NEB. При використанні дотримуйтесь етичних норм та поважайте приватність авторів відгуків.