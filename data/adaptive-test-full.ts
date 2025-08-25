export interface AdaptiveQuestion {
  id: string
  text: string
  level: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED'
  category: string
  isHubQuestion: boolean
  dependsOn?: string
  showConditions?: any
  multiChoice: boolean
  isCritical: boolean
  type: 'single_choice' | 'multiple_choice' | 'text'
  answers?: string[]
  correctAnswer?: string | string[]
  points: number
  order: number
}

export const ADAPTIVE_TEST_QUESTIONS: AdaptiveQuestion[] = [
  // БЛОК 0: ІДЕНТИФІКАЦІЯ (3 питання)
  {
    id: 'q0_1',
    text: 'ФІО',
    level: 'BASIC',
    category: 'БЛОК 0: ІДЕНТИФІКАЦІЯ',
    isHubQuestion: false,
    multiChoice: false,
    isCritical: false,
    type: 'text',
    points: 0,
    order: 1
  },
  {
    id: 'q0_2',
    text: 'Місто',
    level: 'BASIC',
    category: 'БЛОК 0: ІДЕНТИФІКАЦІЯ',
    isHubQuestion: false,
    multiChoice: false,
    isCritical: false,
    type: 'text',
    points: 0,
    order: 2
  },
  {
    id: 'q0_3',
    text: 'Контакти (телефон/email)',
    level: 'BASIC',
    category: 'БЛОК 0: ІДЕНТИФІКАЦІЯ',
    isHubQuestion: false,
    multiChoice: false,
    isCritical: false,
    type: 'text',
    points: 0,
    order: 3
  },

  // БЛОК 1: МОТИВАЦІЯ ТА ІСТОРІЯ (4 питання)
  {
    id: 'q1_1',
    text: 'Чому почали кататись?',
    level: 'BASIC',
    category: 'БЛОК 1: МОТИВАЦІЯ ТА ІСТОРІЯ',
    isHubQuestion: false,
    multiChoice: false,
    isCritical: false,
    type: 'single_choice',
    answers: [
      'З дитинства мріяв',
      'Батько/мати мотоцикліст',
      'Мене прокатили і я захотів',
      'Давно задивлявся, а тут можна вмерти а на мотоцику ще не покатався',
      'Свій варіант'
    ],
    points: 1,
    order: 4
  },
  {
    id: 'q1_2',
    text: 'Хто вас навчав?',
    level: 'BASIC',
    category: 'БЛОК 1: МОТИВАЦІЯ ТА ІСТОРІЯ',
    isHubQuestion: false,
    multiChoice: false,
    isCritical: false,
    type: 'single_choice',
    answers: [
      'TheRiders',
      'YellowRide',
      'ProBiker',
      'Freeride.kiev.ua',
      'Motostar',
      'VShleme',
      'Сам навчався',
      'Друг навчив',
      'Інше'
    ],
    points: 1,
    order: 5
  },
  {
    id: 'q1_3',
    text: 'Який у вас мотоцикл? (Марка/Модель/Рік/Об\'єм)',
    level: 'BASIC',
    category: 'БЛОК 1: МОТИВАЦІЯ ТА ІСТОРІЯ',
    isHubQuestion: false,
    multiChoice: false,
    isCritical: false,
    type: 'text',
    points: 1,
    order: 6
  },
  {
    id: 'q1_4',
    text: 'Скільки сезонів/років активно їздите?',
    level: 'BASIC',
    category: 'БЛОК 1: МОТИВАЦІЯ ТА ІСТОРІЯ',
    isHubQuestion: true, // HUB питання!
    multiChoice: false,
    isCritical: false,
    type: 'single_choice',
    answers: [
      'Ще не почав або перший сезон',
      '2-3 сезони',
      '3-7 сезонів',
      '7+ сезонів'
    ],
    points: 3,
    order: 7
  },

  // БЛОК 2: САМООЦІНКА ТА ДОСВІД (6 питань)
  {
    id: 'q2_1',
    text: 'Оцініть свій рівень їзди від 1 до 10',
    level: 'BASIC',
    category: 'БЛОК 2: САМООЦІНКА ТА ДОСВІД',
    isHubQuestion: false,
    multiChoice: false,
    isCritical: false,
    type: 'text',
    points: 1,
    order: 8
  },
  {
    id: 'q2_2',
    text: 'Що найбільше лякає в їзді?',
    level: 'BASIC',
    category: 'БЛОК 2: САМООЦІНКА ТА ДОСВІД',
    isHubQuestion: false,
    multiChoice: false,
    isCritical: false,
    type: 'text',
    points: 1,
    order: 9
  },
  {
    id: 'q2_3',
    text: 'Від чого отримуєте найбільше задоволення?',
    level: 'BASIC',
    category: 'БЛОК 2: САМООЦІНКА ТА ДОСВІД',
    isHubQuestion: false,
    multiChoice: false,
    isCritical: false,
    type: 'text',
    points: 1,
    order: 10
  },
  {
    id: 'q2_4',
    text: 'Чи були вже складні ситуації?',
    level: 'BASIC',
    category: 'БЛОК 2: САМООЦІНКА ТА ДОСВІД',
    isHubQuestion: true, // HUB питання!
    multiChoice: false,
    isCritical: false,
    type: 'single_choice',
    answers: [
      'Ще не було складних',
      'Екстрене гальмування',
      'Уникнення від перестроювання маневром',
      'Втрата балансу/падіння',
      'Багато вже було (5+)'
    ],
    points: 2,
    order: 11
  },
  {
    id: 'q2_5',
    text: 'Скільки складних ситуацій в сезон?',
    level: 'INTERMEDIATE',
    category: 'БЛОК 2: САМООЦІНКА ТА ДОСВІД',
    isHubQuestion: false,
    dependsOn: 'q2_4',
    showConditions: {
      'q2_4': ['Екстрене гальмування', 'Уникнення від перестроювання маневром', 'Втрата балансу/падіння', 'Багато вже було (5+)']
    },
    multiChoice: false,
    isCritical: false,
    type: 'single_choice',
    answers: [
      'Жодної',
      '1-2 за сезон',
      '3-5 за сезон',
      'Більше 5 за сезон',
      'Не рахую'
    ],
    points: 2,
    order: 12
  },
  {
    id: 'q2_6',
    text: 'Опишіть найскладнішу ситуацію детально',
    level: 'INTERMEDIATE',
    category: 'БЛОК 2: САМООЦІНКА ТА ДОСВІД',
    isHubQuestion: false,
    dependsOn: 'q2_4',
    showConditions: {
      'q2_4': ['Екстрене гальмування', 'Уникнення від перестроювання маневром', 'Втрата балансу/падіння', 'Багато вже було (5+)']
    },
    multiChoice: false,
    isCritical: false,
    type: 'text',
    points: 3,
    order: 13
  },

  // БЛОК 3: ПСИХОЛОГІЯ ТА РИЗИКИ (3 питання)
  {
    id: 'q3_1',
    text: 'Як оцінюєте небезпеку? Чи думаєте що можете загинути/бути покаліченим?',
    level: 'BASIC',
    category: 'БЛОК 3: ПСИХОЛОГІЯ ТА РИЗИКИ',
    isHubQuestion: false,
    multiChoice: false,
    isCritical: true,
    type: 'single_choice',
    answers: [
      'Так, авжеж, розумію ризики',
      'Досить нав\'язлива думка, думаю часто',
      'Ні, зі мною цього не станеться'
    ],
    correctAnswer: 'Так, авжеж, розумію ризики',
    points: 3,
    order: 14
  },
  {
    id: 'q3_2',
    text: 'Що найбільше дискомфортить в місті?',
    level: 'BASIC',
    category: 'БЛОК 3: ПСИХОЛОГІЯ ТА РИЗИКИ',
    isHubQuestion: false,
    multiChoice: true,
    isCritical: false,
    type: 'multiple_choice',
    answers: [
      'Щільні затори і міжряддя',
      'Маневри на низькій швидкості, розвороти на вузькій дорозі',
      'Небезпечні маневри інших водіїв',
      'Лякає екстрене гальмування зі швидкості',
      'Рейки, слизьке',
      'Раптові ями або зрізаний асфальт',
      'Непрогнозовані дії водіїв'
    ],
    points: 2,
    order: 15
  },
  {
    id: 'q3_3',
    text: 'Що робили для зменшення ризиків?',
    level: 'BASIC',
    category: 'БЛОК 3: ПСИХОЛОГІЯ ТА РИЗИКИ',
    isHubQuestion: true, // HUB питання!
    multiChoice: true,
    isCritical: false,
    type: 'multiple_choice',
    answers: [
      'Ось я тут на тесті, поки це все',
      'Купив якісну екіпіровку',
      'Дивився аварії в YouTube',
      'Дивився БАГАТО аварій в YouTube (50+)',
      'Тренував гальмування',
      'Джимхана',
      'Їздив по ґрунту/офроуд',
      'Читав літературу/статті'
    ],
    points: 3,
    order: 16
  },

  // БЛОК 4: МІСЬКА СТРАТЕГІЯ (3 питання)
  {
    id: 'q4_1',
    text: 'Що робите на світлофорі?',
    level: 'BASIC',
    category: 'БЛОК 4: МІСЬКА СТРАТЕГІЯ',
    isHubQuestion: false,
    multiChoice: false,
    isCritical: false,
    type: 'single_choice',
    answers: [
      'Стою в потоці як всі',
      'Проїжджаю вперед і стаю попереду',
      'Стою з готовністю втекти',
      'Контролюю дзеркала на випадок удару ззаду'
    ],
    correctAnswer: 'Контролюю дзеркала на випадок удару ззаду',
    points: 2,
    order: 17
  },
  {
    id: 'q4_2',
    text: 'В якій частині смуги зазвичай рухаєтесь?',
    level: 'BASIC',
    category: 'БЛОК 4: МІСЬКА СТРАТЕГІЯ',
    isHubQuestion: false,
    multiChoice: false,
    isCritical: false,
    type: 'single_choice',
    answers: [
      'По центру',
      'Лівий край',
      'Правий край',
      'Постійно змінюю позицію залежно від ситуації'
    ],
    correctAnswer: 'Постійно змінюю позицію залежно від ситуації',
    points: 3,
    order: 18
  },
  {
    id: 'q4_3',
    text: 'Які найнебезпечніші ситуації в місті на ваш погляд?',
    level: 'BASIC',
    category: 'БЛОК 4: МІСЬКА СТРАТЕГІЯ',
    isHubQuestion: false,
    multiChoice: true,
    isCritical: false,
    type: 'multiple_choice',
    answers: [
      'Удар ззаду',
      'Перестроювання без поворотників',
      'Несподівані розвороти',
      'Лівий поворот назустріч',
      'Виїзди з прилеглих',
      'Пішоходи',
      'Відкриття дверей'
    ],
    points: 2,
    order: 19
  },

  // БЛОК 5: МІЖРЯДДЯ (4 питання)
  {
    id: 'q5_1',
    text: 'Чи легко вам їхати в міжрядді?',
    level: 'BASIC',
    category: 'БЛОК 5: МІЖРЯДДЯ',
    isHubQuestion: true, // HUB питання!
    multiChoice: false,
    isCritical: false,
    type: 'single_choice',
    answers: [
      'Боюсь, не їжджу',
      'Складно, некомфортно',
      'Нормально, але напружено',
      'Легко, комфортно',
      'Дуже легко, як риба у воді'
    ],
    points: 2,
    order: 20
  },
  {
    id: 'q5_2',
    text: 'На якій швидкості в міжрядді?',
    level: 'INTERMEDIATE',
    category: 'БЛОК 5: МІЖРЯДДЯ',
    isHubQuestion: false,
    dependsOn: 'q5_1',
    showConditions: {
      'q5_1': ['Складно, некомфортно', 'Нормально, але напружено', 'Легко, комфортно', 'Дуже легко, як риба у воді']
    },
    multiChoice: false,
    isCritical: false,
    type: 'single_choice',
    answers: [
      'До 20 км/год',
      '20-40 км/год',
      '40-60 км/год',
      'Швидше 60 км/год'
    ],
    points: 2,
    order: 21
  },
  {
    id: 'q5_3',
    text: 'Як контролюєте швидкість в міжрядді?',
    level: 'INTERMEDIATE',
    category: 'БЛОК 5: МІЖРЯДДЯ',
    isHubQuestion: false,
    dependsOn: 'q5_1',
    showConditions: {
      'q5_1': ['Складно, некомфортно', 'Нормально, але напружено', 'Легко, комфортно', 'Дуже легко, як риба у воді']
    },
    multiChoice: false,
    isCritical: false,
    type: 'single_choice',
    answers: [
      'Заднім гальмом',
      'Зчепленням',
      'Переднім гальмом',
      'Комбіновано задній+зчеплення'
    ],
    correctAnswer: 'Заднім гальмом',
    points: 2,
    order: 22
  },
  {
    id: 'q5_4',
    text: 'На що дивитесь в міжрядді?',
    level: 'ADVANCED',
    category: 'БЛОК 5: МІЖРЯДДЯ',
    isHubQuestion: false,
    dependsOn: 'q5_1',
    showConditions: {
      'q5_1': ['Легко, комфортно', 'Дуже легко, як риба у воді'],
      'q1_4': ['3-7 сезонів', '7+ сезонів']
    },
    multiChoice: false,
    isCritical: false,
    type: 'single_choice',
    answers: [
      'Поворотники',
      'Передні колеса машин',
      'Голови водіїв в дзеркалах',
      'Загальний тренд руху авто',
      'Все вище одночасно'
    ],
    correctAnswer: 'Все вище одночасно',
    points: 3,
    order: 23
  },

  // БЛОК 6: ШВИДКІСТЬ ТА ГАЛЬМУВАННЯ (8 питань)
  {
    id: 'q6_1',
    text: 'З якою швидкістю зазвичай їздите в місті?',
    level: 'BASIC',
    category: 'БЛОК 6: ШВИДКІСТЬ ТА ГАЛЬМУВАННЯ',
    isHubQuestion: false,
    multiChoice: false,
    isCritical: false,
    type: 'single_choice',
    answers: [
      'До 60 км/год',
      '60-80 км/год',
      '80-100 км/год',
      '100-120 км/год',
      'Швидше 120'
    ],
    points: 2,
    order: 24
  },
  {
    id: 'q6_2',
    text: 'Як зазвичай гальмуєте?',
    level: 'BASIC',
    category: 'БЛОК 6: ШВИДКІСТЬ ТА ГАЛЬМУВАННЯ',
    isHubQuestion: false,
    multiChoice: false,
    isCritical: false,
    type: 'single_choice',
    answers: [
      'В основному заднім',
      'В основному переднім',
      'Обома одночасно',
      'Залежить від ситуації'
    ],
    correctAnswer: 'Обома одночасно',
    points: 2,
    order: 25
  },
  {
    id: 'q6_3',
    text: 'Скільки метрів гальмування з 100 км/год?',
    level: 'INTERMEDIATE',
    category: 'БЛОК 6: ШВИДКІСТЬ ТА ГАЛЬМУВАННЯ',
    isHubQuestion: false,
    dependsOn: 'q3_3',
    showConditions: {
      'q3_3': ['Тренував гальмування']
    },
    multiChoice: false,
    isCritical: true,
    type: 'single_choice',
    answers: [
      '20-25 м',
      '30-35 м',
      '40-45 м',
      '50+ м',
      'Не знаю'
    ],
    correctAnswer: '30-35 м',
    points: 3,
    order: 26
  },
  {
    id: 'q6_4',
    text: 'Чи блокували колеса?',
    level: 'INTERMEDIATE',
    category: 'БЛОК 6: ШВИДКІСТЬ ТА ГАЛЬМУВАННЯ',
    isHubQuestion: false,
    multiChoice: false,
    isCritical: false,
    type: 'single_choice',
    answers: [
      'Ні, ніколи',
      'Так, заднє',
      'Так, переднє',
      'Обидва блокував'
    ],
    points: 2,
    order: 27
  },
  {
    id: 'q6_5',
    text: 'Що робити якщо заблокувалось переднє колесо?',
    level: 'ADVANCED',
    category: 'БЛОК 6: ШВИДКІСТЬ ТА ГАЛЬМУВАННЯ',
    isHubQuestion: false,
    dependsOn: 'q6_4',
    showConditions: {
      'q6_4': ['Так, переднє', 'Обидва блокував']
    },
    multiChoice: false,
    isCritical: true,
    type: 'single_choice',
    answers: [
      'Тримати гальмо далі',
      'Відпустити гальмо миттєво',
      'Додати заднє гальмо',
      'Вижати зчеплення'
    ],
    correctAnswer: 'Відпустити гальмо миттєво',
    points: 3,
    order: 28
  },
  {
    id: 'q6_6',
    text: 'Що буде якщо гальмувати в повороті?',
    level: 'ADVANCED',
    category: 'БЛОК 6: ШВИДКІСТЬ ТА ГАЛЬМУВАННЯ',
    isHubQuestion: false,
    multiChoice: false,
    isCritical: true,
    type: 'single_choice',
    answers: [
      'Нічого, якщо правильно',
      'Мотоцикл випрямиться, можливий highside',
      'Впаду',
      'Залежить від швидкості'
    ],
    correctAnswer: 'Мотоцикл випрямиться, можливий highside',
    points: 3,
    order: 29
  },
  {
    id: 'q6_7',
    text: 'Чи гальмували в дощ?',
    level: 'INTERMEDIATE',
    category: 'БЛОК 6: ШВИДКІСТЬ ТА ГАЛЬМУВАННЯ',
    isHubQuestion: false,
    multiChoice: false,
    isCritical: false,
    type: 'single_choice',
    answers: [
      'Так, регулярно',
      'Кілька разів',
      'Ні, уникаю дощу',
      'Ще не доводилось'
    ],
    points: 2,
    order: 30
  },
  {
    id: 'q6_8',
    text: 'Як використовуєте задні гальма?',
    level: 'BASIC',
    category: 'БЛОК 6: ШВИДКІСТЬ ТА ГАЛЬМУВАННЯ',
    isHubQuestion: false,
    multiChoice: false,
    isCritical: false,
    type: 'single_choice',
    answers: [
      'Завжди - це основні гальма',
      'Тільки в екстреній ситуації разом з переднім',
      'При гальмуванні на поворотах',
      'При гальмуванні на слизькій дорозі',
      'В міжрядді',
      'Майже не використовую'
    ],
    points: 2,
    order: 31
  },

  // БЛОК 7: ПОВОРОТИ ТА МАНЕВРИ (7 питань)
  {
    id: 'q7_1',
    text: 'Страх розворотів з вивернутим кермом?',
    level: 'BASIC',
    category: 'БЛОК 7: ПОВОРОТИ ТА МАНЕВРИ',
    isHubQuestion: false,
    multiChoice: false,
    isCritical: false,
    type: 'single_choice',
    answers: [
      'Так, дуже боюсь',
      'Трохи некомфортно',
      'Ні, нормально роблю',
      'Що це таке?'
    ],
    points: 2,
    order: 32
  },
  {
    id: 'q7_2',
    text: 'Досвід джимхани або треку?',
    level: 'BASIC',
    category: 'БЛОК 7: ПОВОРОТИ ТА МАНЕВРИ',
    isHubQuestion: false,
    multiChoice: false,
    isCritical: false,
    type: 'single_choice',
    answers: [
      'Ні',
      'Трохи джимхани',
      'Трохи треку',
      'Обидва регулярно'
    ],
    points: 2,
    order: 33
  },
  {
    id: 'q7_3',
    text: 'Чи знаєте ваш граничний кут нахилу?',
    level: 'INTERMEDIATE',
    category: 'БЛОК 7: ПОВОРОТИ ТА МАНЕВРИ',
    isHubQuestion: true, // HUB питання!
    multiChoice: false,
    isCritical: false,
    type: 'single_choice',
    answers: [
      'Так, точно знаю',
      'Приблизно уявляю',
      'Ні, не знаю',
      'Не розумію про що мова'
    ],
    points: 3,
    order: 34
  },
  {
    id: 'q7_4',
    text: 'Як їдете в повороті (траєкторія)?',
    level: 'INTERMEDIATE',
    category: 'БЛОК 7: ПОВОРОТИ ТА МАНЕВРИ',
    isHubQuestion: false,
    multiChoice: false,
    isCritical: false,
    type: 'single_choice',
    answers: [
      'Обережно по центру',
      'Вузький вхід, широкий вихід',
      'Широкий вхід, вузький вихід',
      'Не звертаю уваги на траєкторію'
    ],
    correctAnswer: 'Широкий вхід, вузький вихід',
    points: 3,
    order: 35
  },
  {
    id: 'q7_5',
    text: 'Чи знаєте як гальмувати в повороті?',
    level: 'ADVANCED',
    category: 'БЛОК 7: ПОВОРОТИ ТА МАНЕВРИ',
    isHubQuestion: false,
    dependsOn: 'q7_3',
    showConditions: {
      'q7_3': ['Так, точно знаю', 'Приблизно уявляю']
    },
    multiChoice: false,
    isCritical: false,
    type: 'single_choice',
    answers: [
      'Не знаю, треба пробувати',
      'Випрямляю і гальмую по прямій',
      'Використовую тільки заднє',
      'Розумію trail braking'
    ],
    points: 3,
    order: 36
  },
  {
    id: 'q7_6',
    text: 'Максимальна швидкість входу в поворот на розв\'язці?',
    level: 'ADVANCED',
    category: 'БЛОК 7: ПОВОРОТИ ТА МАНЕВРИ',
    isHubQuestion: false,
    dependsOn: 'q7_2',
    showConditions: {
      'q7_2': ['Трохи джимхани', 'Трохи треку', 'Обидва регулярно']
    },
    multiChoice: false,
    isCritical: false,
    type: 'single_choice',
    answers: [
      '40-60 км/год',
      '60-80 км/год',
      '80-100 км/год',
      'Не знаю'
    ],
    points: 2,
    order: 37
  },
  {
    id: 'q7_7',
    text: 'Чи є дискомфорт при дуже крутому повороті?',
    level: 'ADVANCED',
    category: 'БЛОК 7: ПОВОРОТИ ТА МАНЕВРИ',
    isHubQuestion: false,
    dependsOn: 'q7_3',
    showConditions: {
      'q7_3': ['Так, точно знаю', 'Приблизно уявляю']
    },
    multiChoice: false,
    isCritical: false,
    type: 'single_choice',
    answers: [
      'Так, боюсь що впаду',
      'Трохи напружуюсь',
      'Ні, комфортно',
      'Люблю агресивні повороти'
    ],
    points: 2,
    order: 38
  },

  // БЛОК 8: СОЦІАЛЬНІ АСПЕКТИ (7 питань)
  {
    id: 'q8_1',
    text: 'Використання дальнього світла в місті?',
    level: 'BASIC',
    category: 'БЛОК 8: СОЦІАЛЬНІ АСПЕКТИ',
    isHubQuestion: false,
    multiChoice: false,
    isCritical: false,
    type: 'single_choice',
    answers: [
      'Вдень включаю, вночі ні',
      'Завжди включене',
      'Ніколи не включаю',
      'Тільки коли темно і пусто'
    ],
    correctAnswer: 'Тільки коли темно і пусто',
    points: 2,
    order: 39
  },
  {
    id: 'q8_2',
    text: 'Як сильно тримаєте кермо?',
    level: 'BASIC',
    category: 'БЛОК 8: СОЦІАЛЬНІ АСПЕКТИ',
    isHubQuestion: false,
    multiChoice: false,
    isCritical: true,
    type: 'single_choice',
    answers: [
      'Міцно, щоб контролювати',
      'Як тримаю склянку кави',
      'Залежить від ситуації'
    ],
    correctAnswer: 'Як тримаю склянку кави',
    points: 3,
    order: 40
  },
  {
    id: 'q8_3',
    text: 'Куди стаєте на червоному?',
    level: 'BASIC',
    category: 'БЛОК 8: СОЦІАЛЬНІ АСПЕКТИ',
    isHubQuestion: false,
    multiChoice: false,
    isCritical: false,
    type: 'single_choice',
    answers: [
      'Проїжджаю всіх вперед',
      'Між машинами де є місце',
      'Справа від крайньої лівої',
      'Залишаюсь в потоці'
    ],
    correctAnswer: 'Справа від крайньої лівої',
    points: 2,
    order: 41
  },
  {
    id: 'q8_4',
    text: 'Чому мотоциклісти встають на підніжки?',
    level: 'BASIC',
    category: 'БЛОК 8: СОЦІАЛЬНІ АСПЕКТИ',
    isHubQuestion: false,
    multiChoice: false,
    isCritical: true,
    type: 'single_choice',
    answers: [
      'Показати що ендуристи',
      'Розім\'яти ноги',
      'Бачити далі через машини',
      'Круто виглядає',
      'Легше керувати на малій швидкості'
    ],
    correctAnswer: 'Бачити далі через машини',
    points: 3,
    order: 42
  },
  {
    id: 'q8_5',
    text: 'Навіщо гума на баку?',
    level: 'BASIC',
    category: 'БЛОК 8: СОЦІАЛЬНІ АСПЕКТИ',
    isHubQuestion: false,
    multiChoice: false,
    isCritical: false,
    type: 'single_choice',
    answers: [
      'Захист від подряпин',
      'Від бензинових плям',
      'Для контролю при гальмуванні',
      'Для кращого контролю ногами'
    ],
    correctAnswer: 'Для контролю при гальмуванні',
    points: 2,
    order: 43
  },
  {
    id: 'q8_6',
    text: 'Чи їздите швидше в групі?',
    level: 'BASIC',
    category: 'БЛОК 8: СОЦІАЛЬНІ АСПЕКТИ',
    isHubQuestion: false,
    multiChoice: false,
    isCritical: false,
    type: 'single_choice',
    answers: [
      'Так, підлаштовуюсь',
      'Ні, їжджу своїм темпом',
      'Не їжджу в групах'
    ],
    correctAnswer: 'Ні, їжджу своїм темпом',
    points: 2,
    order: 44
  },
  {
    id: 'q8_7',
    text: 'Пасажира вже катали?',
    level: 'BASIC',
    category: 'БЛОК 8: СОЦІАЛЬНІ АСПЕКТИ',
    isHubQuestion: false,
    multiChoice: false,
    isCritical: false,
    type: 'single_choice',
    answers: [
      'Так, регулярно',
      'Кілька разів',
      'Ще ні',
      'Принципово соло'
    ],
    points: 1,
    order: 45
  },

  // БЛОК 9: ТЕХНІЧНІ ТА НАВЧАЛЬНІ (5 питань)
  {
    id: 'q9_1',
    text: 'Який тиск в шинах?',
    level: 'BASIC',
    category: 'БЛОК 9: ТЕХНІЧНІ ТА НАВЧАЛЬНІ',
    isHubQuestion: false,
    multiChoice: false,
    isCritical: true,
    type: 'single_choice',
    answers: [
      'Знаю точно (вкажіть нижче)',
      'Приблизно знаю',
      'Не знаю'
    ],
    points: 3,
    order: 46
  },
  {
    id: 'q9_2',
    text: 'Чи є механік/СТО?',
    level: 'BASIC',
    category: 'БЛОК 9: ТЕХНІЧНІ ТА НАВЧАЛЬНІ',
    isHubQuestion: false,
    multiChoice: false,
    isCritical: false,
    type: 'single_choice',
    answers: [
      'Так, постійний',
      'Іноді звертаюсь',
      'Сам обслуговую',
      'Поки не потрібно було'
    ],
    points: 1,
    order: 47
  },
  {
    id: 'q9_3',
    text: 'Досвід складних умов?',
    level: 'INTERMEDIATE',
    category: 'БЛОК 9: ТЕХНІЧНІ ТА НАВЧАЛЬНІ',
    isHubQuestion: false,
    multiChoice: false,
    isCritical: false,
    type: 'single_choice',
    answers: [
      'Ні',
      'Трохи (дощ, холод)',
      'Регулярно всепогодний'
    ],
    points: 2,
    order: 48
  },
  {
    id: 'q9_4',
    text: 'Записуєте поїздки на камеру?',
    level: 'INTERMEDIATE',
    category: 'БЛОК 9: ТЕХНІЧНІ ТА НАВЧАЛЬНІ',
    isHubQuestion: false,
    multiChoice: false,
    isCritical: false,
    type: 'single_choice',
    answers: [
      'Так, для аналізу',
      'Так, для безпеки',
      'Іноді',
      'Ні'
    ],
    points: 2,
    order: 49
  },
  {
    id: 'q9_5',
    text: 'Плануєте маршрути заздалегідь?',
    level: 'INTERMEDIATE',
    category: 'БЛОК 9: ТЕХНІЧНІ ТА НАВЧАЛЬНІ',
    isHubQuestion: false,
    multiChoice: false,
    isCritical: false,
    type: 'single_choice',
    answers: [
      'Завжди',
      'Для далеких поїздок',
      'Рідко',
      'Ніколи'
    ],
    points: 2,
    order: 50
  }
]