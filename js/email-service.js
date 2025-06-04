// Email Service for sending notifications
class EmailService {
  constructor() {
    this.templates = {}
    this.loadTemplates()
  }

  async loadTemplates() {
    // In production, these would be loaded from a server or template files
    this.templates = {
      welcome: this.getWelcomeTemplate(),
      submitted: this.getSubmittedTemplate(),
      approved: this.getApprovedTemplate(),
      rejected: this.getRejectedTemplate(),
    }
  }

  async sendWelcomeEmail(userData) {
    const emailData = {
      to: userData.email,
      subject: "Welcome to RSE KYC Portal",
      template: "welcome",
      variables: {
        userName: userData.name,
        dashboardUrl: `${window.location.origin}/dashboard.html`,
      },
    }

    return this.sendEmail(emailData)
  }

  async sendApplicationSubmittedEmail(applicationData) {
    const emailData = {
      to: applicationData.email,
      subject: "KYC Application Submitted Successfully",
      template: "submitted",
      variables: {
        userName: applicationData.name,
        applicationId: applicationData.id,
        submittedDate: this.formatDate(applicationData.submittedDate),
        brokerName: this.getBrokerName(applicationData.broker),
        statusUrl: `${window.location.origin}/dashboard.html#status`,
      },
    }

    return this.sendEmail(emailData)
  }

  async sendApplicationApprovedEmail(applicationData) {
    const emailData = {
      to: applicationData.email,
      subject: "🎉 Your KYC Application has been Approved!",
      template: "approved",
      variables: {
        userName: applicationData.name,
        applicationId: applicationData.id,
        approvedDate: this.formatDate(new Date().toISOString()),
        brokerName: this.getBrokerName(applicationData.broker),
        brokerContactUrl: `${window.location.origin}/dashboard.html#broker-contact`,
      },
    }

    return this.sendEmail(emailData)
  }

  async sendApplicationRejectedEmail(applicationData) {
    const emailData = {
      to: applicationData.email,
      subject: "KYC Application - Additional Information Required",
      template: "rejected",
      variables: {
        userName: applicationData.name,
        applicationId: applicationData.id,
        updateUrl: `${window.location.origin}/dashboard.html#update-application`,
      },
    }

    return this.sendEmail(emailData)
  }

