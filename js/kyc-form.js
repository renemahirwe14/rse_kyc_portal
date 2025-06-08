// KYC Form specific JavaScript

// File upload handling
document.addEventListener("DOMContentLoaded", () => {
  setupFileUploads()
  setupFormValidation()
})

// Declare variables here
const currentStep = 1 // Initialize currentStep
const showNotification = (message, type) => {
  // Default implementation for showNotification
  console.log(`${type}: ${message}`)
  // You might want to replace this with your actual notification logic
}

const formatCurrency = (amount) => {
  // Default implementation for formatCurrency
  return amount.toLocaleString()
  // You might want to replace this with your actual currency formatting logic
}

const changeStep = (direction) => {
  // Default implementation for changeStep
  console.log(`Changing step: ${direction}`)
  // You might want to replace this with your actual step changing logic
}

const saveFormData = () => {
  // Default implementation for saveFormData
  console.log("Saving form data")
  // You might want to replace this with your actual form saving logic
}

function setupFileUploads() {
  const fileInputs = document.querySelectorAll('input[type="file"]')

  fileInputs.forEach((input) => {
    input.addEventListener("change", (event) => {
      const file = event.target.files[0]
      if (file) {
        validateFileUpload(file, input)
      }
    })
  })
}

function validateFileUpload(file, input) {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"]

  if (file.size > maxSize) {
    showNotification("File size must be less than 5MB", "error")
    input.value = ""
    return false
  }

  if (!allowedTypes.includes(file.type)) {
    showNotification("Only JPG, PNG, and PDF files are allowed", "error")
    input.value = ""
    return false
  }

  showNotification(`File "${file.name}" uploaded successfully`, "success")
  return true
}

function setupFormValidation() {
  // Real-time validation for specific fields
  const emailField = document.getElementById("email")
  if (emailField) {
    emailField.addEventListener("blur", validateEmail)
  }

  const phoneField = document.getElementById("phone")
  if (phoneField) {
    phoneField.addEventListener("blur", validatePhone)
  }

  const idNumberField = document.getElementById("idNumber")
  if (idNumberField) {
    idNumberField.addEventListener("blur", validateIdNumber)
  }

  const plannedInvestmentField = document.getElementById("plannedInvestment")
  if (plannedInvestmentField) {
    plannedInvestmentField.addEventListener("blur", validateInvestmentAmount)
  }
}

function validateEmail() {
  const email = document.getElementById("email").value
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (email && !emailRegex.test(email)) {
    document.getElementById("email").classList.add("error")
    showFieldError("email", "Please enter a valid email address")
  } else {
    document.getElementById("email").classList.remove("error")
    removeFieldError("email")
  }
}

function validatePhone() {
  const phone = document.getElementById("phone").value
  const phoneRegex = /^\+?[0-9]{10,15}$/

  if (phone && !phoneRegex.test(phone.replace(/\s/g, ""))) {
    document.getElementById("phone").classList.add("error")
    showFieldError("phone", "Please enter a valid phone number")
  } else {
    document.getElementById("phone").classList.remove("error")
    removeFieldError("phone")
  }
}

function validateIdNumber() {
  const idNumber = document.getElementById("idNumber").value
  const idType = document.getElementById("idType").value

  if (idNumber && idType) {
    let isValid = true
    let errorMessage = ""

    switch (idType) {
      case "national_id":
        // Rwanda National ID format: 16 digits
        if (!/^\d{16}$/.test(idNumber)) {
          isValid = false
          errorMessage = "National ID must be 16 digits"
        }
        break
      case "passport":
        // Passport format: alphanumeric, 6-9 characters
        if (!/^[A-Z0-9]{6,9}$/.test(idNumber.toUpperCase())) {
          isValid = false
          errorMessage = "Passport number must be 6-9 alphanumeric characters"
        }
        break
      case "driving_license":
        // Driving license format: varies, but basic validation
        if (idNumber.length < 5) {
          isValid = false
          errorMessage = "Driving license number must be at least 5 characters"
        }
        break
    }

    if (!isValid) {
      document.getElementById("idNumber").classList.add("error")
      showFieldError("idNumber", errorMessage)
    } else {
      document.getElementById("idNumber").classList.remove("error")
      removeFieldError("idNumber")
    }
  }
}

