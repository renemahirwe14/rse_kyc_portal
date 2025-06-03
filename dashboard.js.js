// Dashboard JavaScript

let currentStep = 1
const totalSteps = 4

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

  // Update navigation buttons
  updateFormNavigation()

  // If moving to review step, populate review section
  if (currentStep === 4) {
    populateReviewSection()
  }

  // Save form data
  saveFormData()
}

function validateStep(step) {
  const stepElement = document.querySelector(`.form-step[data-step="${step}"]`)
  const requiredFields = stepElement.querySelectorAll("[required]")
  let isValid = true

  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
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
  if (!validateStep(4)) {
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
        riskTolerance: formData.riskTolerance,
        investmentGoal: formData.investmentGoal,
        plannedInvestment: Number.parseInt(formData.plannedInvestment),
      },
    }

    // Save application
    const applications = JSON.parse(localStorage.getItem("applications") || "[]")
    applications.push(application)
    localStorage.setItem("applications", JSON.stringify(applications))

    // Generate and simulate PDF sending
    generatePDF(application)

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
