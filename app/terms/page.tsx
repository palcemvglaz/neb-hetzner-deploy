export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-8">Умови використання</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-lg mb-6">
              Дата останнього оновлення: 1 березня 2024
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">1. Загальні положення</h2>
              <p>
                Ці Умови використання регулюють використання освітньої платформи Nebachiv 
                (далі - "Платформа"). Використовуючи Платформу, ви погоджуєтесь з цими умовами.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">2. Використання Платформи</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Платформа призначена для навчання принципам безпечної їзди на мотоциклі</li>
                <li>Користувачі повинні бути старше 16 років</li>
                <li>Забороняється використовувати Платформу для незаконних цілей</li>
                <li>Контент Платформи захищений авторським правом</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">3. Реєстрація та акаунт</h2>
              <p>
                Для доступу до повного функціоналу необхідна реєстрація. Ви несете відповідальність за:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Надання достовірної інформації при реєстрації</li>
                <li>Збереження конфіденційності паролю</li>
                <li>Всі дії, здійснені під вашим акаунтом</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">4. Підписка та оплата</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Оплата здійснюється щомісячно або щорічно</li>
                <li>Підписка автоматично продовжується</li>
                <li>Скасування можливе в будь-який час</li>
                <li>Повернення коштів протягом 30 днів</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">5. Інтелектуальна власність</h2>
              <p>
                Весь контент Платформи, включаючи систему KB_NEB, є інтелектуальною власністю Nebachiv. 
                Забороняється копіювання, розповсюдження або модифікація без письмового дозволу.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">6. Відмова від відповідальності</h2>
              <p className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <strong>Важливо:</strong> Платформа надає освітні матеріали, але не гарантує 100% безпеку на дорозі. 
                Користувачі несуть повну відповідальність за свої дії під час керування транспортним засобом.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">7. Зміни умов</h2>
              <p>
                Ми залишаємо за собою право змінювати ці умови. Про зміни буде повідомлено через email 
                та на Платформі за 30 днів до набрання чинності.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">8. Контакти</h2>
              <p>
                З питань щодо цих Умов використання звертайтесь:
              </p>
              <ul className="list-none space-y-1">
                <li>Email: legal@nebachiv.com</li>
                <li>Телефон: +38 (050) 123-45-67</li>
                <li>Адреса: м. Київ, вул. Хрещатик, 1</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}