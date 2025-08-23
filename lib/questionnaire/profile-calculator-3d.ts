/**
 * 3D Profile Calculator for Experienced Riders
 * Three independent axes: Risk-Taking, Technical Skills, Self-Assessment Adequacy
 */

export interface Profile3D {
  // Core 3D coordinates
  riskTaking: number;      // 0-10 (0=very cautious, 10=very risky)
  technicalSkills: number; // 0-10 (0=beginner, 10=expert)
  adequacy: number;        // -5 to +5 (negative=underestimates, positive=overestimates)
  
  // Derived metrics
  safetyIndex: number;     // -20 to +20
  growthPotential: number; // 0-10
  dangerLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  
  // Profile classification
  profileType: string;
  characteristics: string[];
  recommendations: string[];
  redFlags: string[];
}

// Profile types based on 3D position
export const RIDER_PROFILES_3D = {
  DUNNING_KRUGER: 'Dunning-Kruger Rider',        // High risk, low skills, overconfident
  IMPOSTOR_SYNDROME: 'Impostor Syndrome',        // Low risk, good skills, underconfident
  CALCULATED_RISK: 'Calculated Risk-Taker',      // High risk, high skills, accurate
  LUCKY_SURVIVOR: 'Lucky Survivor',              // High risk, medium skills, accurate
  CAUTIOUS_EXPERT: 'Cautious Expert',            // Low risk, high skills, accurate
  NERVOUS_BEGINNER: 'Nervous Beginner',          // Low risk, low skills, underconfident
  DANGEROUS_NOVICE: 'Dangerous Novice',          // High risk, low skills, overconfident
  BALANCED_RIDER: 'Balanced Rider',              // Medium all axes
  SKILLED_PESSIMIST: 'Skilled Pessimist',        // Low risk, high skills, underconfident
  OVERCONFIDENT_INTERMEDIATE: 'Overconfident Intermediate' // Medium risk/skills, overconfident
};

/**
 * Calculate risk-taking score from answers
 */
