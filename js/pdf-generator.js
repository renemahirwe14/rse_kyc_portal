// PDF Generation using jsPDF library
// Note: In production, include jsPDF library: <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

class PDFGenerator {
  constructor() {
    this.doc = null
    this.pageHeight = 297 // A4 height in mm
    this.pageWidth = 210 // A4 width in mm
    this.margin = 20
    this.currentY = this.margin
  }

  async generateKYCPDF(applicationData) {
    try {
      // Initialize jsPDF (mock for demo - in production use actual jsPDF)
      this.doc = this.createMockPDF()

      // Add header
      this.addHeader()

      // Add application details
      this.addApplicationDetails(applicationData)

      // Add personal information
      this.addPersonalInformation(applicationData.personalInfo)

      // Add identity information
      this.addIdentityInformation(applicationData.identity)

      // Add financial information
      this.addFinancialInformation(applicationData.financial)

      // Add footer
      this.addFooter()

      // Generate and return PDF blob
      return this.finalizePDF(applicationData.id)
    } catch (error) {
      console.error("PDF Generation Error:", error)
      throw new Error("Failed to generate PDF")
    }
  }

  createMockPDF() {
    // Mock PDF object for demonstration
    return {
      content: [],
      addText: (text, x, y, options = {}) => {
        this.doc.content.push({ type: "text", text, x, y, options })
      },
      addLine: (x1, y1, x2, y2) => {
        this.doc.content.push({ type: "line", x1, y1, x2, y2 })
      },
      addImage: (imageData, x, y, width, height) => {
        this.doc.content.push({ type: "image", imageData, x, y, width, height })
      },
    }
  }

  addHeader() {
    // Add RSE logo and header
    this.doc.addText("RSE KYC PORTAL", this.margin, this.currentY, {
      fontSize: 20,
      fontWeight: "bold",
    })

    this.currentY += 10
    this.doc.addText("Know Your Customer Application", this.margin, this.currentY, {
      fontSize: 14,
    })

    this.currentY += 15
    this.doc.addLine(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY)
    this.currentY += 10
  }

  addApplicationDetails(applicationData) {
    this.addSectionTitle("Application Details")

    const details = [
      ["Application ID:", applicationData.id],
      ["Submitted Date:", this.formatDate(applicationData.submittedDate)],
      ["Status:", applicationData.status.toUpperCase()],
      ["Selected Broker:", this.getBrokerName(applicationData.broker)],
    ]

    details.forEach(([label, value]) => {
      this.addLabelValue(label, value)
    })

    this.currentY += 10
  }

  addPersonalInformation(personalInfo) {
    this.addSectionTitle("Personal Information")

    const info = [
      ["Full Name:", `${personalInfo.firstName} ${personalInfo.lastName}`],
      ["Date of Birth:", this.formatDate(personalInfo.dateOfBirth)],
      ["Nationality:", personalInfo.nationality],
      ["Email Address:", personalInfo.email],
      ["Phone Number:", personalInfo.phone],
      ["Residential Address:", personalInfo.address],
    ]

    info.forEach(([label, value]) => {
      this.addLabelValue(label, value)
    })

    this.currentY += 10
  }

  addIdentityInformation(identity) {
    this.addSectionTitle("Identity Verification")

    const info = [
      ["ID Type:", this.formatIdType(identity.idType)],
      ["ID Number:", identity.idNumber],
      ["Issue Date:", this.formatDate(identity.issueDate)],
      ["Expiry Date:", this.formatDate(identity.expiryDate)],
    ]

    info.forEach(([label, value]) => {
      this.addLabelValue(label, value)
    })

    this.currentY += 10
  }

  addFinancialInformation(financial) {
    this.addSectionTitle("Financial Information")

    const info = [
      ["Employment Status:", this.formatEmploymentStatus(financial.employmentStatus)],
      ["Employer:", financial.employer || "N/A"],
      ["Annual Income Range:", financial.annualIncome],
      ["Source of Funds:", this.formatSourceOfFunds(financial.sourceOfFunds)],
      ["Investment Experience:", this.formatExperience(financial.investmentExperience)],
      ["Risk Tolerance:", this.formatRiskTolerance(financial.riskTolerance)],
      ["Investment Goal:", this.formatInvestmentGoal(financial.investmentGoal)],
      ["Planned Investment:", this.formatCurrency(financial.plannedInvestment)],
    ]

    info.forEach(([label, value]) => {
      this.addLabelValue(label, value)
    })

    this.currentY += 10
  }

