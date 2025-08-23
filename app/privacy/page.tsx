export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-8">Політика конфіденційності</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-lg mb-6">
              Дата останнього оновлення: 1 березня 2024
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">1. Загальна інформація</h2>
              <p>
                Ця Політика конфіденційності пояснює, як Nebachiv збирає, використовує та захищає 
                вашу особисту інформацію. Ми серйозно ставимося до захисту ваших даних.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">2. Інформація, яку ми збираємо</h2>
              <h3 className="text-xl font-semibold mb-3">2.1. Інформація, яку ви надаєте:</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Ім'я та прізвище</li>
                <li>Email адреса</li>
                <li>Номер телефону (за бажанням)</li>
                <li>Дата народження</li>
                <li>Платіжна інформація (обробляється Stripe)</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3">2.2. Інформація, яку ми збираємо автоматично:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>IP-адреса</li>
                <li>Тип браузера та пристрою</li>
                <li>Дані про використання платформи</li>
                <li>Прогрес навчання та результати тестів</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">3. Використання інформації</h2>
              <p>Ми використовуємо вашу інформацію для:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Надання доступу до навчальних матеріалів</li>
                <li>Персоналізації навчального досвіду</li>
                <li>Обробки платежів та управління підпискою</li>
                <li>Відправки важливих повідомлень про платформу</li>
                <li>Покращення якості наших послуг</li>
                <li>Забезпечення безпеки платформи</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">4. Захист даних</h2>
              <p>Ми вживаємо наступних заходів для захисту ваших даних:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>SSL-шифрування для всіх передач даних</li>
                <li>Захищені сервери з обмеженим доступом</li>
                <li>Регулярні оновлення безпеки</li>
                <li>Двофакторна автентифікація (за бажанням)</li>
                <li>Платіжні дані обробляються через сертифіковані платіжні системи</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">5. Cookies та аналітика</h2>
              <p>
                Ми використовуємо cookies для покращення вашого досвіду на платформі. 
                Ви можете керувати налаштуваннями cookies у вашому браузері.
              </p>
              <p className="mt-3">
                Для аналітики ми використовуємо Google Analytics з анонімізацією IP-адрес.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">6. Передача даних третім особам</h2>
              <p>Ми НЕ продаємо та НЕ передаємо ваші персональні дані третім особам, окрім:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Платіжних систем для обробки транзакцій</li>
                <li>Випадків, передбачених законодавством</li>
                <li>З вашої явної згоди</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">7. Ваші права</h2>
              <p>Ви маєте право:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Отримати доступ до ваших персональних даних</li>
                <li>Виправити неточну інформацію</li>
                <li>Видалити ваш акаунт та дані</li>
                <li>Відмовитися від маркетингових комунікацій</li>
                <li>Експортувати ваші дані</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">8. Зберігання даних</h2>
              <p>
                Ми зберігаємо ваші дані протягом активності вашого акаунту та 3 роки після його видалення 
                для дотримання законодавчих вимог. Навчальний прогрес може зберігатися в анонімізованому 
                вигляді для статистичних цілей.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">9. Діти</h2>
              <p>
                Платформа не призначена для осіб молодше 16 років. Ми не збираємо свідомо 
                інформацію від дітей молодше цього віку.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">10. Зміни політики</h2>
              <p>
                Ми можемо оновлювати цю політику. Про суттєві зміни ми повідомимо через email 
                та на платформі за 30 днів до набрання чинності.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">11. Контакти</h2>
              <p>З питань конфіденційності звертайтесь:</p>
              <ul className="list-none space-y-1">
                <li>Email: privacy@nebachiv.com</li>
                <li>Відповідальний за захист даних: dpo@nebachiv.com</li>
                <li>Телефон: +38 (050) 123-45-67</li>
              </ul>
            </section>

            <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-center text-blue-800">
                Використовуючи платформу Nebachiv, ви погоджуєтесь з цією Політикою конфіденційності
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}