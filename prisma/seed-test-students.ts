import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Realistic questionnaire data for different profiles
const testStudentsData = [
  {
    id: 1
    email: 'student1@test.com'
    name: 'Олександр Коваленко'
    age: '22'
    profession: 'ІТ-спеціаліст'
    motorcycle: 'Yamaha MT-09'
    seasons: '2'
    type: 'experienced' as const
    profileType: 'EXPERIENCED_SAFE'
    riskScore: 3.2
    confidenceScore: 85
    safetyScore: 88
    skillsScore: 82
    knowledgeScore: 90
    psychologyScore: 78
    riskAwareness: 85
    overallLevel: 'Intermediate'
    riskProfile: 'moderate' as const
    redFlags: ['Перевищення швидкості на трасі']
    recommendations: ['Пройти курс екстремального водіння', 'Вивчити техніку контраварійного водіння']
    completionTime: 420
    answers: {
      e1_1: 'Так, маю права категорії А'
      e1_2: '2'
      e1_3: 'Так, регулярно'
      e1_4: 'Переважно в місті та на короткі дистанції'
      e1_5: 'Так, досить впевнено'
      e1_6: 'Yamaha MT-09'
      e2_1: 'Завжди'
      e2_2: 'Завжди'
      e2_3: 'Часто перевіряю'
      e2_4: 'Так, завжди дотримуюся'
      e3_1: 'Зменшую швидкість та збільшую дистанцію'
      e3_2: 'Зупиняюся і чекаю покращення погоди'
      e3_3: 'Уникаю їзди в нічний час'
      e4_1: 'Так, неодноразово'
      e4_2: 'Завжди аналізую і роблю висновки'
      e4_3: 'Проходжу додаткові курси'
      e5_1: 'Дуже важливо, завжди слідую'
      e5_2: 'Регулярно читаю про безпеку'
      e5_3: 'Так, маю аптечку і знаю як нею користуватися'
    }
  }
  {
    id: 2
    email: 'student2@test.com'
    name: 'Марина Петрова'
    age: '28'
    profession: 'Дизайнер'
    motorcycle: 'Honda CB650R'
    seasons: '1'
    type: 'beginner' as const
    profileType: 'BEGINNER_CAREFUL'
    riskScore: 2.1
    confidenceScore: 65
    safetyScore: 92
    skillsScore: 68
    knowledgeScore: 75
    psychologyScore: 85
    riskAwareness: 90
    overallLevel: 'Novice'
    riskProfile: 'low' as const
    redFlags: []
    recommendations: ['Більше практики на майданчику', 'Курс базової технічної підготовки']
    completionTime: 380
    answers: {
      b1_1: 'Нещодавно отримав(ла)'
      b1_2: '1'
      b1_3: 'Тільки починаю'
      b1_4: 'Переважно навчальні поїздки'
      b1_5: 'Поки що не дуже впевнено'
      b1_6: 'Honda CB650R'
      b2_1: 'Завжди'
      b2_2: 'Завжди'
      b2_3: 'Завжди перевіряю перед поїздкою'
      b2_4: 'Так, суворо дотримуюся'
      b3_1: 'Не їжджу в поганих умовах'
      b3_2: 'Не їжджу вночі'
      b3_3: 'Уникаю складних ділянок'
      b4_1: 'Ні, поки що не було'
      b4_2: 'Буду аналізувати'
      b4_3: 'Планую проходити курси'
      b5_1: 'Дуже важливо'
      b5_2: 'Активно вивчаю'
      b5_3: 'Так, завжди маю при собі'
    }
  }
  {
    id: 3
    email: 'student3@test.com'
    name: 'Дмитро Сидоров'
    age: '35'
    profession: 'Інженер'
    motorcycle: 'BMW R1250GS'
    seasons: '8'
    type: 'experienced' as const
    profileType: 'EXPERIENCED_AGGRESSIVE'
    riskScore: 4.7
    confidenceScore: 95
    safetyScore: 72
    skillsScore: 94
    knowledgeScore: 88
    psychologyScore: 65
    riskAwareness: 70
    overallLevel: 'Advanced'
    riskProfile: 'high' as const
    redFlags: ['Агресивна манера водіння', 'Ігнорування погодних умов', 'Перевищення швидкості']
    recommendations: ['Курс психології водіння', 'Тренінг з управління ризиками', 'Медитація та контроль емоцій']
    completionTime: 290
    answers: {
      e1_1: 'Так, маю багаторічний досвід'
      e1_2: '8'
      e1_3: 'Так, їжджу щодня'
      e1_4: 'Довгі поїздки, туризм'
      e1_5: 'Так, дуже впевнено'
      e1_6: 'BMW R1250GS'
      e2_1: 'Іноді забуваю'
      e2_2: 'Не завжди'
      e2_3: 'Перевіряю нерегулярно'
      e2_4: 'Не завжди дотримуюся обмежень'
      e3_1: 'Продовжую їхати звичайно'
      e3_2: 'Їжджу в будь-яку погоду'
      e3_3: 'Їжджу в будь-який час'
      e4_1: 'Так, було кілька випадків'
      e4_2: 'Не завжди аналізую'
      e4_3: 'Вважаю себе досвідченим'
      e5_1: 'Важливо, але не завжди слідую'
      e5_2: 'Рідко читаю'
      e5_3: 'Іноді забуваю взяти'
    }
  }
  {
    id: 4
    email: 'student4@test.com'
    name: 'Анна Іваненко'
    age: '26'
    profession: 'Лікар'
    motorcycle: 'Kawasaki Ninja 400'
    seasons: '1'
    type: 'beginner' as const
    profileType: 'BEGINNER_FAST'
    riskScore: 3.8
    confidenceScore: 78
    safetyScore: 75
    skillsScore: 70
    knowledgeScore: 82
    psychologyScore: 72
    riskAwareness: 75
    overallLevel: 'Novice'
    riskProfile: 'moderate' as const
    redFlags: ['Швидка їзда на початку навчання', 'Недооцінка ризиків']
    recommendations: ['Курс безпечного водіння', 'Більше практики на майданчику', 'Вивчення основ психології водіння']
    completionTime: 345
    answers: {
      b1_1: 'Отримав(ла) кілька місяців тому'
      b1_2: '1'
      b1_3: 'Активно навчаюсь'
      b1_4: 'Поїздки в місто'
      b1_5: 'Досить впевнено'
      b1_6: 'Kawasaki Ninja 400'
      b2_1: 'Завжди'
      b2_2: 'Часто'
      b2_3: 'Перевіряю основне'
      b2_4: 'В основному дотримуюсь'
      b3_1: 'Обережно продовжую'
      b3_2: 'Можу їхати вночі'
      b3_3: 'Спробую подолати'
      b4_1: 'Був один випадок'
      b4_2: 'Намагаюсь аналізувати'
      b4_3: 'Планую курси'
      b5_1: 'Важливо'
      b5_2: 'Читаю іноді'
      b5_3: 'Так, маю аптечку'
    }
  }
  {
    id: 5
    email: 'student5@test.com'
    name: 'Сергій Мельник'
    age: '19'
    profession: 'Студент'
    motorcycle: 'Honda CBR250R'
    seasons: '0.5'
    type: 'beginner' as const
    profileType: 'BEGINNER_ROMANTIC'
    riskScore: 2.8
    confidenceScore: 60
    safetyScore: 80
    skillsScore: 55
    knowledgeScore: 70
    psychologyScore: 88
    riskAwareness: 85
    overallLevel: 'Novice'
    riskProfile: 'low' as const
    redFlags: []
    recommendations: ['Базовий курс водіння', 'Практика на безпечних дорогах', 'Вивчення ПДР']
    completionTime: 450
    answers: {
      b1_1: 'Щойно отримав(ла)'
      b1_2: '0.5'
      b1_3: 'Тільки почав(ла)'
      b1_4: 'Короткі поїздки'
      b1_5: 'Поки що неврено'
      b1_6: 'Honda CBR250R'
      b2_1: 'Завжди'
      b2_2: 'Завжди'
      b2_3: 'Ретельно перевіряю'
      b2_4: 'Так, завжди'
      b3_1: 'Не їжджу в поганих умовах'
      b3_2: 'Не їжджу вночі'
      b3_3: 'Уникаю складних ділянок'
      b4_1: 'Ні, не було'
      b4_2: 'Будь завжди аналізувати'
      b4_3: 'Планую багато навчатися'
      b5_1: 'Дуже важливо'
      b5_2: 'Постійно читаю'
      b5_3: 'Так, завжди беру'
    }
  }
  {
    id: 6
    email: 'student6@test.com'
    name: 'Катерина Бондаренко'
    age: '31'
    profession: 'Менеджер'
    motorcycle: 'Yamaha XSR700'
    seasons: '4'
    type: 'experienced' as const
    profileType: 'EXPERIENCED_SAFE'
    riskScore: 2.5
    confidenceScore: 82
    safetyScore: 94
    skillsScore: 85
    knowledgeScore: 87
    psychologyScore: 90
    riskAwareness: 92
    overallLevel: 'Intermediate'
    riskProfile: 'low' as const
    redFlags: []
    recommendations: ['Курс вдосконалення технічних навичок', 'Тренінг з їзди в групі']
    completionTime: 395
    answers: {
      e1_1: 'Так, маю досвід'
      e1_2: '4'
      e1_3: 'Регулярно їжджу'
      e1_4: 'Поїздки на роботу та відпочинок'
      e1_5: 'Так, впевнено'
      e1_6: 'Yamaha XSR700'
      e2_1: 'Завжди'
      e2_2: 'Завжди'
      e2_3: 'Ретельно перевіряю'
      e2_4: 'Так, завжди дотримуюся'
      e3_1: 'Адаптую стиль водіння'
      e3_2: 'Обережно, з додатковими запобіжними заходами'
      e3_3: 'Їжджу обережно'
      e4_1: 'Було кілька випадків'
      e4_2: 'Завжди аналізую та роблю висновки'
      e4_3: 'Регулярно проходжу курси'
      e5_1: 'Дуже важливо'
      e5_2: 'Регулярно читаю'
      e5_3: 'Так, завжди маю повний комплект'
    }
  }
  {
    id: 7
    email: 'student7@test.com'
    name: 'Віктор Ткаченко'
    age: '42'
    profession: 'Підприємець'
    motorcycle: 'Harley-Davidson Street Glide'
    seasons: '12'
    type: 'experienced' as const
    profileType: 'EXPERIENCED_SAFE'
    riskScore: 2.9
    confidenceScore: 90
    safetyScore: 91
    skillsScore: 92
    knowledgeScore: 95
    psychologyScore: 88
    riskAwareness: 89
    overallLevel: 'Expert'
    riskProfile: 'low' as const
    redFlags: []
    recommendations: ['Інструкторський курс', 'Курс для ментора-наставника']
    completionTime: 285
    answers: {
      e1_1: 'Так, маю великий досвід'
      e1_2: '12'
      e1_3: 'Так, їжджу постійно'
      e1_4: 'Довгі подорожі, туризм'
      e1_5: 'Так, дуже впевнено'
      e1_6: 'Harley-Davidson Street Glide'
      e2_1: 'Завжди'
      e2_2: 'Завжди'
      e2_3: 'Ретельно перевіряю весь мотоцикл'
      e2_4: 'Так, суворо дотримуюся'
      e3_1: 'Адаптую техніку під умови'
      e3_2: 'Їжджу обережно з урахуванням умов'
      e3_3: 'Маю досвід нічної їзди'
      e4_1: 'Так, за роки було кілька'
      e4_2: 'Завжди детально аналізую'
      e4_3: 'Ділюся досвідом з іншими'
      e5_1: 'Найвища пріоритет'
      e5_2: 'Постійно слідкую за новинками'
      e5_3: 'Маю розширену аптечку та інструменти'
    }
  }
  {
    id: 8
    email: 'student8@test.com'
    name: 'Юлія Гриценко'
    age: '24'
    profession: 'Маркетолог'
    motorcycle: 'KTM Duke 390'
    seasons: '2'
    type: 'experienced' as const
    profileType: 'EXPERIENCED_AGGRESSIVE'
    riskScore: 4.2
    confidenceScore: 88
    safetyScore: 68
    skillsScore: 83
    knowledgeScore: 79
    psychologyScore: 62
    riskAwareness: 65
    overallLevel: 'Intermediate'
    riskProfile: 'high' as const
    redFlags: ['Агресивне водіння в місті', 'Ігнорування деяких правил безпеки']
    recommendations: ['Курс психології водіння', 'Тренінг з управління агресією', 'Додатковий курс безпеки']
    completionTime: 310
    answers: {
      e1_1: 'Так, маю права'
      e1_2: '2'
      e1_3: 'Так, їжджу часто'
      e1_4: 'Місто, спорт їзда'
      e1_5: 'Так, дуже впевнено'
      e1_6: 'KTM Duke 390'
      e2_1: 'Зазвичай'
      e2_2: 'Часто'
      e2_3: 'Перевіряю основне'
      e2_4: 'Не завжди дотримуюся швидкості'
      e3_1: 'Продовжую їздити'
      e3_2: 'Можу їхати в дощ'
      e3_3: 'Їжджу в будь-який час'
      e4_1: 'Так, було'
      e4_2: 'Іноді аналізую'
      e4_3: 'Вважаю досвід достатнім'
      e5_1: 'Важливо, але не завжди дотримуюся'
      e5_2: 'Рідко читаю'
      e5_3: 'Не завжди пам\'ятаю взяти'
    }
  }
  {
    id: 9
    email: 'student9@test.com'
    name: 'Михайло Левченко'
    age: '29'
    profession: 'Фотограф'
    motorcycle: 'Triumph Street Triple'
    seasons: '3'
    type: 'experienced' as const
    profileType: 'EXPERIENCED_SAFE'
    riskScore: 3.1
    confidenceScore: 80
    safetyScore: 86
    skillsScore: 88
    knowledgeScore: 84
    psychologyScore: 82
    riskAwareness: 87
    overallLevel: 'Intermediate'
    riskProfile: 'moderate' as const
    redFlags: []
    recommendations: ['Курс вдосконалення технічних навичок', 'Тренінг з фотозйомки під час їзди']
    completionTime: 360
    answers: {
      e1_1: 'Так, маю права'
      e1_2: '3'
      e1_3: 'Регулярно їжджу'
      e1_4: 'Робочі поїздки, фотосесії'
      e1_5: 'Так, впевнено'
      e1_6: 'Triumph Street Triple'
      e2_1: 'Завжди'
      e2_2: 'Завжди'
      e2_3: 'Регулярно перевіряю'
      e2_4: 'Так, дотримуюся'
      e3_1: 'Адаптую стиль водіння'
      e3_2: 'Обережно їжджу'
      e3_3: 'Їжджу з додатковими засобами безпеки'
      e4_1: 'Було пару випадків'
      e4_2: 'Завжди аналізую'
      e4_3: 'Періодично проходжу курси'
      e5_1: 'Дуже важливо'
      e5_2: 'Регулярно читаю'
      e5_3: 'Так, завжди маю аптечку'
    }
  }
]

