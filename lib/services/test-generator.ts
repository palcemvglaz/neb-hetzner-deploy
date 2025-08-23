import { prisma } from '@/lib/db/prisma'

export interface TestQuestion {
  question: string
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SCENARIO'
  options: string[]
  correctAnswer: number
  explanation: string
  points: number
}

export interface TestStructure {
  title: string
  description: string
  category: string
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  timeLimit: number // minutes
  passingScore: number // percentage
  questions: TestQuestion[]
  tags: string[]
}

export class TestGenerator {
  
  async createVisionBlockerTest(): Promise<TestStructure> {
    const questions: TestQuestion[] = [
      {
        question: "Що таке 'блокер видимості' в контексті безпечної їзди на мотоциклі?",
        type: 'MULTIPLE_CHOICE',
        options: [
          "Захисне спорядження для очей",
          "Об'єкт, який обмежує огляд дороги",
          "Спеціальний маневр уникнення",
          "Система гальмування"
        ],
        correctAnswer: 1,
        explanation: "Блокер видимості - це будь-який об'єкт (велика автівка, вантажівка, будівля), який обмежує ваш огляд дороги та може приховати потенційні загрози.",
        points: 2
      },
      {
        question: "Чи правильно їхати довго поруч з великою тонованою автівкою?",
        type: 'TRUE_FALSE',
        options: ["Так", "Ні"],
        correctAnswer: 1,
        explanation: "Ні, це небезпечно. Велика тонована автівка є блокером видимості - ви не бачите, що відбувається попереду, і не можете завчасно відреагувати на небезпеку.",
        points: 2
      },
      {
        question: "Яку позицію краще займати в лівій смузі для максимального огляду?",
        type: 'MULTIPLE_CHOICE',
        options: [
          "Посередині смуги",
          "Зліва в смузі", 
          "Справа в смузі",
          "Позиція не має значення"
        ],
        correctAnswer: 2,
        explanation: "Справа в лівій смузі - так ви бачите далеко крізь весь ряд і можете завчасно помітити гальмування попереду. Також маєте можливість швидко піти в міжряддя.",
        points: 3
      },
      {
        question: "Ви наближаєтесь до припаркованої вантажівки. Як діяти згідно з принципом 'бачити далеко'?",
        type: 'SCENARIO',
        options: [
          "Проїхати швидко повз неї",
          "Сповільнити та очікувати потенційну загрозу з-за неї",
          "Зупинитися перед вантажівкою",
          "Обігнати по зустрічній смузі"
        ],
        correctAnswer: 1,
        explanation: "Потрібно сповільнити та очікувати потенційну загрозу. За вантажівкою може раптово з'явитися пішохід, велосипедист або інша перешкода. Кожен блокер = потенційна загроза.",
        points: 3
      },
      {
        question: "Основна мета принципу 'бачити далеко' - це:",
        type: 'MULTIPLE_CHOICE',
        options: [
          "Розвинути зір мотоцикліста",
          "Уникати 'раптових' загроз на дорозі", 
          "Їздити швидше за потоком",
          "Економити пальне"
        ],
        correctAnswer: 1,
        explanation: "Головна мета - уникати 'раптових' загроз. Максимізуючи огляд і мінімізуючи блокери видимості, ви завчасно бачите небезпеку і маєте час відреагувати.",
        points: 2
      }
    ]

    return {
      title: "Принцип 'Бачити далеко' та блокери видимості",
      description: "Тест на знання основного принципу безпечної їзди - максимізації огляду дороги та роботи з блокерами видимості",
      category: "Основи безпеки",
      difficulty: 'BEGINNER',
      timeLimit: 15,
      passingScore: 70,
      questions,
      tags: ["безпека", "новачки", "cornerstone", "огляд дороги", "позиціонування"]
    }
  }

  async saveTestToDatabase(testStructure: TestStructure): Promise<string | null> {
    try {
      const test = await prisma.test.create({
        data: {
          title: testStructure.title,
          description: testStructure.description,
          category: testStructure.category,
          difficulty: testStructure.difficulty,
          timeLimit: testStructure.timeLimit,
          passingScore: testStructure.passingScore,
          totalPoints: testStructure.questions.reduce((sum, q) => sum + q.points, 0),
          tags: testStructure.tags,
          questions: {
            create: testStructure.questions.map((question, index) => ({
              question: question.question,
              type: question.type,
              options: question.options,
              correctAnswer: question.correctAnswer,
              explanation: question.explanation,
              points: question.points,
              order: index + 1
            }))
          }
        },
        include: {
          questions: true
        }
      })
      
      return test.id
    } catch (error) {
      console.error('Error saving test to database:', error)
      return null
    }
  }
}