  addSectionTitle(title) {
    this.checkPageBreak(20)

    this.doc.addText(title, this.margin, this.currentY, {
      fontSize: 16,
      fontWeight: "bold",
    })

    this.currentY += 8
    this.doc.addLine(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY)
    this.currentY += 8
  }

  addLabelValue(label, value) {
    this.checkPageBreak(8)

    this.doc.addText(label, this.margin, this.currentY, {
      fontSize: 10,
      fontWeight: "bold",
    })

    this.doc.addText(value || "N/A", this.margin + 60, this.currentY, {
      fontSize: 10,
    })

    this.currentY += 6
  }

  addFooter() {
    const footerY = this.pageHeight - 20

    this.doc.addLine(this.margin, footerY - 5, this.pageWidth - this.margin, footerY - 5)

    this.doc.addText("This document is generated automatically by RSE KYC Portal", this.margin, footerY, {
      fontSize: 8,
    })

    this.doc.addText(`Generated on: ${new Date().toLocaleString()}`, this.margin, footerY + 5, { fontSize: 8 })

    this.doc.addText("Page 1 of 1", this.pageWidth - this.margin - 20, footerY, { fontSize: 8 })
  }

  checkPageBreak(requiredSpace) {
    if (this.currentY + requiredSpace > this.pageHeight - 40) {
      // In a real implementation, this would add a new page
      this.currentY = this.margin
    }
  }

  finalizePDF(applicationId) {
    // In production, this would use jsPDF's save method
    const pdfData = {
      content: this.doc.content,
      filename: `KYC_Application_${applicationId}.pdf`,
      generatedAt: new Date().toISOString(),
    }

    // Simulate PDF blob creation
    const pdfBlob = new Blob([JSON.stringify(pdfData, null, 2)], {
      type: "application/json", // In production: 'application/pdf'
    })

    return pdfBlob
  }

  // Utility methods
  formatDate(dateString) {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  formatCurrency(amount) {
    if (!amount) return "N/A"
    return new Intl.NumberFormat("en-RW", {
      style: "currency",
      currency: "RWF",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  formatIdType(idType) {
    const types = {
      national_id: "National ID",
      passport: "Passport",
      driving_license: "Driving License",
    }
    return types[idType] || idType
  }

  formatEmploymentStatus(status) {
    const statuses = {
      employed: "Employed",
      self_employed: "Self Employed",
      unemployed: "Unemployed",
      retired: "Retired",
      student: "Student",
    }
    return statuses[status] || status
  }

  formatSourceOfFunds(source) {
    const sources = {
      salary: "Salary/Employment",
      business: "Business Income",
      investments: "Investment Returns",
      inheritance: "Inheritance",
      savings: "Personal Savings",
      other: "Other",
    }
    return sources[source] || source
  }

  formatExperience(experience) {
    const levels = {
      beginner: "Beginner (0-1 years)",
      intermediate: "Intermediate (1-5 years)",
      experienced: "Experienced (5+ years)",
    }
    return levels[experience] || experience
  }

  formatRiskTolerance(risk) {
    const levels = {
      conservative: "Conservative",
      moderate: "Moderate",
      aggressive: "Aggressive",
    }
    return levels[risk] || risk
  }

  formatInvestmentGoal(goal) {
    const goals = {
      wealth_building: "Wealth Building",
      retirement: "Retirement Planning",
      education: "Education Funding",
      short_term: "Short-term Goals",
    }
    return goals[goal] || goal
  }

  getBrokerName(brokerId) {
    const brokers = JSON.parse(localStorage.getItem("brokers") || "[]")
    const broker = brokers.find((b) => b.id === brokerId)
    return broker ? broker.name : "Unknown Broker"
  }
}

// Export for use in other modules
window.PDFGenerator = PDFGenerator
