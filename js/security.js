// Security utilities for password hashing and validation
class SecurityService {
  constructor() {
    this.saltRounds = 12
  }

  // Password hashing using Web Crypto API
  async hashPassword(password) {
    try {
      const encoder = new TextEncoder()
      const data = encoder.encode(password + this.getSalt())
      const hashBuffer = await crypto.subtle.digest("SHA-256", data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
      return hashHex
    } catch (error) {
      console.error("Password hashing failed:", error)
      // Fallback to simple encoding for demo
      return btoa(password + this.getSalt())
    }
  }

  // Verify password against hash
  async verifyPassword(password, hash) {
    try {
      const hashedInput = await this.hashPassword(password)
      return hashedInput === hash
    } catch (error) {
      console.error("Password verification failed:", error)
      return false
    }
  }

  // Generate salt for password hashing
  getSalt() {
    return "rse_kyc_salt_2024" // In production, use random salts per user
  }

  // Password strength validation
  validatePasswordStrength(password) {
    const requirements = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSpecialChars: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      noCommonPatterns: !this.hasCommonPatterns(password),
    }

    const score = Object.values(requirements).filter(Boolean).length
    const strength = this.getPasswordStrength(score)

    return {
      isValid: score >= 4, // Require at least 4 out of 6 criteria
      score,
      strength,
      requirements,
      suggestions: this.getPasswordSuggestions(requirements),
    }
  }

  hasCommonPatterns(password) {
    const commonPatterns = [/123456/, /password/i, /qwerty/i, /admin/i, /letmein/i, /welcome/i]

    return commonPatterns.some((pattern) => pattern.test(password))
  }

  getPasswordStrength(score) {
    if (score <= 2) return "weak"
    if (score <= 4) return "medium"
    return "strong"
  }

  getPasswordSuggestions(requirements) {
    const suggestions = []

    if (!requirements.minLength) {
      suggestions.push("Use at least 8 characters")
    }
    if (!requirements.hasUppercase) {
      suggestions.push("Include uppercase letters (A-Z)")
    }
    if (!requirements.hasLowercase) {
      suggestions.push("Include lowercase letters (a-z)")
    }
    if (!requirements.hasNumbers) {
      suggestions.push("Include numbers (0-9)")
    }
    if (!requirements.hasSpecialChars) {
      suggestions.push("Include special characters (!@#$%^&*)")
    }
    if (!requirements.noCommonPatterns) {
      suggestions.push('Avoid common patterns like "123456" or "password"')
    }

    return suggestions
  }

  // Input sanitization
  sanitizeInput(input) {
    if (typeof input !== "string") return input

    return input
      .replace(/[<>]/g, "") // Remove potential HTML tags
      .replace(/javascript:/gi, "") // Remove javascript: protocol
      .replace(/on\w+=/gi, "") // Remove event handlers
      .trim()
  }

  // Email validation
  validateEmail(email) {
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

    return {
      isValid: emailRegex.test(email),
      message: emailRegex.test(email) ? "Valid email" : "Please enter a valid email address",
    }
  }

  // Phone number validation
  validatePhone(phone) {
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, "")

    // Check for valid length and format
    const isValid = /^(\+?250|0)?[7][0-9]{8}$/.test(cleanPhone) || /^(\+?[1-9]\d{1,14})$/.test(cleanPhone)

    return {
      isValid,
      message: isValid ? "Valid phone number" : "Please enter a valid phone number",
    }
  }

  // Generate secure session token
  generateSessionToken() {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
  }

  // Validate session token
  validateSessionToken(token) {
    return token && typeof token === "string" && token.length === 64
  }

  // Rate limiting for login attempts
  checkRateLimit(identifier) {
    const key = `rate_limit_${identifier}`
    const attempts = JSON.parse(localStorage.getItem(key) || "[]")
    const now = Date.now()
    const windowMs = 15 * 60 * 1000 // 15 minutes
    const maxAttempts = 5

    // Remove old attempts outside the window
    const recentAttempts = attempts.filter((timestamp) => now - timestamp < windowMs)

    if (recentAttempts.length >= maxAttempts) {
      const oldestAttempt = Math.min(...recentAttempts)
      const timeUntilReset = windowMs - (now - oldestAttempt)

      return {
        allowed: false,
        timeUntilReset: Math.ceil(timeUntilReset / 1000 / 60), // minutes
        message: `Too many login attempts. Please try again in ${Math.ceil(timeUntilReset / 1000 / 60)} minutes.`,
      }
    }

    return { allowed: true }
  }

  // Record login attempt
  recordLoginAttempt(identifier, success = false) {
    const key = `rate_limit_${identifier}`
    const attempts = JSON.parse(localStorage.getItem(key) || "[]")

    if (!success) {
      attempts.push(Date.now())
      localStorage.setItem(key, JSON.stringify(attempts))
    } else {
      // Clear attempts on successful login
      localStorage.removeItem(key)
    }
  }

  // Secure data storage
  secureStore(key, data) {
    try {
      const encrypted = btoa(JSON.stringify(data)) // Simple encoding for demo
      localStorage.setItem(`secure_${key}`, encrypted)
      return true
    } catch (error) {
      console.error("Secure storage failed:", error)
      return false
    }
  }

  // Secure data retrieval
  secureRetrieve(key) {
    try {
      const encrypted = localStorage.getItem(`secure_${key}`)
      if (!encrypted) return null

      return JSON.parse(atob(encrypted)) // Simple decoding for demo
    } catch (error) {
      console.error("Secure retrieval failed:", error)
      return null
    }
  }

  // Clear sensitive data
  clearSensitiveData() {
    const keys = Object.keys(localStorage)
    keys.forEach((key) => {
      if (key.startsWith("secure_") || key.includes("password") || key.includes("token")) {
        localStorage.removeItem(key)
      }
    })
  }

  // Generate CSRF token
  generateCSRFToken() {
    const token = this.generateSessionToken()
    sessionStorage.setItem("csrf_token", token)
    return token
  }

  // Validate CSRF token
  validateCSRFToken(token) {
    const storedToken = sessionStorage.getItem("csrf_token")
    return token === storedToken
  }
}

// Export for use in other modules
window.SecurityService = SecurityService
