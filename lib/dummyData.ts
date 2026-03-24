export const Templates = [
  {
    id: 1,
    name: "order_status",
    category: "UTILITY",
    bodyText: "Hello {{1}}, your order {{2}} has been shipped.",
    footer: "Thank you for shopping with us!",
    headerType: "TEXT",
    headerText: "Order Update",
    buttons: [
      {
        type: "URL",
        text: "Track Order",
        value: "https://example.com/track"
      },
      {
        type: "PHONE_NUMBER",
        text: "Call Support",
        value: "+917904677821"
      }
    ]
  },
  {
    id: 2,
    name: "promo_offer_launch",
    category: "MARKETING",
    bodyText: "Hello {{1}}, we have exclusive offers on our AI-powered software solutions! 🎉 Transform your business with our innovative web and mobile applications.",
    footer: "Gramosoft — Innovate with AI",
    headerType: "TEXT",
    headerText: "Exciting Offer! 🚀",
    buttons: [
      {
        type: "URL",
        text: "View Offers",
        value: "https://example.com/offers"
      }
    ]
  },
  {
    id: 3,
    name: "project_progress_update",
    category: "UTILITY",
    bodyText: "Hi {{1}}, our team is diligently working on your software solution and we are on track to meet the deadline. We'll keep you posted!",
    footer: "Gramosoft Project Team",
    headerType: "TEXT",
    headerText: "Project Update",
    buttons: [
      {
        type: "PHONE_NUMBER",
        text: "Contact Manager",
        value: "+917904677821"
      }
    ]
  },
  {
    id: 4,
    name: "maintenance_alert_scheduled",
    category: "UTILITY",
    bodyText: "Dear Customer, our services will undergo scheduled maintenance on {{1}}. We apologize for any inconvenience caused.",
    footer: "We appreciate your patience.",
    headerType: "TEXT",
    headerText: "Maintenance Notice ⚙️",
    buttons: [
      {
        type: "URL",
        text: "Check Status",
        value: "https://example.com/status"
      }
    ]
  },
  {
    id: 5,
    name: "feedback_request_lead",
    category: "MARKETING",
    bodyText: "Hi {{1}}, thank you for your interest in Gramosoft! To better assist you, can you share your primary area of interest in software development? 🤔",
    footer: "We'd love to hear from you!",
    headerType: "TEXT",
    headerText: "We Value Your Feedback!",
    buttons: [
      {
        type: "QUICK_REPLY",
        text: "AI Solutions",
        value: "ai_solutions"
      },
      {
        type: "QUICK_REPLY",
        text: "Mobile Apps",
        value: "mobile_apps"
      }
    ]
  },
  {
    id: 6,
    name: "service_overview_info",
    category: "MARKETING",
    bodyText: "Hello {{1}}, Gramosoft offers a wide array of services — 💻 Web Development, 📱 Mobile Apps, 🔐 Cybersecurity, and AI Solutions. Let us help you grow!",
    footer: "Gramosoft — Your Tech Partner",
    headerType: "TEXT",
    headerText: "Explore Our Services!",
    buttons: [
      {
        type: "URL",
        text: "Learn More",
        value: "https://example.com/services"
      },
      {
        type: "PHONE_NUMBER",
        text: "Talk to Us",
        value: "+917904677821"
      }
    ]
  },
  {
    id: 7,
    name: "invoice_sent_confirm",
    category: "UTILITY",
    bodyText: "Hi {{1}}, your invoice for the services provided has been sent successfully. Please review it and reach out if you have any queries. 📄",
    footer: "Thank you for choosing Gramosoft!",
    headerType: "TEXT",
    headerText: "Invoice Sent ✅",
    buttons: [
      {
        type: "URL",
        text: "View Invoice",
        value: "https://example.com/invoice"
      },
      {
        type: "PHONE_NUMBER",
        text: "Call Support",
        value: "+917904677821"
      }
    ]
  },
  {
    id: 8,
    name: "feature_release_alert",
    category: "UTILITY",
    bodyText: "Dear {{1}}, we are excited to announce new enhancements to our software solutions! 🚀 Log in now to explore the latest features.",
    footer: "Stay ahead with Gramosoft.",
    headerType: "TEXT",
    headerText: "New Feature Release! 🎉",
    buttons: [
      {
        type: "URL",
        text: "Explore Now",
        value: "https://example.com/features"
      }
    ]
  }
];