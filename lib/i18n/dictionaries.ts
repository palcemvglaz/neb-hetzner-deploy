export const dictionaries = {
  ua: {
    common: {
      loading: 'Завантаження...',
      error: 'Помилка',
      success: 'Успішно',
      save: 'Зберегти',
      cancel: 'Скасувати',
      delete: 'Видалити',
      edit: 'Редагувати',
      back: 'Назад',
      next: 'Далі',
      previous: 'Попередній',
      continue: 'Продовжити',
      login: 'Увійти',
      logout: 'Вийти',
      register: 'Реєстрація'
    },
    navigation: {
      home: 'Головна',
      courses: 'Курси',
      dashboard: 'Панель керування',
      profile: 'Профіль',
      admin: 'Адміністрування'
    },
    courses: {
      title: 'Курси',
      enroll: 'Записатися',
      enrolled: 'Ви записані',
      progress: 'Прогрес',
      completed: 'Завершено',
      lessons: 'уроків',
      minutes: 'хвилин',
      difficulty: {
        BEGINNER: 'Початковий',
        INTERMEDIATE: 'Середній', 
        ADVANCED: 'Просунутий'
      }
    },
    auth: {
      signIn: 'Увійдіть в свій акаунт',
      signUp: 'Створити акаунт',
      email: 'Email',
      password: 'Пароль',
      name: 'Ім\'я',
      forgotPassword: 'Забули пароль?',
      noAccount: 'Немає акаунту?',
      hasAccount: 'Вже є акаунт?'
    }
  },
  en: {
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      continue: 'Continue',
      login: 'Login',
      logout: 'Logout',
      register: 'Register'
    },
    navigation: {
      home: 'Home',
      courses: 'Courses',
      dashboard: 'Dashboard',
      profile: 'Profile',
      admin: 'Administration'
    },
    courses: {
      title: 'Courses',
      enroll: 'Enroll',
      enrolled: 'Enrolled',
      progress: 'Progress',
      completed: 'Completed',
      lessons: 'lessons',
      minutes: 'minutes',
      difficulty: {
        BEGINNER: 'Beginner',
        INTERMEDIATE: 'Intermediate',
        ADVANCED: 'Advanced'
      }
    },
    auth: {
      signIn: 'Sign in to your account',
      signUp: 'Create account',
      email: 'Email',
      password: 'Password',
      name: 'Name',
      forgotPassword: 'Forgot password?',
      noAccount: 'No account?',
      hasAccount: 'Already have an account?'
    }
  },
  ru: {
    common: {
      loading: 'Загрузка...',
      error: 'Ошибка',
      success: 'Успешно',
      save: 'Сохранить',
      cancel: 'Отменить',
      delete: 'Удалить',
      edit: 'Редактировать',
      back: 'Назад',
      next: 'Далее',
      previous: 'Предыдущий',
      continue: 'Продолжить',
      login: 'Войти',
      logout: 'Выйти',
      register: 'Регистрация'
    },
    navigation: {
      home: 'Главная',
      courses: 'Курсы',
      dashboard: 'Панель управления',
      profile: 'Профиль',
      admin: 'Администрирование'
    },
    courses: {
      title: 'Курсы',
      enroll: 'Записаться',
      enrolled: 'Вы записаны',
      progress: 'Прогресс',
      completed: 'Завершено',
      lessons: 'уроков',
      minutes: 'минут',
      difficulty: {
        BEGINNER: 'Начальный',
        INTERMEDIATE: 'Средний',
        ADVANCED: 'Продвинутый'
      }
    },
    auth: {
      signIn: 'Войдите в свой аккаунт',
      signUp: 'Создать аккаунт',
      email: 'Email',
      password: 'Пароль',
      name: 'Имя',
      forgotPassword: 'Забыли пароль?',
      noAccount: 'Нет аккаунта?',
      hasAccount: 'Уже есть аккаунт?'
    }
  }
} as const

export type Dictionary = typeof dictionaries.ua
export type Language = keyof typeof dictionaries

export const getDictionary = (lang: Language): Dictionary => {
  return dictionaries[lang] || dictionaries.ua
}