// Main application JavaScript

// Global state management
const AppState = {
  currentUser: null,
  currentStep: 1,
  formData: {},
  applications: [],
  users: [],
  brokers: [],
}

// Initialize application
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

function initializeApp() {
  // Check if user is logged in
  const userData = localStorage.getItem("currentUser")
  if (userData) {
    AppState.currentUser = JSON.parse(userData)
    // Redirect to dashboard if on landing page
    if (window.location.pathname.endsWith("index.html") || window.location.pathname === "/") {
      window.location.href = "dashboard.html"
    }
  }

  // Initialize sample data
  initializeSampleData()

  // Setup event listeners
  setupEventListeners()
}

function initializeSampleData() {
  // Sample applications data
  if (!localStorage.getItem("applications")) {
    const sampleApplications = [
      {
        id: "APP001",
        name: "John Doe",
        email: "john.doe@email.com",
        broker: "broker1",
        submittedDate: "2024-01-15",
        status: "pending",
        personalInfo: {
          firstName: "John",
          lastName: "Doe",
          dateOfBirth: "1990-05-15",
          nationality: "RW",
          address: "KG 123 St, Kigali",
          phone: "+250788123456",
          email: "john.doe@email.com",
        },
        identity: {
          idType: "national_id",
          idNumber: "1199012345678",
          issueDate: "2015-01-01",
          expiryDate: "2025-01-01",
        },
        financial: {
          employmentStatus: "employed",
          employer: "Tech Company Ltd",
          annualIncome: "5000000-10000000",
          sourceOfFunds: "salary",
          investmentExperience: "intermediate",
          riskTolerance: "moderate",
          investmentGoal: "wealth_building",
          plannedInvestment: 2000000,
        },
      },
      {
        id: "APP002",
        name: "Jane Smith",
        email: "jane.smith@email.com",
        broker: "broker2",
        submittedDate: "2024-01-14",
        status: "approved",
        personalInfo: {
          firstName: "Jane",
          lastName: "Smith",
          dateOfBirth: "1985-08-22",
          nationality: "RW",
          address: "KN 456 St, Kigali",
          phone: "+250788654321",
          email: "jane.smith@email.com",
        },
      },
    ]
    localStorage.setItem("applications", JSON.stringify(sampleApplications))
  }

  // Sample users data
  if (!localStorage.getItem("users")) {
    const sampleUsers = [
      {
        id: "USER001",
        name: "John Doe",
        email: "john.doe@email.com",
        registrationDate: "2024-01-10",
        status: "active",
      },
      {
        id: "USER002",
        name: "Jane Smith",
        email: "jane.smith@email.com",
        registrationDate: "2024-01-08",
        status: "active",
      },
    ]
    localStorage.setItem("users", JSON.stringify(sampleUsers))
  }

  // Sample brokers data
  if (!localStorage.getItem("brokers")) {
    const sampleBrokers = [
      {
        id: "broker1",
        name: "BK Capital Rwanda",
        email: "contact@bkcapital.rw",
        phone: "+250788111222",
        applications: 45,
        status: "active",
      },
      {
        id: "broker2",
        name: "Rwanda Investment Group",
        email: "info@rig.rw",
        phone: "+250788333444",
        applications: 32,
        status: "active",
      },
      {
        id: "broker3",
        name: "East Africa Securities",
        email: "contact@eas.com",
        phone: "+250788555666",
        applications: 28,
        status: "active",
      },
      {
        id: "broker4",
        name: "Capital Markets Rwanda",
        email: "info@cmr.rw",
        phone: "+250788777888",
        applications: 25,
        status: "active",
      },
    ]
    localStorage.setItem("brokers", JSON.stringify(sampleBrokers))
  }
}

function setupEventListeners() {
  // Close modals when clicking outside
  window.addEventListener("click", (event) => {
    if (event.target.classList.contains("modal")) {
      event.target.style.display = "none"
    }
  })

  // Handle escape key to close modals
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const modals = document.querySelectorAll(".modal")
      modals.forEach((modal) => {
        if (modal.style.display === "block" || modal.classList.contains("show")) {
          modal.style.display = "none"
          modal.classList.remove("show")
        }
      })
    }
  })
}

// Utility functions
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

function formatDate(dateString) {
  const options = { year: "numeric", month: "short", day: "numeric" }
  return new Date(dateString).toLocaleDateString("en-US", options)
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency: "RWF",
    minimumFractionDigits: 0,
  }).format(amount)
}

function generateId(prefix = "ID") {
  return prefix + Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
}

// Export functions for use in other files
window.AppState = AppState
window.showNotification = showNotification
window.formatDate = formatDate
window.formatCurrency = formatCurrency
window.generateId = generateId
