/**
 * Questionnaire for Beginner Motorcycle Riders
 * Comprehensive assessment for riders with less than 1 year of experience
 */

export interface QuestionnaireQuestion {
  id: string
  blockId: string
  blockName: string
  text: string
  type: 'single_choice' | 'multiple_choice' | 'text' | 'number' | 'slider' | 'motorcycle_select'
  required: boolean
  order: number
  options?: string[]
  placeholder?: string
  sliderConfig?: {
    min: number
    max: number
    step: number
    defaultValue?: number
    unit?: string
    labels?: string[]
    label?: (value: number) => string
  }
  validationRules?: {
    minLength?: number
    maxLength?: number
    pattern?: string
    custom?: (value: any) => boolean
  }
  dependsOn?: {
    questionId: string
    condition: 'equals' | 'not_equals' | 'includes' | 'not_includes' | 'greater_than' | 'less_than'
    value: any
  }
  skipIf?: {
    questionId: string
    condition: 'equals' | 'not_equals' | 'includes' | 'not_includes'
    value: any
  }
  isHubQuestion?: boolean // Key question that affects other questions
  scoringWeight?: number // Weight for profile calculation
  redFlagTrigger?: any // Value that triggers red flag
  analyticsKey?: string // Key for analytics tracking
}

export const BEGINNER_QUESTIONNAIRE: QuestionnaireQuestion[] = [
  // =======================================
  // БЛОК 1: ПРОФІЛЬ І САМООЦІНКА
  // =======================================
  {
    id: 'b1_1',
    blockId: 'block_1',
    blockName: 'ПРОФІЛЬ І САМООЦІНКА',
    text: 'Скільки вам років?',
    type: 'single_choice',
    required: true,
    order: 1,
    options: ['До 20', '20-30', '30-40', '40-50', '50+'],
    analyticsKey: 'age_group'
  },
  {
    id: 'b1_2',
    blockId: 'block_1',
    blockName: 'ПРОФІЛЬ І САМООЦІНКА',
    text: 'Стать?',
    type: 'single_choice',
    required: true,
    order: 2,
    options: ['Чоловік', 'Жінка', 'Не вказувати'],
    analyticsKey: 'gender'
  },
  {
    id: 'b1_3',
    blockId: 'block_1',
    blockName: 'ПРОФІЛЬ І САМООЦІНКА',
    text: 'Чому вирішили почати кататися?',
    type: 'single_choice',
    required: true,
    order: 3,
    options: [
      'Сімейна історія - в сім\'ї катались',
      'Мене прокатили і я захопився мотоциклізмом',
      'Давно хотів і ось вирішив, бо можна померти, а на мотоциклі ще не катався',
      'Є мрія, де я мчу на захід сонця на мотоциклі',
      'Просто стало цікаво спробувати - спробував і сподобалось',
      'Інше'
    ],
    scoringWeight: 2,
    analyticsKey: 'motivation'
  },
  {
    id: 'b1_4',
    blockId: 'block_1',
    blockName: 'ПРОФІЛЬ І САМООЦІНКА',
    text: 'Чим займаєтесь по професії?',
    type: 'single_choice',
    required: true,
    order: 4,
    options: [
      'Лікар',
      'Айтішник',
      'Фінансист',
      'Військовий',
      'Підприємець',
      'Інше'
    ],
    analyticsKey: 'profession'
  },
  {
    id: 'b1_5',
    blockId: 'block_1',
    blockName: 'ПРОФІЛЬ І САМООЦІНКА',
    text: 'Який досвід їзди на мотоциклі?',
    type: 'single_choice',
    required: true,
    order: 5,
    isHubQuestion: true,
    options: [
      'Ще не маю мотоцикла, мотошколу не пройшов',
      'В мотошколі зараз',
      'Перший місяць їжджу',
      'Більше 3 місяців',
      'Більше року їжджу'
    ],
    scoringWeight: 5,
    analyticsKey: 'experience_level'
  },
  {
    id: 'b1_6',
    blockId: 'block_1',
    blockName: 'ПРОФІЛЬ І САМООЦІНКА',
    text: 'Який у вас мотоцикл?',
    type: 'motorcycle_select',
    required: false,
    order: 6,
    placeholder: 'Почніть вводити марку або модель...',
    dependsOn: {
      questionId: 'b1_5',
      condition: 'not_equals',
      value: 'Ще не маю мотоцикла, мотошколу не пройшов'
    },
    analyticsKey: 'motorcycle'
  },
  {
    id: 'b1_7',
    blockId: 'block_1',
    blockName: 'ПРОФІЛЬ І САМООЦІНКА',
    text: 'В якій мотошколі навчались?',
    type: 'single_choice',
    required: false,
    order: 7,
    options: [
      'TheRiders',
      'YellowRide',
      'Probiker',
      'Freeride',
      'Motostar',
      'VShleme',
      'Інша мотошкола',
      'Не навчався в мотошколі'
    ],
    analyticsKey: 'motoschool_name'
  },
  {
    id: 'b1_8',
    blockId: 'block_1',
    blockName: 'ПРОФІЛЬ І САМООЦІНКА',
    text: 'Як вибирали мотошколу?',
    type: 'single_choice',
    required: false,
    order: 8,
    options: [
      'По знайомих',
      'Загуглив',
      'Через Nebachiv',
      'Не навчався в мотошколі',
      'Інше'
    ],
    skipIf: {
      questionId: 'b1_7',
      condition: 'equals',
      value: ''
    },
    analyticsKey: 'motoschool_source'
  },

  // =======================================
  // БЛОК 2: ДОСВІД
  // =======================================
  {
    id: 'b2_1',
    blockId: 'block_2',
    blockName: 'ДОСВІД',
    text: 'Чи почали їздити в міжрядді?',
    type: 'single_choice',
    required: true,
    order: 9,
    options: [
      'Ще ні. Страшно подряпати автівки',
      'Так, але страшнувато',
      'Так, але некомфортно',
      'Так, впевнено'
    ],
    dependsOn: {
      questionId: 'b1_5',
      condition: 'not_includes',
      value: ['Ще не маю мотоцикла, мотошколу не пройшов', 'В мотошколі зараз']
    },
    scoringWeight: 2,
    analyticsKey: 'lane_splitting'
  },
  {
    id: 'b2_2',
    blockId: 'block_2',
    blockName: 'ДОСВІД',
    text: 'Дискомфортні ситуації, з якими вже мали справу:',
    type: 'multiple_choice',
    required: false,
    order: 10,
    options: [
      'Перелаштування автівки в мене',
      'Втрата балансу -> падіння',
      'Дискомфорт в повороті, бо незрозуміло, як сильно можна нахилити байк',
      'Глохну на світлофорі',
      'Дискомфорт від уваги інших водіїв',
      'Коли на хвості сідає автівка або страх, що вдарять ззаду на перехресті',
      'Інше'
    ],
    dependsOn: {
      questionId: 'b1_5',
      condition: 'not_includes',
      value: ['Ще не маю мотоцикла, мотошколу не пройшов']
    },
    scoringWeight: 3,
    analyticsKey: 'experienced_situations'
  },
  {
    id: 'b2_3',
    blockId: 'block_2',
    blockName: 'ДОСВІД',
    text: 'Ситуації, які ще НЕ траплялись і не знаєте як діяти:',
    type: 'multiple_choice',
    required: false,
    order: 11,
    options: [
      'Як вибрати мотоцикл',
      'Як вибрати гарну екіпіровку',
      'Лівий поворот автівки в мене',
      'Неприємності через блокера',
      'Виїзд з другорядної автівки в мене',
      'Нічні пригоди на незнайомій дорозі',
      'Слизькі люки, рейки',
      'Наїзд на ями, бугри',
      '"Забув повернути" від автівки',
      'Виїзд мені назустріч',
      'Неочікуваний пішохід',
      'Проїзд автівки на червоний',
      'Необхідність екстренно гальмувати зі швидкості 80+',
      'Необхідність екстренно гальмувати на слизькому',
      'Необхідність екстренно гальмувати і маневрувати на прямій',
      'Необхідність екстренно гальмувати і маневрувати в повороті',
      'Помилку сприйняття у водія',
      'Проблема з фурами',
      'Неочікуване відкриття дверей автівки',
      'Як взаємодіяти з іншими райдерами при груповій їзді',
      'Засліплення вночі',
      'Інше'
    ],
    scoringWeight: 4,
    analyticsKey: 'unknown_situations'
  },
  {
    id: 'b2_4',
    blockId: 'block_2',
    blockName: 'ДОСВІД',
    text: 'Чи були вже неприємні ситуації, які потенційно могли пошкодити вас?',
    type: 'single_choice',
    required: true,
    order: 12,
    options: [
      'Ще не було складних',
      '1-3 ситуації',
      'Більше 3 ситуацій'
    ],
    dependsOn: {
      questionId: 'b1_5',
      condition: 'not_equals',
      value: 'Ще не маю мотоцикла, мотошколу не пройшов'
    },
    scoringWeight: 3,
    analyticsKey: 'dangerous_situations_count'
  },

  // =======================================
  // БЛОК 3: ОЦІНКА РИЗИКІВ І ПСИХОЛОГІЯ
  // =======================================
  {
    id: 'b3_1',
    blockId: 'block_3',
    blockName: 'ОЦІНКА РИЗИКІВ І ПСИХОЛОГІЯ',
    text: 'Як оцінювали загрозу від міської їзди, коли приймали рішення стати мотоциклістом?',
    type: 'single_choice',
    required: true,
    order: 13,
    isHubQuestion: true,
    options: [
      'Не думав про це, я хочу кататись і покладаюсь на удачу',
      'Думав про це, прийняв, що небезпечно, зроблю все, щоб підготуватись',
      'Періодично думаю про це, бо не розумію всіх потенційних небезпек',
      'Постійно думаю про це перед виїздом, тривожусь'
    ],
    scoringWeight: 5,
    redFlagTrigger: 'Не думав про це, я просто хочу кататись',
    analyticsKey: 'risk_assessment'
  },
  {
    id: 'b3_2',
    blockId: 'block_3',
    blockName: 'ОЦІНКА РИЗИКІВ І ПСИХОЛОГІЯ',
    text: 'Щось робили для зменшення ризиків?',
    type: 'multiple_choice',
    required: false,
    order: 14,
    isHubQuestion: true,
    options: [
      'Ні',
      'Намагаюсь більше кататись, спеціально виїжджаю для збільшення накату',
      'Самостійно тренував гальмування - маневри на майданчику',
      'Купив якісну екіпіровку',
      'Пройшов додаткове навчання',
      'Дивився аварії в YouTube',
      'Дивлюсь канал Небачив',
      'Інше'
    ],
    scoringWeight: 4,
    redFlagTrigger: ['Ні'],
    analyticsKey: 'safety_actions'
  },
  {
    id: 'b3_3',
    blockId: 'block_3',
    blockName: 'ОЦІНКА РИЗИКІВ І ПСИХОЛОГІЯ',
    text: 'Чи відлякує вас дивитись відео аварій?',
    type: 'single_choice',
    required: true,
    order: 15,
    options: [
      'Не подобається, але дивлюсь. Хоч і страшно, але корисно для отримання досвіду',
      'Не дуже хочеться, бо може відвернути від їзди. Але цікаво дивитись ті ситуації, де все закінчилось добре',
      'Не дивився, якось навіть не думав про це',
      'Не хочу дивитись. Зі мною таке не трапиться'
    ],
    scoringWeight: 3,
    redFlagTrigger: 'Не хочу дивитись. Зі мною таке не трапиться',
    analyticsKey: 'accident_videos_attitude'
  },

  // =======================================
  // БЛОК 4: БАЗОВІ НАВИЧКИ
  // =======================================
  {
    id: 'b4_1',
    blockId: 'block_4',
    blockName: 'БАЗОВІ НАВИЧКИ',
    text: 'З якою реальною швидкістю їздите по місту? (мається на увазі верхня планка)',
    type: 'single_choice',
    required: true,
    order: 16,
    isHubQuestion: true,
    options: [
      '40-70 км/год',
      '70-90 км/год',
      '90-150 км/год'
    ],
    dependsOn: {
      questionId: 'b1_5',
      condition: 'not_includes',
      value: ['Ще не маю мотоцикла, мотошколу не пройшов', 'В мотошколі зараз']
    },
    scoringWeight: 5,
    redFlagTrigger: '90-150 км/год',
    analyticsKey: 'city_speed'
  },
  {
    id: 'b4_2',
    blockId: 'block_4',
    blockName: 'БАЗОВІ НАВИЧКИ',
    text: 'Як сильно тримаєте кермо?',
    type: 'single_choice',
    required: true,
    order: 17,
    options: [
      'Міцно, щоб контролювати',
      'Легко, як філіжанку кави',
      'Залежить від дороги'
    ],
    dependsOn: {
      questionId: 'b1_5',
      condition: 'not_includes',
      value: ['Ще не маю мотоцикла, мотошколу не пройшов']
    },
    scoringWeight: 2,
    analyticsKey: 'handlebar_grip'
  },
  {
    id: 'b4_3',
    blockId: 'block_4',
    blockName: 'БАЗОВІ НАВИЧКИ',
    text: 'Що самі тренували на майданчику?',
    type: 'multiple_choice',
    required: false,
    order: 18,
    isHubQuestion: true,
    options: [
      'Екстрене гальмування',
      'Повороти',
      'Повільну їзду і баланс',
      'Джимхану',
      'Виїжджав на трек',
      'Пітбайки',
      'Нічого не тренував',
      'Інше'
    ],
    scoringWeight: 4,
    analyticsKey: 'self_training'
  },
  {
    id: 'b4_4',
    blockId: 'block_4',
    blockName: 'БАЗОВІ НАВИЧКИ',
    text: 'В якій частині смуги зазвичай рухаєтесь?',
    type: 'single_choice',
    required: true,
    order: 19,
    options: [
      'По центру',
      'Лівий край',
      'Правий край',
      'Постійно змінюю позицію'
    ],
    dependsOn: {
      questionId: 'b1_5',
      condition: 'not_includes',
      value: ['Ще не маю мотоцикла, мотошколу не пройшов', 'В мотошколі зараз']
    },
    scoringWeight: 2,
    analyticsKey: 'lane_position'
  },
  {
    id: 'b4_5',
    blockId: 'block_4',
    blockName: 'БАЗОВІ НАВИЧКИ',
    text: 'Чи катали вже пасажира?',
    type: 'single_choice',
    required: false,
    order: 20,
    options: [
      'Так',
      'Так, було досить незручно',
      'Ще ні',
      'Ще ні, не відчуваю впевненості'
    ],
    dependsOn: {
      questionId: 'b1_5',
      condition: 'not_includes',
      value: ['Ще не маю мотоцикла, мотошколу не пройшов', 'В мотошколі зараз']
    },
    scoringWeight: 1,
    analyticsKey: 'passenger_experience'
  },

  // =======================================
  // БЛОК 5: СОЦІАЛЬНИЙ АСПЕКТ
  // =======================================
  {
    id: 'b5_1',
    blockId: 'block_5',
    blockName: 'СОЦІАЛЬНИЙ АСПЕКТ',
    text: 'Чи є друзі-мотоциклісти для порад?',
    type: 'single_choice',
    required: true,
    order: 21,
    isHubQuestion: true,
    options: [
      'Ні',
      '1-2 людини',
      'Кілька досвідчених',
      'Велика спільнота'
    ],
    scoringWeight: 3,
    analyticsKey: 'moto_friends'
  },
  {
    id: 'b5_2',
    blockId: 'block_5',
    blockName: 'СОЦІАЛЬНИЙ АСПЕКТ',
    text: 'Чи катаєтесь з кимось?',
    type: 'single_choice',
    required: true,
    order: 22,
    options: [
      'Тільки сам',
      'Іноді з друзями',
      'Регулярно в групі'
    ],
    scoringWeight: 2,
    analyticsKey: 'riding_style'
  },
  {
    id: 'b5_3',
    blockId: 'block_5',
    blockName: 'СОЦІАЛЬНИЙ АСПЕКТ',
    text: 'До кого звертаєтесь за технічними порадами?',
    type: 'single_choice',
    required: false,
    order: 23,
    options: [
      'Нікого немає',
      'Друзі',
      'Механік/СТО',
      'Онлайн спільноти',
      'Інше'
    ],
    scoringWeight: 1,
    analyticsKey: 'technical_advice_source'
  },
  {
    id: 'b5_4',
    blockId: 'block_5',
    blockName: 'СОЦІАЛЬНИЙ АСПЕКТ',
    text: 'Додаткові коментарі (необов\'язково)',
    type: 'text',
    required: false,
    order: 24,
    placeholder: 'Розкажіть більше про ваш досвід або що вас турбує...',
    validationRules: {
      maxLength: 500
    },
    analyticsKey: 'additional_comments'
  }
]