function calculateRiskScore(answers: Record<string, any>): number {
  let score = 5; // Start at neutral
  
  // Age factor
  if (answers.e1_1 === '20-30') score += 0.5;
  else if (answers.e1_1 === '40-50') score -= 0.3;
  else if (answers.e1_1 === '50+') score -= 0.5;
  
  // Profession
  if (answers.e1_5 === 'Військовий') score += 0.5;
  else if (answers.e1_5 === 'Лікар') score -= 0.3;
  else if (answers.e1_5 === 'Підприємець') score += 0.2;
  
  // Motorcycle without ABS
  const moto = answers.e1_7 || '';
  if (moto && !moto.toLowerCase().includes('abs')) score += 1.5;
  
  // Speed in city
  if (answers.e7_1 === '40-70 км/год') score -= 2;
  else if (answers.e7_1 === '70-90 км/год') score += 1;
  else if (answers.e7_1 === '90-150 км/год') score += 3;
  
  // Gear usage
  if (answers.e4_2 === 'В повному екіпі') score -= 1;
  else if (answers.e4_2 === 'В легкому екіпі') score += 0.5;
  else if (answers.e4_2 === 'Шолом, футболка, шльопкі') score += 2;
  
  // Riding style
  if (answers.e4_4 === 'Агресивний') score += 2;
  else if (answers.e4_4 === 'Спокійний') score -= 1;
  
  // Lane filtering
  if (answers.e2_1 === 'Вільно почуваю, люблю затори') score += 1.5;
  else if (answers.e2_1 === 'Не їжджу') score -= 1;
  
  // Scary situations per season - CORRECTED: 4-6 is NOT normal!
  const experience = getExperienceYears(answers.e1_start_year || answers.e1_6);
  if (answers.e2_4 === '0-3 ситуації') {
    // If high speed, might be ignoring risks
    if (answers.e7_1 === '90-150 км/год') score += 1; // Not seeing risks at high speed
    else score -= 0.5;
  } else if (answers.e2_4 === '4-6 ситуацій') {
    // This shows poor strategy, worse with more experience
    score += 1 + (experience * 0.2); // Gets worse with experience
  } else if (answers.e2_4 === 'Більше 6 ситуацій') {
    // Very poor strategy and high risk
    score += 2 + (experience * 0.3); // Much worse with experience
  }
  
  // Crashes - expected about 0.5-1 per season average
  const crashes = parseInt(answers.e2_5) || 0;
  const expectedCrashes = experience * 0.7; // Average expectation
  
  if (crashes === 0 && experience < 2) {
    score -= 0.5; // Cautious beginner
  } else if (crashes === 0 && experience > 5) {
    score -= 2; // Very cautious or extremely skilled
  } else if (crashes > expectedCrashes + 2) {
    score += 2; // Too many crashes
  } else if (crashes > expectedCrashes) {
    score += 1;
  }
  
  // Risk assessment attitude
  if (answers.e3_1 === 'Не думав про це, я просто хотів кататись') score += 2;
  else if (answers.e3_1 === 'Думав про це, прийняв що небезпечно, роблю все щоб підготуватись') score -= 1;
  else if (answers.e3_1 === 'Постійно думаю про це перед виїздом, тривожусь') score -= 1.5;
  
  // Lane position (center is risky)
  if (answers.e7_3 === 'По центру') score += 1;
  
  // Specific situations for risk calculation
  const situations = answers.e2_2 || [];
  if (Array.isArray(situations)) {
    if (situations.includes('Не розрахував швидкість-траєкторію -> виліт з повороту') ||
        situations.includes('Виліт з повороту')) {
      score += 0.5;
    }
    if (situations.includes('Я догнав автівку')) {
      score += 1.0;
    }
    if (situations.includes('Втратив баланс з пасажиркою і впав')) {
      score += 0.5; // Takes risks with passenger
    }
    // Multiple falls indicate risk-taking
    const fallSituations = [
      'Втрата балансу -> падіння',
      'Втратив баланс і впав',
      'Впав на рейках',
      'Підсковзнувся на бруді',
      'Виліт з повороту'
    ];
    const fallCount = fallSituations.filter(s => situations.includes(s)).length;
    if (fallCount >= 3) {
      score += 1.5; // Pattern of risky behavior
    }
  }
  
  return Math.max(0, Math.min(10, score));
}

/**
 * Helper to get experience in years
 * Can be calculated from start year or from seasons
 */
function getExperienceYears(experienceOrYear: string | number): number {
  // If it's a year (e.g., 2020)
  if (typeof experienceOrYear === 'number' || /^\d{4}$/.test(experienceOrYear)) {
    const startYear = typeof experienceOrYear === 'number' ? experienceOrYear : parseInt(experienceOrYear);
    const currentYear = new Date().getFullYear();
    const years = currentYear - startYear;
    return Math.max(0.5, Math.min(15, years)); // Cap at 15 years
  }
  
  // Otherwise it's seasons description
  if (experienceOrYear === 'Перший сезон') return 0.5;
  if (experienceOrYear === '2-3 сезони') return 2.5;
  if (experienceOrYear === '3-7 сезонів') return 5;
  if (experienceOrYear === '7+ сезонів') return 8;
  return 1;
}

/**
 * Calculate technical skills from demonstrated knowledge
 */
