/**
 * Questionnaire for Experienced Motorcycle Riders
 * Comprehensive assessment for riders with 1+ years of experience
 */

import { QuestionnaireQuestion } from './questionnaire-beginner'

export const EXPERIENCED_QUESTIONNAIRE: QuestionnaireQuestion[] = [
  // =======================================
  // БЛОК 1: ПРОФІЛЬ І САМООЦІНКА
  // =======================================
  {
    id: 'e0_riding_year',
    blockId: 'block_1',
    blockName: 'ПРОФІЛЬ І САМООЦІНКА',
    text: 'Коли ви почали кататись на мотоциклі?',
    type: 'slider',
    required: true,
    order: 0,
    sliderConfig: {
      min: 1990,
      max: new Date().getFullYear(),
      defaultValue: new Date().getFullYear() - 1, // Default: 1 year ago for experienced
      step: 1,
      unit: 'рік',
      label: (value: number) => {
        const currentYear = new Date().getFullYear();
        const years = currentYear - value;
        const seasons = years;
        if (years === 0) return `${value} (цього року)`;
        if (years === 1) return `${value} (1 рік, 1 сезон)`;
        if (years >= 2 && years <= 4) return `${value} (${years} роки, ${seasons} сезони)`;
        return `${value} (${years} років, ${seasons} сезонів)`;
      }
    },
    scoringWeight: 3,
    analyticsKey: 'riding_start_year'
  },
  {
    id: 'e1_1',
    blockId: 'block_1',
    blockName: 'ПРОФІЛЬ І САМООЦІНКА',
    text: 'Скільки років вам?',
    type: 'single_choice',
    required: true,
    order: 1,
    options: [
      '20-30',
      '30-40',
      '40-50',
      '50+'
    ],
    analyticsKey: 'age_group'
  },
  {
    id: 'e1_2',
    blockId: 'block_1',
    blockName: 'ПРОФІЛЬ І САМООЦІНКА',
    text: 'Стать?',
    type: 'single_choice',
    required: true,
    order: 2,
    options: [
      'Чоловік',
      'Жінка'
    ],
    analyticsKey: 'gender'
  },
  {
    id: 'e1_3',
    blockId: 'block_1',
    blockName: 'ПРОФІЛЬ І САМООЦІНКА',
    text: 'Від 1 до 10 який у вас рівень володіння мотоциклом?',
    type: 'number',
    required: true,
    order: 3,
    placeholder: 'Виберіть від 1 до 10',
    validationRules: {
      minLength: 1,
      maxLength: 2
    },
    scoringWeight: 3,
    analyticsKey: 'self_skill_level'
  },
  {
    id: 'e1_4',
    blockId: 'block_1',
    blockName: 'ПРОФІЛЬ І САМООЦІНКА',
    text: 'Пам\'ятаєте чому вирішили кататись?',
    type: 'single_choice',
    required: true,
    order: 4,
    options: [
      'Сімейна історія - в сім\'ї хтось катався',
      'Мене прокатили і вкусили мотоциклізмом',
      'Якось давно хотів і ось вирішив, бо можна вмерти а на мотоцику ще не катався',
      'Є мрія де я мчу на захід сонця на мотоциклі',
      'Просто стало цікаво спробувати - спробував і сподобалось',
      'Інше'
    ],
    analyticsKey: 'motivation'
  },
  {
    id: 'e1_5',
    blockId: 'block_1',
    blockName: 'ПРОФІЛЬ І САМООЦІНКА',
    text: 'Чим займаєтесь по професії?',
    type: 'single_choice',
    required: false,
    order: 5,
    options: [
      'Лікар',
      'Айтішник',
      'Фінансист',
      'Військовий',
      'Підприємець',
      'Юрист',
      'Творча професія',
      'Інше'
    ],
    analyticsKey: 'profession'
  },
  {
    id: 'e1_6',
    blockId: 'block_1',
    blockName: 'ПРОФІЛЬ І САМООЦІНКА',
    text: 'Який у вас мотоцикл?',
    type: 'motorcycle_select',
    required: true,
    order: 6,
    placeholder: 'Почніть вводити марку або модель...',
    analyticsKey: 'current_motorcycle'
  },
  {
    id: 'e1_7',
    blockId: 'block_1',
    blockName: 'ПРОФІЛЬ І САМООЦІНКА',
    text: 'В якій мотошколі навчались?',
    type: 'single_choice',
    required: false,
    order: 7,
    options: [
      'Сам навчався',
      'TheRiders',
      'YellowRide',
      'Probiker',
      'Freeride',
      'Motostar VShleme',
      'Інше'
    ],
    analyticsKey: 'moto_school'
  },

  // =======================================
  // БЛОК 2: ДОСВІД
  // =======================================
  {
    id: 'e2_1',
    blockId: 'block_2',
    blockName: 'ДОСВІД',
    text: 'Як почуваєтесь в міжрядді?',
    type: 'single_choice',
    required: true,
    order: 9,
    options: [
      'Не їжджу',
      'Дискомфортно, але їжджу',
      'Вільно почуваю, люблю затори'
    ],
    scoringWeight: 3,
    analyticsKey: 'lane_filtering_comfort'
  },
  {
    id: 'e2_2',
    blockId: 'block_2',
    blockName: 'ДОСВІД',
    text: 'Дискомфортні ситуації з якими ВИ ВЖЕ МАЛИ СПРАВУ',
    type: 'multiple_choice',
    required: false,
    order: 10,
    options: [
      'Перелаштування автівки в мене',
      'Втрата балансу -> падіння',
      'Дискомфорт в повороті, бо незрозуміло, як сильно можна нахилити байк',
      'Дискомфорт від дій інших водіїв',
      'Коли на хвості сідає автівка або страх, що вдарять ззаду на перехресті',
      'Блокування переднього колеса при гальмуванні',
      'Блокування заднього колеса при гальмуванні',
      'Не розрахував швидкість-траєкторію -> виліт з повороту',
      'Виїзд автівки з другорядної в мене',
      'Лівий поворот автівки в мене',
      'Я догнав автівку',
      'Інше'
    ],
    analyticsKey: 'experienced_situations'
  },
  {
    id: 'e2_3',
    blockId: 'block_2',
    blockName: 'ДОСВІД',
    text: 'Дискомфортні ситуації які ще НЕ ТРАПЛЯЛИСЬ але про які ВИ ЗНАЄТЕ і турбуєтесь',
    type: 'multiple_choice',
    required: false,
    order: 11,
    options: [
      'Лівий поворот автівки в мене',
      'Неприємності ізза блокера',
      'Виїзд з другорядної автівки в мене',
      'Ями, Люки, Рейки, Бугри',
      '"Забув повернути" від автівки',
      'Виїзд автівки на зустрічку',
      'Неочікуванний пішохід',
      'Проїзд автівки на червоний',
      'Необхідність екстренно гальмувати зі швидкості 80+',
      'Необхідність екстренно гальмувати на слизькому або поганому покритті',
      'Необхідність екстренно гальмувати і маневрувати на прямій',
      'Необхідність екстренно гальмувати і маневрувати в повороті',
      'Не розрахував швидкість-траєкторію і виліт з повороту',
      'Інше'
    ],
    analyticsKey: 'worried_situations'
  },
  {
    id: 'e2_4',
    blockId: 'block_2',
    blockName: 'ДОСВІД',
    text: 'Скільки стрьомних ситуацій зазвичай за сезон?',
    type: 'single_choice',
    required: true,
    order: 12,
    options: [
      '0-3 ситуації',
      '4-6 ситуацій',
      'Більше 6 ситуацій'
    ],
    scoringWeight: 3,
    analyticsKey: 'scary_situations_per_season'
  },
  {
    id: 'e2_5',
    blockId: 'block_2',
    blockName: 'ДОСВІД',
    text: 'Чи були у вас серйозні з пошкодженнями падіння і ДТП?',
    type: 'slider',
    required: true,
    order: 13,
    sliderConfig: {
      min: 0,
      max: 10,
      defaultValue: 0,
      step: 1,
      unit: '',
      label: (value: number) => {
        if (value === 0) return 'Не було';
        if (value === 1) return '1 випадок';
        if (value >= 2 && value <= 4) return `${value} випадки`;
        if (value >= 5) return `${value} випадків`;
        return `${value}`;
      }
    },
    scoringWeight: 4,
    analyticsKey: 'serious_crashes'
  },
  {
    id: 'e2_6',
    blockId: 'block_2',
    blockName: 'ДОСВІД',
    text: 'Чи є відео інцидента?',
    type: 'single_choice',
    required: false,
    order: 14,
    options: [
      'Так',
      'Ні'
    ],
    dependsOn: {
      questionId: 'e2_5',
      condition: 'not_equals',
      value: '0'
    },
    analyticsKey: 'has_incident_video'
  },
  {
    id: 'e2_7',
    blockId: 'block_2',
    blockName: 'ДОСВІД',
    text: 'Чи можете поділитись для ком\'юніті?',
    type: 'single_choice',
    required: false,
    order: 15,
    options: [
      'Так',
      'Ні'
    ],
    dependsOn: {
      questionId: 'e2_6',
      condition: 'equals',
      value: 'Так'
    },
    analyticsKey: 'will_share_video'
  },

  // =======================================
  // БЛОК 3: ОЦІНКА РИЗИКІВ І ПСИХОЛОГІЯ
  // =======================================
  {
    id: 'e3_1',
    blockId: 'block_3',
    blockName: 'ОЦІНКА РИЗИКІВ',
    text: 'Коли приймали рішення стати мотоциклістом - як оцінювали загрозу від міської їзди?',
    type: 'single_choice',
    required: true,
    order: 16,
    options: [
      'Не думав про це, я просто хотів кататись',
      'Думав про це, прийняв що небезпечно, роблю все щоб підготуватись',
      'Періодично думаю про це, бо не розумію всіх потенційних небезпек',
      'Постійно думаю про це перед виїздом, тривожусь'
    ],
    isHubQuestion: true,
    scoringWeight: 4,
    analyticsKey: 'risk_assessment'
  },

  // =======================================
  // БЛОК 4: СТИЛЬ ЇЗДИ ТА ЕКІПІРОВКА
  // =======================================
  {
    id: 'e4_1',
    blockId: 'block_4',
    blockName: 'СТИЛЬ ЇЗДИ',
    text: 'Чи катаєте вже пасажирів?',
    type: 'single_choice',
    required: false,
    order: 17,
    options: [
      'Так, але відчуваю складності, досить незручно',
      'Так, я серійний кататель',
      'Ні, не подобається'
    ],
    scoringWeight: 2,
    analyticsKey: 'passenger_riding'
  },
  {
    id: 'e4_2',
    blockId: 'block_4',
    blockName: 'СТИЛЬ ЇЗДИ',
    text: 'Ви зазвичай їздите:',
    type: 'single_choice',
    required: true,
    order: 18,
    options: [
      'В повному екіпі',
      'В легкому екіпі',
      'Шолом, футболка, шльопкі',
      'Залежить від поїздки'
    ],
    scoringWeight: 3,
    analyticsKey: 'gear_usage'
  },
  {
    id: 'e4_3',
    blockId: 'block_4',
    blockName: 'СТИЛЬ ЇЗДИ',
    text: 'Чи проходили додаткові курси після мотошколи?',
    type: 'multiple_choice',
    required: false,
    order: 19,
    options: [
      'Джимхана',
      'Трек виїзди',
      'Мотокрос',
      'Ендуро',
      'Пітбайки',
      'Ні, не проходив'
    ],
    scoringWeight: 2,
    analyticsKey: 'additional_training'
  },
  {
    id: 'e4_4',
    blockId: 'block_4',
    blockName: 'СТИЛЬ ЇЗДИ',
    text: 'Який у вас стиль їзди?',
    type: 'single_choice',
    required: true,
    order: 20,
    options: [
      'Агресивний',
      'Спокійний',
      'Змішаний'
    ],
    scoringWeight: 3,
    analyticsKey: 'riding_style'
  },

  // =======================================
  // БЛОК 5: НАВИЧКИ ГАЛЬМУВАННЯ
  // =======================================
  {
    id: 'e5_1',
    blockId: 'block_5',
    blockName: 'НАВИЧКИ ГАЛЬМУВАННЯ',
    text: 'З чим можете впевнено справитись?',
    type: 'multiple_choice',
    required: false,
    order: 21,
    options: [
      'Можу впевнено екстренно відгальмуватись з 60',
      'Можу впевнено екстренно відгальмуватись з 100',
      'Можу впевнено екстренно відгальмуватись зі 150',
      'Можу впевнено екстренно відгальмуватись на слизькій дорозі',
      'Трейлбрейкінг - впевнено практикую',
      'Можу справитись з блоком переднього колеса',
      'Можу справитись з блоком заднього колеса',
      'Можу поїхати в стопі'
    ],
    scoringWeight: 4,
    analyticsKey: 'braking_skills'
  },
  {
    id: 'e5_2',
    blockId: 'block_5',
    blockName: 'НАВИЧКИ ГАЛЬМУВАННЯ',
    text: 'Скільки метрів займе гальмування з 60 км/год?',
    type: 'single_choice',
    required: false,
    order: 22,
    options: [
      '8-10 м',
      '12-14 м',
      '14-16 м',
      '16-17 м',
      'Не знаю'
    ],
    dependsOn: {
      questionId: 'e5_1',
      condition: 'includes',
      value: 'Можу впевнено екстренно відгальмуватись з 60'
    },
    scoringWeight: 3,
    analyticsKey: 'braking_distance_60'
  },
  {
    id: 'e5_3',
    blockId: 'block_5',
    blockName: 'НАВИЧКИ ГАЛЬМУВАННЯ',
    text: 'Скільки метрів займе гальмування з 100 км/год?',
    type: 'single_choice',
    required: false,
    order: 23,
    options: [
      '20-30 м',
      '30-35 м',
      '35-40 м',
      '45-53 м',
      'Хз не заміряв'
    ],
    dependsOn: {
      questionId: 'e5_1',
      condition: 'includes',
      value: 'Можу впевнено екстренно відгальмуватись з 100'
    },
    scoringWeight: 3,
    analyticsKey: 'braking_distance_100'
  },
  {
    id: 'e5_4',
    blockId: 'block_5',
    blockName: 'НАВИЧКИ ГАЛЬМУВАННЯ',
    text: 'Скільки метрів займе гальмування з 150 км/год?',
    type: 'single_choice',
    required: false,
    order: 24,
    options: [
      '40-50 м',
      '70-80 м',
      '90-100 м',
      '120-130 м',
      'Хз не заміряв'
    ],
    dependsOn: {
      questionId: 'e5_1',
      condition: 'includes',
      value: 'Можу впевнено екстренно відгальмуватись зі 150'
    },
    scoringWeight: 3,
    analyticsKey: 'braking_distance_150'
  },

  // =======================================
  // БЛОК 6: НАВИЧКИ МАНЕВРУВАННЯ
  // =======================================
  {
    id: 'e6_trajectory',
    blockId: 'block_6',
    blockName: 'НАВИЧКИ МАНЕВРУВАННЯ',
    text: 'Якою траєкторією краще проходити повороти?',
    type: 'single_choice',
    required: true,
    order: 25,
    options: [
      'Рівноудаленно від загроз, їжджу по центру',
      'Широкий вхід',
      'Спрямити вхід в поворот',
      'Не знаю, просто їжджу'
    ],
    scoringWeight: 3,
    analyticsKey: 'trajectory_knowledge'
  },
  {
    id: 'e6_1',
    blockId: 'block_6',
    blockName: 'НАВИЧКИ МАНЕВРУВАННЯ',
    text: 'Що можете впевнено робити?',
    type: 'multiple_choice',
    required: false,
    order: 26,
    options: [
      'Впевнено їжджу в поворотах',
      'Впевнено можу розвернутись на вузькій дорозі без ніг',
      'Можу поїхати в коліно',
      'Впевнено можу їхати в дощ в повороті'
    ],
    scoringWeight: 3,
    analyticsKey: 'maneuvering_skills'
  },
  {
    id: 'e6_2',
    blockId: 'block_6',
    blockName: 'НАВИЧКИ МАНЕВРУВАННЯ',
    text: 'Що з цього можете? (стант навички)',
    type: 'multiple_choice',
    required: false,
    order: 26.5,
    options: [
      'Швидкий старт зі світлофора',
      'Павервіллі',
      'Клатчвіллі',
      'Віллі в баланс',
      'Стоппі',
      'Бьорнаут',
      'Дріфт',
      'Статичний баланс',
      'Нічого з цього не роблю'
    ],
    scoringWeight: 2,
    analyticsKey: 'stunt_skills'
  },

  // =======================================
  // БЛОК 7: БАЗОВІ НАВИЧКИ
  // =======================================
  {
    id: 'e7_1',
    blockId: 'block_7',
    blockName: 'БАЗОВІ НАВИЧКИ',
    text: 'З якою реальною швидкістю їздите по місту? (верхня планка)',
    type: 'single_choice',
    required: true,
    order: 27,
    options: [
      '40-70 км/год',
      '70-90 км/год',
      '90-150 км/год'
    ],
    isHubQuestion: true,
    scoringWeight: 4,
    analyticsKey: 'city_speed'
  },
  {
    id: 'e7_2',
    blockId: 'block_7',
    blockName: 'БАЗОВІ НАВИЧКИ',
    text: 'Як сильно тримаєте кермо?',
    type: 'single_choice',
    required: true,
    order: 28,
    options: [
      'Міцно, щоб контролювати',
      'Легко, як філіжанку кави',
      'Залежить від дороги'
    ],
    scoringWeight: 3,
    analyticsKey: 'handlebar_grip'
  },
  {
    id: 'e7_3',
    blockId: 'block_7',
    blockName: 'БАЗОВІ НАВИЧКИ',
    text: 'В якій частині смуги зазвичай рухаєтесь в місті?',
    type: 'single_choice',
    required: true,
    order: 29,
    options: [
      'По центру',
      'Лівий край',
      'Правий край',
      'Постійно змінюю позицію'
    ],
    scoringWeight: 3,
    analyticsKey: 'lane_position'
  },

  // =======================================
  // БЛОК 8: СОЦІАЛЬНИЙ АСПЕКТ
  // =======================================
  {
    id: 'e8_1',
    blockId: 'block_8',
    blockName: 'СОЦІАЛЬНИЙ АСПЕКТ',
    text: 'Чи є друзі-мотоциклісти для порад?',
    type: 'single_choice',
    required: false,
    order: 30,
    options: [
      'Ні',
      '1-2 людини',
      'Кілька досвідчених',
      'Велика спільнота'
    ],
    scoringWeight: 2,
    analyticsKey: 'moto_friends'
  },
  {
    id: 'e8_2',
    blockId: 'block_8',
    blockName: 'СОЦІАЛЬНИЙ АСПЕКТ',
    text: 'Чи катаєтесь з кимось?',
    type: 'single_choice',
    required: false,
    order: 31,
    options: [
      'Тільки сам',
      'Іноді з друзями',
      'Регулярно в групі'
    ],
    scoringWeight: 2,
    analyticsKey: 'group_riding'
  },

  // =======================================
  // БЛОК 9: СКЛАДНІ УМОВИ
  // =======================================
  {
    id: 'e9_1',
    blockId: 'block_9',
    blockName: 'СКЛАДНІ УМОВИ',
    text: 'На швидкості 100+ вобблінг. Що зробите?',
    type: 'single_choice',
    required: true,
    order: 32,
    options: [
      'Розслабити руки, не гальмувати',
      'Гальмувати',
      'Міцно тримати кермо',
      'Прискоритись'
    ],
    isHubQuestion: true,
    scoringWeight: 5,
    analyticsKey: 'wobble_response'
  },
  {
    id: 'e9_2',
    blockId: 'block_9',
    blockName: 'СКЛАДНІ УМОВИ',
    text: 'На скільки збільшується гальмівний шлях на мокрому?',
    type: 'single_choice',
    required: true,
    order: 33,
    options: [
      'На 20-30%',
      'На 75%-90%',
      'В 2-3 рази',
      'Не знаю'
    ],
    scoringWeight: 3,
    analyticsKey: 'wet_braking_distance'
  },
  
  // ========== BLOCK 10: ADVENTURE EXPERIENCE ==========
  {
    id: 'e10_1',
    blockId: 'block_10',
    blockName: 'ДОСВІД ПОДОРОЖЕЙ',
    text: 'Скільки дальніх поїздок (300+ км/день) за останні 2 роки?',
    type: 'single_choice',
    required: true,
    order: 34,
    options: [
      '0 (жодної)',
      '1-3 поїздки',
      '4-10 поїздок',
      '10+ поїздок'
    ],
    scoringWeight: 3,
    analyticsKey: 'long_trips_count'
  },
  {
    id: 'e10_3',
    blockId: 'block_10',
    blockName: 'ДОСВІД ПОДОРОЖЕЙ',
    text: 'Досвід соло-подорожей?',
    type: 'single_choice',
    required: true,
    order: 35,
    options: [
      'Ніколи не їжджу соло далеко',
      '1-2 соло поїздки',
      'Регулярно їжджу соло',
      'Переважно їжджу соло'
    ],
    scoringWeight: 2,
    analyticsKey: 'solo_travel_experience'
  },
  {
    id: 'e10_4',
    blockId: 'block_10',
    blockName: 'ДОСВІД ПОДОРОЖЕЙ',
    text: 'Частота виїздів за місто?',
    type: 'single_choice',
    required: true,
    order: 36,
    options: [
      'Рідко (раз на місяць або рідше)',
      'Щовихідних',
      '2-3 рази на тиждень',
      'Щодня або майже щодня'
    ],
    scoringWeight: 2,
    analyticsKey: 'out_of_city_frequency'
  },
  
  // ========== BLOCK 11: TRAINING REGULARITY ==========
  {
    id: 'e11_1',
    blockId: 'block_11',
    blockName: 'РЕГУЛЯРНІСТЬ ТРЕНУВАНЬ',
    text: 'Як часто тренуєтесь (не просто катаєтесь)?',
    type: 'single_choice',
    required: true,
    order: 37,
    options: [
      'Ніколи',
      'Раз на сезон',
      'Раз на місяць',
      'Щотижня',
      'Кілька разів на тиждень'
    ],
    scoringWeight: 3,
    analyticsKey: 'training_frequency'
  },
  {
    id: 'e11_2',
    blockId: 'block_11',
    blockName: 'РЕГУЛЯРНІСТЬ ТРЕНУВАНЬ',
    text: 'Що саме тренуєте регулярно?',
    type: 'multiple_choice',
    required: false,
    order: 38,
    options: [
      'Екстрене гальмування',
      'Джимхана/маневрування',
      'Трек (швидкість в поворотах)',
      'Стант елементи',
      'Офроуд/ендуро',
      'Міжряддя в заторах',
      'Повільну їзду та баланс',
      'Нічого не тренуюсь'
    ],
    analyticsKey: 'training_types'
  },
  {
    id: 'e11_3',
    blockId: 'block_11',
    blockName: 'РЕГУЛЯРНІСТЬ ТРЕНУВАНЬ',
    text: 'Останнє тренування було?',
    type: 'single_choice',
    required: true,
    order: 39,
    options: [
      'Цього тижня',
      'Цього місяця',
      'В цьому сезоні',
      'Минулого сезону',
      'Більше року тому',
      'Ніколи не тренувався'
    ],
    scoringWeight: 2,
    analyticsKey: 'last_training_time'
  },
  
  // ========== BLOCK 12: INCIDENT FREQUENCY ==========
  {
    id: 'e12_1',
    blockId: 'block_12',
    blockName: 'ЧАСТОТА ІНЦИДЕНТІВ',
    text: 'Серйозні інциденти за останні 2 роки:',
    type: 'single_choice',
    required: true,
    order: 40,
    options: [
      '0 (жодного)',
      '1 інцидент',
      '2-3 інциденти',
      '4+ інцидентів'
    ],
    scoringWeight: 4,
    analyticsKey: 'serious_incidents_2years'
  },
  
  // ========== BLOCK 13: RIDING INTENSITY ==========
  {
    id: 'e13_1',
    blockId: 'block_13',
    blockName: 'ІНТЕНСИВНІСТЬ ЇЗДИ',
    text: 'Кілометраж за сезон:',
    type: 'single_choice',
    required: true,
    order: 41,
    options: [
      'До 1,000 км',
      '1,000-3,000 км',
      '3,000-5,000 км',
      '5,000-10,000 км',
      '10,000+ км'
    ],
    scoringWeight: 3,
    analyticsKey: 'season_mileage'
  },
  {
    id: 'e13_2',
    blockId: 'block_13',
    blockName: 'ІНТЕНСИВНІСТЬ ЇЗДИ',
    text: 'Використання мотоцикла:',
    type: 'single_choice',
    required: true,
    order: 42,
    options: [
      'Тільки вихідні для задоволення',
      'Щоденні поїздки на роботу',
      'Основний транспорт',
      'Професійно (кур\'єр, інструктор)'
    ],
    scoringWeight: 2,
    analyticsKey: 'motorcycle_usage'
  }
]