function validateInvestmentAmount() {
  const amount = Number.parseInt(document.getElementById("plannedInvestment").value)
  const minAmount = 100000 // 100,000 RWF

  if (amount && amount < minAmount) {
    document.getElementById("plannedInvestment").classList.add("error")
    showFieldError("plannedInvestment", `Minimum investment amount is ${formatCurrency(minAmount)}`)
  } else {
    document.getElementById("plannedInvestment").classList.remove("error")
    removeFieldError("plannedInvestment")
  }
}

function showFieldError(fieldId, message) {
  removeFieldError(fieldId) // Remove existing error first

  const field = document.getElementById(fieldId)
  const errorDiv = document.createElement("div")
  errorDiv.className = "error-message"
  errorDiv.textContent = message
  errorDiv.id = `error-${fieldId}`

  field.parentNode.appendChild(errorDiv)
}

function removeFieldError(fieldId) {
  const existingError = document.getElementById(`error-${fieldId}`)
  if (existingError) {
    existingError.remove()
  }
}

// Enhanced form navigation with progress saving
function enhancedChangeStep(direction) {
  // Save current step data before moving
  saveCurrentStepData()

  // Perform the step change
  changeStep(direction)

  // Update progress indicator
  updateProgressIndicator()
}

function saveCurrentStepData() {
  const currentStepData = {}
  const currentStepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`)
  const inputs = currentStepElement.querySelectorAll("input, select, textarea")

  inputs.forEach((input) => {
    if (input.type === "file") {
      currentStepData[input.id] = input.files[0]?.name || ""
    } else if (input.type === "checkbox") {
      currentStepData[input.id] = input.checked
    } else {
      currentStepData[input.id] = input.value
    }
  })

  // Save to localStorage with step-specific key
  const userData = JSON.parse(localStorage.getItem("currentUser"))
  localStorage.setItem(`stepData_${userData.id}_${currentStep}`, JSON.stringify(currentStepData))
}

function updateProgressIndicator() {
  const progressSteps = document.querySelectorAll(".progress-step")
  progressSteps.forEach((step, index) => {
    const stepNumber = index + 1
    if (stepNumber < currentStep) {
      step.classList.add("completed")
      step.classList.remove("active")
    } else if (stepNumber === currentStep) {
      step.classList.add("active")
      step.classList.remove("completed")
    } else {
      step.classList.remove("active", "completed")
    }
  })
}

// Auto-save functionality
let autoSaveTimeout

function setupAutoSave() {
  const formInputs = document.querySelectorAll("#kycForm input, #kycForm select, #kycForm textarea")

  formInputs.forEach((input) => {
    input.addEventListener("input", () => {
      clearTimeout(autoSaveTimeout)
      autoSaveTimeout = setTimeout(() => {
        saveFormData()
        showNotification("Progress saved automatically", "info")
      }, 2000) // Auto-save after 2 seconds of inactivity
    })
  })
}

// Initialize auto-save when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(setupAutoSave, 1000) // Setup after initial load
})

// Form completion percentage
function calculateCompletionPercentage() {
  const allRequiredFields = document.querySelectorAll("#kycForm [required]")
  const completedFields = Array.from(allRequiredFields).filter((field) => {
    if (field.type === "checkbox") {
      return field.checked
    }
    return field.value.trim() !== ""
  })

  const percentage = Math.round((completedFields.length / allRequiredFields.length) * 100)
  updateCompletionIndicator(percentage)
  return percentage
}

function updateCompletionIndicator(percentage) {
  let indicator = document.querySelector(".completion-indicator")
  if (!indicator) {
    indicator = document.createElement("div")
    indicator.className = "completion-indicator"
    indicator.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--surface-color);
            padding: 1rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-lg);
            border: 1px solid var(--border-color);
            min-width: 200px;
            z-index: 1000;
        `
    document.body.appendChild(indicator)
  }

  indicator.innerHTML = `
        <div style="text-align: center;">
            <div style="margin-bottom: 0.5rem; font-weight: 500;">Form Completion</div>
            <div style="background: var(--border-color); height: 8px; border-radius: 4px; overflow: hidden;">
                <div style="background: var(--primary-color); height: 100%; width: ${percentage}%; transition: width 0.3s;"></div>
            </div>
            <div style="margin-top: 0.5rem; font-size: 0.875rem; color: var(--text-muted);">${percentage}% Complete</div>
        </div>
    `
}

