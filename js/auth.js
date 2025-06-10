// Enhanced Authentication with Better UX

document.addEventListener("DOMContentLoaded", () => {
  initializeAuth()
})

function initializeAuth() {
  setupPasswordToggle()
  setupPasswordStrength()
  setupFormValidation()
  checkAuthState()
}

function setupPasswordToggle() {
  const toggleButtons = document.querySelectorAll(".toggle-password")

  toggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const input = button.parentElement.querySelector('input[type="password"], input[type="text"]')
      const icon = button.querySelector("i")

      if (input.type === "password") {
        input.type = "text"
        icon.classList.remove("fa-eye")
        icon.classList.add("fa-eye-slash")
      } else {
        input.type = "password"
        icon.classList.remove("fa-eye-slash")
        icon.classList.add("fa-eye")
      }
    })
  })
}

function setupPasswordStrength() {
  const passwordInput = document.getElementById("signupPassword")
  if (!passwordInput) return

  passwordInput.addEventListener("input", () => {
    const password = passwordInput.value
    const strength = calculatePasswordStrength(password)
    updatePasswordStrengthUI(strength)
  })
}

function calculatePasswordStrength(password) {
  let score = 0
  const feedback = []

  // Length check
  if (password.length >= 8) score += 1
  else feedback.push("At least 8 characters")

  // Uppercase check
  if (/[A-Z]/.test(password)) score += 1
  else feedback.push("One uppercase letter")

  // Lowercase check
  if (/[a-z]/.test(password)) score += 1
  else feedback.push("One lowercase letter")

  // Number check
  if (/\d/.test(password)) score += 1
  else feedback.push("One number")

  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1
  else feedback.push("One special character")

  // Common patterns check
  if (!/123456|password|qwerty|admin/i.test(password)) score += 1
  else feedback.push("Avoid common patterns")

  return { score, feedback }
}

function updatePasswordStrengthUI(strength) {
  const strengthBar = document.querySelector(".strength-fill")
  const strengthText = document.querySelector(".strength-text")

  if (!strengthBar || !strengthText) return

  const percentage = (strength.score / 6) * 100
  strengthBar.style.width = `${percentage}%`

  // Remove existing classes
  strengthBar.classList.remove("weak", "medium", "strong")

  if (strength.score <= 2) {
    strengthBar.classList.add("weak")
    strengthText.textContent = "Weak password"
    strengthText.style.color = "var(--danger-color)"
  } else if (strength.score <= 4) {
    strengthBar.classList.add("medium")
    strengthText.textContent = "Medium strength"
    strengthText.style.color = "var(--warning-color)"
  } else {
    strengthBar.classList.add("strong")
    strengthText.textContent = "Strong password"
    strengthText.style.color = "var(--success-color)"
  }
}

function setupFormValidation() {
  const forms = document.querySelectorAll("#loginForm, #signupForm")

  forms.forEach((form) => {
    const inputs = form.querySelectorAll("input")

    inputs.forEach((input) => {
      input.addEventListener("blur", () => validateInput(input))
      input.addEventListener("input", () => clearInputError(input))
    })
  })
}

function validateInput(input) {
  const value = input.value.trim()
  let isValid = true
  let errorMessage = ""

  // Clear previous error
  clearInputError(input)

  // Required field validation
  if (input.hasAttribute("required") && !value) {
    isValid = false
    errorMessage = "This field is required"
  }

  // Email validation
  if (input.type === "email" && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      isValid = false
      errorMessage = "Please enter a valid email address"
    }
  }

  // Password validation
  if (input.type === "password" && input.id === "signupPassword" && value) {
    const strength = calculatePasswordStrength(value)
    if (strength.score < 3) {
      isValid = false
      errorMessage = "Password is too weak"
    }
  }

  // Confirm password validation
  if (input.id === "confirmPassword" && value) {
    const password = document.getElementById("signupPassword").value
    if (value !== password) {
      isValid = false
      errorMessage = "Passwords do not match"
    }
  }

  if (!isValid) {
    showInputError(input, errorMessage)
  }

  return isValid
}

function showInputError(input, message) {
  input.classList.add("error")

  // Create or update error message
  let errorElement = input.parentElement.parentElement.querySelector(".error-message")
  if (!errorElement) {
    errorElement = document.createElement("div")
    errorElement.className = "error-message"
    input.parentElement.parentElement.appendChild(errorElement)
  }

  errorElement.textContent = message
  errorElement.classList.add("show")
}

function clearInputError(input) {
  input.classList.remove("error")
  const errorElement = input.parentElement.parentElement.querySelector(".error-message")
  if (errorElement) {
    errorElement.classList.remove("show")
  }
}

function checkAuthState() {
  const currentUser = localStorage.getItem("currentUser")
  if (currentUser && (window.location.pathname.endsWith("index.html") || window.location.pathname === "/")) {
    // User is logged in and on landing page, redirect to dashboard
    window.location.href = "dashboard.html"
  }
}

function showLogin() {
  const modal = document.getElementById("loginModal")
  modal.style.display = "block"
  modal.classList.add("show")

  // Focus first input
  setTimeout(() => {
    const firstInput = modal.querySelector("input")
    if (firstInput) firstInput.focus()
  }, 100)
}

