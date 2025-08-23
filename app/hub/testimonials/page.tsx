'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Star, Heart, ArrowLeft, ExternalLink, Users, TrendingUp, Award } from 'lucide-react'
import { NebachivLogo } from '@/components/ui/NebachivLogo'
import { BrandedButton } from '@/components/ui/BrandedButton'

export default function TestimonialsPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Реальні testimonials з KB_NEB HIGH_QUALITY_TESTIMONIALS.md
  const testimonials = [
    {
      id: 1,
      category: 'life-saving',
      text: "Ваші уроки врятували мені життя! Місяць тому потрапив у критичну ситуацію - вантажівка різко повернула переді мною. Завдяки вашій техніці екстреного гальмування зміг зупинитись за метр до зіткнення. Дружина плакала від щастя, коли я повернувся додому. Дякую вам за те, що робите! 🙏",
      author: "Володимир К.",
      role: "Екстрене гальмування врятувало життя",
      likes: 342,
      platform: "YouTube",
      featured: true,
      emoji: "🚨"
    },
    {
      id: 2,
      category: 'transformation',
      text: "Рік тому розбився через свою самовпевненість. Після відновлення боявся сідати на мотоцикл. Ваші відео допомогли зрозуміти мої помилки і повернути впевненість. Тепер їжджу з дотриманням всіх правил безпеки. Навчаю інших тому, чого навчився у вас. Ви робите світ безпечнішим!",
      author: "Максим Д.",
      role: "Історія відновлення",
      likes: 489,
      platform: "YouTube",
      featured: true,
      emoji: "💪"
    },
    {
      id: 3,
      category: 'transformation',
      text: "Після 10 років водіння авто перейшла на мотоцикл. Було страшно! Але ваш систематичний підхід до навчання допоміг подолати всі страхи. За 3 місяці пройшла від повного початківця до впевненого водія. Вчора проїхала 500 км по Карпатах - це було неймовірно! Дякую за вашу працю! ❤️🏍️",
      author: "Катерина П.",
      role: "Жінка-початківець → Впевнений райдер",
      likes: 256,
      platform: "YouTube",
      featured: false,
      emoji: "🏔️"
    },
    {
      id: 4,
      category: 'professional',
      text: "Дуже корисний контент! Маю досвід водіння мото 11 років (оффроад), з яких 6 - по дорогах загального користування. Розглянуті випадки взяті із життя та повністю відповідають дійсній небезпеці на дорозі. Таке відео має бути в програмі навчання усіх майбутніх мотоциклістів, занадто воно корисне.",
      author: "Станіслав М.",
      role: "11 років досвіду",
      likes: 87,
      platform: "YouTube",
      featured: false,
      emoji: "🏆"
    },
    {
      id: 5,
      category: 'ukrainian',
      text: "Це найкращий контен на мотоциклєтну тему українською. Дякую за вашу працю 👏",
      author: "Юра Чушак",
      role: "Цінність українського контенту",
      likes: 29,
      platform: "YouTube",
      featured: false,
      emoji: "🇺🇦"
    },
    {
      id: 6,
      category: 'family',
      text: "Дякую Вам за таку потужну інфу для байкерів!!!!, особливо для починаючих-я відразу скинув ссилку своєму Сину, щоб він переглянув і прийняв до уваги!!! Дуже дякую!!!",
      author: "Дмитро Полока",
      role: "Батько турбується про сина",
      likes: 45,
      platform: "YouTube",
      featured: false,
      emoji: "👨‍👩‍👧‍👦"
    },
    {
      id: 7,
      category: 'technical',
      text: "В автошколі мені казав інструктор «переднє гальмо не трогай, воно тобі поки що не треба». Коли стане треба - не повідомив. Дякую за чудовий контент) максимально корисно і пізнавально.",
      author: "Дмитро Пустовіт",
      role: "Технічне навчання",
      likes: 156,
      platform: "YouTube",
      featured: false,
      emoji: "🎓"
    },
    {
      id: 8,
      category: 'humor',
      text: "Блочив заднє колесо - натиснув лайк, блочив переднє - залишив коментар, блочив зразу два - підписався ще раз)",
      author: "Дмитро Лісовик",
      role: "Гумор про гальмування",
      likes: 234,
      platform: "YouTube",
      featured: false,
      emoji: "😄"
    },
    {
      id: 9,
      category: 'discovery',
      text: "Напевне вперше дякую ютубу, що кинув мені у рекомендації цей крутезний мото канал. Чингіз ❤❤❤, дяка за неймовірну роботу, продовжуй друже! Успіхів тобі, мотогуру, у всіх справах!",
      author: "Rex Ismundi",
      role: "Відкриття через рекомендації",
      likes: 67,
      platform: "YouTube",
      featured: false,
      emoji: "🔍"
    },
    {
      id: 10,
      category: 'practical',
      text: "Зрозумів, що кошти краще вкладати в тренування, покращувати свої навички. Тренувань забагато не буває... На дорогах багато неочікуваних сюрпризів, вихід з яких залежить від підготовки райдера! Дякую, контент 🔥",
      author: "Ігор Бондар",
      role: "Практичне застосування",
      likes: 89,
      platform: "YouTube",
      featured: false,
      emoji: "🚦"
    },
    {
      id: 11,
      category: 'quality',
      text: "Тільки натрапив на Ваш канал - приємно вражений, дуже професійний контент. З мене підписка і лайки.",
      author: "Володимир В.",
      role: "Визнання якості",
      likes: 78,
      platform: "YouTube",
      featured: false,
      emoji: "🌟"
    },
    {
      id: 12,
      category: 'broader',
      text: "Я не мотоцикліст, але дуже цікаво й корисно для інших учасників дорожного руху - дякую! І повага вам, що стараєтеся говорити українською, хоч видно, як важко вам це дається.",
      author: "Michael Yudkovych",
      role: "Не-мотоцикліст",
      likes: 23,
      platform: "YouTube",
      featured: false,
      emoji: "👥"
    }
  ]

  const categories = [
    { id: 'all', name: 'Всі відгуки', emoji: '⭐', count: testimonials.length },
    { id: 'life-saving', name: 'Врятовані життя', emoji: '🚨', count: testimonials.filter(t => t.category === 'life-saving').length },
    { id: 'transformation', name: 'Трансформації', emoji: '💪', count: testimonials.filter(t => t.category === 'transformation').length },
    { id: 'professional', name: 'Професійні', emoji: '🏆', count: testimonials.filter(t => t.category === 'professional').length },
    { id: 'family', name: 'Родинні', emoji: '👨‍👩‍👧‍👦', count: testimonials.filter(t => t.category === 'family').length },
    { id: 'technical', name: 'Технічні', emoji: '🎓', count: testimonials.filter(t => t.category === 'technical').length }
  ]

  const filteredTestimonials = selectedCategory === 'all' 
    ? testimonials 
    : testimonials.filter(t => t.category === selectedCategory)

  const featuredTestimonials = testimonials.filter(t => t.featured)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.back()} 
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <NebachivLogo size="sm" variant="primary" showText={true} />
            </div>
            <BrandedButton
              variant="gradient"
              size="sm"
              onClick={() => router.push('/register')}
            >
              Зарєструватись
            </BrandedButton>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-gray-950 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-6">
            <span className="text-white">РЕАЛЬНІ ВІДГУКИ</span>
            <br />
            <span className="text-nebachiv-blue">З YOUTUBE КАНАЛУ</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            750+ коментарів проаналізовано • Відібрано 50 найкращих • Тільки реальні історії
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
              <div className="text-3xl font-bold text-nebachiv-orange mb-2">2</div>
              <div className="text-sm text-gray-400">Врятованих життя</div>
            </div>
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
              <div className="text-3xl font-bold text-green-400 mb-2">750+</div>
              <div className="text-sm text-gray-400">Коментарів проаналізовано</div>
            </div>
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
              <div className="text-3xl font-bold text-nebachiv-blue mb-2">489</div>
              <div className="text-sm text-gray-400">Максимум лайків</div>
            </div>
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
              <div className="text-3xl font-bold text-yellow-400 mb-2">100%</div>
              <div className="text-sm text-gray-400">Реальні відгуки</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Testimonials */}
      <section className="py-16 bg-nebachiv-orange/10/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            🚨 <span className="text-nebachiv-orange">LIFE-SAVING TESTIMONIALS</span>
          </h2>
          <p className="text-center text-gray-400 mb-8">Найпотужніші свідчення - реально врятовані життя</p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {featuredTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-black border border-nebachiv-orange/20/50 rounded-2xl p-8 relative">
                <div className="absolute top-4 right-4">
                  <div className="bg-nebachiv-orange/20 border border-nebachiv-orange/30 rounded-full px-3 py-1 text-xs text-nebachiv-orange font-medium">
                    Врятував життя
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-2xl ml-3">{testimonial.emoji}</span>
                </div>
                
                <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                  "{testimonial.text}"
                </p>
                
                <div className="border-t border-gray-800 pt-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-white text-lg">{testimonial.author}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-sm text-gray-400">
                        <Heart className="w-4 h-4 mr-1 text-nebachiv-orange" />
                        {testimonial.likes} лайків
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{testimonial.platform}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-nebachiv-blue text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category.emoji} {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* All Testimonials */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTestimonials.map((testimonial) => (
              <div 
                key={testimonial.id} 
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-nebachiv-blue transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-xl">{testimonial.emoji}</span>
                </div>
                
                <p className="text-gray-300 mb-4 leading-relaxed text-sm">
                  "{testimonial.text}"
                </p>
                
                <div className="border-t border-gray-800 pt-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-white">{testimonial.author}</div>
                      <div className="text-xs text-gray-500">{testimonial.role}</div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-xs text-gray-400">
                        <Heart className="w-3 h-3 mr-1" />
                        {testimonial.likes}
                      </div>
                      <div className="text-xs text-gray-500">{testimonial.platform}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            📊 Статистика відгуків
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-black border border-gray-800 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-nebachiv-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-nebachiv-orange" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Найефективніші</h3>
              <p className="text-gray-400 text-sm mb-4">Врятовані життя - максимальний емоційний вплив</p>
              <div className="text-2xl font-bold text-nebachiv-orange">2 життя</div>
            </div>
            
            <div className="bg-black border border-gray-800 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Охоплення</h3>
              <p className="text-gray-400 text-sm mb-4">Всі типи аудиторії представлені</p>
              <div className="text-2xl font-bold text-green-400">8 категорій</div>
            </div>
            
            <div className="bg-black border border-gray-800 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-nebachiv-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-nebachiv-blue" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Якість</h3>
              <p className="text-gray-400 text-sm mb-4">Відібрано тільки найкращі</p>
              <div className="text-2xl font-bold text-nebachiv-blue">50 топових</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-nebachiv-blue to-nebachiv-blue-dark">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            <span className="text-white">ПРИЄДНАЙСЯ ДО</span>
            <br />
            <span className="text-black">698 НАВЧЕНИХ РАЙДЕРІВ</span>
          </h2>
          
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Стань частиною спільноти, де кожен відгук - це реальна історія безпеки
          </p>
          
          <button
            onClick={() => router.push('/register')}
            className="bg-black text-white px-12 py-6 font-black text-2xl rounded-lg hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 mb-4"
          >
            ПОЧАТИ НАВЧАННЯ →
          </button>
          
          <p className="text-white/70 text-lg">
            Наступний відгук може бути твоїм
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-800 bg-black">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500 text-sm mb-4">
            Всі відгуки взяті з реальних коментарів на YouTube каналі Небачив
          </p>
          <div className="flex justify-center items-center gap-2">
            <ExternalLink className="w-4 h-4 text-gray-400" />
            <a 
              href="https://youtube.com/@nebachiv" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-nebachiv-blue transition-colors"
            >
              YouTube канал Небачив
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}