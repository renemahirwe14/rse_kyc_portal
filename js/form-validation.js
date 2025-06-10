// Enhanced Form Validation with Error Highlighting

class FormValidator {
  constructor() {
    this.errors = new Map()
    this.currentStep = 1
    this.totalSteps = 4
    this.stepValidation = {
      1: ["firstName", "lastName", "dateOfBirth", "nationality", "address", "phone", "email"],
      2: ["idType", "idNumber", "issueDate", "expiryDate", "idFrontUpload", "idBackUpload"],
      3: ["employmentStatus", "annualIncome", "sourceOfFunds", "investmentExperience", "plannedInvestment"],
      4: ["brokerSelect", "termsAccept"],
    }
    this.init()
  }

  init() {
    this.setupRealTimeValidation()
    this.setupFileValidation()
    this.updateProgressBar()
  }

  setupRealTimeValidation() {
    // Add event listeners for real-time validation
    const form = document.getElementById("kycForm")
    if (!form) return

    const inputs = form.querySelectorAll("input, select, textarea")
    inputs.forEach((input) => {
      input.addEventListener("blur", () => this.validateField(input))
      input.addEventListener("input", () => this.clearFieldError(input.id))

      // Special handling for certain fields
      if (input.type === "email") {
        input.addEventListener("input", () => this.validateEmail(input))
      }
      if (input.type === "tel") {
        input.addEventListener("input", () => this.validatePhone(input))
      }
      if (input.id === "dateOfBirth") {
        input.addEventListener("change", () => this.validateAge(input))
      }
      if (input.id === "idNumber") {
        input.addEventListener("input", () => this.validateIdNumber(input))
      }
      if (input.id === "plannedInvestment") {
        input.addEventListener("input", () => this.validateInvestmentAmount(input))
      }
    })
  }

  setupFileValidation() {
    const fileInputs = document.querySelectorAll('input[type="file"]')
    fileInputs.forEach((input) => {
      input.addEventListener("change", (e) => this.validateFileUpload(e.target))
    })
  }

  validateField(field) {
    const fieldId = field.id || field.name
    const value = field.value.trim()
    let isValid = true
    let errorMessage = ""

    // Clear previous error
    this.clearFieldError(fieldId)

    // Required field validation - be more lenient with whitespace and different input types
    if (field.hasAttribute("required")) {
      if (field.type === "checkbox" && !field.checked) {
        isValid = false
        errorMessage = `${this.getFieldLabel(fieldId)} must be accepted`
      } else if (field.type === "file" && (!field.files || field.files.length === 0)) {
        isValid = false
        errorMessage = `${this.getFieldLabel(fieldId)} is required`
      } else if (field.type !== "checkbox" && field.type !== "file" && (!value || value.length === 0)) {
        isValid = false
        errorMessage = `${this.getFieldLabel(fieldId)} is required`
      }
    }

    // Field-specific validation
    if (isValid && value) {
      switch (fieldId) {
        case "firstName":
        case "lastName":
          if (!/^[a-zA-Z\s]{2,50}$/.test(value)) {
            isValid = false
            errorMessage = "Name must contain only letters and be 2-50 characters long"
          }
          break

        case "email":
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            isValid = false
            errorMessage = "Please enter a valid email address"
          }
          break

        case "phone":
          if (!/^\+?[0-9]{10,15}$/.test(value.replace(/\s/g, ""))) {
            isValid = false
            errorMessage = "Please enter a valid phone number"
          }
          break

        case "dateOfBirth":
          const age = this.calculateAge(new Date(value))
          if (age < 18) {
            isValid = false
            errorMessage = "You must be at least 18 years old"
          } else if (age > 100) {
            isValid = false
            errorMessage = "Please enter a valid date of birth"
          }
          break

        case "idNumber":
          const idType = document.getElementById("idType")?.value
          if (idType && !this.validateIdFormat(value, idType)) {
            isValid = false
            errorMessage = this.getIdFormatError(idType)
          }
          break

        case "issueDate":
        case "expiryDate":
          if (fieldId === "issueDate" && new Date(value) > new Date()) {
            isValid = false
            errorMessage = "Issue date cannot be in the future"
          } else if (fieldId === "expiryDate" && new Date(value) < new Date()) {
            isValid = false
            errorMessage = "Expiry date cannot be in the past"
          }
          break

        case "plannedInvestment":
          const amount = Number.parseInt(value)
          if (amount < 100000) {
            isValid = false
            errorMessage = "Minimum investment amount is 100,000 RWF"
          }
          break

        case "address":
          if (value.length < 10) {
            isValid = false
            errorMessage = "Please provide a complete address (minimum 10 characters)"
          }
          break
      }
    }

