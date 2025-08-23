// Application constants

export const APP_NAME = 'Nebachiv'
export const APP_DESCRIPTION = 'Сучасна платформа для навчання безпечній їзді на мотоциклі'

// User roles
export const USER_ROLES = {
  STUDENT: 'STUDENT',
  INSTRUCTOR: 'INSTRUCTOR', 
  SCHOOL_ADMIN: 'SCHOOL_ADMIN',
  ADMIN: 'ADMIN'
} as const

// Content types
export const CONTENT_TYPES = {
  ARTICLE: 'ARTICLE',
  GUIDE: 'GUIDE',
  LESSON: 'LESSON',
  VIDEO: 'VIDEO',
  EXERCISE: 'EXERCISE'
} as const

// Languages
export const LANGUAGES = {
  UA: 'UA',
  EN: 'EN', 
  RU: 'RU'
} as const

// KB_NEB formats
export const KB_NEB_FORMATS = {
  M: 'M',      // Master
  T: 'T',      // Thesis
  IG: 'IG',    // Instagram
  W_ART: 'W_ART' // Web Article
} as const

// Subscription plans
export const SUBSCRIPTION_PLANS = {
  FREE: 'FREE',
  BASIC: 'BASIC',
  PREMIUM: 'PREMIUM',
  SCHOOL: 'SCHOOL'
} as const

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
  GUIDES: '/guides',
  ABOUT: '/about',
  PRICING: '/pricing',
  CONTACT: '/contact'
} as const

// API endpoints
export const API_ROUTES = {
  HEALTH: '/api/health',
  AUTH: '/api/auth',
  CONTENT: '/api/content',
  TESTS: '/api/tests',
  KB_NEB: '/api/kb-neb',
  PAYMENTS: '/api/payments'
} as const