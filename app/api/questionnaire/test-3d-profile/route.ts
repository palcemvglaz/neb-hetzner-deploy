import { NextRequest, NextResponse } from 'next/server'
import { calculate3DProfile, getProfileDescription, RIDER_PROFILES_3D } from '@/lib/questionnaire/profile-calculator-3d-simple'

// Test profiles with different answer patterns
const TEST_PROFILES = {
  dangerous_novice: {
    e1_1: '20-30',
    e1_3: 9, // Self-assessment: 9/10
    e1_5: 'Творча професія',
    e1_6: 'Перший сезон',
    e1_7: 'Yamaha R1 (no ABS)',
    e2_1: 'Вільно почуваю, люблю затори',
    e2_2: ['Втрата балансу -> падіння', 'Я догнав автівку'],
    e2_3: [],
    e2_4: '4-6 ситуацій',
    e2_5: '2',
    e3_1: 'Не думав про це, я просто хотів кататись',
    e4_2: 'Шолом, футболка, шльопкі',
    e4_3: [],
    e4_4: 'Агресивний',
    e5_1: ['Можу впевнено екстренно відгальмуватись зі 150', 'Трейлбрейкінг - впевнено практикую'],
    e5_2: '8-10 м', // Wrong!
    e5_3: '20-30 м', // Wrong!
    e5_4: '40-50 м', // Wrong!
    e6_1: ['Можу поїхати в коліно'],
    e6_trajectory: 'Так, їжджу по центру',
    e7_1: '90-150 км/год',
    e7_2: 'Міцно, щоб контролювати',
    e7_3: 'По центру',
    e9_1: 'Гальмувати', // Critical error!
    e9_2: 'Не знаю'
  },
  
  cautious_expert: {
    e1_1: '40-50',
    e1_3: 7, // Self-assessment: 7/10
    e1_5: 'Лікар',
    e1_6: '7+ сезонів',
    e1_7: 'BMW R1250GS ABS',
    e2_1: 'Вільно почуваю, люблю затори',
    e2_2: ['Блокування переднього колеса при гальмуванні', 'Лівий поворот автівки в мене', 'Виїзд автівки з другорядної в мене'],
    e2_3: ['Необхідність екстренно гальмувати і маневрувати в повороті'],
    e2_4: '0-3 ситуації',
    e2_5: '1',
    e3_1: 'Думав про це, прийняв що небезпечно, роблю все щоб підготуватись',
    e4_2: 'В повному екіпі',
    e4_3: ['Джимхана', 'Трек виїзди'],
    e4_4: 'Спокійний',
    e5_1: ['Можу впевнено екстренно відгальмуватись з 60', 'Можу впевнено екстренно відгальмуватись з 100', 'Трейлбрейкінг - впевнено практикую'],
    e5_2: '14-16 м', // Correct!
    e5_3: '30-35 м', // Correct!
    e5_4: '70-80 м', // Correct!
    e6_1: ['Впевнено їжджу в поворотах', 'Впевнено можу розвернутись на вузькій дорозі без ніг', 'Впевнено можу їхати в дощ в повороті'],
    e6_trajectory: 'Так, широкий вхід',
    e7_1: '40-70 км/год',
    e7_2: 'Легко, як філіжанку кави',
    e7_3: 'Постійно змінюю позицію',
    e9_1: 'Розслабити руки, не гальмувати', // Correct!
    e9_2: 'В 1.5-2 рази' // Correct!
  },
  
  impostor_syndrome: {
    e1_1: '30-40',
    e1_3: 4, // Self-assessment: 4/10
    e1_5: 'Айтішник',
    e1_6: '3-7 сезонів',
    e1_7: 'Honda CB650R ABS',
    e2_1: 'Дискомфортно, але їжджу',
    e2_2: ['Блокування заднього колеса при гальмуванні', 'Виїзд автівки з другорядної в мене'],
    e2_3: ['Лівий поворот автівки в мене', 'Необхідність екстренно гальмувати зі швидкості 80+', 'Необхідність екстренно гальмувати на слизькому або поганому покритті'],
    e2_4: '0-3 ситуації',
    e2_5: '0',
    e3_1: 'Періодично думаю про це, бо не розумію всіх потенційних небезпек',
    e4_2: 'В повному екіпі',
    e4_3: ['Джимхана'],
    e4_4: 'Спокійний',
    e5_1: ['Можу впевнено екстренно відгальмуватись з 60', 'Можу справитись з блоком заднього колеса'],
    e5_2: '14-16 м', // Correct!
    e5_3: '30-35 м', // Correct!
    e5_4: 'Хз не заміряв',
    e6_1: ['Впевнено їжджу в поворотах', 'Впевнено можу розвернутись на вузькій дорозі без ніг'],
    e6_trajectory: 'Так, широкий вхід',
    e7_1: '40-70 км/год',
    e7_2: 'Легко, як філіжанку кави',
    e7_3: 'Постійно змінюю позицію',
    e9_1: 'Розслабити руки, не гальмувати', // Correct!
    e9_2: 'В 1.5-2 рази' // Correct!
  },
  
  lucky_survivor: {
    e1_1: '20-30',
    e1_3: 6, // Self-assessment: 6/10
    e1_5: 'Підприємець',
    e1_6: '2-3 сезони',
    e1_7: 'Kawasaki Z650',
    e2_1: 'Вільно почуваю, люблю затори',
    e2_2: ['Виліт з повороту', 'Втратив баланс і впав', 'Впав на рейках'],
    e2_3: ['Лівий поворот автівки в мене'],
    e2_4: 'Більше 6 ситуацій',
    e2_5: '3',
    e3_1: 'Не думав про це, я просто хотів кататись',
    e4_2: 'В легкому екіпі',
    e4_3: [],
    e4_4: 'Змішаний',
    e5_1: ['Можу впевнено екстренно відгальмуватись з 60', 'Можу впевнено екстренно відгальмуватись з 100'],
    e5_2: '14-16 м', // Correct
    e5_3: '45-53 м', // Wrong
    e5_4: 'Хз не заміряв',
    e6_1: ['Впевнено їжджу в поворотах'],
    e6_trajectory: 'Не знаю, просто їжджу',
    e7_1: '70-90 км/год',
    e7_2: 'Залежить від дороги',
    e7_3: 'Лівий край',
    e9_1: 'Розслабити руки, не гальмувати',
    e9_2: 'На 20-30%' // Underestimate
  }
}

