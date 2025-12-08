/** @type {import('next').NextConfig} */
const nextConfig = {
  // --- إعدادات Next.js العامة ---
  reactStrictMode: true,
  typescript: {
    // تم الإبقاء على تجاهل أخطاء TypeScript التي أضفتها
    ignoreBuildErrors: true,
  },
  images: {
    // تم الإبقاء على unoptimized: true
    unoptimized: true, 
  },
  
  // --- الإعدادات الخاصة بـ Electron (Static Export) ---
  
  // 1. **الخطوة الأهم**: يخبر Next.js بتوليد ملفات ثابتة في مجلد 'out'
  output: 'export', 
  
  // 2. تم إزالة basePath و assetPrefix لأنها كانت تتعارض مع next/font
  //    'output: export' يكفي غالباً لتوليد مسارات نسبية
};

export default nextConfig;