// Profile types for experienced riders
export const EXPERIENCED_PROFILES = {
  SAFE_CONSERVATIVE: 'Обережний водій',
  BALANCED_RIDER: 'Збалансований райдер',
  AGGRESSIVE_RISKY: 'Агресивний райдер',
  LEARNING_CONSCIOUS: 'Свідомий учень'
}

// Import the new 3D profile calculator
import { calculate3DProfile, getProfileDescription } from '@/lib/questionnaire/profile-calculator-3d-simple'

export function calculateExperiencedProfile(answers: Record<string, any>) {
  // Use the new 3D profile calculation system
  const profile3D = calculate3DProfile(answers)
  
  // Return in the format expected by the existing code
  return {
    profile: profile3D.profileType,
    profileDescription: getProfileDescription(profile3D.profileType),
    scores: {
      risk: profile3D.riskTaking,
      skills: profile3D.technicalSkills,
      adequacy: profile3D.adequacy,
      safety: profile3D.safetyIndex,
      growth: profile3D.growthPotential
    },
    redFlags: profile3D.redFlags.length > 0 ? profile3D.redFlags : null,
    characteristics: profile3D.characteristics,
    recommendations: profile3D.recommendations,
    // Add new 3D metrics
    dangerLevel: profile3D.dangerLevel,
    metrics: {
      riskTaking: `${profile3D.riskTaking.toFixed(1)}/10`,
      technicalSkills: `${profile3D.technicalSkills.toFixed(1)}/10`,
      adequacy: `${profile3D.adequacy > 0 ? '+' : ''}${profile3D.adequacy.toFixed(1)}`,
      safetyIndex: `${profile3D.safetyIndex > 0 ? '+' : ''}${profile3D.safetyIndex.toFixed(1)}`,
      growthPotential: `${profile3D.growthPotential.toFixed(1)}/10`
    }
  }
}