    if (!isValid) {
      this.showFieldError(fieldId, errorMessage)
      this.errors.set(fieldId, errorMessage)
    } else {
      this.errors.delete(fieldId)
    }

    this.updateFieldState(field, isValid)
    return isValid
  }

  validateFileUpload(fileInput) {
    const fieldId = fileInput.id
    const file = fileInput.files[0]

    this.clearFieldError(fieldId)

    if (!file && fileInput.hasAttribute("required")) {
      this.showFieldError(fieldId, "Please upload a file")
      this.errors.set(fieldId, "File is required")
      return false
    }

    if (file) {
      const maxSize = 5 * 1024 * 1024 // 5MB
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"]

      if (file.size > maxSize) {
        this.showFieldError(fieldId, "File size must be less than 5MB")
        this.errors.set(fieldId, "File too large")
        fileInput.value = ""
        return false
      }

      if (!allowedTypes.includes(file.type)) {
        this.showFieldError(fieldId, "Only JPG, PNG, and PDF files are allowed")
        this.errors.set(fieldId, "Invalid file type")
        fileInput.value = ""
        return false
      }

      // Update file upload UI
      this.updateFileUploadUI(fileInput, file)
      this.errors.delete(fieldId)
      return true
    }

    return true
  }

  validateStep(stepNumber) {
    const fieldsToValidate = this.stepValidation[stepNumber] || []
    let stepIsValid = true
    const stepErrors = []

    fieldsToValidate.forEach((fieldId) => {
      const field = document.getElementById(fieldId) || document.querySelector(`[name="${fieldId}"]`)
      if (field) {
        // Clear previous errors for fresh validation
        this.clearFieldError(fieldId)

        // Validate the field
        const isValid = this.validateField(field)
        if (!isValid) {
          stepIsValid = false
          const errorMessage = this.errors.get(fieldId)
          if (errorMessage) {
            stepErrors.push(`${this.getFieldLabel(fieldId)}: ${errorMessage}`)
          }
        }
      }
    })

    // Special validation for step 2 (date consistency)
    if (stepNumber === 2) {
      const issueDate = document.getElementById("issueDate")?.value
      const expiryDate = document.getElementById("expiryDate")?.value

      if (issueDate && expiryDate && new Date(issueDate) >= new Date(expiryDate)) {
        this.showFieldError("expiryDate", "Expiry date must be after issue date")
        stepErrors.push("Expiry date must be after issue date")
        stepIsValid = false
      }
    }

    // Special validation for step 4 (terms and broker)
    if (stepNumber === 4) {
      const termsAccept = document.getElementById("termsAccept")
      const brokerSelect = document.getElementById("brokerSelect")

      if (termsAccept && !termsAccept.checked) {
        this.showFieldError("termsAccept", "You must accept the terms and conditions")
        stepErrors.push("Terms and conditions must be accepted")
        stepIsValid = false
      }

      if (brokerSelect && !brokerSelect.value) {
        this.showFieldError("brokerSelect", "Please select a broker")
        stepErrors.push("Broker selection is required")
        stepIsValid = false
      }
    }

    if (!stepIsValid) {
      this.showErrorSummary(stepErrors)
      this.highlightErrorFields(stepNumber)
    } else {
      this.hideErrorSummary()
    }

    return stepIsValid
  }

  showFieldError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}-error`)
    if (errorElement) {
      errorElement.textContent = message
      errorElement.classList.add("show")
    }
  }

  clearFieldError(fieldId) {
    const errorElement = document.getElementById(`${fieldId}-error`)
    if (errorElement) {
      errorElement.textContent = ""
      errorElement.classList.remove("show")
    }
  }

  updateFieldState(field, isValid) {
    if (isValid) {
      field.classList.remove("error")
      field.classList.add("valid")
    } else {
      field.classList.add("error")
      field.classList.remove("valid")
    }
  }

  showErrorSummary(errors) {
    const errorSummary = document.getElementById("errorSummary")
    const errorList = document.getElementById("errorList")

    if (errorSummary && errorList) {
      errorList.innerHTML = ""
      errors.forEach((error) => {
        const li = document.createElement("li")
        li.textContent = error
        errorList.appendChild(li)
      })

      errorSummary.classList.remove("hidden")
      errorSummary.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  hideErrorSummary() {
    const errorSummary = document.getElementById("errorSummary")
    if (errorSummary) {
      errorSummary.classList.add("hidden")
    }
  }

  highlightErrorFields(stepNumber) {
    const fieldsToCheck = this.stepValidation[stepNumber] || []
    fieldsToCheck.forEach((fieldId) => {
      if (this.errors.has(fieldId)) {
        const field = document.getElementById(fieldId) || document.querySelector(`[name="${fieldId}"]`)
        if (field) {
          field.classList.add("error")
          // Add pulse animation to draw attention
          field.style.animation = "pulse 0.5s ease-in-out 3"
          setTimeout(() => {
            field.style.animation = ""
          }, 1500)
        }
      }
    })
  }

  updateFileUploadUI(fileInput, file) {
    const uploadArea = fileInput.parentElement.querySelector(".file-upload-area")
    if (uploadArea) {
      const uploadText = uploadArea.querySelector(".upload-text")
      const uploadHint = uploadArea.querySelector(".upload-hint")

      if (uploadText) {
        uploadText.textContent = `Selected: ${file.name}`
        uploadText.style.color = "var(--success-color)"
      }

      if (uploadHint) {
        uploadHint.textContent = `${(file.size / 1024 / 1024).toFixed(2)} MB`
      }

      uploadArea.style.borderColor = "var(--success-color)"
      uploadArea.style.background = "linear-gradient(135deg, rgba(22, 163, 74, 0.05) 0%, rgba(22, 163, 74, 0.1) 100%)"
    }
  }

  updateProgressBar() {
    const progressFill = document.getElementById("progressFill")
    if (progressFill) {
      const progress = ((this.currentStep - 1) / (this.totalSteps - 1)) * 100
      progressFill.style.width = `${progress}%`
    }
  }

  // Utility methods
  calculateAge(birthDate) {
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  validateIdFormat(idNumber, idType) {
    switch (idType) {
      case "national_id":
        return /^\d{16}$/.test(idNumber)
      case "passport":
        return /^[A-Z0-9]{6,9}$/i.test(idNumber)
      case "driving_license":
        return idNumber.length >= 5
      default:
        return true
    }
  }

  getIdFormatError(idType) {
    switch (idType) {
      case "national_id":
        return "National ID must be 16 digits"
      case "passport":
        return "Passport number must be 6-9 alphanumeric characters"
      case "driving_license":
        return "Driving license number must be at least 5 characters"
      default:
        return "Invalid ID format"
    }
  }

  getFieldLabel(fieldId) {
    const labelMap = {
      firstName: "First Name",
      lastName: "Last Name",
      dateOfBirth: "Date of Birth",
      nationality: "Nationality",
      address: "Address",
      phone: "Phone Number",
      email: "Email Address",
      idType: "ID Type",
      idNumber: "ID Number",
      issueDate: "Issue Date",
      expiryDate: "Expiry Date",
      idFrontUpload: "ID Front Upload",
      idBackUpload: "ID Back Upload",
      employmentStatus: "Employment Status",
      annualIncome: "Annual Income",
      sourceOfFunds: "Source of Funds",
      investmentExperience: "Investment Experience",
      plannedInvestment: "Planned Investment",
      brokerSelect: "Broker Selection",
      termsAccept: "Terms and Conditions",
    }

    return labelMap[fieldId] || fieldId
  }

  // Email validation with suggestions
  validateEmail(emailField) {
    const email = emailField.value.trim()
    if (!email) return

    const commonDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"]
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email)) {
      this.showFieldError(emailField.id, "Please enter a valid email address")
      return false
    }

    // Check for common typos
    const domain = email.split("@")[1]
    if (domain) {
      const suggestion = this.suggestEmailDomain(domain, commonDomains)
      if (suggestion && suggestion !== domain) {
        const suggestedEmail = email.replace(domain, suggestion)
        this.showFieldError(emailField.id, `Did you mean: ${suggestedEmail}?`)
      }
    }

    return true
  }

  suggestEmailDomain(domain, commonDomains) {
    const threshold = 2 // Maximum edit distance
    let bestMatch = null
    let minDistance = threshold + 1

    commonDomains.forEach((commonDomain) => {
      const distance = this.levenshteinDistance(domain.toLowerCase(), commonDomain)
      if (distance < minDistance) {
        minDistance = distance
        bestMatch = commonDomain
      }
    })

    return minDistance <= threshold ? bestMatch : null
  }

  levenshteinDistance(str1, str2) {
    const matrix = []

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        }
      }
    }

    return matrix[str2.length][str1.length]
  }

  // Phone number formatting
  validatePhone(phoneField) {
    let phone = phoneField.value.replace(/\D/g, "")

    // Format Rwanda phone numbers
    if (phone.startsWith("250")) {
      phone = "+" + phone
    } else if (phone.startsWith("0") && phone.length === 10) {
      phone = "+250" + phone.substring(1)
    } else if (phone.length === 9) {
      phone = "+250" + phone
    }

    phoneField.value = phone

    const isValid = /^\+?250[0-9]{9}$/.test(phone) || /^\+?[1-9]\d{1,14}$/.test(phone)

    if (!isValid && phone.length > 0) {
      this.showFieldError(phoneField.id, "Please enter a valid phone number")
      return false
    }

    return true
  }

  // Age validation
  validateAge(dateField) {
    const birthDate = new Date(dateField.value)
    const age = this.calculateAge(birthDate)

    if (age < 18) {
      this.showFieldError(dateField.id, "You must be at least 18 years old")
      return false
    }

    if (age > 100) {
      this.showFieldError(dateField.id, "Please enter a valid date of birth")
      return false
    }

    return true
  }

  // Investment amount validation
  validateInvestmentAmount(amountField) {
    const amount = Number.parseInt(amountField.value)
    const minAmount = 100000

    if (amount < minAmount) {
      this.showFieldError(amountField.id, `Minimum investment amount is ${minAmount.toLocaleString()} RWF`)
      return false
    }

    return true
  }

  // ID number validation
  validateIdNumber(idField) {
    const idNumber = idField.value.trim()
    const idType = document.getElementById("idType")?.value

    if (!idType || !idNumber) return true

    const isValid = this.validateIdFormat(idNumber, idType)

    if (!isValid) {
      this.showFieldError(idField.id, this.getIdFormatError(idType))
      return false
    }

    return true
  }

  // Public methods for form navigation
  hasValidValue(field) {
    if (!field) return false

    if (field.type === "checkbox") {
      return field.checked
    } else if (field.type === "file") {
      return field.files && field.files.length > 0
    } else {
      return field.value && field.value.trim().length > 0
    }
  }

  canProceedToStep(stepNumber) {
    // For step 1, just validate the current step
    if (stepNumber === 1) {
      return this.validateStep(stepNumber)
    }

    // For other steps, validate the current step and ensure previous steps are complete
    const currentStepValid = this.validateStep(stepNumber)

    // Check if all previous steps have been completed
    for (let i = 1; i < stepNumber; i++) {
      const fieldsToCheck = this.stepValidation[i] || []
      const allFieldsComplete = fieldsToCheck.every((fieldId) => {
        const field = document.getElementById(fieldId) || document.querySelector(`[name="${fieldId}"]`)
        return this.hasValidValue(field)
      })

      if (!allFieldsComplete) {
        this.showErrorSummary([`Please complete Step ${i} before proceeding`])
        return false
      }
    }

    return currentStepValid
  }

  setCurrentStep(stepNumber) {
    this.currentStep = stepNumber
    this.updateProgressBar()
  }

  getErrors() {
    return Array.from(this.errors.entries())
  }

  clearAllErrors() {
    this.errors.clear()
    const errorElements = document.querySelectorAll(".error-message")
    errorElements.forEach((element) => {
      element.textContent = ""
      element.classList.remove("show")
    })

    const errorFields = document.querySelectorAll(".error")
    errorFields.forEach((field) => {
      field.classList.remove("error")
    })

    this.hideErrorSummary()
  }

  hasErrors() {
    return this.errors.size > 0
  }
}

// Initialize form validator
let formValidator

document.addEventListener("DOMContentLoaded", () => {
  formValidator = new FormValidator()
})

// Export for use in other files
window.FormValidator = FormValidator
window.formValidator = formValidator
