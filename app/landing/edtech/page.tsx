'use client';

import React from 'react';
import { useState } from 'react';
import Link from 'next/link';

// Import JSON data
import productStats from './assets/product-stats.json';
import competitiveAdvantages from './assets/competitive-advantages.json';
import tractionProof from './assets/traction-proof.json';

export default function EdTechLanding() {
  const [activeTab, setActiveTab] = useState('technical');

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-md z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-nebachiv-blue">🎓</div>
              <span className="text-xl font-bold text-gray-900">Nebachiv EdTech</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-nebachiv-blue transition-colors">Features</a>
              <a href="#tech" className="text-gray-600 hover:text-nebachiv-blue transition-colors">Technology</a>
              <a href="#traction" className="text-gray-600 hover:text-nebachiv-blue transition-colors">Traction</a>
              <a href="#investment" className="text-gray-600 hover:text-nebachiv-blue transition-colors">Investment</a>
            </div>
            <button className="bg-nebachiv-blue text-white px-6 py-2 rounded-lg hover:bg-nebachiv-blue-dark transition-colors">
              Get Demo
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div>
              <div className="inline-flex items-center space-x-2 bg-nebachiv-blue/20 text-nebachiv-blue px-4 py-2 rounded-full text-sm font-medium mb-6">
                <span className="text-nebachiv-blue">●</span>
                <span>Production-Ready EdTech Platform</span>
              </div>
              
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                AI-Powered
                <span className="text-nebachiv-blue block">Motorcycle Safety</span>
                <span className="text-gray-600 text-3xl block mt-2">Education Platform</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Перша україномовна EdTech платформа для навчання безпечному водінню мотоциклів. 
                <strong className="text-gray-900"> 750+ testimonials</strong> підтверджують ефективність, 
                <strong className="text-nebachiv-blue"> AI система KB_NEB</strong> генерує персоналізований контент.
              </p>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-nebachiv-blue">₴120M</div>
                  <div className="text-sm text-gray-600">ARR потенціал 2027</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-600">750+</div>
                  <div className="text-sm text-gray-600">Реальні testimonials</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-700">A+</div>
                  <div className="text-sm text-gray-600">Tech stack grade</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-nebachiv-blue text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-nebachiv-blue-dark transform hover:scale-105 transition-all">
                  📊 Investment Deck
                </button>
                <button className="border-2 border-nebachiv-blue text-nebachiv-blue px-8 py-4 rounded-lg text-lg font-semibold hover:bg-nebachiv-blue/20 transition-colors">
                  🚀 Live Demo
                </button>
              </div>
            </div>

            {/* Right Column */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-nebachiv-blue/20 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-nebachiv-blue/20 rounded-full -ml-12 -mb-12"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Platform Stats</h3>
                    <div className="text-2xl">🎯</div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Market Size (Ukraine)</span>
                      <span className="font-bold text-indigo-600">400K+ мотоциклістів</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">B2B Target</span>
                      <span className="font-bold text-gray-700">200+ мотошкіл</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Yearly Growth</span>
                      <span className="font-bold text-purple-600">+15% (війна)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">First-Mover</span>
                      <span className="font-bold text-orange-600">🇺🇦 UA Market</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                    <div className="text-sm text-gray-800 font-medium">💬 Latest Testimonial</div>
                    <div className="text-sm text-gray-700 mt-1">
                      "Ваші уроки врятували мені життя!" - Володимир К. (342 лайки)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Конкурентні переваги</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Чотири ключові фактори, що роблять Nebachiv EdTech неповторною інвестиційною можливістю
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {competitiveAdvantages.advantages.map((advantage, index) => (
              <div key={advantage.id} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="text-4xl">{advantage.icon}</div>
                  <div>
                    <div className="text-sm text-indigo-600 font-medium">#{advantage.rank} ПЕРЕВАГА</div>
                    <h3 className="text-xl font-bold text-gray-900">{advantage.title}</h3>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6">{advantage.description}</p>
                
                {/* Specific details for each advantage */}
                {advantage.id === 'ai-content' && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-nebachiv-blue">✓</span>
                      <span className="text-sm">750+ testimonials як data source</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-nebachiv-blue">✓</span>
                      <span className="text-sm">5-dimensional quality scoring</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-nebachiv-blue">✓</span>
                      <span className="text-sm">Автогенерація в 4+ форматах</span>
                    </div>
                    <div className="bg-nebachiv-blue/20 p-3 rounded-lg mt-4">
                      <div className="text-sm font-medium text-nebachiv-blue">🎯 Результат</div>
                      <div className="text-sm text-indigo-700">{advantage.result}</div>
                    </div>
                  </div>
                )}

                {advantage.id === 'market-first' && (
                  <div className="space-y-3">
                    {advantage.proof?.map((proofItem, idx) => (
                      <div key={idx} className="text-sm text-gray-700 bg-gray-100 p-3 rounded-lg">
                        {proofItem}
                      </div>
                    ))}
                  </div>
                )}

                {advantage.id === 'vertical-integration' && (
                  <div className="space-y-2">
                    {advantage.details.pipeline.map((step, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <span className="text-nebachiv-blue/200">→</span>
                        <span className="text-sm">{step}</span>
                      </div>
                    ))}
                  </div>
                )}

                {advantage.id === 'tech-advantage' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-nebachiv-blue/20 p-3 rounded-lg">
                      <div className="text-sm font-medium text-nebachiv-blue">Frontend</div>
                      <div className="text-xs text-nebachiv-blue/80">Next.js 14 + TypeScript</div>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="text-sm font-medium text-gray-800">Backend</div>
                      <div className="text-xs text-gray-700">Prisma + PostgreSQL</div>
                    </div>
                    <div className="bg-nebachiv-blue/20 p-3 rounded-lg">
                      <div className="text-sm font-medium text-nebachiv-blue">Mobile</div>
                      <div className="text-xs text-purple-700">Capacitor iOS/Android</div>
                    </div>
                    <div className="bg-nebachiv-orange/20 p-3 rounded-lg">
                      <div className="text-sm font-medium text-nebachiv-orange">AI</div>
                      <div className="text-xs text-orange-700">OpenAI + KB_NEB</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="tech" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Technology Stack</h2>
            <p className="text-xl text-gray-600">Production-ready архітектура з оцінкою {productStats.techStack.grade}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {productStats.techStack.technologies.map((tech, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-sm text-indigo-600 font-medium mb-2">{tech.category}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{tech.name}</h3>
                <div className="text-sm text-gray-500 mb-3">v{tech.version}</div>
                <p className="text-sm text-gray-600">{tech.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Ключові переваги архітектури</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {productStats.techStack.advantages.map((advantage, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700">{advantage}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Market & Business Model */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Ринок та бізнес-модель</h2>
            <p className="text-xl text-gray-600">Три потужні revenue streams у зростаючому ринку</p>
          </div>

          {/* Market Size */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">🌍 Розмір ринку</h3>
              <div className="space-y-4">
                <div className="bg-nebachiv-blue/20 p-4 rounded-lg">
                  <div className="text-sm text-nebachiv-blue font-medium">Global EdTech</div>
                  <div className="text-2xl font-bold text-nebachiv-blue">{productStats.marketSize.global.edtech2024}</div>
                  <div className="text-sm text-nebachiv-blue/80">→ {productStats.marketSize.global.edtech2030} до 2030</div>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 font-medium">Ukraine Motorcycle Market</div>
                  <div className="text-2xl font-bold text-gray-800">{productStats.marketSize.ukraine.motorcyclists}</div>
                  <div className="text-sm text-gray-700">+{productStats.marketSize.ukraine.yearlyGrowth} річний приріст</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">🎯 Сегменти ринку</h3>
              <div className="space-y-4">
                {[
                  { 
                    name: 'B2C Студенти', 
                    percentage: productStats.segments.b2c.percentage, 
                    revenue: '₴500-2000/міс',
                    color: 'bg-nebachiv-blue/200'
                  },
                  { 
                    name: 'B2B Мотошколи', 
                    percentage: productStats.segments.b2b.percentage, 
                    revenue: '₴5K-25K/міс',
                    color: 'bg-nebachiv-blue'
                  },
                  { 
                    name: 'B2G Держсектор', 
                    percentage: productStats.segments.b2g.percentage, 
                    revenue: '₴500K-2M',
                    color: 'bg-nebachiv-blue/200'
                  }
                ].map((segment, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${segment.color}`}
                        style={{ width: `${segment.percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{segment.name}</div>
                      <div className="text-sm text-gray-600">{segment.revenue}</div>
                    </div>
                    <div className="text-lg font-bold text-gray-700">{segment.percentage}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Revenue Projections */}
          <div className="bg-gradient-to-r from-nebachiv-blue/20 to-nebachiv-blue/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">📈 Фінансові прогнози</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {Object.entries(productStats.projections).map(([year, data], index) => (
                <div key={year} className="bg-white rounded-xl p-6 text-center">
                  <div className="text-lg font-bold text-indigo-600 mb-2">
                    {year === 'year1' ? '2025' : year === 'year2' ? '2026' : '2027'}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{data.revenue}</div>
                  <div className="text-sm text-gray-600 mb-3">{data.users}</div>
                  <div className="text-xs text-indigo-600 font-medium">
                    {data.growth || data.expansion || data.milestone}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Traction Section */}
      <section id="traction" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Traction & Proof of Concept</h2>
            <p className="text-xl text-gray-600">Реальні результати та готовність до масштабування</p>
          </div>

          {/* Top Testimonials */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {tractionProof.socialProof.testimonials.topTestimonials.slice(0, 2).map((testimonial, index) => (
              <div key={testimonial.id} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="text-2xl">
                      {testimonial.category === 'LIFE_SAVING' ? '🛡️' : 
                       testimonial.category === 'TRANSFORMATION' ? '🚀' : '⭐'}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{testimonial.author}</div>
                      <div className="text-sm text-gray-500">{testimonial.likes} лайків</div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    testimonial.category === 'LIFE_SAVING' ? 'bg-nebachiv-orange/20 text-nebachiv-orange' :
                    testimonial.category === 'TRANSFORMATION' ? 'bg-gray-100 text-gray-800' :
                    'bg-nebachiv-blue/20 text-nebachiv-blue'
                  }`}>
                    {testimonial.category}
                  </div>
                </div>
                
                <blockquote className="text-gray-700 italic mb-4">
                  "{testimonial.quote}"
                </blockquote>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-gray-900">Impact:</div>
                  <div className="text-sm text-gray-600">{testimonial.impact}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Technical Readiness */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">🚀 Готовність до масштабування</h3>
            
            <div className="grid md:grid-cols-4 gap-6">
              {Object.entries(tractionProof.readinessMetrics).map(([category, metrics], index) => (
                <div key={category} className="text-center">
                  <div className="text-3xl mb-3">
                    {category === 'infrastructure' ? '⚡' :
                     category === 'payments' ? '💳' :
                     category === 'localization' ? '🌍' : '🔒'}
                  </div>
                  <h4 className="font-bold text-gray-900 mb-3 capitalize">{category}</h4>
                  <div className="space-y-2">
                    {Object.entries(metrics).map(([key, value], idx) => (
                      <div key={idx} className="text-sm">
                        <span className="text-nebachiv-blue">✓</span>
                        <span className="text-gray-600 ml-1">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Investment Section */}
      <section id="investment" className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-nebachiv-blue-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">💎 Інвестиційна пропозиція</h2>
            <p className="text-xl text-nebachiv-blue-light">Seed Round: $500K для захоплення недооціненого ринку</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">💰 Use of Funds</h3>
              <div className="space-y-4">
                {[
                  { category: 'Team Expansion', percentage: 40, amount: '$200K', description: 'Developers, content creators' },
                  { category: 'Marketing & PR', percentage: 30, amount: '$150K', description: 'User acquisition, brand building' },
                  { category: 'Product Development', percentage: 20, amount: '$100K', description: 'Mobile apps, AI features' },
                  { category: 'Operations', percentage: 10, amount: '$50K', description: 'Infrastructure, legal' }
                ].map((item, index) => (
                  <div key={index} className="bg-white/10 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{item.category}</span>
                      <span className="text-nebachiv-blue-light">{item.amount}</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                      <div 
                        className="bg-gradient-to-r from-nebachiv-blue to-gray-400 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-nebachiv-blue-light">{item.description}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6">🎯 ROI для інвесторів</h3>
              <div className="bg-white/10 rounded-2xl p-6 mb-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-nebachiv-blue-light">5x</div>
                    <div className="text-sm text-nebachiv-blue-light">Conservative Return</div>
                    <div className="text-xs text-indigo-300">Year 3</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400">10x</div>
                    <div className="text-sm text-nebachiv-blue-light">Potential Return</div>
                    <div className="text-xs text-indigo-300">EU Expansion</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-nebachiv-orange">18</div>
                    <div className="text-sm text-nebachiv-blue-light">Break-even</div>
                    <div className="text-xs text-indigo-300">Months</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-pink-400">IPO</div>
                    <div className="text-sm text-nebachiv-blue-light">Exit Ready</div>
                    <div className="text-xs text-indigo-300">Year 3</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-bold">📊 Why Invest NOW?</h4>
                {[
                  '🥇 First-mover advantage в недооціненій ніші',
                  '🤖 AI moat через унікальну KB_NEB систему',
                  '💪 Proven traction з реальними користувачами',
                  '🌍 Scalable на європейський ринок',
                  '⭐ Experienced team з track record'
                ].map((reason, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="text-nebachiv-blue-light">✓</span>
                    <span className="text-nebachiv-blue/20">{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
            <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <h3 className="text-2xl font-bold mb-4">🚀 Наступні кроки</h3>
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                {[
                  { step: '1', title: 'Demo', description: 'Живий показ платформи' },
                  { step: '2', title: 'Due Diligence', description: 'Технічний аудит' },
                  { step: '3', title: 'Market Research', description: 'Валідація прогнозів' },
                  { step: '4', title: 'Terms', description: 'Умови інвестування' }
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-nebachiv-blue rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                      {item.step}
                    </div>
                    <div className="font-bold mb-2">{item.title}</div>
                    <div className="text-sm text-nebachiv-blue-light">{item.description}</div>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-indigo-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-nebachiv-blue/20 transition-colors">
                  📧 Schedule Demo
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition-colors">
                  📊 Download Pitch Deck
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="text-2xl">🎓</div>
                <span className="text-xl font-bold">Nebachiv EdTech</span>
              </div>
              <p className="text-gray-400 mb-4">
                AI-powered освітня платформа для безпечного водіння мотоциклів
              </p>
              <div className="text-sm text-gray-500">
                Production-ready • Mobile-first • AI-integrated
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">📞 Contacts</h3>
              <div className="space-y-2 text-gray-400">
                <div>📧 invest@nebachiv.com</div>
                <div>💬 @nebachiv_invest</div>
                <div>🔗 app.nebachiv.com</div>
                <div>📊 deck.nebachiv.com</div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">🔗 Resources</h3>
              <div className="space-y-2">
                <Link href="/docs/NEB_CONTENT_SALES_PITCH.md" className="text-gray-400 hover:text-white transition-colors block">
                  Sales Pitch Document
                </Link>
                <Link href="/api/health" className="text-gray-400 hover:text-white transition-colors block">
                  Platform Health Check
                </Link>
                <Link href="http://localhost:3205" className="text-gray-400 hover:text-white transition-colors block">
                  Live Demo (localhost:3205)
                </Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; 2025 Nebachiv EdTech Platform. Investment-ready Ukrainian EdTech solution.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}