// Student 10 will not have questionnaire data (for testing empty state)
const student10 = {
  email: 'student10@test.com'
  name: 'Роман Новак'
  role: 'STUDENT' as const
}

async function generateSkillMap(userId: string, profile: any) {
  const baseSkills = {
    balance: Math.floor(profile.skillsScore * 0.8 + Math.random() * 20)
    throttleControl: Math.floor(profile.skillsScore * 0.9 + Math.random() * 20)
    braking: Math.floor(profile.skillsScore * 0.85 + Math.random() * 20)
    clutchControl: Math.floor(profile.skillsScore * 0.8 + Math.random() * 20)
    gearShifting: Math.floor(profile.skillsScore * 0.85 + Math.random() * 20)
    cornering: Math.floor(profile.skillsScore * 0.7 + Math.random() * 30)
    steering: Math.floor(profile.skillsScore * 0.75 + Math.random() * 25)
    posture: Math.floor(profile.safetyScore * 0.8 + Math.random() * 20)
  }

  const advancedSkills = {
    emergencyBraking: Math.floor(profile.skillsScore * 0.6 + Math.random() * 40)
    avoidanceManeuvers: Math.floor(profile.skillsScore * 0.5 + Math.random() * 50)
    wetWeatherRiding: Math.floor((profile.safetyScore + profile.skillsScore) / 2 * 0.7 + Math.random() * 30)
    nightRiding: Math.floor(profile.riskAwareness * 0.8 + Math.random() * 20)
    groupRiding: Math.floor(profile.psychologyScore * 0.7 + Math.random() * 30)
    highSpeedStability: Math.floor(profile.confidenceScore * 0.6 + Math.random() * 40)
    trafficReading: Math.floor(profile.knowledgeScore * 0.8 + Math.random() * 20)
    roadPositioning: Math.floor((profile.knowledgeScore + profile.safetyScore) / 2 * 0.8 + Math.random() * 20)
  }

  const safetySkills = {
    hazardPerception: Math.floor(profile.riskAwareness * 0.9 + Math.random() * 10)
    defensiveRiding: Math.floor(profile.safetyScore * 0.8 + Math.random() * 20)
    riskAssessment: Math.floor(profile.riskAwareness * 0.8 + Math.random() * 20)
    emergencyResponse: Math.floor(profile.safetyScore * 0.7 + Math.random() * 30)
    situationalAwareness: Math.floor((profile.riskAwareness + profile.psychologyScore) / 2 * 0.8 + Math.random() * 20)
    protectiveEquipment: Math.floor(profile.safetyScore * 0.9 + Math.random() * 10)
    mechanicalKnowledge: Math.floor(profile.knowledgeScore * 0.7 + Math.random() * 30)
    firstAid: Math.floor(profile.knowledgeScore * 0.6 + Math.random() * 40)
  }

  const stuntSkills = {
    wheelie: profile.profileType.includes('AGGRESSIVE') ? Math.floor(Math.random() * 60 + 20) : Math.floor(Math.random() * 30)
    stoppie: profile.profileType.includes('AGGRESSIVE') ? Math.floor(Math.random() * 50 + 10) : Math.floor(Math.random() * 20)
    burnout: profile.profileType.includes('AGGRESSIVE') ? Math.floor(Math.random() * 70 + 20) : Math.floor(Math.random() * 25)
    powerslide: profile.profileType.includes('AGGRESSIVE') ? Math.floor(Math.random() * 60 + 20) : Math.floor(Math.random() * 30)
  }

  // Map string levels to numeric levels
  const levelMapping = {
    'Novice': 1
    'Beginner': 2
    'Intermediate': 5
    'Advanced': 8
    'Expert': 10
  }
  const numericLevel = levelMapping[profile.overallLevel as keyof typeof levelMapping] || 3

  return await prisma.riderSkillMap.create({
    data: {
      userId
      overallLevel: numericLevel
      basicSkills: baseSkills
      advancedSkills: advancedSkills
      stuntSkills: stuntSkills
      safetySkills: safetySkills
    }
  })
}