export async function GET(request: NextRequest) {
  try {
    const results = []
    
    // Calculate profiles for all test cases
    for (const [key, answers] of Object.entries(TEST_PROFILES)) {
      const profile = calculate3DProfile(answers)
      const description = getProfileDescription(profile.profileType)
      
      results.push({
        testCase: key,
        expectedProfile: key.replace(/_/g, ' ').split(' ').map(w => 
          w.charAt(0).toUpperCase() + w.slice(1)
        ).join(' '),
        calculatedProfile: {
          type: profile.profileType,
          description,
          axes: {
            riskTaking: profile.riskTaking,
            technicalSkills: profile.technicalSkills,
            adequacy: profile.adequacy
          },
          metrics: {
            safetyIndex: profile.safetyIndex,
            growthPotential: profile.growthPotential,
            dangerLevel: profile.dangerLevel
          },
          characteristics: profile.characteristics,
          recommendations: profile.recommendations,
          redFlags: profile.redFlags
        },
        match: profile.profileType.toLowerCase().includes(key.replace(/_/g, ' ').toLowerCase()) ||
               key.includes(profile.profileType.toLowerCase().replace(/\s+/g, '_'))
      })
    }
    
    // Summary
    const summary = {
      totalTests: results.length,
      correctMatches: results.filter(r => r.match).length,
      profiles: Object.values(RIDER_PROFILES_3D),
      dangerLevels: {
        CRITICAL: results.filter(r => r.calculatedProfile.metrics.dangerLevel === 'CRITICAL').length,
        HIGH: results.filter(r => r.calculatedProfile.metrics.dangerLevel === 'HIGH').length,
        MEDIUM: results.filter(r => r.calculatedProfile.metrics.dangerLevel === 'MEDIUM').length,
        LOW: results.filter(r => r.calculatedProfile.metrics.dangerLevel === 'LOW').length
      }
    }
    
    return NextResponse.json({
      success: true,
      summary,
      results,
      message: 'Test profiles calculated successfully. Check console for detailed output.'
    })
    
  } catch (error) {
    console.error('Error testing 3D profiles:', error)
    return NextResponse.json(
      { error: 'Failed to test profiles', details: error },
      { status: 500 }
    )
  }
}