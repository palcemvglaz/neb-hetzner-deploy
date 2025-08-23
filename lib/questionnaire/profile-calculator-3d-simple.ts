'use strict';

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
  DUNNING_KRUGER: 'Dunning-Kruger Rider',
  IMPOSTOR_SYNDROME: 'Impostor Syndrome',
  CALCULATED_RISK: 'Calculated Risk-Taker',
  LUCKY_SURVIVOR: 'Lucky Survivor',
  CAUTIOUS_EXPERT: 'Cautious Expert',
  NERVOUS_BEGINNER: 'Nervous Beginner',
  DANGEROUS_NOVICE: 'Dangerous Novice',
  BALANCED_RIDER: 'Balanced Rider',
  SKILLED_PESSIMIST: 'Skilled Pessimist',
  OVERCONFIDENT_INTERMEDIATE: 'Overconfident Intermediate'
};

/**
 * Helper to get experience in years
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
 * Calculate risk-taking score from answers
 */
function calculateRiskScore(answers: Record<string, any>): number {
  let score = 5; // Start at neutral
  
  // Age factor
  if (answers.e1_1 === '20-30') score += 0.5;
  else if (answers.e1_1 === '40-50') score -= 0.3;
  else if (answers.e1_1 === '50+') score -= 0.5;
  
  // Speed in city
  if (answers.e7_1 === '40-70 км/год') score -= 2;
  else if (answers.e7_1 === '70-90 км/год') score += 1;
  else if (answers.e7_1 === '90-150 км/год') score += 3;
  
  // Gear usage
  if (answers.e4_2 === 'В повному екіпі') score -= 1;
  else if (answers.e4_2 === 'В легкому екіпі') score += 0.5;
  else if (answers.e4_2 === 'Шолом, футболка, шльопкі') score += 2;
  
  return Math.max(0, Math.min(10, score));
}

/**
 * Calculate technical skills from demonstrated knowledge
 */
function calculateSkillScore(answers: Record<string, any>): number {
  let score = 2; // Start low
  
  // Experience - use start year if available, otherwise use seasons
  const experience = getExperienceYears(answers.e1_start_year || answers.e1_6);
  
  // Base skill growth with experience
  if (experience < 1) score += 0.5;
  else if (experience < 3) score += 2;
  else if (experience < 7) score += 3;
  else score += 4;
  
  // Correct technical responses
  if (answers.e9_1 === 'Розслабити руки, не гальмувати') score += 1; // Wobble
  else if (answers.e9_1 === 'Гальмувати') score -= 1; // Critical error!
  
  // Handlebar grip - CRITICAL basic skill
  if (answers.e7_2 === 'Легко, як філіжанку кави') score += 0.5;
  else if (answers.e7_2 === 'Міцно, щоб контролювати') score -= 2; // Major basic error
  
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
  
  // Experience-based adjustments
  // Some overestimation at the beginning is NORMAL (Dunning-Kruger effect)
  if (experience < 1 && selfAssessment >= 7) {
    adequacy += 1.5; // Reduced penalty - it's normal for beginners
  } else if (experience < 1 && selfAssessment >= 9) {
    adequacy += 2; // Only extreme overestimation is bad
  } else if (experience > 7 && selfAssessment < 5) {
    adequacy -= 2; // Underestimation after many years
  }
  
  // Cap at -5 to +5
  return Math.max(-5, Math.min(5, adequacy));
}

/**
 * Calculate safety index
 */
function calculateSafetyIndex(risk: number, skills: number, adequacy: number): number {
  return skills - risk - Math.abs(adequacy);
}

/**
 * Calculate growth potential
 */
function calculateGrowthPotential(skills: number, adequacy: number): number {
  let potential = 5; // Base potential
  
  // Lower skills = more room to grow
  potential += (10 - skills) * 0.3;
  
  // Underconfidence = hidden potential
  if (adequacy < 0) potential += Math.abs(adequacy) * 0.5;
  
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
  
  // Cautious Expert: Low risk + High skills + Accurate
  if (risk < 4 && skills > 7 && Math.abs(adequacy) <= 1) {
    return RIDER_PROFILES_3D.CAUTIOUS_EXPERT;
  }
  
  // Default: Balanced Rider
  return RIDER_PROFILES_3D.BALANCED_RIDER;
}

/**
 * Main function to calculate 3D profile
 */
export function calculate3DProfile(answers: Record<string, any>): Profile3D {
  // Calculate three independent axes
  const riskTaking = calculateRiskScore(answers);
  const technicalSkills = calculateSkillScore(answers);
  const adequacy = calculateAdequacy(answers, technicalSkills);
  
  // Calculate derived metrics
  const safetyIndex = calculateSafetyIndex(riskTaking, technicalSkills, adequacy);
  const growthPotential = calculateGrowthPotential(technicalSkills, adequacy);
  const dangerLevel = determineDangerLevel(riskTaking, technicalSkills, adequacy);
  
  // Classify profile
  const profileType = classifyProfile(riskTaking, technicalSkills, adequacy);
  
  // Generate characteristics and recommendations
  const characteristics = [
    `Risk level: ${riskTaking.toFixed(1)}/10`,
    `Skills level: ${technicalSkills.toFixed(1)}/10`,
    `Self-assessment: ${adequacy > 0 ? 'overestimates' : adequacy < 0 ? 'underestimates' : 'accurate'}`
  ];
  
  const recommendations = [
    ...(riskTaking > 7 ? ['ТЕРМІНОВО знизити швидкість їзди'] : []),
    ...(technicalSkills < 4 ? ['Пройти курс контраварійного водіння'] : []),
    ...(adequacy > 3 ? ['Чесно переоцінити свої навички'] : [])
  ];
  
  const redFlags = [
    ...(dangerLevel === 'CRITICAL' ? ['⚠️ КРИТИЧНИЙ РІВЕНЬ НЕБЕЗПЕКИ'] : []),
    ...(riskTaking > 8 ? ['Екстремально високий рівень ризику'] : []),
    ...(adequacy > 4 ? ['Небезпечна переоцінка своїх можливостей'] : [])
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
    [RIDER_PROFILES_3D.DUNNING_KRUGER]: 
      'Ви переоцінюєте свої навички. Це нормально на початку, але важливо усвідомити реальний рівень для безпечного прогресу. Ваша впевненість випереджає досвід.',
    [RIDER_PROFILES_3D.IMPOSTOR_SYNDROME]: 
      'Ви недооцінюєте свої навички. Маєте гарний досвід, але не вірите в себе. Це може заважати розвитку та отриманню задоволення від їзди.',
    [RIDER_PROFILES_3D.CALCULATED_RISK]: 
      'Ви приймаєте ризики, але робите це свідомо. Знаєте свої межі та розумієте наслідки. Це може бути ефективно, але потребує постійної уваги.',
    [RIDER_PROFILES_3D.LUCKY_SURVIVOR]: 
      'Високий ризик при недостатніх навичках. Вам поки що щастило, але це не може тривати вічно. Терміново потрібне навчання.',
    [RIDER_PROFILES_3D.CAUTIOUS_EXPERT]: 
      'Досвідчений райдер з обережним підходом. Ви знаєте свої можливості та не ризикуєте даремно. Це найбезпечніший профіль.',
    [RIDER_PROFILES_3D.NERVOUS_BEGINNER]: 
      'Початківець, який усвідомлює свої обмеження. Це хороша основа для навчання, але надмірна тривожність може заважати прогресу.',
    [RIDER_PROFILES_3D.DANGEROUS_NOVICE]: 
      'Небезпечна комбінація: мало досвіду, багато ризику, переоцінка себе. Це найнебезпечніший профіль. Потрібне термінове навчання.',
    [RIDER_PROFILES_3D.BALANCED_RIDER]: 
      'Збалансований підхід до їзди. Ризик відповідає навичкам, самооцінка адекватна. Хороша основа для подальшого розвитку.',
    [RIDER_PROFILES_3D.SKILLED_PESSIMIST]: 
      'Високі навички, але недооцінюєте себе та уникаєте ризиків. Можете дозволити собі більше, ваш досвід це дозволяє.',
    [RIDER_PROFILES_3D.OVERCONFIDENT_INTERMEDIATE]: 
      'Середні навички з переоцінкою можливостей. Типово для 2-3 року їзди. Важливо усвідомити реальний рівень.'
  };
  
  return descriptions[profileType] || 'Профіль райдера в процесі формування. Продовжуйте відповідати на питання для точного визначення.';
}