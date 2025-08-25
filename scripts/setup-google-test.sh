#!/bin/bash

echo "🔧 Quick Google OAuth Test Setup"
echo ""

# Check if user wants to add test credentials
read -p "Хочете додати тестові Google OAuth credentials? (y/n): " answer

if [[ $answer == "y" || $answer == "Y" ]]; then
    echo ""
    echo "📝 Введіть Google OAuth credentials:"
    
    read -p "GOOGLE_CLIENT_ID: " client_id
    read -s -p "GOOGLE_CLIENT_SECRET: " client_secret
    echo ""
    
    if [[ ! -z "$client_id" && ! -z "$client_secret" ]]; then
        # Update .env file
        sed -i.bak "s/GOOGLE_CLIENT_ID=\"\"/GOOGLE_CLIENT_ID=\"$client_id\"/" .env
        sed -i.bak "s/GOOGLE_CLIENT_SECRET=\"\"/GOOGLE_CLIENT_SECRET=\"$client_secret\"/" .env
        
        echo ""
        echo "✅ Google OAuth credentials додано до .env"
        echo "🔄 Перезапуск сервера..."
        
        # Kill and restart dev server
        pkill -f "next-server" 2>/dev/null
        sleep 2
        npm run dev > /dev/null 2>&1 &
        
        echo "⏳ Очікування запуску сервера..."
        sleep 5
        
        echo "🎉 Готово! Тепер можете тестувати Google OAuth на:"
        echo "   http://localhost:3205/test-google"
        echo "   http://localhost:3205/login"
        
    else
        echo "❌ Credentials не введені"
    fi
else
    echo ""
    echo "ℹ️  Для налаштування Google OAuth:"
    echo "1. Йдіть на https://console.cloud.google.com/"
    echo "2. Створіть новий проект або оберіть існуючий"
    echo "3. Увімкніть Google+ API"
    echo "4. Створіть OAuth Client ID (Web application)"
    echo "5. Додайте redirect URI: http://localhost:3205/api/auth/callback/google"
    echo "6. Запустіть цей скрипт знову з credentials"
fi