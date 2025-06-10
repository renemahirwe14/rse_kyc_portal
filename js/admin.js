// Add this at the beginning of the file
document.addEventListener("DOMContentLoaded", () => {
  // Check admin authentication
  checkAdminAuth()

  // Initialize admin dashboard if authenticated
  initializeAdminDashboard()
})

// Admin authentication check
function checkAdminAuth() {
  const adminSession = JSON.parse(localStorage.getItem("adminSession") || "null")

  if (!adminSession || !adminSession.isAdmin) {
    // Redirect to admin login page
    window.location.href = "admin-login.html"
    return
  }

  // Check if session is expired (24 hours)
  const loginTime = new Date(adminSession.loginTime).getTime()
  const currentTime = new Date().getTime()
  const sessionDuration = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

  if (currentTime - loginTime > sessionDuration) {
    // Session expired, redirect to login
    localStorage.removeItem("adminSession")
    window.location.href = "admin-login.html"
    return
  }
}

// Add this function to handle admin logout
function adminLogout() {
  // Clear admin session
  localStorage.removeItem("adminSession")

  // Show notification
  if (window.showNotification) {
    showNotification("Admin logged out successfully! Redirecting to main site...", "success")
  }

  // Redirect to main site instead of login page
  setTimeout(() => {
    window.location.href = "index.html"
  }, 1500)
}

// Update the existing initializeAdminDashboard function to include admin info
function initializeAdminDashboard() {
  loadData()
  updateDashboardStats()
  loadApplicationsTable()
  loadUsersTable()
  loadBrokersTable()
  setupCharts()

  // Display admin username in sidebar if available
  const adminSession = JSON.parse(localStorage.getItem("adminSession") || "null")
  if (adminSession && adminSession.username) {
    const adminNameElement = document.querySelector(".sidebar-header p")
    if (adminNameElement) {
      adminNameElement.textContent = `Admin: ${adminSession.username}`
    }
  }
}
