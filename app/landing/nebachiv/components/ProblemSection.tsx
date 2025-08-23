'use client';

import headlines from '../assets/copy/headlines.json';
import statistics from '../assets/social-proof/statistics.json';

interface ProblemSectionProps {
  version: 'ukrainian' | 'hormozi';
}

export default function ProblemSection({ version }: ProblemSectionProps) {
  const problemHeadlines = headlines.headlines.problem_headlines[version === 'ukrainian' ? 'ukrainian' : 'hormozi'];
  const stats = statistics.statistics;

  const problems = [
    {
      icon: '⚠️',
      title: version === 'hormozi' 
        ? '37% ВОДІЇВ НЕ БАЧАТЬ ТЕБЕ' 
        : 'Статистика що шокує',
      description: version === 'hormozi'
        ? '37% всіх ДТП - водії просто НЕ ПОБАЧИЛИ мотоцикліста. 52% смертей - через помилки самих райдерів. 32% аварій - не було навіть секунди!'
        : 'Дослідження MAIDS (921 ДТП) показує: 37% аварій - водії не помічають мотоциклістів.',
      stat: '88%',
      statLabel: 'ДТП через людський фактор'
    },
    {
      icon: '🏫',
      title: version === 'hormozi'
        ? 'МОТОШКОЛИ БРЕШУТЬ ТОБІ'
        : 'Мотошколи навчають неправильно',
      description: version === 'hormozi'
        ? 'Вони дають тобі МЕРТВУ теорію з підручників 1980-х. Вони НЕ ЗНАЮТЬ як виживати в реальному трафіку!'
        : 'Традиційні мотошколи фокусуються на теорії та здачі іспиту, але не готують до реальних небезпек на дорозі.',
      stat: '77%',
      statLabel: 'мали навчання, але розбились'
    },
    {
      icon: '🧠',
      title: version === 'hormozi'
        ? 'ТИ НЕ ЗНАЄШ ЩО ТЕБЕ ВБИВАЄ'
        : 'Приховані загрози дороги',
      description: version === 'hormozi'
        ? '8 НЕВИДИМИХ ЗАГРОЗ чатують на тебе щодня. Ти їх НЕ БАЧИШ. Поки не стане ЗАНАДТО ПІЗНО.'
        : 'Більшість аварій відбувається через загрози, які мотоциклісти не вміють розпізнавати заздалегідь.',
      stat: '921',
      statLabel: 'ДТП проаналізовано MAIDS'
    }
  ];

  return (
    <section className="py-20 px-4 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-5xl font-bold text-white mb-6 ${
            version === 'hormozi' ? 'text-nebachiv-orange' : ''
          }`}>
            {problemHeadlines[0]}
          </h2>
          
          {version === 'hormozi' ? (
            <div className="bg-nebachiv-orange/20 border-2 border-nebachiv-orange p-6 rounded-lg max-w-4xl mx-auto">
              <p className="text-xl text-nebachiv-orange-light font-bold">
                ⚠️ ФАКТ MAIDS: 37% водіїв НЕ БАЧАТЬ тебе. 52% смертей - ТВОЯ помилка. Більшість мотоциклістів роблять 8 помилок екстренного гальмування.
                Це ОФІЦІЙНІ ДАНІ. Це РЕАЛЬНІСТЬ.
              </p>
            </div>
          ) : (
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              Мотошкола навчила керувати, але не показала як виживати в місті. Більшість мотоциклістів не вміють правильно гальмувати в екстренних ситуаціях.
              Розглянемо основні проблеми.
            </p>
          )}
        </div>

        {/* Problems grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {problems.map((problem, index) => (
            <div 
              key={index}
              className={`p-8 rounded-lg text-center ${
                version === 'hormozi'
                  ? 'bg-gray-800 border-2 border-nebachiv-orange'
                  : 'bg-gray-800'
              }`}
            >
              <div className="text-6xl mb-4">{problem.icon}</div>
              <h3 className={`text-xl font-bold text-white mb-4 ${
                version === 'hormozi' ? 'text-nebachiv-orange' : ''
              }`}>
                {problem.title}
              </h3>
              <p className="text-gray-300 mb-6">
                {problem.description}
              </p>
              <div className={`text-3xl font-bold ${
                version === 'hormozi' ? 'text-nebachiv-orange' : 'text-nebachiv-blue'
              }`}>
                {problem.stat}
              </div>
              <div className="text-sm text-gray-400">
                {problem.statLabel}
              </div>
            </div>
          ))}
        </div>

        {/* The brutal truth section */}
        <div className={`p-8 rounded-lg text-center ${
          version === 'hormozi'
            ? 'bg-black border-2 border-nebachiv-orange'
            : 'bg-gray-800'
        }`}>
          <h3 className={`text-2xl md:text-3xl font-bold text-white mb-6 ${
            version === 'hormozi' ? 'text-nebachiv-orange' : ''
          }`}>
            {version === 'hormozi'
              ? 'ЖОРСТОКА ПРАВДА:'
              : 'Реальність на дорозі:'
            }
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div>
              <h4 className="text-xl font-bold text-white mb-4">
                {version === 'hormozi' ? 'ЩО ТЕБЕ ВБИВАЄ:' : 'Основні причини аварій:'}
              </h4>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start space-x-3">
                  <span className="text-nebachiv-orange">❌</span>
                  <span>Не бачиш небезпеку за 3-5 секунд</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-nebachiv-orange">❌</span>
                  <span>Робиш одну чи більше з 8 помилок гальмування</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-nebachiv-orange">❌</span>
                  <span>Панікуєш в критичних ситуаціях</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-nebachiv-orange">❌</span>
                  <span>Довіряєш іншим водіям</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl font-bold text-white mb-4">
                {version === 'hormozi' ? 'ЩО ТЕБЕ ВРЯТУЄ:' : 'Що дійсно працює:'}
              </h4>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start space-x-3">
                  <span className="text-green-500">✅</span>
                  <span>Система передбачення загроз</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-500">✅</span>
                  <span>Техніки екстреного гальмування</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-500">✅</span>
                  <span>Психологія виживання</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-500">✅</span>
                  <span>Реальні кейси з життя</span>
                </li>
              </ul>
            </div>
          </div>

          {version === 'hormozi' && (
            <div className="mt-8 p-4 bg-nebachiv-orange/20 rounded-lg">
              <p className="text-nebachiv-orange-light font-bold text-lg">
                💀 ФАКТ: 50% ДТП відбуваються на швидкості до 50 км/год. 
                Не швидкість вбиває - НЕЗНАННЯ вбиває.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}