  async sendEmail(emailData) {
    try {
      // Simulate email sending process
      console.log("Sending email:", emailData)

      // In production, this would integrate with an email service like:
      // - SendGrid
      // - Mailgun
      // - AWS SES
      // - SMTP server

      const emailContent = this.generateEmailContent(emailData)

      // Simulate API call delay
      await this.delay(1000)

      // Store email in localStorage for demo purposes
      this.storeEmailLog(emailData, emailContent)

      // Show notification
      if (window.showNotification) {
        window.showNotification(`Email sent to ${emailData.to}`, "success")
      }

      return {
        success: true,
        messageId: this.generateMessageId(),
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      console.error("Email sending failed:", error)

      if (window.showNotification) {
        window.showNotification("Failed to send email notification", "error")
      }

      return {
        success: false,
        error: error.message,
      }
    }
  }

  generateEmailContent(emailData) {
    let template = this.templates[emailData.template]

    if (!template) {
      throw new Error(`Template '${emailData.template}' not found`)
    }

    // Replace variables in template
    Object.keys(emailData.variables).forEach((key) => {
      const placeholder = `{{${key}}}`
      template = template.replace(new RegExp(placeholder, "g"), emailData.variables[key])
    })

    return template
  }

  storeEmailLog(emailData, content) {
    const emailLogs = JSON.parse(localStorage.getItem("emailLogs") || "[]")

    const logEntry = {
      id: this.generateMessageId(),
      to: emailData.to,
      subject: emailData.subject,
      template: emailData.template,
      content: content,
      timestamp: new Date().toISOString(),
      status: "sent",
    }

    emailLogs.push(logEntry)

    // Keep only last 100 emails
    if (emailLogs.length > 100) {
      emailLogs.splice(0, emailLogs.length - 100)
    }

    localStorage.setItem("emailLogs", JSON.stringify(emailLogs))
  }

  // Template methods
  getWelcomeTemplate() {
    return `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
                <div style="background: linear-gradient(135deg, #2563eb, #3b82f6); color: white; padding: 2rem; text-align: center;">
                    <h1>Welcome to RSE KYC Portal</h1>
                    <p>Your journey to secure investing starts here</p>
                </div>
                <div style="padding: 2rem; line-height: 1.6;">
                    <h2>Hello {{userName}},</h2>
                    <p>Thank you for registering with RSE KYC Portal. We're excited to help you begin your investment journey with confidence and security.</p>
                    
                    <p><strong>Next Steps:</strong></p>
                    <ol>
                        <li>Complete your KYC (Know Your Customer) information</li>
                        <li>Upload required identity documents</li>
                        <li>Select your preferred broker</li>
                        <li>Start investing!</li>
                    </ol>
                    
                    <div style="text-align: center; margin: 2rem 0;">
                        <a href="{{dashboardUrl}}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Complete Your KYC</a>
                    </div>
                    
                    <p>If you have any questions, our support team is here to help.</p>
                    <p>Best regards,<br>The RSE Team</p>
                </div>
                <div style="background: #f8fafc; padding: 1rem 2rem; text-align: center; font-size: 0.875rem; color: #64748b;">
                    <p>&copy; 2024 RSE KYC Portal. All rights reserved.</p>
                </div>
            </div>
        `
  }

  getSubmittedTemplate() {
    return `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
                <div style="background: linear-gradient(135deg, #2563eb, #3b82f6); color: white; padding: 2rem; text-align: center;">
                    <h1>KYC Application Submitted</h1>
                    <p>We've received your application</p>
                </div>
                <div style="padding: 2rem; line-height: 1.6;">
                    <h2>Hello {{userName}},</h2>
                    <p>Your KYC application has been successfully submitted and is now under review.</p>
                    
                    <div style="background: #f8fafc; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
                        <p><strong>Application Details:</strong></p>
                        <ul style="margin: 0;">
                            <li>Application ID: {{applicationId}}</li>
                            <li>Submitted Date: {{submittedDate}}</li>
                            <li>Selected Broker: {{brokerName}}</li>
                            <li>Status: <span style="color: #ca8a04; font-weight: bold;">Under Review</span></li>
                        </ul>
                    </div>
                    
                    <p>Our team will review your application within 2-3 business days. You'll receive an email notification once the review is complete.</p>
                    
                    <div style="text-align: center; margin: 2rem 0;">
                        <a href="{{statusUrl}}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Check Application Status</a>
                    </div>
                    
                    <p>Thank you for choosing RSE KYC Portal.</p>
                    <p>Best regards,<br>The RSE Team</p>
                </div>
            </div>
        `
  }

  getApprovedTemplate() {
    return `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
                <div style="background: linear-gradient(135deg, #16a34a, #22c55e); color: white; padding: 2rem; text-align: center;">
                    <h1>🎉 Application Approved!</h1>
                    <p>Welcome to the RSE investment community</p>
                </div>
                <div style="padding: 2rem; line-height: 1.6;">
                    <h2>Congratulations {{userName}}!</h2>
                    <p>Your KYC application has been <span style="color: #16a34a; font-weight: bold;">APPROVED</span>. You can now start investing through your selected broker.</p>
                    
                    <div style="background: #d1fae5; padding: 1rem; border-radius: 6px; margin: 1rem 0; border-left: 4px solid #16a34a;">
                        <p><strong>Application Details:</strong></p>
                        <ul style="margin: 0;">
                            <li>Application ID: {{applicationId}}</li>
                            <li>Approved Date: {{approvedDate}}</li>
                            <li>Broker: {{brokerName}}</li>
                            <li>Status: <span style="color: #16a34a; font-weight: bold;">Approved</span></li>
                        </ul>
                    </div>
                    
                    <p><strong>What's Next?</strong></p>
                    <ol>
                        <li>Your broker will contact you within 24 hours</li>
                        <li>Complete any additional broker-specific requirements</li>
                        <li>Fund your investment account</li>
                        <li>Start building your portfolio!</li>
                    </ol>
                    
                    <div style="text-align: center; margin: 2rem 0;">
                        <a href="{{brokerContactUrl}}" style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Contact Your Broker</a>
                    </div>
                    
                    <p>Welcome to your investment journey!</p>
                    <p>Best regards,<br>The RSE Team</p>
                </div>
            </div>
        `
  }

  getRejectedTemplate() {
    return `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
                <div style="background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 2rem; text-align: center;">
                    <h1>Application Update Required</h1>
                    <p>Additional information needed</p>
                </div>
                <div style="padding: 2rem; line-height: 1.6;">
                    <h2>Hello {{userName}},</h2>
                    <p>Thank you for submitting your KYC application. After careful review, we need some additional information to complete your application.</p>
                    
                    <div style="background: #fee2e2; padding: 1rem; border-radius: 6px; margin: 1rem 0; border-left: 4px solid #dc2626;">
                        <p><strong>Application Status:</strong> <span style="color: #dc2626; font-weight: bold;">Additional Information Required</span></p>
                        <p><strong>Application ID:</strong> {{applicationId}}</p>
                    </div>
                    
                    <p><strong>Required Actions:</strong></p>
                    <ul>
                        <li>Please review and update your submitted information</li>
                        <li>Ensure all documents are clear and legible</li>
                        <li>Verify that all required fields are completed</li>
                        <li>Contact our support team if you need assistance</li>
                    </ul>
                    
                    <div style="text-align: center; margin: 2rem 0;">
                        <a href="{{updateUrl}}" style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Update Application</a>
                    </div>
                    
                    <p>Our support team is available to help you complete your application successfully.</p>
                    <p>Best regards,<br>The RSE Team</p>
                </div>
                <div style="background: #f8fafc; padding: 1rem 2rem; text-align: center; font-size: 0.875rem; color: #64748b;">
                    <p>Support: support@rse-kyc.com | Phone: +250 788 123 456</p>
                </div>
            </div>
        `
  }

  // Utility methods
  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  getBrokerName(brokerId) {
    const brokers = JSON.parse(localStorage.getItem("brokers") || "[]")
    const broker = brokers.find((b) => b.id === brokerId)
    return broker ? broker.name : "Unknown Broker"
  }

  generateMessageId() {
    return "msg_" + Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

// Export for use in other modules
window.EmailService = EmailService