// Profile calculation logic
export const BEGINNER_PROFILES = {
  CAREFUL_STUDENT: 'BEGINNER_CAREFUL',
  FAST_PROGRESS: 'BEGINNER_FAST',
  ROMANTIC_DREAMER: 'BEGINNER_ROMANTIC',
  RED_FLAG: 'BEGINNER_RED_FLAG'
}

export function calculateBeginnerProfile(answers: Record<string, any>) {
  const profiles = {
    careful: 0,
    fast: 0,
    romantic: 0,
    redFlags: [] as string[],
    characteristics: [] as string[],
    riskFactors: [] as string[]
  }

  // Enhanced red flag detection
  if (answers.b3_1 === 'Не думав про це, я просто хочу кататись') {
    profiles.redFlags.push('Ігнорує ризики')
    profiles.riskFactors.push('no_risk_awareness')
  }
  if (answers.b3_2?.includes('Ні, нічого не робив')) {
    profiles.redFlags.push('Відсутні дії з безпеки')
    profiles.riskFactors.push('no_safety_preparation')
  }
  if (answers.b3_3 === 'Не хочу дивитись. Зі мною таке не трапиться') {
    profiles.redFlags.push('Заперечення небезпеки')
    profiles.riskFactors.push('danger_denial')
  }
  if (answers.b4_1 === '90-150 км/год' && 
      (answers.b1_5 === 'Перший місяць їжджу' || answers.b1_5 === 'В мотошколі зараз')) {
    profiles.redFlags.push('Надмірна швидкість для досвіду')
    profiles.riskFactors.push('excessive_speed')
  }
  if (answers.b2_1 === 'Так, проїжджаю між машинами регулярно' && 
      answers.b1_5 === 'Перший місяць їжджу') {
    profiles.redFlags.push('Небезпечна поведінка для початківця')
    profiles.riskFactors.push('risky_lane_splitting')
  }
  if (answers.b4_2 === 'Різкі прискорення, активне маневрування') {
    profiles.riskFactors.push('aggressive_riding')
  }

  // If critical red flags detected, return immediately
  if (profiles.redFlags.length >= 3 || 
      (profiles.redFlags.length >= 2 && profiles.riskFactors.length >= 2)) {
    return {
      profile: BEGINNER_PROFILES.RED_FLAG,
      redFlags: profiles.redFlags,
      riskFactors: profiles.riskFactors,
      scores: {
        careful: profiles.careful,
        fast: profiles.fast,
        romantic: profiles.romantic,
        riskLevel: 'critical'
      },
      characteristics: [
        'Високий рівень ризику',
        'Потребує негайного навчання безпеці',
        'Схильність до небезпечної поведінки'
      ],
      recommendations: [
        'Обов\'язковий курс безпеки перед продовженням їзди',
        'Перегляд статистики аварій початківців',
        'Індивідуальний ментор обов\'язковий',
        'Психологічна консультація щодо сприйняття ризиків',
        'Заборона їзди в групі до проходження курсу'
      ]
    }
  }

  // Enhanced CAREFUL_STUDENT scoring
  if (answers.b3_1?.includes('Постійно думаю') || answers.b3_1?.includes('Періодично думаю')) {
    profiles.careful += 3
    profiles.characteristics.push('Усвідомлює ризики')
  }
  if (answers.b2_3 && answers.b2_3.length > 8) {
    profiles.careful += 2
    profiles.characteristics.push('Розуміє свої обмеження')
  }
  if (answers.b4_1 === '40-70 км/год') {
    profiles.careful += 2
    profiles.characteristics.push('Консервативна швидкість')
  }
  if (answers.b2_1 === 'Ще ні. Страшно подряпати автівки') {
    profiles.careful += 1
    profiles.characteristics.push('Обережний у трафіку')
  }
  if (answers.b3_2?.includes('Записався на курси безпечного водіння')) {
    profiles.careful += 3
    profiles.characteristics.push('Інвестує в навчання')
  }
  if (answers.b4_3?.includes('Читання ситуації на дорозі')) {
    profiles.careful += 2
  }

  // Enhanced FAST_PROGRESS scoring
  if (answers.b3_2?.includes('Самостійно тренував гальмування')) {
    profiles.fast += 3
    profiles.characteristics.push('Активне навчання')
  }
  if (answers.b3_2?.includes('Дивився аварії в YouTube')) {
    profiles.fast += 2
    profiles.characteristics.push('Вчиться на помилках інших')
  }
  if (answers.b4_3 && answers.b4_3.length > 3) {
    profiles.fast += 3
    profiles.characteristics.push('Працює над багатьма навичками')
  }
  if (answers.b1_4 === 'Айтішник' || answers.b1_4 === 'Військовий') {
    profiles.fast += 1
    profiles.characteristics.push('Аналітичний підхід')
  }
  if (answers.b5_1 === 'Кілька досвідчених' || answers.b5_1 === 'Велика спільнота') {
    profiles.fast += 2
    profiles.characteristics.push('Має підтримку спільноти')
  }
  if (answers.b1_2 === '3-5 років' || answers.b1_2 === 'Більше 5 років') {
    profiles.fast += 2
    profiles.characteristics.push('Досвід водіння автомобіля')
  }
  if (answers.b4_3?.includes('Екстрене гальмування')) {
    profiles.fast += 3
    profiles.characteristics.push('Фокус на критичних навичках')
  }

  // Enhanced ROMANTIC_DREAMER scoring
  if (answers.b1_3?.includes('мрія') || answers.b1_3?.includes('можна померти')) {
    profiles.romantic += 3
    profiles.characteristics.push('Емоційна мотивація')
  }
  if (!answers.b4_3?.includes('Екстрене гальмування') && !answers.b4_3?.includes('Повороти')) {
    profiles.romantic += 2
    profiles.characteristics.push('Ігнорує технічні навички')
  }
  if (answers.b5_2 === 'Регулярно в групі') {
    profiles.romantic += 2
    profiles.characteristics.push('Соціальний райдер')
  }
  if (answers.b3_3 === 'Не дивився, якось навіть не думав про це') {
    profiles.romantic += 1
  }
  if (answers.b1_3?.includes('свобода') || answers.b1_3?.includes('адреналін')) {
    profiles.romantic += 2
    profiles.characteristics.push('Шукає відчуттів')
  }

  // Calculate risk level
  const riskLevel = profiles.redFlags.length > 0 ? 'high' :
                    profiles.riskFactors.length > 2 ? 'moderate' :
                    profiles.careful > 5 ? 'low' : 'moderate'

  // Determine primary profile
  const maxScore = Math.max(profiles.careful, profiles.fast, profiles.romantic)
  
  if (profiles.careful === maxScore && profiles.careful > 0) {
    return {
      profile: BEGINNER_PROFILES.CAREFUL_STUDENT,
      scores: {
        careful: profiles.careful,
        fast: profiles.fast,
        romantic: profiles.romantic,
        riskLevel
      },
      characteristics: profiles.characteristics,
      redFlags: profiles.redFlags,
      recommendations: [
        'Продовжуйте поступовий розвиток навичок',
        'Приєднайтесь до структурованої навчальної програми',
        'Практикуйтеся в безпечному середовищі',
        'Фокус на техніці проходження поворотів',
        'Освойте екстрене гальмування на закритому майданчику'
      ]
    }
  } else if (profiles.fast === maxScore && profiles.fast > 0) {
    return {
      profile: BEGINNER_PROFILES.FAST_PROGRESS,
      scores: {
        careful: profiles.careful,
        fast: profiles.fast,
        romantic: profiles.romantic,
        riskLevel
      },
      characteristics: profiles.characteristics,
      redFlags: profiles.redFlags,
      recommendations: [
        'Рекомендується просунуте навчання',
        'Трек-дні для безпечної практики швидкості',
        'Розгляньте програму менторства',
        'Курс контраварійного водіння',
        'Вивчення техніки спортивної їзди в безпечних умовах'
      ]
    }
  } else {
    return {
      profile: BEGINNER_PROFILES.ROMANTIC_DREAMER,
      scores: {
        careful: profiles.careful,
        fast: profiles.fast,
        romantic: profiles.romantic,
        riskLevel
      },
      characteristics: profiles.characteristics,
      redFlags: profiles.redFlags,
      recommendations: [
        'Базовий курс безпеки обов\'язковий',
        'Фокус на технічних навичках',
        'Приєднайтесь до спільноти райдерів',
        'Вивчіть теорію керування мотоциклом',
        'Практика базових маневрів на майданчику'
      ]
    }
  }
}