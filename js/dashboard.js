<<<<<<< HEAD
// Enhanced Dashboard JavaScript with Clickable Tabs
=======
// Dashboard JavaScript
>>>>>>> 25489bba4609c5662ce74ad0233036b567a67232

let currentStep = 1
const totalSteps = 4

<<<<<<< HEAD
=======
// Mock functions for demonstration purposes
function showNotification(message, type) {
  console.log(`Notification (${type}): ${message}`)
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
}

function generateId(prefix) {
  return prefix + Math.random().toString(36).substring(2, 15)
}

>>>>>>> 25489bba4609c5662ce74ad0233036b567a67232
document.addEventListener("DOMContentLoaded", () => {
  initializeDashboard()
})

function initializeDashboard() {
  // Check authentication
  const userData = localStorage.getItem("currentUser")
  if (!userData) {
    window.location.href = "index.html"
    return
  }

  const user = JSON.parse(userData)
  document.getElementById("userName").textContent = user.name

  // Load saved form data if exists
  loadSavedFormData()

  // Update navigation state
  updateFormNavigation()
<<<<<<< HEAD
  updateProgressIndicator()

  // Initialize step validation
  updateStepAccessibility()
=======
>>>>>>> 25489bba4609c5662ce74ad0233036b567a67232
}

function showSection(sectionId) {
  // Hide all sections
  const sections = document.querySelectorAll(".section")
  sections.forEach((section) => section.classList.remove("active"))

  // Show selected section
  document.getElementById(sectionId).classList.add("active")

  // Update nav items
  const navItems = document.querySelectorAll(".nav-item")
  navItems.forEach((item) => item.classList.remove("active"))

  // Add active class to clicked nav item
  event.target.closest(".nav-item").classList.add("active")
}

<<<<<<< HEAD
// Enhanced step navigation with validation
function goToStep(targetStep) {
  if (targetStep < 1 || targetStep > totalSteps) {
    return
  }

  // Check if step is accessible (only for forward navigation)
  if (targetStep > currentStep) {
    const stepElement = document.querySelector(`.progress-step[data-step="${targetStep}"]`)
    if (stepElement && stepElement.classList.contains("disabled")) {
      showNotification("Please complete the previous steps first", "warning")
      return
    }

    // If moving forward, validate current step
    if (!validateCurrentStep()) {
      return
    }
  }

  // Hide current step
  const currentStepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`)
  if (currentStepElement) {
    currentStepElement.classList.remove("active")
  }

  // Show target step
  currentStep = targetStep
  const targetStepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`)
  if (targetStepElement) {
    targetStepElement.classList.add("active")
  }

  // Update progress indicator
  updateProgressIndicator()
