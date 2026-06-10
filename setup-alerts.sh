#!/bin/bash

# Quick Setup Script for ScoutAI Match Alerts
# This script helps you set up the alerts system quickly

set -e

echo "========================================="
echo "ScoutAI Match Alerts - Quick Setup"
echo "========================================="
echo ""

# Check if .env.local exists
if [ -f .env.local ]; then
    echo "✅ .env.local already exists"
else
    echo "📋 Creating .env.local from template..."
    cp .env.local.example .env.local
    echo "✅ .env.local created"
    echo "⚠️  Please edit .env.local and add your credentials:"
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - SUPABASE_SERVICE_ROLE_KEY"
    echo "   - RESEND_API_KEY"
fi

echo ""
echo "📦 Installing dependencies..."
npm install
npm remove @sendgrid/mail nodemailer 2>/dev/null || true

echo ""
echo "✅ Dependencies installed"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env.local with your credentials"
echo "2. Set up Supabase project:"
echo "   - Go to supabase.com"
echo "   - Create new project"
echo "   - Copy NEXT_PUBLIC_SUPABASE_URL and SERVICE_ROLE_KEY"
echo ""
echo "3. Create Resend account:"
echo "   - Go to resend.com"
echo "   - Create API key"
echo ""
echo "4. Run database migrations:"
echo "   - Go to Supabase SQL Editor"
echo "   - Copy content from supabase/migrations/001_create_alerts_schema.sql"
echo "   - Run the SQL"
echo ""
echo "5. Start dev server:"
echo "   npm run dev"
echo ""
echo "6. Test alerts:"
echo "   - Visit http://localhost:3000/notifications"
echo "   - Create an alert"
echo ""
echo "7. Set up cron job:"
echo "   - See ALERTS_SETUP.md for details"
echo ""
echo "✅ Setup complete!"
