// Authentication JavaScript

// Mock AppState and utility functions for demonstration
const AppState = {
  currentUser: localStorage.getItem("currentUser") ? JSON.parse(localStorage.getItem("currentUser")) : null,
}

function showNotification(message, type) {
  // Implement your notification logic here
  alert(`${type.toUpperCase()}: ${message}`)
}

function generateId(prefix) {
  return prefix + "_" + Math.random().toString(36).substr(2, 9)
}

function showLogin() {
  const modal = document.getElementById("loginModal")
  modal.style.display = "block"
  modal.classList.add("show")
}

function showSignup() {
  const modal = document.getElementById("signupModal")
  modal.style.display = "block"
  modal.classList.add("show")
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId)
  modal.style.display = "none"
  modal.classList.remove("show")
}

function handleLogin(event) {
  event.preventDefault()

  const email = document.getElementById("loginEmail").value
  const password = document.getElementById("loginPassword").value

  // Basic validation
  if (!email || !password) {
    showNotification("Please fill in all fields", "error")
    return
  }

  // Simulate API call with loading state
  const submitBtn = event.target.querySelector('button[type="submit"]')
  submitBtn.classList.add("loading")
  submitBtn.disabled = true

  setTimeout(() => {
    // Check credentials (in real app, this would be an API call)
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const user = users.find((u) => u.email === email)

    if (user) {
      // Successful login
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        loginTime: new Date().toISOString(),
      }

      localStorage.setItem("currentUser", JSON.stringify(userData))
      AppState.currentUser = userData

      showNotification("Login successful! Redirecting...", "success")

      setTimeout(() => {
        window.location.href = "dashboard.html"
      }, 1500)
    } else {
      showNotification("Invalid credentials. Please try again.", "error")
    }

    submitBtn.classList.remove("loading")
    submitBtn.disabled = false
  }, 1500)
}

function handleSignup(event) {
  event.preventDefault()

  const name = document.getElementById("signupName").value
  const email = document.getElementById("signupEmail").value
  const password = document.getElementById("signupPassword").value
  const confirmPassword = document.getElementById("confirmPassword").value

  // Validation
  if (!name || !email || !password || !confirmPassword) {
    showNotification("Please fill in all fields", "error")
    return
  }

  if (password !== confirmPassword) {
    showNotification("Passwords do not match", "error")
    return
  }

  if (password.length < 6) {
    showNotification("Password must be at least 6 characters", "error")
    return
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    showNotification("Please enter a valid email address", "error")
    return
  }

  // Simulate API call with loading state
  const submitBtn = event.target.querySelector('button[type="submit"]')
  submitBtn.classList.add("loading")
  submitBtn.disabled = true

  setTimeout(() => {
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const existingUser = users.find((u) => u.email === email)

    if (existingUser) {
      showNotification("An account with this email already exists", "error")
      submitBtn.classList.remove("loading")
      submitBtn.disabled = false
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
    AppState.currentUser = userData

    showNotification("Account created successfully! Redirecting...", "success")

    setTimeout(() => {
      window.location.href = "dashboard.html"
    }, 1500)

    submitBtn.classList.remove("loading")
    submitBtn.disabled = false
  }, 1500)
}

function logout() {
  localStorage.removeItem("currentUser")
  AppState.currentUser = null
  showNotification("Logged out successfully", "success")
  setTimeout(() => {
    window.location.href = "index.html"
  }, 1000)
}

// Check authentication on protected pages
function checkAuth() {
  const currentUser = localStorage.getItem("currentUser")
  if (!currentUser && window.location.pathname !== "/index.html" && !window.location.pathname.endsWith("index.html")) {
    window.location.href = "index.html"
  }
}

// Initialize auth check
document.addEventListener("DOMContentLoaded", checkAuth)
