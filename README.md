# 🏦 RSE KYC Portal

A comprehensive Know Your Customer (KYC) web application for the Rwanda Stock Exchange (RSE) investment platform. This system allows users to complete their KYC process online and enables administrators to manage applications efficiently.

## 🌟 Features

### User Features
- ✅ **Secure Authentication** - Login/signup with validation
- ✅ **Multi-step KYC Form** - Personal, Identity, and Financial information
- ✅ **Document Upload** - Secure file upload for identity verification
- ✅ **Progress Tracking** - Real-time form completion tracking
- ✅ **Auto-save** - Automatic progress saving
- ✅ **Responsive Design** - Works on all devices
- ✅ **Email Notifications** - Status updates via email
- ✅ **PDF Generation** - Automatic PDF creation for submissions

### Admin Features
- ✅ **Dashboard Overview** - Statistics and analytics
- ✅ **Application Management** - Review, approve, or reject applications
- ✅ **User Management** - Manage registered users
- ✅ **Broker Management** - Manage broker information
- ✅ **Advanced Filtering** - Filter by status, broker, date, or name
- ✅ **Data Export** - Export data for reporting
- ✅ **Real-time Updates** - Live status updates

## 👥 Team Members

| Name | Role | Responsibilities |
|------|------|-----------------|
| **Team Member 1** | Authentication & Landing | Landing page, login/signup, user authentication |
| **Team Member 2** | KYC Forms (1-2) | Personal info form, identity verification form |
| **Team Member 3** | KYC Forms (3-4) | Financial info form, review page, PDF generation |
| **Team Member 4** | Admin Dashboard | Admin interface, application management |

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS Grid, Flexbox, Custom CSS Variables
- **Storage**: Local Storage (for demo purposes)
- **Icons**: Font Awesome
- **APIs**: Web APIs for file handling and validation

## 🚀 Quick Start

### Option 1: Direct Browser Access
1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/your-username/rse-kyc-portal.git
   cd rse-kyc-portal
   \`\`\`

2. Open `index.html` in your web browser

3. For admin access, open `admin.html`

### Option 2: Local Server
1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Start development server:
   \`\`\`bash
   npm run dev
   \`\`\`

3. Open http://localhost:3000

## 📁 Project Structure

\`\`\`
rse-kyc-portal/
├── index.html              # Landing page with auth
├── dashboard.html           # User dashboard and KYC form
├── admin.html              # Admin management interface
├── email-templates.html    # Email template previews
├── deployment-guide.html   # Deployment instructions
├── css/
│   ├── main.css            # Global styles and utilities
│   ├── auth.css            # Authentication page styles
│   ├── dashboard.css       # User dashboard styles
│   └── admin.css           # Admin dashboard styles
├── js/
│   ├── main.js             # Core application logic
│   ├── auth.js             # Authentication handling
│   ├── dashboard.js        # User dashboard functionality
│   ├── kyc-form.js         # KYC form validation and steps
│   ├── admin.js            # Admin dashboard functionality
│   ├── pdf-generator.js    # PDF generation utilities
│   ├── email-service.js    # Email notification service
│   └── security.js         # Security utilities
├── package.json            # Project configuration
└── README.md              # This file
\`\`\`

## 🎯 User Journey

### For Applicants:
1. **Register/Login** - Create account or sign in
2. **Complete KYC** - Fill out 4-step form:
   - Personal Information
   - Identity Verification
   - Financial Information
   - Review & Submit
3. **Upload Documents** - Provide identity verification files
4. **Select Broker** - Choose preferred investment broker
5. **Submit Application** - Complete the process
6. **Track Status** - Monitor application progress

### For Administrators:
1. **Dashboard Overview** - View statistics and metrics
2. **Review Applications** - Examine submitted KYC forms
3. **Make Decisions** - Approve or request additional information
4. **Manage Users** - Handle user accounts and data
5. **Generate Reports** - Export data and analytics

## 🔧 Configuration

### Email Service Setup
To enable email notifications in production:

1. Update `js/email-service.js` with your email provider
2. Configure SMTP settings or API keys
3. Update email templates in `email-templates.html`

### PDF Generation Setup
For production PDF generation:

1. Include jsPDF library:
   \`\`\`html
   <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
   \`\`\`

2. Update `js/pdf-generator.js` to use actual jsPDF methods

### Security Configuration
For production deployment:

1. Implement server-side authentication
2. Use secure database storage
3. Add HTTPS encryption
4. Implement proper file upload validation
5. Add rate limiting and CSRF protection

## 🌐 Deployment Options

### GitHub Pages (Recommended for Demo)
1. Push code to GitHub repository
2. Enable GitHub Pages in repository settings
3. Access at: `https://username.github.io/repository-name`

### Netlify
1. Connect GitHub repository to Netlify
2. Deploy with automatic builds
3. Custom domain support available

### Vercel
1. Import repository to Vercel
2. Automatic deployments on push
3. Serverless functions support

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Complete KYC form submission
- [ ] File upload functionality
- [ ] Admin dashboard operations
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility

### Test Accounts
- **User**: test@example.com / password123
- **Admin**: Access via admin.html directly

## 📊 Sample Data

The application includes sample data for demonstration:
- 2 sample users
- 2 sample applications (1 pending, 1 approved)
- 4 sample brokers
- Email logs and notifications

## 🔒 Security Notes

⚠️ **Important**: This is a demonstration application. For production use:

- Replace localStorage with secure database
- Implement server-side validation
- Add proper authentication and authorization
- Use HTTPS for all communications
- Implement proper file upload security
- Add audit logging and monitoring

## 🐛 Troubleshooting

### Common Issues

**Forms not submitting:**
- Check browser console for JavaScript errors
- Ensure all required fields are filled
- Verify file uploads are within size limits

**Styles not loading:**
- Check file paths in HTML files
- Clear browser cache
- Ensure CSS files are properly linked

**Admin dashboard empty:**
- Complete at least one KYC application first
- Check localStorage for sample data
- Refresh the page

## 📈 Future Enhancements

### Phase 2 Features
- [ ] Real-time notifications
- [ ] Document OCR integration
- [ ] Two-factor authentication
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Mobile app development

### Integration Opportunities
- [ ] Payment gateway integration
- [ ] Third-party identity verification
- [ ] CRM system integration
- [ ] Automated compliance checking
- [ ] Blockchain verification

## 📞 Support

For technical support or questions:
- Create an issue in the GitHub repository
- Contact the development team
- Refer to the deployment guide for common solutions

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Rwanda Stock Exchange for the inspiration
- BK Capital for the reference design
- Font Awesome for icons
- The development team for their contributions

---

**Built with ❤️ by the RSE Academic Interns May Intake**

Rene MAHIRWE - University of Rwanda
Nadine UWASE - University of Rwanda 
Belyse MAHORO - Mount Kigali University
Yvonne Kwizera - Mount Kigali University


