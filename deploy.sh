#!/bin/bash

# Polina.chat Deployment Script

echo "🚀 Building Polina.chat for production..."

# Build the application
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Production files are in the 'dist' directory"
    echo ""
    echo "🌐 To deploy:"
    echo "   • Vercel: Connect your repository for automatic deployments"
    echo "   • Netlify: Drag and drop the 'dist' folder"
    echo "   • GitHub Pages: Use GitHub Actions"
    echo "   • Custom server: Serve the 'dist' folder"
    echo ""
    echo "📊 To test locally: npm run preview"
else
    echo "❌ Build failed!"
    exit 1
fi 