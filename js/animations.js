// Enhanced Animations and Interactions

document.addEventListener("DOMContentLoaded", () => {
  initializeAnimations()
  setupScrollAnimations()
  setupHoverEffects()
  setupParallaxEffects()
})

function initializeAnimations() {
  // Animate elements on page load
  animateOnLoad()

  // Setup intersection observer for scroll animations
  setupIntersectionObserver()

  // Initialize typing animation
  initializeTypingAnimation()

  // Setup floating animations
  setupFloatingAnimations()
}

function animateOnLoad() {
  // Animate logo
  const logo = document.querySelector(".logo-img")
  if (logo) {
    logo.style.opacity = "0"
    logo.style.transform = "scale(0.8)"

    setTimeout(() => {
      logo.style.transition = "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
      logo.style.opacity = "1"
      logo.style.transform = "scale(1)"
    }, 200)
  }

  // Animate hero elements
  const heroElements = document.querySelectorAll(".hero-title, .hero-description, .action-buttons")
  heroElements.forEach((element, index) => {
    element.style.opacity = "0"
    element.style.transform = "translateY(30px)"

    setTimeout(
      () => {
        element.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
        element.style.opacity = "1"
        element.style.transform = "translateY(0)"
      },
      400 + index * 200,
    )
  })
}

function setupIntersectionObserver() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in")

        // Special handling for feature cards
        if (entry.target.classList.contains("feature-card")) {
          animateFeatureCard(entry.target)
        }

        // Special handling for process steps
        if (entry.target.classList.contains("step")) {
          animateProcessStep(entry.target)
        }
      }
    })
  }, observerOptions)

  // Observe elements
  const elementsToObserve = document.querySelectorAll(".feature-card, .step, .stats-card, .section-header")
  elementsToObserve.forEach((element) => {
    observer.observe(element)
  })
}

function animateFeatureCard(card) {
  const icon = card.querySelector(".feature-icon")
  const title = card.querySelector("h4")
  const description = card.querySelector("p")
  const highlight = card.querySelector(".feature-highlight")

  // Animate icon
  if (icon) {
    icon.style.transform = "scale(0) rotate(-180deg)"
    setTimeout(() => {
      icon.style.transition = "all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)"
      icon.style.transform = "scale(1) rotate(0deg)"
    }, 100)
  }
  // Animate text elements
  ;[title, description, highlight].forEach((element, index) => {
    if (element) {
      element.style.opacity = "0"
      element.style.transform = "translateY(20px)"

      setTimeout(
        () => {
          element.style.transition = "all 0.5s ease-out"
          element.style.opacity = "1"
          element.style.transform = "translateY(0)"
        },
        200 + index * 100,
      )
    }
  })
}

function animateProcessStep(step) {
  const stepNumber = step.querySelector(".step-number")
  const stepContent = step.querySelector(".step-content")

  if (stepNumber) {
    stepNumber.style.transform = "scale(0)"
    stepNumber.style.opacity = "0"

    setTimeout(() => {
      stepNumber.style.transition = "all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)"
      stepNumber.style.transform = "scale(1)"
      stepNumber.style.opacity = "1"
    }, 100)
  }

  if (stepContent) {
    stepContent.style.opacity = "0"
    stepContent.style.transform = "translateX(30px)"

    setTimeout(() => {
      stepContent.style.transition = "all 0.6s ease-out"
      stepContent.style.opacity = "1"
      stepContent.style.transform = "translateX(0)"
    }, 300)
  }
}