async function generateTimelineEvents(userId: string, profile: any) {
  const events = []
  const currentDate = new Date()
  const seasons = parseInt(profile.seasons) || 1
  
  // First license event
  const licenseDate = new Date(currentDate)
  licenseDate.setFullYear(licenseDate.getFullYear() - Math.max(seasons, 1))
  
  events.push({
    userId
    title: 'Отримання водійських прав категорії А'
    description: 'Успішно склав теоретичний та практичний іспити на право керування мотоциклом'
    eventType: 'LICENSE'
    eventDate: licenseDate
  })

  // First motorcycle purchase
  if (seasons >= 1) {
    const purchaseDate = new Date(licenseDate)
    purchaseDate.setMonth(purchaseDate.getMonth() + 1)
    
    events.push({
      userId
      title: `Покупка першого мотоцикла ${profile.motorcycle}`
      description: `Придбав ${profile.motorcycle} - мій перший власний мотоцикл`
      eventType: 'PURCHASE'
      eventDate: purchaseDate
    })
  }

  // Add some riding events based on experience
  for (let i = 0; i < Math.min(seasons * 2, 10); i++) {
    const eventDate = new Date(licenseDate)
    eventDate.setMonth(eventDate.getMonth() + (i + 2) * 3)
    
    const rideEvents = [
      'Перша довга поїздка (понад 200 км)'
      'Їзда в дощову погоду'
      'Поїздка в гори'
      'Участь у мотопробігу'
      'Технічне обслуговування мотоцикла'
      'Їзда нічною трасою'
      'Поїздка до іншого міста'
      'Групова поїздка з друзями'
    ]
    
    if (eventDate < currentDate) {
      events.push({
        userId
        title: rideEvents[i % rideEvents.length]
        description: 'Важлива подія в моєму мотоциклетному житті'
        eventType: 'RIDE'
        eventDate: eventDate
        })
    }
  }

  // Add incident events for higher risk profiles
  if (profile.riskProfile === 'high' || profile.redFlags.length > 0) {
    const incidentDate = new Date(currentDate)
    incidentDate.setMonth(incidentDate.getMonth() - Math.floor(Math.random() * 12))
    
    events.push({
      userId
      title: 'Небезпечна ситуація на дорозі'
      description: 'Ледь уникнув ДТП через необережність іншого водія'
      eventType: 'INCIDENT'
      eventDate: incidentDate
    })
  }

  // Training events for safety-focused riders
  if (profile.profileType.includes('SAFE') || profile.safetyScore > 85) {
    const trainingDate = new Date(currentDate)
    trainingDate.setMonth(trainingDate.getMonth() - Math.floor(Math.random() * 6))
    
    events.push({
      userId
      title: 'Курс безпечного водіння'
      description: 'Пройшов додатковий курс з техніки безпечного водіння'
      eventType: 'TRAINING'
      eventDate: trainingDate
    })
  }

  return await prisma.riderTimelineEvent.createMany({
    data: events
  })
}

