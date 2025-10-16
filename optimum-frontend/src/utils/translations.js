// Translation system for Optimum Smart System
export const translations = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    newOrder: "New Order",
    orders: "Orders",
    suppliers: "Suppliers",
    accounting: "Accounting",
    aiInsights: "AI Insights",
    
    // Dashboard
    totalOrders: "Total Orders",
    totalItems: "Total Items",
    pendingOrders: "Pending Orders",
    upcomingDeliveries: "Upcoming Deliveries",
    orderStatusDistribution: "Order Status Distribution",
    recentOrders: "Recent Orders",
    upcomingDeliveriesList: "Upcoming Deliveries",
    
    // Order Status
    pending: "Pending",
    inPreparation: "In Preparation",
    delivered: "Delivered",
    ready: "Ready",
    
    // AI Dashboard
    aiPoweredInsights: "AI-Powered Insights",
    intelligentAnalysis: "Intelligent analysis and recommendations for your business",
    smartOrderAnalysis: "Smart Order Analysis",
    enterOrderText: "Enter order text to analyze (e.g., 'I need 2 laptops urgently for next week')",
    analyzeWithAI: "Analyze with AI",
    businessIntelligence: "Business Intelligence",
    keyInsights: "Key Insights",
    recommendations: "Recommendations",
    demandPredictions: "Demand Predictions",
    topProducts: "Top Products",
    demandTrend: "Demand Trend",
    customerSentiment: "Customer Sentiment",
    aiPerformance: "AI Performance",
    totalAnalyses: "Total Analyses",
    sentimentAnalyses: "Sentiment Analyses",
    demandPredictionsCount: "Demand Predictions",
    
    // File Upload
    smartFileAnalysis: "Smart File Analysis",
    uploadImagesDocuments: "Upload images or documents for AI analysis",
    dragDropFiles: "Drag & drop files here, or click to select",
    supportedFormats: "Supported: JPG, PNG, PDF, TXT, DOC",
    maxSize: "Max size: 10MB",
    analyzing: "Analyzing...",
    analysisComplete: "Analysis complete",
    productType: "Product Type",
    quantity: "Quantity",
    urgency: "Urgency",
    sentiment: "Sentiment",
    confidence: "Confidence",
    imageAnalysis: "Image Analysis",
    extractedText: "Extracted Text",
    
    // Common
    high: "High",
    medium: "Medium",
    low: "Low",
    positive: "Positive",
    neutral: "Neutral",
    negative: "Negative",
    orders: "orders",
    loading: "Loading...",
    error: "Error",
    success: "Success"
  },
  
  ar: {
    // Navigation
    dashboard: "لوحة التحكم",
    newOrder: "طلب جديد",
    orders: "الطلبات",
    suppliers: "الموردون",
    accounting: "المحاسبة",
    aiInsights: "رؤى الذكاء الاصطناعي",
    
    // Dashboard
    totalOrders: "إجمالي الطلبات",
    totalItems: "إجمالي العناصر",
    pendingOrders: "الطلبات المعلقة",
    upcomingDeliveries: "التسليمات القادمة",
    orderStatusDistribution: "توزيع حالة الطلبات",
    recentOrders: "الطلبات الأخيرة",
    upcomingDeliveriesList: "التسليمات القادمة",
    
    // Order Status
    pending: "معلق",
    inPreparation: "قيد التحضير",
    delivered: "تم التسليم",
    ready: "جاهز",
    
    // AI Dashboard
    aiPoweredInsights: "رؤى مدعومة بالذكاء الاصطناعي",
    intelligentAnalysis: "تحليل ذكي وتوصيات لعملك",
    smartOrderAnalysis: "تحليل الطلبات الذكي",
    enterOrderText: "أدخل نص الطلب للتحليل (مثال: 'أحتاج 2 لابتوب عاجل للأسبوع القادم')",
    analyzeWithAI: "تحليل بالذكاء الاصطناعي",
    businessIntelligence: "ذكاء الأعمال",
    keyInsights: "رؤى رئيسية",
    recommendations: "التوصيات",
    demandPredictions: "توقعات الطلب",
    topProducts: "أفضل المنتجات",
    demandTrend: "اتجاه الطلب",
    customerSentiment: "مشاعر العملاء",
    aiPerformance: "أداء الذكاء الاصطناعي",
    totalAnalyses: "إجمالي التحليلات",
    sentimentAnalyses: "تحليلات المشاعر",
    demandPredictionsCount: "توقعات الطلب",
    
    // File Upload
    smartFileAnalysis: "تحليل الملفات الذكي",
    uploadImagesDocuments: "ارفع الصور أو المستندات للتحليل بالذكاء الاصطناعي",
    dragDropFiles: "اسحب الملفات هنا، أو انقر للاختيار",
    supportedFormats: "المدعومة: JPG, PNG, PDF, TXT, DOC",
    maxSize: "الحد الأقصى: 10 ميجابايت",
    analyzing: "جاري التحليل...",
    analysisComplete: "اكتمل التحليل",
    productType: "نوع المنتج",
    quantity: "الكمية",
    urgency: "الاستعجال",
    sentiment: "المشاعر",
    confidence: "الثقة",
    imageAnalysis: "تحليل الصورة",
    extractedText: "النص المستخرج",
    
    // Common
    high: "عالي",
    medium: "متوسط",
    low: "منخفض",
    positive: "إيجابي",
    neutral: "محايد",
    negative: "سلبي",
    orders: "طلبات",
    loading: "جاري التحميل...",
    error: "خطأ",
    success: "نجح"
  }
};

export const getTranslation = (key, language = 'en') => {
  return translations[language]?.[key] || translations.en[key] || key;
};

export const setLanguage = (language) => {
  localStorage.setItem('optimum_language', language);
  document.documentElement.lang = language;
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
};

export const getCurrentLanguage = () => {
  return localStorage.getItem('optimum_language') || 'en';
};

export const initializeLanguage = () => {
  const savedLanguage = getCurrentLanguage();
  setLanguage(savedLanguage);
  return savedLanguage;
};