// Periodically update completion percentage
setInterval(() => {
  if (document.getElementById("kycForm")) {
    calculateCompletionPercentage()
  }
}, 5000)

// Add this function to update the review section with bank account information
function populateReviewSection() {
  const formData = collectFormData()

  // Personal Information Review
  const personalReview = document.getElementById("reviewPersonal")
  personalReview.innerHTML = `
        <div class="review-item">
            <span class="review-label">Name:</span>
            <span class="review-value">${formData.firstName} ${formData.lastName}</span>
        </div>
        <div class="review-item">
            <span class="review-label">Date of Birth:</span>
            <span class="review-value">${formatDate(formData.dateOfBirth)}</span>
        </div>
        <div class="review-item">
            <span class="review-label">Email:</span>
            <span class="review-value">${formData.email}</span>
        </div>
        <div class="review-item">
            <span class="review-label">Phone:</span>
            <span class="review-value">${formData.phone}</span>
        </div>
        <div class="review-item">
            <span class="review-label">Address:</span>
            <span class="review-value">${formData.address}</span>
        </div>
    `

  // Identity Review
  const identityReview = document.getElementById("reviewIdentity")
  identityReview.innerHTML = `
        <div class="review-item">
            <span class="review-label">ID Type:</span>
            <span class="review-value">${formData.idType}</span>
        </div>
        <div class="review-item">
            <span class="review-label">ID Number:</span>
            <span class="review-value">${formData.idNumber}</span>
        </div>
        <div class="review-item">
            <span class="review-label">Issue Date:</span>
            <span class="review-value">${formatDate(formData.issueDate)}</span>
        </div>
        <div class="review-item">
            <span class="review-label">Expiry Date:</span>
            <span class="review-value">${formatDate(formData.expiryDate)}</span>
        </div>
    `

  // Financial Review
  const financialReview = document.getElementById("reviewFinancial")
  financialReview.innerHTML = `
        <div class="review-item">
            <span class="review-label">Employment:</span>
            <span class="review-value">${formData.employmentStatus}</span>
        </div>
        <div class="review-item">
            <span class="review-label">Employer:</span>
            <span class="review-value">${formData.employer || "N/A"}</span>
        </div>
        <div class="review-item">
            <span class="review-label">Job Title:</span>
            <span class="review-value">${formData.jobTitle || "N/A"}</span>
        </div>
        <div class="review-item">
            <span class="review-label">Annual Income:</span>
            <span class="review-value">${formData.annualIncome}</span>
        </div>
        <div class="review-item">
            <span class="review-label">Bank Name:</span>
            <span class="review-value">${formData.bankName}</span>
        </div>
        <div class="review-item">
            <span class="review-label">Account Number:</span>
            <span class="review-value">${formData.accountNumber}</span>
        </div>
        <div class="review-item">
            <span class="review-label">Account Holder:</span>
            <span class="review-value">${formData.accountName}</span>
        </div>
        <div class="review-item">
            <span class="review-label">Investment Experience:</span>
            <span class="review-value">${formData.investmentExperience}</span>
        </div>
        <div class="review-item">
            <span class="review-label">Planned Investment:</span>
            <span class="review-value">${formatCurrency(formData.plannedInvestment)}</span>
        </div>
    `
}

function collectFormData() {
  const formData = {}
  const formElements = document.getElementById("kycForm").elements

  for (let i = 0; i < formElements.length; i++) {
    const element = formElements[i]

    if (element.name) {
      if (element.type === "radio") {
        if (element.checked) {
          formData[element.name] = element.value
        }
      } else if (element.type === "checkbox") {
        formData[element.name] = element.checked
      } else {
        formData[element.name] = element.value
      }
    }
  }

  return formData
}

function formatDate(dateString) {
  const date = new Date(dateString)
  const day = date.getDate().toString().padStart(2, "0")
  const month = (date.getMonth() + 1).toString().padStart(2, "0") // Month is 0-indexed
  const year = date.getFullYear()

  return `${year}-${month}-${day}`
}