=======
function changeStep(direction) {
  const newStep = currentStep + direction

  if (newStep < 1 || newStep > totalSteps) {
    return
  }

  // Validate current step before proceeding
  if (direction === 1 && !validateStep(currentStep)) {
    return
  }

  // Hide current step
  document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove("active")
  document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.remove("active")

  // Show new step
  currentStep = newStep
  document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add("active")
  document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.add("active")

  // Mark completed steps
  for (let i = 1; i < currentStep; i++) {
    document.querySelector(`.progress-step[data-step="${i}"]`).classList.add("completed")
  }
>>>>>>> 25489bba4609c5662ce74ad0233036b567a67232

  // Update navigation buttons
  updateFormNavigation()

<<<<<<< HEAD
  // Update step accessibility - be more lenient
  updateStepAccessibility()

=======
>>>>>>> 25489bba4609c5662ce74ad0233036b567a67232
  // If moving to review step, populate review section
  if (currentStep === 4) {
    populateReviewSection()
  }

  // Save form data
  saveFormData()
<<<<<<< HEAD

  // Smooth scroll to top of form
  const formContainer = document.querySelector(".form-container")
  if (formContainer) {
    formContainer.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  // Update form validator current step
  if (window.formValidator) {
    window.formValidator.setCurrentStep(currentStep)
  }
}

function changeStep(direction) {
  const newStep = currentStep + direction

  if (newStep < 1 || newStep > totalSteps) {
    return
  }

  // Validate current step before proceeding forward
  if (direction === 1 && !validateCurrentStep()) {
    return
  }

  goToStep(newStep)
}

function validateCurrentStep() {
  if (window.formValidator) {
    const isValid = window.formValidator.validateStep(currentStep)
    if (!isValid) {
      // Scroll to first error
      const firstError = document.querySelector(".error, .error-message.show")
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" })
        // Focus on the related input if it's an error message
        if (firstError.classList.contains("error-message")) {
          const fieldId = firstError.id.replace("-error", "")
          const field = document.getElementById(fieldId)
          if (field) {
            field.focus()
          }
        } else {
          firstError.focus()
        }
      }
    }
    return isValid
  }

  // Fallback validation if FormValidator is not available
  const stepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`)
=======
}

function validateStep(step) {
  const stepElement = document.querySelector(`.form-step[data-step="${step}"]`)
>>>>>>> 25489bba4609c5662ce74ad0233036b567a67232
  const requiredFields = stepElement.querySelectorAll("[required]")
  let isValid = true

  requiredFields.forEach((field) => {
<<<<<<< HEAD
    let hasValue = false

    if (field.type === "checkbox") {
      hasValue = field.checked
    } else if (field.type === "file") {
      hasValue = field.files && field.files.length > 0
    } else {
      hasValue = field.value && field.value.trim().length > 0
    }

    if (!hasValue) {
=======
    if (!field.value.trim()) {
>>>>>>> 25489bba4609c5662ce74ad0233036b567a67232
      field.classList.add("error")
      isValid = false
    } else {
      field.classList.remove("error")
    }
  })

  if (!isValid) {
    showNotification("Please fill in all required fields", "error")
  }

  return isValid
}

<<<<<<< HEAD
function updateProgressIndicator() {
  const progressSteps = document.querySelectorAll(".progress-step")

  progressSteps.forEach((step, index) => {
    const stepNumber = index + 1
    step.classList.remove("active", "completed")

    if (stepNumber < currentStep) {
      step.classList.add("completed")
    } else if (stepNumber === currentStep) {
      step.classList.add("active")
    }
  })

  // Update progress bar
  const progressFill = document.getElementById("progressFill")
  if (progressFill) {
    const progress = ((currentStep - 1) / (totalSteps - 1)) * 100
    progressFill.style.width = `${progress}%`
  }
}

function updateStepAccessibility() {
  const progressSteps = document.querySelectorAll(".progress-step")

  progressSteps.forEach((step, index) => {
    const stepNumber = index + 1

    // Enable all steps that have been visited or are the next logical step
    if (stepNumber <= currentStep + 1) {
      step.classList.remove("disabled")
      step.style.cursor = "pointer"
      step.setAttribute("tabindex", "0")
    } else {
      step.classList.add("disabled")
      step.style.cursor = "not-allowed"
      step.setAttribute("tabindex", "-1")
    }
  })
}

=======
>>>>>>> 25489bba4609c5662ce74ad0233036b567a67232
function updateFormNavigation() {
  const prevBtn = document.getElementById("prevBtn")
  const nextBtn = document.getElementById("nextBtn")
  const submitBtn = document.getElementById("submitBtn")

  prevBtn.style.display = currentStep === 1 ? "none" : "inline-flex"

  if (currentStep === totalSteps) {
    nextBtn.style.display = "none"
    submitBtn.style.display = "inline-flex"
  } else {
    nextBtn.style.display = "inline-flex"
    submitBtn.style.display = "none"
  }
}

function populateReviewSection() {
  const formData = collectFormData()

  // Personal Information Review
  const personalReview = document.getElementById("reviewPersonal")
<<<<<<< HEAD
  if (personalReview) {
    personalReview.innerHTML = `
      <div class="review-item">
        <span class="review-label">Name:</span>
        <span class="review-value">${formData.firstName || ""} ${formData.lastName || ""}</span>
      </div>
      <div class="review-item">
        <span class="review-label">Date of Birth:</span>
        <span class="review-value">${formatDate(formData.dateOfBirth)}</span>
      </div>
      <div class="review-item">
        <span class="review-label">Email:</span>
        <span class="review-value">${formData.email || ""}</span>
      </div>
      <div class="review-item">
        <span class="review-label">Phone:</span>
        <span class="review-value">${formData.phone || ""}</span>
      </div>
      <div class="review-item">
        <span class="review-label">Address:</span>
        <span class="review-value">${formData.address || ""}</span>
      </div>
    `
  }

  // Identity Review
  const identityReview = document.getElementById("reviewIdentity")
  if (identityReview) {
    identityReview.innerHTML = `
      <div class="review-item">
        <span class="review-label">ID Type:</span>
        <span class="review-value">${formatIdType(formData.idType)}</span>
      </div>
      <div class="review-item">
        <span class="review-label">ID Number:</span>
        <span class="review-value">${formData.idNumber || ""}</span>
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
  }

  // Financial Review
  const financialReview = document.getElementById("reviewFinancial")
  if (financialReview) {
    financialReview.innerHTML = `
      <div class="review-item">
        <span class="review-label">Employment:</span>
        <span class="review-value">${formatEmploymentStatus(formData.employmentStatus)}</span>
      </div>
      <div class="review-item">
        <span class="review-label">Employer:</span>
        <span class="review-value">${formData.employer || "N/A"}</span>
      </div>
      <div class="review-item">
        <span class="review-label">Annual Income:</span>
        <span class="review-value">${formData.annualIncome || ""}</span>
      </div>
      <div class="review-item">
        <span class="review-label">Investment Experience:</span>
        <span class="review-value">${formatExperience(formData.investmentExperience)}</span>
      </div>
      <div class="review-item">
        <span class="review-label">Planned Investment:</span>
        <span class="review-value">${formatCurrency(formData.plannedInvestment)}</span>
      </div>
    `
  }
