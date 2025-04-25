const withPWA = require("next-pwa")({
  dest: "public", // Output directory for service worker and related files
  register: true, // Automatically register the service worker
  skipWaiting: true, // Activate the service worker immediately after installation
});

module.exports = withPWA({
  allowedDevOrigins: ['192.168.1.5', 'your-production-url.com'], // Replace with your actual IP + port
  reactStrictMode: true,
  // Other Next.js configurations
});
