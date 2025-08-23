'use client';

import { useState } from 'react';

interface FAQSectionProps {
  version: 'ukrainian' | 'hormozi';
}

export default function FAQSection({ version }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = version === 'hormozi' ? [
    {
      question: 'Чому ПДР не рятують від ДТП?',
      answer: 'Бо ДТП стається коли люди НЕ ДОТРИМУЮТЬСЯ ПДР, а ти ОЧІКУЄШ від них дотримання. MAIDS: 88% ДТП - людський фактор. Моя система вчить ПЕРЕДБАЧАТИ порушення.'
    },
    {
      question: 'Як ти можеш ГАРАНТУВАТИ що я не потраплю в аварію?',
      answer: 'Я НЕ МОЖУ гарантувати що ти не потрапиш в аварію. Але MAIDS доводить: знання Vision/Blocker знижує ризик на 45%. Моя система базована на 1,999 реальних ДТП. Якщо не відчуєш результат - поверну гроші.'
    },
    {
      question: 'Чому твоя система коштує ₴9,997? Це ДОРОГО!',
      answer: 'ДОРОГО? Твої похорони коштують ₴50,000. Інвалідна коляска - ₴30,000. Психолог для травмованої родини - ₴20,000 на рік. ₴9,997 за ЖИТТЯ - це НАЙДЕШЕВША ціна яку ти коли-небудь заплатиш.'
    },
    {
      question: 'У мене вже є 10 років досвіду. Навіщо мені твоя система?',
      answer: 'MAIDS: 68% мотоциклістів переоцінюють свої навички. 73% не проходили додаткового навчання. Досвід без СИСТЕМИ = ІЛЮЗІЯ безпеки. Моя система дає структуровані знання.'
    },
    {
      question: 'Де ДОКАЗИ що ти врятував 237+ життів?',
      answer: 'У мене 750+ testimonials з YouTube. Проаналізовані і категоризовані. Моя система базується на MAIDS - найбільшому європейському дослідженні ДТП. Це не обіцянки - це факти.'
    }
  ] : [
    {
      question: 'Чи підходить курс для новачків?',
      answer: 'Так, курс підходить для всіх рівнів. MAIDS показує: новачки ризикують в 2.3 рази більше. Перші 6 місяців - найнебезпечніші. Ми даємо систему виживання з першого дня.'
    },
    {
      question: 'Скільки часу потрібно на проходження курсу?',
      answer: 'Базовий курс розрахований на 3 місяці при 15 хвилинах навчання на день. Ви можете навчатися у своєму темпі - доступ до матеріалів пожиттєвий.'
    },
    {
      question: 'Чи є гарантія повернення коштів?',
      answer: 'Так, ми даємо 90-денну гарантію повернення коштів. Якщо ви не відчуєте покращення своїх навичок та впевненості на дорозі, ми повернемо всі гроші без питань.'
    },
    {
      question: 'Чим ваш курс відрізняється від мотошколи?',
      answer: 'Мотошколи вчать здавати іспити, ми вчимо виживати на дорозі. Наша система базується на аналізі 12,000+ реальних ДТП та 18-річному досвіді без аварій.'
    },
    {
      question: 'Чи можу я навчатися з мобільного телефону?',
      answer: 'Так, наша платформа повністю адаптована для мобільних пристроїв. Ви можете навчатися в дорозі, дома або будь-де де є інтернет.'
    }
  ];

  return (
    <section className="py-20 px-4 bg-gray-800">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-5xl font-bold text-white mb-6 ${
            version === 'hormozi' ? 'text-nebachiv-orange' : ''
          }`}>
            {version === 'hormozi'
              ? 'ТВОЇ ЗАПЕРЕЧЕННЯ vs МОЇ ВІДПОВІДІ'
              : 'Часті питання'
            }
          </h2>
          <p className="text-xl text-gray-300">
            {version === 'hormozi'
              ? 'Я ЗНАЮ що ти думаєш. Ось ЖОРСТКІ відповіді:'
              : 'Відповіді на найпоширеніші питання про навчання'
            }
          </p>
        </div>

        {/* FAQ list */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className={`rounded-lg overflow-hidden ${
                version === 'hormozi'
                  ? 'bg-gray-900 border border-nebachiv-orange'
                  : 'bg-gray-900 border border-gray-700'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-800 transition-colors"
              >
                <h3 className={`text-lg font-bold text-white pr-4 ${
                  version === 'hormozi' ? 'text-nebachiv-orange' : ''
                }`}>
                  {faq.question}
                </h3>
                <span className={`text-2xl transform transition-transform ${
                  openIndex === index ? 'rotate-180' : ''
                } ${version === 'hormozi' ? 'text-nebachiv-orange' : 'text-nebachiv-blue'}`}>
                  ▼
                </span>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional CTA */}
        <div className="text-center mt-12">
          <p className={`text-lg mb-6 ${
            version === 'hormozi' ? 'text-nebachiv-orange-light' : 'text-gray-300'
          }`}>
            {version === 'hormozi'
              ? 'Є ще питання? Задай їх ПІСЛЯ того як ВИЖИВЕШ.'
              : 'Не знайшли відповідь на своє питання?'
            }
          </p>
          <button className={`px-8 py-4 rounded-lg font-bold text-lg ${
            version === 'hormozi'
              ? 'bg-nebachiv-orange hover:bg-nebachiv-orange/80 text-white'
              : 'bg-nebachiv-blue hover:bg-nebachiv-blue/80 text-white'
          }`}>
            {version === 'hormozi' 
              ? 'НАПИСАТИ НЕБАЧІВУ'
              : 'Зв\'язатися з нами'
            }
          </button>
        </div>
      </div>
    </section>
  );
}