function calculateSkillScore(answers: Record<string, any>): number {
  let score = 2; // Start low
  
  // Experience - use start year if available, otherwise use seasons
  const experience = getExperienceYears(answers.e1_start_year || answers.e1_6);
  
  // Base skill growth with experience
  // Skills SHOULD grow proportionally to experience
  if (experience < 1) score += 0.5;
  else if (experience < 3) score += 2;
  else if (experience < 7) score += 3;
  else score += 4;
  
  // Check if skills are growing appropriately with experience
  // This is used later to detect stagnation
  
  // Lane filtering skill penalty - gets worse with experience if not doing it
  if (experience >= 2) {
    if (answers.e2_1 === 'Не їжджу') {
      score -= Math.min(2, experience * 0.4); // Penalty grows with experience
    } else if (answers.e2_1 === 'Дискомфортно, але їжджу') {
      score -= Math.min(1, experience * 0.2); // Smaller penalty
    } else if (answers.e2_1 === 'Вільно почуваю, люблю затори') {
      score += Math.min(1, experience * 0.15); // Bonus for skill
    }
  }
  
  // Additional training
  const training = answers.e4_3 || [];
  if (training.includes('Джимхана')) score += 1;
  if (training.includes('Трек виїзди')) score += 1;
  if (training.includes('Мотокрос')) score += 0.5;
  if (training.includes('Ендуро')) score += 0.5;
  
  // Braking knowledge (correct answers)
  if (answers.e5_2 === '14-16 м') score += 0.5; // Correct for 60
  if (answers.e5_3 === '30-35 м') score += 0.5; // Correct for 100
  if (answers.e5_4 === '70-80 м') score += 0.5; // Correct for 150
  
  // Braking skills claimed and likely true
  const brakingSkills = answers.e5_1 || [];
  if (brakingSkills.includes('Трейлбрейкінг - впевнено практикую')) {
    // Check if they know what they're doing
    if (answers.e1_6 !== 'Перший сезон') score += 0.5;
  }
  if (brakingSkills.includes('Можу справитись з блоком переднього колеса')) score += 0.3;
  if (brakingSkills.includes('Можу справитись з блоком заднього колеса')) score += 0.2;
  
  // Maneuvering skills
  const maneuveringSkills = answers.e6_1 || [];
  if (maneuveringSkills.includes('Можу поїхати в коліно')) {
    if (training.includes('Трек виїзди')) score += 0.5; // Verified skill
  }
  if (maneuveringSkills.includes('Впевнено можу розвернутись на вузькій дорозі без ніг')) {
    if (experience < 1) score -= 0.5; // Unlikely for beginner
    else score += 0.3;
  }
  if (maneuveringSkills.includes('Впевнено можу їхати в дощ в повороті')) {
    if (experience < 2) score -= 0.3; // Unlikely
    else if (experience > 3 && parseInt(answers.e2_5 || '0') === 0) score += 0.5;
  }
  
  // Correct technical responses
  if (answers.e9_1 === 'Розслабити руки, не гальмувати') score += 1; // Wobble
  else if (answers.e9_1 === 'Гальмувати') score -= 1; // Critical error!
  
  // Handlebar grip - CRITICAL basic skill
  if (answers.e7_2 === 'Легко, як філіжанку кави') score += 0.5;
  else if (answers.e7_2 === 'Міцно, щоб контролювати') score -= 2; // Major basic error
  
  // Lane position
  if (answers.e7_3 === 'Постійно змінюю позицію') score += 0.5;
  else if (answers.e7_3 === 'По центру') score -= 0.5; // Doesn't understand positioning
  
  // Trajectory understanding (if present in answers)
  if (answers.e6_trajectory) {
    if (answers.e6_trajectory === 'Так, широкий вхід') score += 0.5;
    else if (answers.e6_trajectory === 'Так, їжджу по центру') score -= 0.5;
  }
  
  // Wet braking knowledge
  if (answers.e9_2 === 'В 1.5-2 рази') score += 0.5;
  
  // Specific situations analysis
  const situations = answers.e2_2 || [];
  if (Array.isArray(situations)) {
    // Positive skills indicators
    if (situations.includes('Блокування переднього колеса при гальмуванні')) {
      // If they experienced front wheel lock and survived, they learned something
      score += 1.0;
    }
    if (situations.includes('Лівий поворот автівки в мене')) {
      // Survived critical situation
      score += 0.5;
    }
    if (situations.includes('Виїзд автівки з другорядної в мене')) {
      score += 0.3; // Managed to handle
    }
    
    // Negative indicators
    if (situations.includes('Не розрахував швидкість-траєкторію -> виліт з повороту') ||
        situations.includes('Виліт з повороту')) {
      score -= 0.5;
    }
    if (situations.includes('Я догнав автівку')) {
      score -= 0.3; // Lack of attention
    }
    if (situations.includes('Втрата балансу -> падіння') ||
        situations.includes('Втратив баланс і впав')) {
      score -= 0.3; // Basic skill issue
    }
    if (situations.includes('Втратив баланс з пасажиркою і впав')) {
      score -= 0.4; // Worse with passenger
    }
    
    // Falls on specific surfaces
    if (situations.includes('Впав на рейках')) {
      score -= 0.2; // Common but avoidable
    }
    if (situations.includes('Підсковзнувся на бруді')) {
      score -= 0.2; // Surface awareness issue
    }
    
    // Got hit by car - mixed indicator
    if (situations.includes('В мене приїхала тачка ззаду')) {
      // Could be not rider's fault, but positioning matters
      score += 0.1; // Survived
    }
    if (situations.includes('В мене приїхала тачка збоку')) {
      // Visibility/positioning issue
      score -= 0.1;
    }
  }
  
  return Math.max(0, Math.min(10, score));
}

/**
 * Calculate self-assessment adequacy
 */
function calculateAdequacy(answers: Record<string, any>, realSkills: number): number {
  const selfAssessment = parseInt(answers.e1_3) || 5;
  const experience = getExperienceYears(answers.e1_start_year || answers.e1_6);
  
  // Convert real skills (0-10) to same scale as self-assessment (1-10)
  const adjustedRealSkills = Math.round(realSkills);
  
  // Base adequacy calculation
  let adequacy = selfAssessment - adjustedRealSkills;
  
  // Age adjustments
  if (answers.e1_1 === '20-30') adequacy += 0.5;
  else if (answers.e1_1 === '40-50') adequacy -= 0.3;
  else if (answers.e1_1 === '50+') adequacy -= 0.5;
  
  // Profession adjustments
  if (answers.e1_5 === 'Військовий') adequacy += 0.3;
  else if (answers.e1_5 === 'Айтішник') adequacy -= 0.3; // More analytical
  else if (answers.e1_5 === 'Творча професія') adequacy += 0.3; // More emotional
  else if (answers.e1_5 === 'Фінансист') adequacy -= 0.2; // Risk calculation
  
  // Experience-based adjustments
  // Some overestimation at the beginning is NORMAL (Dunning-Kruger effect)
  if (experience < 1 && selfAssessment >= 7) {
    adequacy += 1.5; // Reduced penalty - it's normal for beginners
  } else if (experience < 1 && selfAssessment >= 9) {
    adequacy += 2; // Only extreme overestimation is bad
  } else if (experience > 7 && selfAssessment < 5) {
    adequacy -= 2; // Underestimation after many years
  
  // Situations vs experience ratio
  const situations = answers.e2_2 ? (Array.isArray(answers.e2_2) ? answers.e2_2.length : 1) : 0;
  const expectedSituations = Math.min(10, experience * 2);
  if (situations < expectedSituations * 0.5 && experience > 2) {
    adequacy += 1; // Not recognizing risks they've faced
  }
  
  // Fears vs experience ratio
  const fears = answers.e2_3 ? (Array.isArray(answers.e2_3) ? answers.e2_3.length : 1) : 0;
  const expectedFears = Math.max(2, 10 - experience);
  if (fears > expectedFears && experience > 5) adequacy -= 1;
  else if (fears < 2 && experience < 2) adequacy += 1;
  
  // Specific situations affecting adequacy
  if (situations.includes('Я догнав автівку')) {
    adequacy += 0.5; // Overconfidence
  }
  if (situations.includes('Втратив баланс з пасажиркою і впав')) {
    if (experience < 2) {
      adequacy += 1.0; // Taking passenger too early
    }
  }
  // Pattern recognition
  const fallSituations = [
    'Втрата балансу -> падіння',
    'Втратив баланс і впав',
    'Впав на рейках',
    'Підсковзнувся на бруді',
    'Виліт з повороту'
  ];
  const fallCount = fallSituations.filter(s => situations.includes(s)).length;
  if (fallCount >= 2 && selfAssessment >= 7) {
    adequacy += 1.0; // Falls but still high self-assessment
  }
  
  // Cap at -5 to +5
  return Math.max(-5, Math.min(5, adequacy));
}

/**
 * Identify trap question failures (claims vs knowledge)
 */
function identifyTrapFailures(answers: Record<string, any>): string[] {
  const failures = [];
  const brakingSkills = answers.e5_1 || [];
  
  // Claimed braking from 60 but wrong answer
  if (brakingSkills.includes('Можу впевнено екстренно відгальмуватись з 60')) {
    if (answers.e5_2 && answers.e5_2 !== '14-16 м') {
      failures.push('Заявляє вміння гальмувати з 60, але не знає дистанцію');
    }
  }
  
  // Claimed braking from 100 but wrong answer
  if (brakingSkills.includes('Можу впевнено екстренно відгальмуватись з 100')) {
    if (answers.e5_3 && answers.e5_3 !== '30-35 м') {
      failures.push('Заявляє вміння гальмувати з 100, але не знає дистанцію');
    }
  }
  
  // Claimed braking from 150 but wrong answer
  if (brakingSkills.includes('Можу впевнено екстренно відгальмуватись зі 150')) {
    if (answers.e5_4 && answers.e5_4 !== '70-80 м') {
      failures.push('Заявляє вміння гальмувати з 150, але не знає дистанцію');
    }
  }
  
  // Claims trail braking but is a beginner
  const training = answers.e4_3 || [];
  if (brakingSkills.includes('Трейлбрейкінг - впевнено практикую')) {
    if (answers.e1_6 === 'Перший сезон') {
      failures.push('Заявляє трейлбрейкінг в перший сезон - малоймовірно');
    } else if (!training.includes('Трек виїзди') && getExperienceYears(answers.e1_6) < 5) {
      failures.push('Заявляє трейлбрейкінг без треку і достатнього досвіду');
    }
  }
  
  // Claims knee down but no track experience
  const maneuveringSkills = answers.e6_1 || [];
  if (maneuveringSkills.includes('Можу поїхати в коліно')) {
    if (!training.includes('Трек виїзди')) {
      failures.push('Заявляє їзду в коліно без треку - сумнівно');
    }
  }
  
  // U-turn without feet in first season
  if (maneuveringSkills.includes('Впевнено можу розвернутись на вузькій дорозі без ніг')) {
    if (answers.e1_6 === 'Перший сезон') {
      failures.push('Заявляє розворот без ніг в перший сезон - малоймовірно');
    }
  }
  
  // Wobble wrong response
  if (answers.e9_1 === 'Гальмувати') {
    failures.push('⚠️ КРИТИЧНА ПОМИЛКА: гальмування при wobble = падіння!');
  }
  
  // Tight handlebar grip
  if (answers.e7_2 === 'Міцно, щоб контролювати') {
    failures.push('Базова помилка: міцний хват керма погіршує контроль');
  }
  
  return failures;
}

/**
 * Calculate safety index
 */
function calculateSafetyIndex(risk: number, skills: number, adequacy: number): number {
  // Formula: Skills - Risk - |Adequacy|
  // Higher skills increase safety
  // Higher risk decreases safety
  // Both over and underconfidence decrease safety
  return skills - risk - Math.abs(adequacy);
}

/**
 * Calculate growth potential
 */
function calculateGrowthPotential(skills: number, adequacy: number, training: string[]): number {
  let potential = 5; // Base potential
  
  // Lower skills = more room to grow
  potential += (10 - skills) * 0.3;
  
  // Underconfidence = hidden potential
  if (adequacy < 0) potential += Math.abs(adequacy) * 0.5;
  
  // Training history shows learning attitude
  if (training && training.length > 0) potential += training.length * 0.5;
  
  return Math.max(0, Math.min(10, potential));
}

/**
 * Determine danger level
 */
function determineDangerLevel(risk: number, skills: number, adequacy: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  const safetyIndex = calculateSafetyIndex(risk, skills, adequacy);
  
  // Critical: High risk + low skills + overconfidence
  if (risk > 7 && skills < 4 && adequacy > 2) return 'CRITICAL';
  
  // Critical: Very negative safety index
  if (safetyIndex < -5) return 'CRITICAL';
  
  // High: Significant mismatch
  if (risk > skills + 3) return 'HIGH';
  if (adequacy > 3 || adequacy < -3) return 'HIGH';
  if (safetyIndex < -2) return 'HIGH';
  
  // Medium: Some concerns
  if (risk > skills + 1) return 'MEDIUM';
  if (Math.abs(adequacy) > 2) return 'MEDIUM';
  if (safetyIndex < 2) return 'MEDIUM';
  
  return 'LOW';
}

/**
 * Classify rider into specific profile based on 3D position
 */
function classifyProfile(risk: number, skills: number, adequacy: number): string {
  // Dangerous Novice: High risk + Low skills + Overconfident
  if (risk > 6 && skills < 4 && adequacy > 2) {
    return RIDER_PROFILES_3D.DANGEROUS_NOVICE;
  }
  
  // Dunning-Kruger: Medium-high risk + Low-medium skills + Very overconfident
  if (risk >= 5 && skills < 6 && adequacy >= 3) {
    return RIDER_PROFILES_3D.DUNNING_KRUGER;
  }
  
  // Impostor Syndrome: Low risk + Good skills + Underconfident
  if (risk < 4 && skills > 6 && adequacy < -2) {
    return RIDER_PROFILES_3D.IMPOSTOR_SYNDROME;
  }
  
  // Calculated Risk-Taker: High risk + High skills + Accurate assessment
  if (risk > 6 && skills > 7 && Math.abs(adequacy) <= 1) {
    return RIDER_PROFILES_3D.CALCULATED_RISK;
  }
  
  // Lucky Survivor: High risk + Medium skills + Somewhat accurate
  if (risk > 6 && skills >= 4 && skills <= 7 && Math.abs(adequacy) <= 2) {
    return RIDER_PROFILES_3D.LUCKY_SURVIVOR;
  }
  
  // Cautious Expert: Low risk + High skills + Accurate
  if (risk < 4 && skills > 7 && Math.abs(adequacy) <= 1) {
    return RIDER_PROFILES_3D.CAUTIOUS_EXPERT;
  }
  
  // Nervous Beginner: Low risk + Low skills + Underconfident
  if (risk < 4 && skills < 4 && adequacy < -1) {
    return RIDER_PROFILES_3D.NERVOUS_BEGINNER;
  }
  
  // Skilled Pessimist: Low-medium risk + High skills + Very underconfident
  if (risk < 5 && skills > 6 && adequacy < -2) {
    return RIDER_PROFILES_3D.SKILLED_PESSIMIST;
  }
  
  // Overconfident Intermediate: Medium risk/skills + Overconfident
  if (risk >= 4 && risk <= 6 && skills >= 4 && skills <= 6 && adequacy > 2) {
    return RIDER_PROFILES_3D.OVERCONFIDENT_INTERMEDIATE;
  }
  
  // Default: Balanced Rider
  return RIDER_PROFILES_3D.BALANCED_RIDER;
}

/**
 * Generate characteristics based on profile
 */
function generateCharacteristics(profileType: string, risk: number, skills: number, adequacy: number): string[] {
  const characteristics = [];
  
  // Risk characteristics
  if (risk > 7) characteristics.push('Дуже високий апетит до ризику');
  else if (risk > 5) characteristics.push('Схильність до ризику');
  else if (risk < 3) characteristics.push('Обережний підхід');
  
  // Skill characteristics
  if (skills > 7) characteristics.push('Високі технічні навички');
  else if (skills > 5) characteristics.push('Хороші базові навички');
  else if (skills < 3) characteristics.push('Початковий рівень навичок');
  
  // Adequacy characteristics
  if (adequacy > 3) characteristics.push('Значна переоцінка своїх можливостей');
  else if (adequacy > 1) characteristics.push('Трохи переоцінює себе');
  else if (adequacy < -3) characteristics.push('Значна недооцінка своїх можливостей');
  else if (adequacy < -1) characteristics.push('Трохи недооцінює себе');
  else if (Math.abs(adequacy) <= 1) characteristics.push('Адекватна самооцінка');
  
  // Profile-specific
  switch (profileType) {
    case RIDER_PROFILES_3D.DANGEROUS_NOVICE:
      characteristics.push('Небезпечна комбінація факторів');
      characteristics.push('Потребує негайного втручання');
      break;
    case RIDER_PROFILES_3D.IMPOSTOR_SYNDROME:
      characteristics.push('Прихований потенціал');
      characteristics.push('Може більше, ніж думає');
      break;
    case RIDER_PROFILES_3D.CALCULATED_RISK:
      characteristics.push('Усвідомлені ризики');
      characteristics.push('Знає свої межі');
      break;
  }
  
  return characteristics;
}

/**
 * Generate recommendations based on 3D position
 */
function generateRecommendations(risk: number, skills: number, adequacy: number, trapFailures: string[]): string[] {
  const recommendations = [];
  
  // High risk recommendations
  if (risk > 7) {
    recommendations.push('ТЕРМІНОВО знизити швидкість їзди в місті');
    recommendations.push('Обов\'язково використовувати повну екіпіровку');
  } else if (risk > 5) {
    recommendations.push('Переглянути своє ставлення до ризиків');
    recommendations.push('Практикувати більш обережний стиль');
  }
  
  // Low skill recommendations
  if (skills < 4) {
    recommendations.push('Пройти курс контраварійного водіння');
    recommendations.push('Регулярно практикувати базові навички на майданчику');
    recommendations.push('Вивчити теорію гальмування та маневрування');
  } else if (skills < 6) {
    recommendations.push('Розглянути додаткові тренування (джимхана, трек)');
    recommendations.push('Практикувати екстренне гальмування');
  }
  
  // Adequacy recommendations
  if (adequacy > 3) {
    recommendations.push('Чесно переоцінити свої навички');
    recommendations.push('Вивчити відео аварій для розуміння реальних ризиків');
    recommendations.push('Пройти об\'єктивну оцінку інструктором');
  } else if (adequacy < -3) {
    recommendations.push('Повірити в свої навички');
    recommendations.push('Поступово підвищувати складність завдань');
    recommendations.push('Записати свої успіхи для мотивації');
  }
  
  // Trap failure recommendations
  if (trapFailures.length > 0) {
    recommendations.push('Вивчити теорію перед практикою');
    recommendations.push('Не заявляти навички, яких немає');
  }
  
  // Specific combos
  if (risk > 6 && skills < 4) {
    recommendations.push('⚠️ КРИТИЧНО: Негайно знизити ризики до набуття навичок!');
  }
  
  if (skills > 7 && adequacy < -2) {
    recommendations.push('Ваші навички вищі, ніж ви думаєте - використовуйте їх');
  }
  
  return recommendations;
}

/**
 * Analyze if skills are growing appropriately with experience
 */
function analyzeSkillGrowth(experience: number, skills: number, selfAssessment: number): string[] {
  const warnings = [];
  
  // Expected minimum skills based on experience
  const expectedMinSkills = Math.min(2 + experience * 0.8, 8);
  
  if (skills < expectedMinSkills - 1) {
    warnings.push(`⚠️ Навички не ростуть з досвідом (${experience.toFixed(1)} років, але skills ${skills.toFixed(1)})`);
    
    if (experience > 5 && skills < 5) {
      warnings.push('🔴 КРИТИЧНО: Після 5+ років навички повинні бути вищими!');
    }
    
    if (selfAssessment > 6 && skills < 5) {
      warnings.push('Переоцінка своїх можливостей при низьких реальних навичках');
    }
  }
  
  // Stagnation detection
  if (experience > 3 && skills < 4) {
    warnings.push('Стагнація навичок - потрібне додаткове навчання');
  }
  
  return warnings;
}

/**
 * Main function to calculate 3D profile
 */
export function calculate3DProfile(answers: Record<string, any>): Profile3D {
  // Calculate three independent axes
  const riskTaking = calculateRiskScore(answers);
  const technicalSkills = calculateSkillScore(answers);
  const adequacy = calculateAdequacy(answers, technicalSkills);
  
  // Identify trap question failures
  const trapFailures = identifyTrapFailures(answers);
  
  // Calculate derived metrics
  const safetyIndex = calculateSafetyIndex(riskTaking, technicalSkills, adequacy);
  const growthPotential = calculateGrowthPotential(
    technicalSkills, 
    adequacy, 
    answers.e4_3 || []
  );
  const dangerLevel = determineDangerLevel(riskTaking, technicalSkills, adequacy);
  
  // Classify profile
  const profileType = classifyProfile(riskTaking, technicalSkills, adequacy);
  
  // Generate characteristics and recommendations
  const characteristics = generateCharacteristics(profileType, riskTaking, technicalSkills, adequacy);
  const recommendations = generateRecommendations(riskTaking, technicalSkills, adequacy, trapFailures);
  
  // Analyze skill growth
  const experience = getExperienceYears(answers.e1_start_year || answers.e1_6);
  const selfAssessment = parseInt(answers.e1_3) || 5;
  const skillGrowthWarnings = analyzeSkillGrowth(experience, technicalSkills, selfAssessment);
  
  // Combine trap failures with red flags
  const redFlags = [
    ...trapFailures,
    ...skillGrowthWarnings,
    ...(dangerLevel === 'CRITICAL' ? ['⚠️ КРИТИЧНИЙ РІВЕНЬ НЕБЕЗПЕКИ'] : []),
    ...(riskTaking > 8 ? ['Екстремально високий рівень ризику'] : []),
    ...(adequacy > 4 ? ['Небезпечна переоцінка своїх можливостей'] : []),
    ...(technicalSkills < 3 && riskTaking > 6 ? ['Недостатні навички для такого рівня ризику'] : [])
  ];
  
  return {
    // Core 3D coordinates
    riskTaking: Math.round(riskTaking * 10) / 10,
    technicalSkills: Math.round(technicalSkills * 10) / 10,
    adequacy: Math.round(adequacy * 10) / 10,
    
    // Derived metrics
    safetyIndex: Math.round(safetyIndex * 10) / 10,
    growthPotential: Math.round(growthPotential * 10) / 10,
    dangerLevel,
    
    // Profile classification
    profileType,
    characteristics,
    recommendations,
    redFlags: redFlags.length > 0 ? redFlags : []
  };
}

/**
 * Get profile description for display
 */
export function getProfileDescription(profileType: string): string {
  const descriptions: Record<string, string> = {
    [RIDER_PROFILES_3D.DANGEROUS_NOVICE]: 
      'Небезпечна комбінація: високі ризики без відповідних навичок. Потребує негайної корекції стилю їзди.',
    
    [RIDER_PROFILES_3D.DUNNING_KRUGER]: 
      'Класичний приклад ефекту Даннінга-Крюгера: переоцінює свої можливості через брак досвіду.',
    
    [RIDER_PROFILES_3D.IMPOSTOR_SYNDROME]: 
      'Синдром самозванця: має хороші навички, але недооцінює себе. Може набагато більше.',
    
    [RIDER_PROFILES_3D.CALCULATED_RISK]: 
      'Усвідомлений ризик: високі навички дозволяють контролювати підвищені ризики.',
    
    [RIDER_PROFILES_3D.LUCKY_SURVIVOR]: 
      'Щасливчик: поки що вдається уникати наслідків ризикованої їзди. Варто бути обережнішим.',
    
    [RIDER_PROFILES_3D.CAUTIOUS_EXPERT]: 
      'Обережний експерт: високі навички поєднані з розумною обережністю. Приклад для наслідування.',
    
    [RIDER_PROFILES_3D.NERVOUS_BEGINNER]: 
      'Нервовий початківець: правильна обережність, але потребує більше впевненості та практики.',
    
    [RIDER_PROFILES_3D.SKILLED_PESSIMIST]: 
      'Кваліфікований песиміст: недооцінює свої реальні можливості. Може дозволити собі більше.',
    
    [RIDER_PROFILES_3D.OVERCONFIDENT_INTERMEDIATE]: 
      'Надмірно впевнений: середні навички, але думає що знає більше. Потребує об\'єктивної оцінки.',
    
    [RIDER_PROFILES_3D.BALANCED_RIDER]: 
      'Збалансований райдер: помірні ризики, адекватна самооцінка, є простір для розвитку.'
  };
  
  return descriptions[profileType] || 'Унікальний профіль райдера.';
}