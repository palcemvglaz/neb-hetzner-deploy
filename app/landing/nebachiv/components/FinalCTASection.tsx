'use client';

import { Button } from '@/components/ui/button';
import WaitlistForm from './WaitlistForm';
import statistics from '../assets/social-proof/statistics.json';

interface FinalCTASectionProps {
  version: 'ukrainian' | 'hormozi';
}

export default function FinalCTASection({ version }: FinalCTASectionProps) {
  const stats = statistics.statistics;

  return (
    <section className={`py-20 px-4 ${
      version === 'hormozi' ? 'bg-black' : 'bg-gray-900'
    }`}>
      <div className="max-w-4xl mx-auto text-center">
        
        {/* Final urgent message */}
        {version === 'hormozi' ? (
          <div className="bg-nebachiv-orange/20 border-2 border-nebachiv-orange p-8 rounded-lg mb-12">
            <h2 className="text-4xl md:text-6xl font-bold text-nebachiv-orange mb-6">
              ОСТАННІЙ ШАНС
            </h2>
            <p className="text-2xl text-white mb-6">
              Поки ти читаєш цей текст - десь в Україні мотоцикліст потрапляє в аварію.
            </p>
            <p className="text-xl text-nebachiv-orange-light mb-8">
              ФАКТ: Кожні 6 годин хтось ПОМИРАЄ. Кожні 2 години хтось стає ІНВАЛІДОМ.
              Це НЕ статистика. Це ТВОЄ майбутнє. Якщо ти НЕ з Небачівим.
            </p>
            
            {/* Countdown urgency */}
            <div className="bg-black p-6 rounded-lg mb-8">
              <p className="text-nebachiv-orange font-bold text-lg mb-2">
                ⚠️ ЗНИЖКА -80% ЗАКІНЧУЄТЬСЯ:
              </p>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-white">00</div>
                  <div className="text-sm text-gray-400">ДНІВ</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">04</div>
                  <div className="text-sm text-gray-400">ГОДИН</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">23</div>
                  <div className="text-sm text-gray-400">ХВИЛИН</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">12</div>
                  <div className="text-sm text-gray-400">СЕКУНД</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Від мотошколи до майстерного виживання
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Мотошкола дала основи керування. Nebachiv дасть розуміння як тебе намагатимуться збити і як цього уникнути.
            </p>
          </div>
        )}

        {/* Social proof numbers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center">
            <div className={`text-3xl font-bold ${
              version === 'hormozi' ? 'text-nebachiv-orange' : 'text-nebachiv-blue'
            }`}>
              {stats.audience.youtube_subscribers}+
            </div>
            <div className="text-gray-400">Учнів</div>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${
              version === 'hormozi' ? 'text-nebachiv-orange' : 'text-nebachiv-blue'
            }`}>
              {stats.impact.lives_saved.documented}+
            </div>
            <div className="text-gray-400">Врятованих</div>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${
              version === 'hormozi' ? 'text-nebachiv-orange' : 'text-nebachiv-blue'
            }`}>
              {stats.impact.accidents_analyzed.toLocaleString()}+
            </div>
            <div className="text-gray-400">Аварій проаналізовано</div>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${
              version === 'hormozi' ? 'text-nebachiv-orange' : 'text-nebachiv-blue'
            }`}>
              {stats.impact.years_experience}
            </div>
            <div className="text-gray-400">Років без аварій</div>
          </div>
        </div>

        {/* Final form */}
        <div className={`p-8 rounded-lg max-w-md mx-auto ${
          version === 'hormozi'
            ? 'bg-gray-900 border-2 border-nebachiv-orange'
            : 'bg-gray-800'
        }`}>
          <h3 className={`text-2xl font-bold text-white mb-6 ${
            version === 'hormozi' ? 'text-nebachiv-orange' : ''
          }`}>
            {version === 'hormozi'
              ? 'ПОЧАТИ НАВЧАННЯ:'
              : 'Почати навчання сьогодні:'
            }
          </h3>
          
          <WaitlistForm 
            version={version} 
            onSuccess={() => {
              // Track conversion
              if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('event', 'conversion', {
                  'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL',
                  'value': version === 'hormozi' ? 9997 : 0,
                  'currency': 'UAH'
                });
              }
            }}
          />
        </div>

        {/* Final message */}
        <div className="mt-12">
          {version === 'hormozi' ? (
            <div className="space-y-4">
              <p className="text-nebachiv-orange-light font-bold text-lg">
                💀 ВИБІР ПРОСТИЙ: ₴9,997 ЗА ЖИТТЯ АБО ₴50,000 ЗА ПОХОРОН
              </p>
              <p className="text-white font-bold text-xl">
                ПРИЄДНУЙСЯ АБО РИЗИКУЙ.
              </p>
              <p className="text-gray-400 text-sm">
                P.S. Твоя мама читатиме цей текст або твій некролог. ТВІЙ ВИБІР.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-nebachiv-blue font-bold text-lg">
                "Твій інструктор порекомендує Nebachiv - наступний логічний крок після отримання прав."
              </p>
              <p className="text-white font-bold">
                - Рекомендовано топовими мотошколами України
              </p>
            </div>
          )}
        </div>

        {/* Contact info */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-400">
            <div>
              <p className="font-bold text-white mb-2">Для інвесторів:</p>
              <p>chyngyz@nebachiv.com</p>
            </div>
            <div>
              <p className="font-bold text-white mb-2">Для партнерів:</p>
              <p>partners@nebachiv.com</p>
            </div>
            <div>
              <p className="font-bold text-white mb-2">Гаряча лінія:</p>
              <p>0-800-NEBACHIV</p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              © 2024 Nebachiv. #NebachivArmy #СистемаВиживання #НевбивніМотоциклісти
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}