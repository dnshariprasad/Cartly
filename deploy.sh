#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting deployment process..."

# 1. Build the project
echo "📦 Building project..."
npm run build

# 2. Deploy to Firebase
echo "🔥 Deploying to Firebase..."
firebase deploy

# 3. Git Add
echo "📝 Adding changes to Git..."
git add .

# 4. Git Commit
echo "💾 Committing changes..."
git commit -m "Deployment $(date +'%Y-%m-%d %H:%M:%S')"

# 5. Git Push
echo "⬆️ Pushing to GitHub..."
git push

echo "✅ Deployment and Git push completed successfully!"