=======
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
            <span class="review-label">Annual Income:</span>
            <span class="review-value">${formData.annualIncome}</span>
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
>>>>>>> 25489bba4609c5662ce74ad0233036b567a67232
}

function collectFormData() {
  const formElements = document.getElementById("kycForm").elements
  const formData = {}

  for (const element of formElements) {
    if (element.name || element.id) {
      const key = element.name || element.id
      if (element.type === "checkbox") {
        formData[key] = element.checked
      } else if (element.type === "file") {
        formData[key] = element.files[0]?.name || ""
      } else {
        formData[key] = element.value
      }
    }
  }

  return formData
}

function saveFormData() {
  const formData = collectFormData()
  const userData = JSON.parse(localStorage.getItem("currentUser"))
  localStorage.setItem(`formData_${userData.id}`, JSON.stringify(formData))
}

function loadSavedFormData() {
  const userData = JSON.parse(localStorage.getItem("currentUser"))
  const savedData = localStorage.getItem(`formData_${userData.id}`)

  if (savedData) {
    const formData = JSON.parse(savedData)

    // Populate form fields
    Object.keys(formData).forEach((key) => {
      const element = document.getElementById(key) || document.querySelector(`[name="${key}"]`)
      if (element) {
        if (element.type === "checkbox") {
          element.checked = formData[key]
        } else if (element.type !== "file") {
          element.value = formData[key]
        }
      }
    })
  }
}

// Handle form submission
document.addEventListener("DOMContentLoaded", () => {
  const kycForm = document.getElementById("kycForm")
  if (kycForm) {
    kycForm.addEventListener("submit", handleKYCSubmission)
  }
})

function handleKYCSubmission(event) {
  event.preventDefault()

  // Final validation
<<<<<<< HEAD
  if (!validateCurrentStep()) {
=======
  if (!validateStep(4)) {
>>>>>>> 25489bba4609c5662ce74ad0233036b567a67232
    return
  }

  const termsAccept = document.getElementById("termsAccept")
  const brokerSelect = document.getElementById("brokerSelect")

  if (!termsAccept.checked) {
    showNotification("Please accept the terms and conditions", "error")
    return
  }

  if (!brokerSelect.value) {
    showNotification("Please select a broker", "error")
    return
  }

  const submitBtn = document.getElementById("submitBtn")
  submitBtn.classList.add("loading")
  submitBtn.disabled = true

  // Simulate submission process
  setTimeout(() => {
    const formData = collectFormData()
    const userData = JSON.parse(localStorage.getItem("currentUser"))

    // Create application
    const application = {
      id: generateId("APP"),
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      broker: formData.brokerSelect,
      submittedDate: new Date().toISOString().split("T")[0],
      status: "pending",
      personalInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        nationality: formData.nationality,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
      },
      identity: {
        idType: formData.idType,
        idNumber: formData.idNumber,
        issueDate: formData.issueDate,
        expiryDate: formData.expiryDate,
      },
      financial: {
        employmentStatus: formData.employmentStatus,
        employer: formData.employer,
        annualIncome: formData.annualIncome,
        sourceOfFunds: formData.sourceOfFunds,
        investmentExperience: formData.investmentExperience,
<<<<<<< HEAD
=======
        riskTolerance: formData.riskTolerance,
        investmentGoal: formData.investmentGoal,
>>>>>>> 25489bba4609c5662ce74ad0233036b567a67232
        plannedInvestment: Number.parseInt(formData.plannedInvestment),
      },
    }

    // Save application
    const applications = JSON.parse(localStorage.getItem("applications") || "[]")
    applications.push(application)
    localStorage.setItem("applications", JSON.stringify(applications))

<<<<<<< HEAD
=======
    // Generate and simulate PDF sending
    generatePDF(application)

>>>>>>> 25489bba4609c5662ce74ad0233036b567a67232
    // Clear saved form data
    localStorage.removeItem(`formData_${userData.id}`)

    submitBtn.classList.remove("loading")
    submitBtn.disabled = false

    showNotification("KYC application submitted successfully!", "success")

    // Redirect to status page after delay
    setTimeout(() => {
      showSection("status")
    }, 2000)
  }, 2000)
}

