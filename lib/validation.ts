// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Phone validation (Ukrainian format)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?3?8?(0\d{9})$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

// Password validation
export interface PasswordValidation {
  isValid: boolean
  errors: string[]
}

export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Пароль має містити принаймні 8 символів')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Пароль має містити принаймні одну велику літеру')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Пароль має містити принаймні одну малу літеру')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Пароль має містити принаймні одну цифру')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// URL slug validation
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9-]+$/
  return slugRegex.test(slug)
}

// Price validation
export function isValidPrice(price: number): boolean {
  return price >= 0 && Number.isFinite(price)
}

// Form field validation
export interface FieldValidation {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => boolean | string
}

export function validateField(value: any, rules: FieldValidation): string | null {
  if (rules.required && !value) {
    return 'Це поле є обов\'язковим'
  }
  
  if (rules.minLength && value.length < rules.minLength) {
    return `Мінімальна довжина: ${rules.minLength} символів`
  }
  
  if (rules.maxLength && value.length > rules.maxLength) {
    return `Максимальна довжина: ${rules.maxLength} символів`
  }
  
  if (rules.pattern && !rules.pattern.test(value)) {
    return 'Неправильний формат'
  }
  
  if (rules.custom) {
    const result = rules.custom(value)
    if (typeof result === 'string') return result
    if (!result) return 'Неправильне значення'
  }
  
  return null
}

// Form validation
export interface FormValidation {
  [field: string]: FieldValidation
}

export interface FormErrors {
  [field: string]: string | null
}

export function validateForm<T extends Record<string, any>>(
  data: T,
  rules: FormValidation
): { isValid: boolean; errors: FormErrors } {
  const errors: FormErrors = {}
  let isValid = true
  
  for (const field in rules) {
    const error = validateField(data[field], rules[field])
    if (error) {
      errors[field] = error
      isValid = false
    } else {
      errors[field] = null
    }
  }
  
  return { isValid, errors }
}