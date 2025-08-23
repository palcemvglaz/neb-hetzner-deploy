'use client';

import valueProp from '../assets/copy/value-props.json';

interface SolutionSectionProps {
  version: 'ukrainian' | 'hormozi';
}

export default function SolutionSection({ version }: SolutionSectionProps) {
  const mechanisms = valueProp.unique_mechanisms[version === 'ukrainian' ? 'ukrainian' : 'hormozi'];
  const transformation = valueProp.core_transformation;

  return (
    <section className="py-20 px-4 bg-gray-800">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-5xl font-bold text-white mb-6`}>
            {version === 'hormozi'
              ? 'СИСТЕМА НЕВБИВНОСТІ НЕБАЧІВА'
              : 'Nebachiv: Наступний крок після мотошколи'
            }
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            {version === 'hormozi'
              ? 'Я перетворю тебе з ЖЕРТВИ дороги в ХИЖАКА, який ПОЛЮЄ на загрози замість того щоб стати їх жертвою'
              : 'Мотошкола навчила керувати мотоциклом. Nebachiv навчить як тебе намагатимуться збити і як цього уникнути'
            }
          </p>
        </div>

        {/* Transformation visual */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Before */}
          <div className={`p-8 rounded-lg ${
            version === 'hormozi' 
              ? 'bg-nebachiv-orange/20 border-2 border-nebachiv-orange' 
              : 'bg-gray-900'
          }`}>
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              {transformation.from.title}
            </h3>
            <ul className="space-y-3">
              {transformation.from.traits.map((trait, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="text-nebachiv-orange mt-1">❌</span>
                  <span className="text-gray-300">{trait}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* After */}
          <div className={`p-8 rounded-lg ${
            version === 'hormozi'
              ? 'bg-green-900 border-2 border-nebachiv-blue/200'
              : 'bg-gray-900 border border-nebachiv-blue/200'
          }`}>
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              {transformation.to.title}
            </h3>
            <ul className="space-y-3">
              {transformation.to.traits.map((trait, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="text-nebachiv-blue/200 mt-1">✅</span>
                  <span className="text-gray-300">{trait}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Unique mechanisms */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mechanisms.map((mechanism, index) => (
            <div 
              key={index}
              className={`p-6 rounded-lg text-center ${
                version === 'hormozi'
                  ? 'bg-gray-900 border border-nebachiv-orange'
                  : 'bg-gray-900'
              }`}
            >
              <div className="text-4xl mb-4">
                {getIconEmoji(mechanism.icon)}
              </div>
              <h4 className={`text-lg font-bold text-white mb-3 ${
                version === 'hormozi' ? 'text-nebachiv-orange' : ''
              }`}>
                {mechanism.title}
              </h4>
              <p className="text-gray-300 text-sm">
                {mechanism.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function getIconEmoji(icon: string): string {
  switch (icon) {
    case 'database': return '🗄️';
    case 'shield': return '🛡️';
    case 'map': return '🗺️';
    case 'users': return '👥';
    case 'eye': return '👁️';
    case 'skull': return '💀';
    case 'target': return '🎯';
    case 'guarantee': return '✅';
    default: return '⚡';
  }
}