function setupScrollAnimations() {
  let ticking = false

  function updateScrollAnimations() {
    const scrolled = window.pageYOffset
    const rate = scrolled * -0.5

    // Parallax effect for hero image
    const heroImage = document.querySelector(".hero-image")
    if (heroImage) {
      heroImage.style.transform = `translateY(${rate * 0.3}px)`
    }

    // Floating shapes animation based on scroll
    const shapes = document.querySelectorAll(".shape")
    shapes.forEach((shape, index) => {
      const speed = 0.1 + index * 0.05
      shape.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`
    })

    ticking = false
  }

  function requestScrollUpdate() {
    if (!ticking) {
      requestAnimationFrame(updateScrollAnimations)
      ticking = true
    }
  }

  window.addEventListener("scroll", requestScrollUpdate)
}

function setupHoverEffects() {
  // Enhanced button hover effects
  const buttons = document.querySelectorAll(".btn")
  buttons.forEach((button) => {
    button.addEventListener("mouseenter", () => {
      button.style.transform = "translateY(-2px) scale(1.02)"
    })

    button.addEventListener("mouseleave", () => {
      button.style.transform = "translateY(0) scale(1)"
    })
  })

  // Feature card hover effects
  const featureCards = document.querySelectorAll(".feature-card")
  featureCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      const icon = card.querySelector(".feature-icon")
      if (icon) {
        icon.style.transform = "scale(1.1) rotate(5deg)"
      }
    })

    card.addEventListener("mouseleave", () => {
      const icon = card.querySelector(".feature-icon")
      if (icon) {
        icon.style.transform = "scale(1) rotate(0deg)"
      }
    })
  })

  // Progress step hover effects
  const progressSteps = document.querySelectorAll(".progress-step")
  progressSteps.forEach((step) => {
    step.addEventListener("mouseenter", () => {
      if (!step.classList.contains("disabled")) {
        step.style.transform = "translateY(-3px)"
        const circle = step.querySelector(".step-circle")
        if (circle) {
          circle.style.transform = "scale(1.05)"
        }
      }
    })

    step.addEventListener("mouseleave", () => {
      step.style.transform = "translateY(0)"
      const circle = step.querySelector(".step-circle")
      if (circle && !step.classList.contains("active")) {
        circle.style.transform = "scale(1)"
      }
    })
  })
}

function setupParallaxEffects() {
  const parallaxElements = document.querySelectorAll(".stats-card, .review-card")

  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset

    parallaxElements.forEach((element, index) => {
      const rect = element.getBoundingClientRect()
      const speed = 0.1 + index * 0.02

      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const yPos = -(scrolled * speed)
        element.style.transform = `translateY(${yPos}px)`
      }
    })
  })
}

function initializeTypingAnimation() {
  const typingElement = document.querySelector(".hero-title .highlight")
  if (!typingElement) return

  const words = ["Secure", "Smart", "Simple", "Swift"]
  let wordIndex = 0
  let charIndex = 0
  let isDeleting = false

  function typeWriter() {
    const currentWord = words[wordIndex]

    if (isDeleting) {
      typingElement.textContent = currentWord.substring(0, charIndex - 1)
      charIndex--
    } else {
      typingElement.textContent = currentWord.substring(0, charIndex + 1)
      charIndex++
    }

    let typeSpeed = isDeleting ? 100 : 150

    if (!isDeleting && charIndex === currentWord.length) {
      typeSpeed = 2000 // Pause at end
      isDeleting = true
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false
      wordIndex = (wordIndex + 1) % words.length
      typeSpeed = 500 // Pause before next word
    }

    setTimeout(typeWriter, typeSpeed)
  }

  // Start typing animation after initial load
  setTimeout(typeWriter, 2000)
}

function setupFloatingAnimations() {
  // Add floating animation to various elements
  const floatingElements = document.querySelectorAll(".feature-icon, .step-number, .stat-icon")

  floatingElements.forEach((element, index) => {
    element.style.animation = `float 3s ease-in-out infinite`
    element.style.animationDelay = `${index * 0.5}s`
  })
}

// Smooth scroll for anchor links
function setupSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]')

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()

      const targetId = link.getAttribute("href").substring(1)
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
}

// Mouse trail effect
function setupMouseTrail() {
  const trail = []
  const trailLength = 10

  function createTrailDot() {
    const dot = document.createElement("div")
    dot.className = "mouse-trail-dot"
    dot.style.cssText = `
      position: fixed;
      width: 4px;
      height: 4px;
      background: var(--primary-color);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.3s ease;
    `
    document.body.appendChild(dot)
    return dot
  }

  // Initialize trail dots
  for (let i = 0; i < trailLength; i++) {
    trail.push(createTrailDot())
  }

  document.addEventListener("mousemove", (e) => {
    trail.forEach((dot, index) => {
      setTimeout(() => {
        dot.style.left = e.clientX + "px"
        dot.style.top = e.clientY + "px"
        dot.style.opacity = (trailLength - index) / trailLength
      }, index * 20)
    })
  })
}

// Page transition effects
function setupPageTransitions() {
  // Add page load animation
  document.body.style.opacity = "0"

  window.addEventListener("load", () => {
    document.body.style.transition = "opacity 0.5s ease-in-out"
    document.body.style.opacity = "1"
  })

  // Add page unload animation
  window.addEventListener("beforeunload", () => {
    document.body.style.opacity = "0"
  })
}

// Initialize all animations
function initializeAllAnimations() {
  setupSmoothScroll()
  setupMouseTrail()
  setupPageTransitions()
}

// Call initialization
document.addEventListener("DOMContentLoaded", initializeAllAnimations)

// Export functions for use in other files
window.animateFeatureCard = animateFeatureCard
window.animateProcessStep = animateProcessStep
