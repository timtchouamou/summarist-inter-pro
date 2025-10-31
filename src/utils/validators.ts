export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidPassword = (password: string): boolean => {
  return password.length >= 6
}

export const validateLoginForm = (email: string, password: string) => {
  if (!email.trim()) {
    return { isValid: false, error: 'Email is required' }
  }
  
  if (!isValidEmail(email)) {
    return { isValid: false, error: 'Invalid email address' }
  }
  
  if (!password.trim()) {
    return { isValid: false, error: 'Password is required' }
  }
  
  if (!isValidPassword(password)) {
    return { isValid: false, error: 'Password must be at least 6 characters' }
  }
  
  return { isValid: true, error: null }
}

export const validateSignupForm = (email: string, password: string) => {
  return validateLoginForm(email, password) // Same validation for now
}