async function generateUserMotorcycle(userId: string, motorcycle: string) {
  const motorcycleData = {
    'Yamaha MT-09': { brand: 'Yamaha', model: 'MT-09', year: 2021, engine: '847cc', type: 'Naked' }
    'Honda CB650R': { brand: 'Honda', model: 'CB650R', year: 2020, engine: '649cc', type: 'Naked' }
    'BMW R1250GS': { brand: 'BMW', model: 'R1250GS', year: 2022, engine: '1254cc', type: 'Adventure' }
    'Kawasaki Ninja 400': { brand: 'Kawasaki', model: 'Ninja 400', year: 2019, engine: '399cc', type: 'Sport' }
    'Honda CBR250R': { brand: 'Honda', model: 'CBR250R', year: 2020, engine: '249cc', type: 'Sport' }
    'Yamaha XSR700': { brand: 'Yamaha', model: 'XSR700', year: 2021, engine: '689cc', type: 'Retro' }
    'Harley-Davidson Street Glide': { brand: 'Harley-Davidson', model: 'Street Glide', year: 2020, engine: '1868cc', type: 'Touring' }
    'KTM Duke 390': { brand: 'KTM', model: 'Duke 390', year: 2021, engine: '373cc', type: 'Naked' }
    'Triumph Street Triple': { brand: 'Triumph', model: 'Street Triple', year: 2020, engine: '765cc', type: 'Naked' }
  }

  const data = motorcycleData[motorcycle] || { brand: 'Unknown', model: motorcycle, year: 2020, engine: 'Unknown', type: 'Unknown' }

  return await prisma.userMotorcycle.create({
    data: {
      userId
      brand: data.brand
      model: data.model
      year: data.year
      engineSize: data.engine
      motorcycleType: data.type
      isActive: true
      isPrimary: true
    }
  })
}