function showSignup() {
  const modal = document.getElementById("signupModal")
  modal.style.display = "block"
  modal.classList.add("show")

  // Focus first input
  setTimeout(() => {
    const firstInput = modal.querySelector("input")
    if (firstInput) firstInput.focus()
  }, 100)
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId)
  modal.style.display = "none"
  modal.classList.remove("show")

  // Clear form data
  const form = modal.querySelector("form")
  if (form) {
    form.reset()
    // Clear any error states
    const inputs = form.querySelectorAll("input")
    inputs.forEach((input) => clearInputError(input))
  }
}

function handleLogin(event) {
  event.preventDefault()

  const email = document.getElementById("loginEmail").value.trim()
  const password = document.getElementById("loginPassword").value

  // Validate inputs
  const emailInput = document.getElementById("loginEmail")
  const passwordInput = document.getElementById("loginPassword")

  let isValid = true

  if (!validateInput(emailInput)) isValid = false
  if (!validateInput(passwordInput)) isValid = false

  if (!isValid) return

  const submitBtn = event.target.querySelector('button[type="submit"]')
  setButtonLoading(submitBtn, true)

  // Simulate API call
  setTimeout(() => {
    // Check credentials
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())

    if (user) {
      // Successful login
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        loginTime: new Date().toISOString(),
      }

      localStorage.setItem("currentUser", JSON.stringify(userData))

      showNotification("Login successful! Redirecting...", "success")

      setTimeout(() => {
        window.location.href = "dashboard.html"
      }, 1500)
    } else {
      showNotification("Invalid email or password. Please try again.", "error")
      setButtonLoading(submitBtn, false)
    }
  }, 1500)
}

function handleSignup(event) {
  event.preventDefault()

  const name = document.getElementById("signupName").value.trim()
  const email = document.getElementById("signupEmail").value.trim()
  const password = document.getElementById("signupPassword").value
  const confirmPassword = document.getElementById("confirmPassword").value
  const agreeTerms = document.getElementById("agreeTerms").checked

  // Validate all inputs
  const inputs = [
    document.getElementById("signupName"),
    document.getElementById("signupEmail"),
    document.getElementById("signupPassword"),
    document.getElementById("confirmPassword"),
  ]

  let isValid = true
  inputs.forEach((input) => {
    if (!validateInput(input)) isValid = false
  })

  if (!agreeTerms) {
    showNotification("Please accept the terms and conditions", "error")
    isValid = false
  }

  if (!isValid) return

  const submitBtn = event.target.querySelector('button[type="submit"]')
  setButtonLoading(submitBtn, true)

  // Simulate API call
  setTimeout(() => {
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase())

    if (existingUser) {
      showNotification("An account with this email already exists", "error")
      setButtonLoading(submitBtn, false)
      return
    }

    // Create new user
    const newUser = {
      id: generateId("USER"),
      name: name,
      email: email,
      registrationDate: new Date().toISOString().split("T")[0],
      status: "active",
    }

    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))

    // Auto login
    const userData = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      loginTime: new Date().toISOString(),
    }

    localStorage.setItem("currentUser", JSON.stringify(userData))

    showNotification("Account created successfully! Redirecting...", "success")

    setTimeout(() => {
      window.location.href = "dashboard.html"
    }, 1500)
  }, 2000)
}

function setButtonLoading(button, loading) {
  const btnText = button.querySelector(".btn-text")
  const btnLoader = button.querySelector(".btn-loader")

  if (loading) {
    button.classList.add("loading")
    button.disabled = true
    if (btnText) btnText.style.opacity = "0"
    if (btnLoader) btnLoader.style.display = "block"
  } else {
    button.classList.remove("loading")
    button.disabled = false
    if (btnText) btnText.style.opacity = "1"
    if (btnLoader) btnLoader.style.display = "none"
  }
}

function logout() {
  localStorage.removeItem("currentUser")
  showNotification("Logged out successfully! Redirecting to main site...", "success")
  setTimeout(() => {
    window.location.href = "index.html"
  }, 1500)
}

function generateId(prefix = "ID") {
  return prefix + "_" + Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.5rem;">
      <i class="fas fa-${getNotificationIcon(type)}"></i>
      <span>${message}</span>
    </div>
  `

  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    max-width: 400px;
    box-shadow: var(--shadow-xl);
    backdrop-filter: blur(10px);
  `

  // Set background color based on type
  switch (type) {
    case "success":
      notification.style.background = "linear-gradient(135deg, #16a34a, #22c55e)"
      break
    case "error":
      notification.style.background = "linear-gradient(135deg, #dc2626, #ef4444)"
      break
    case "warning":
      notification.style.background = "linear-gradient(135deg, #ca8a04, #eab308)"
      break
    default:
      notification.style.background = "linear-gradient(135deg, #2563eb, #3b82f6)"
  }

  document.body.appendChild(notification)

  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 400)
  }, 5000)
}

function getNotificationIcon(type) {
  switch (type) {
    case "success":
      return "check-circle"
    case "error":
      return "exclamation-circle"
    case "warning":
      return "exclamation-triangle"
    default:
      return "info-circle"
  }
}

// Close modals when clicking outside
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("modal-backdrop")) {
    const modal = event.target.closest(".modal")
    if (modal) {
      const modalId = modal.id
      closeModal(modalId)
    }
  }
})

// Close modals with Escape key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    const openModal = document.querySelector(".modal.show")
    if (openModal) {
      closeModal(openModal.id)
    }
  }
})

// Export functions for global use
window.showLogin = showLogin
window.showSignup = showSignup
window.closeModal = closeModal
window.logout = logout
window.showNotification = showNotification