<<<<<<< HEAD
// Utility functions
function formatDate(dateString) {
  if (!dateString) return "N/A"
  const options = { year: "numeric", month: "short", day: "numeric" }
  return new Date(dateString).toLocaleDateString("en-US", options)
}

function formatCurrency(amount) {
  if (!amount) return "N/A"
  return new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency: "RWF",
    minimumFractionDigits: 0,
  }).format(amount)
}

function formatIdType(idType) {
  const types = {
    national_id: "National ID",
    passport: "Passport",
    driving_license: "Driving License",
  }
  return types[idType] || idType || "N/A"
}

function formatEmploymentStatus(status) {
  const statuses = {
    employed: "Employed",
    self_employed: "Self Employed",
    unemployed: "Unemployed",
    retired: "Retired",
    student: "Student",
  }
  return statuses[status] || status || "N/A"
}

function formatExperience(experience) {
  const levels = {
    beginner: "Beginner (0-1 years)",
    intermediate: "Intermediate (1-5 years)",
    experienced: "Experienced (5+ years)",
  }
  return levels[experience] || experience || "N/A"
}

function generateId(prefix = "ID") {
  return prefix + Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
}

function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.textContent = message

  // Style the notification
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    animation: slideInRight 0.3s ease-out;
    max-width: 400px;
    box-shadow: var(--shadow-lg);
  `

  // Set background color based on type
  switch (type) {
    case "success":
      notification.style.backgroundColor = "#16a34a"
      break
    case "error":
      notification.style.backgroundColor = "#dc2626"
      break
    case "warning":
      notification.style.backgroundColor = "#ca8a04"
      break
    default:
      notification.style.backgroundColor = "#2563eb"
  }

  document.body.appendChild(notification)

  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease-out"
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 300)
  }, 5000)
}

function logout() {
  localStorage.removeItem("currentUser")
  showNotification("Logged out successfully! Redirecting to main site...", "success")
  setTimeout(() => {
    window.location.href = "index.html"
  }, 1500)
}

// Mobile menu toggle
function toggleMobileMenu() {
  const sidebar = document.getElementById("sidebar")
  sidebar.classList.toggle("open")
}

// Close mobile menu when clicking outside
document.addEventListener("click", (event) => {
  const sidebar = document.getElementById("sidebar")
  const toggle = document.querySelector(".mobile-menu-toggle")

  if (sidebar && toggle && !sidebar.contains(event.target) && !toggle.contains(event.target)) {
    sidebar.classList.remove("open")
  }
})

// Keyboard navigation for progress steps
document.addEventListener("keydown", (event) => {
  if (event.target.classList.contains("progress-step")) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      const stepNumber = Number.parseInt(event.target.getAttribute("data-step"))
      goToStep(stepNumber)
    }
  }
})

// Add these functions at the end of the file

// Profile functionality
function loadProfileData() {
  const userData = JSON.parse(localStorage.getItem("currentUser"))
  if (userData) {
    document.getElementById("profileName").textContent = userData.name
    document.getElementById("profileEmail").textContent = userData.email

    // Load additional profile data if available
    const profileData = JSON.parse(localStorage.getItem(`profile_${userData.id}`) || "{}")

    if (profileData.firstName) document.getElementById("profileFirstName").value = profileData.firstName
    if (profileData.lastName) document.getElementById("profileLastName").value = profileData.lastName
    if (profileData.phone) document.getElementById("profilePhone").value = profileData.phone
    if (profileData.address) document.getElementById("profileAddress").value = profileData.address

    // Set member since date
    const memberSince = new Date(userData.registrationDate || Date.now()).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    })
    document.getElementById("memberSince").textContent = memberSince
  }
}

// Status functionality
function loadStatusData() {
  const userData = JSON.parse(localStorage.getItem("currentUser"))
  const applications = JSON.parse(localStorage.getItem("applications") || "[]")

  // Find user's application
  const userApp = applications.find((app) => app.email === userData.email)

  if (userApp) {
    document.getElementById("currentAppId").textContent = userApp.id
    document.getElementById("submissionDate").textContent = formatDate(userApp.submittedDate)
    document.getElementById("statusName").textContent = userApp.name
    document.getElementById("statusEmail").textContent = userApp.email

    if (userApp.personalInfo && userApp.personalInfo.phone) {
      document.getElementById("statusPhone").textContent = userApp.personalInfo.phone
    }

    // Update verification status
    const statusElement = document.getElementById("verificationStatus")
    if (statusElement) {
      statusElement.textContent = userApp.status.charAt(0).toUpperCase() + userApp.status.slice(1)
    }

    // Update applications count
    const appCount = applications.filter((app) => app.email === userData.email).length
    document.getElementById("applicationsCount").textContent = appCount.toString()
  }
}

// Profile form submission
document.addEventListener("DOMContentLoaded", () => {
  const profileForm = document.getElementById("profileForm")
  if (profileForm) {
    profileForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const userData = JSON.parse(localStorage.getItem("currentUser"))
      const profileData = {
        firstName: document.getElementById("profileFirstName").value,
        lastName: document.getElementById("profileLastName").value,
        phone: document.getElementById("profilePhone").value,
        address: document.getElementById("profileAddress").value,
        updatedAt: new Date().toISOString(),
      }

      localStorage.setItem(`profile_${userData.id}`, JSON.stringify(profileData))
      showNotification("Profile updated successfully!", "success")
    })
  }
})

// Status action functions
function downloadApplicationPDF() {
  showNotification("PDF download will be available once your application is approved", "info")
}

function contactSupport() {
  showNotification("Redirecting to support portal...", "info")
  setTimeout(() => {
    window.open("mailto:support@rse-kyc.com?subject=KYC Application Support", "_blank")
  }, 1000)
}

function updateApplication() {
  showNotification("You can update your application by completing the KYC form again", "info")
  setTimeout(() => {
    showSection("kyc-form")
  }, 1500)
}

function withdrawApplication() {
  if (confirm("Are you sure you want to withdraw your application? This action cannot be undone.")) {
    showNotification("Application withdrawal request submitted", "warning")
  }
}

function showChangePassword() {
  showNotification("Password change functionality will be available in the next update", "info")
}

// Update the showSection function to load data when switching sections
const originalShowSection = showSection
showSection = (sectionId) => {
  originalShowSection(sectionId)

  // Load section-specific data
  if (sectionId === "profile") {
    loadProfileData()
  } else if (sectionId === "status") {
    loadStatusData()
  }
}

// Load data on initial page load
document.addEventListener("DOMContentLoaded", () => {
  // Add a small delay to ensure DOM is fully loaded
  setTimeout(() => {
    loadProfileData()
    loadStatusData()
  }, 100)
})
=======
function generatePDF(application) {
  // In a real application, this would generate and send a PDF
  // For demo purposes, we'll just simulate it
  console.log("Generating PDF for application:", application.id)

  // Simulate sending to broker
  setTimeout(() => {
    showNotification(`PDF sent to ${getBrokerName(application.broker)}`, "info")
  }, 1000)
}

function getBrokerName(brokerId) {
  const brokers = JSON.parse(localStorage.getItem("brokers") || "[]")
  const broker = brokers.find((b) => b.id === brokerId)
  return broker ? broker.name : "Selected Broker"
}
>>>>>>> 25489bba4609c5662ce74ad0233036b567a67232