async function main() {
  console.log('🌱 Creating 10 test students with questionnaire data...')

  const password = await bcrypt.hash('password123', 12)

  // Create students 1-9 with full questionnaire data
  for (const studentData of testStudentsData) {
    console.log(`\n👤 Creating ${studentData.name}...`)

    // Create user
    const user = await prisma.user.upsert({
      where: { email: studentData.email }
      update: {}
      create: {
        email: studentData.email
        name: studentData.name
        password: password
        role: 'STUDENT'
        emailVerified: new Date()
        riderProfile: studentData.profileType
        riderProfileData: {
          profile: studentData.profileType
          profileType: studentData.profileType
          riskScore: studentData.riskScore
          confidenceScore: studentData.confidenceScore
          safetyScore: studentData.safetyScore
          skillsScore: studentData.skillsScore
          knowledgeScore: studentData.knowledgeScore
          psychologyScore: studentData.psychologyScore
          riskAwareness: studentData.riskAwareness
          overallLevel: studentData.overallLevel
          riskProfile: studentData.riskProfile
          redFlags: studentData.redFlags
          recommendations: studentData.recommendations
        }
      }
    })

    // Create questionnaire profile
    await prisma.questionnaireProfile.create({
      data: {
        userId: user.id
        type: studentData.type
        answers: studentData.answers
        profileType: studentData.profileType
        riskScore: studentData.riskScore
        confidenceScore: studentData.confidenceScore
        safetyScore: studentData.safetyScore
        skillsScore: studentData.skillsScore
        knowledgeScore: studentData.knowledgeScore
        psychologyScore: studentData.psychologyScore
        riskAwareness: studentData.riskAwareness
        overallLevel: studentData.overallLevel
        riskProfile: studentData.riskProfile
        redFlags: studentData.redFlags
        recommendations: studentData.recommendations
        completionTime: studentData.completionTime
      }
    })

    // Generate skill map
    await generateSkillMap(user.id, studentData)

    // Generate timeline events
    await generateTimelineEvents(user.id, studentData)

    // Generate motorcycle data
    await generateUserMotorcycle(user.id, studentData.motorcycle)

    console.log(`✅ Created complete profile for ${studentData.name}`)
  }

  // Create student 10 without questionnaire (for testing empty state)
  console.log(`\n👤 Creating ${student10.name} (without questionnaire)...`)
  const user10 = await prisma.user.upsert({
    where: { email: student10.email }
    update: {}
    create: {
      email: student10.email
      name: student10.name
      password: password
      role: student10.role
      emailVerified: new Date()
    }
  })
  console.log(`✅ Created user ${student10.name} (ready for questionnaire)`)

  console.log('\n🎉 Successfully created all 10 test students!')
  console.log('\n📊 Summary:')
  console.log('• 9 students with complete questionnaire data')
  console.log('• 1 student ready for questionnaire testing')
  console.log('• All students have password: password123')
  console.log('• Students can be accessed at /login page')

  console.log('\n📧 Test accounts:')
  for (let i = 1; i <= 10; i++) {
    console.log(`  student${i}@test.com`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })