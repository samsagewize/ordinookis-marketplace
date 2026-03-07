#!/bin/bash

# NookiMarket — Developer Setup Script 🦝
# Run this once after cloning: bash setup.sh

echo ""
echo "🦝 NookiMarket Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check Node version
NODE_VERSION=$(node --version 2>/dev/null | sed 's/v//' | cut -d. -f1)
if [ -z "$NODE_VERSION" ]; then
  echo "❌ Node.js not found. Install it from https://nodejs.org (v18 or higher)"
  exit 1
fi

if [ "$NODE_VERSION" -lt 18 ]; then
  echo "❌ Node.js v$NODE_VERSION found but v18+ is required."
  echo "   Download: https://nodejs.org"
  exit 1
fi

echo "✅ Node.js v$(node --version) detected"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
  echo "❌ npm install failed. Try deleting node_modules and running again."
  exit 1
fi

echo ""
echo "✅ Dependencies installed"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Setup complete! Run the dev server:"
echo ""
echo "   npm run dev"
echo ""
echo "   Then open: http://localhost:3000"
echo ""
echo "📖 Read CONTRIBUTING.md for the git workflow."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
