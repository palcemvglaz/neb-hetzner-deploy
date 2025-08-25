/**
 * Motorcycle Database
 * Complete list of 107+ motorcycle models with specifications
 */

export interface Motorcycle {
  id: string
  brand: string
  model: string
  fullName: string
  type: 'naked' | 'sport' | 'adventure' | 'cruiser' | 'touring' | 'supermoto' | 'classic' | 'scooter'
  engineSize: number // in CC
  hasABS: boolean
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  riskCategory: 'low' | 'medium' | 'high'
  beginnerFriendly: boolean
  popularityRank?: number
}

export const MOTORCYCLES_DATABASE: Motorcycle[] = [
  // ================ JAPANESE BRANDS ================
  
  // YAMAHA
  { id: 'yam_mt03', brand: 'Yamaha', model: 'MT-03', fullName: 'Yamaha MT-03', type: 'naked', engineSize: 321, hasABS: true, difficultyLevel: 'beginner', riskCategory: 'low', beginnerFriendly: true, popularityRank: 8 },
  { id: 'yam_mt07', brand: 'Yamaha', model: 'MT-07', fullName: 'Yamaha MT-07', type: 'naked', engineSize: 689, hasABS: true, difficultyLevel: 'intermediate', riskCategory: 'medium', beginnerFriendly: true, popularityRank: 1 },
  { id: 'yam_mt09', brand: 'Yamaha', model: 'MT-09', fullName: 'Yamaha MT-09', type: 'naked', engineSize: 889, hasABS: true, difficultyLevel: 'advanced', riskCategory: 'high', beginnerFriendly: false, popularityRank: 3 },
  { id: 'yam_mt10', brand: 'Yamaha', model: 'MT-10', fullName: 'Yamaha MT-10', type: 'naked', engineSize: 998, hasABS: true, difficultyLevel: 'expert', riskCategory: 'high', beginnerFriendly: false },
  { id: 'yam_r3', brand: 'Yamaha', model: 'R3', fullName: 'Yamaha R3', type: 'sport', engineSize: 321, hasABS: true, difficultyLevel: 'beginner', riskCategory: 'low', beginnerFriendly: true },
  { id: 'yam_r6', brand: 'Yamaha', model: 'R6', fullName: 'Yamaha R6', type: 'sport', engineSize: 599, hasABS: true, difficultyLevel: 'advanced', riskCategory: 'high', beginnerFriendly: false },
  { id: 'yam_r7', brand: 'Yamaha', model: 'R7', fullName: 'Yamaha R7', type: 'sport', engineSize: 689, hasABS: true, difficultyLevel: 'intermediate', riskCategory: 'medium', beginnerFriendly: false },
  { id: 'yam_r1', brand: 'Yamaha', model: 'R1', fullName: 'Yamaha R1', type: 'sport', engineSize: 998, hasABS: true, difficultyLevel: 'expert', riskCategory: 'high', beginnerFriendly: false },
  { id: 'yam_tenere', brand: 'Yamaha', model: 'Tenere 700', fullName: 'Yamaha Tenere 700', type: 'adventure', engineSize: 689, hasABS: true, difficultyLevel: 'intermediate', riskCategory: 'medium', beginnerFriendly: false },
  { id: 'yam_tracer9', brand: 'Yamaha', model: 'Tracer 9', fullName: 'Yamaha Tracer 9', type: 'touring', engineSize: 889, hasABS: true, difficultyLevel: 'advanced', riskCategory: 'medium', beginnerFriendly: false },

  // HONDA
  { id: 'hon_cb125r', brand: 'Honda', model: 'CB125R', fullName: 'Honda CB125R', type: 'naked', engineSize: 125, hasABS: true, difficultyLevel: 'beginner', riskCategory: 'low', beginnerFriendly: true },
  
  // CLASSIC/OLD MODELS (Popular in Ukraine)
  { id: 'kaw_zzr400', brand: 'Kawasaki', model: 'ZZR400', fullName: 'Kawasaki ZZR400', type: 'sport', engineSize: 399, hasABS: false, difficultyLevel: 'intermediate', riskCategory: 'medium', beginnerFriendly: true, popularityRank: 15 },
  { id: 'kaw_zzr600', brand: 'Kawasaki', model: 'ZZR600', fullName: 'Kawasaki ZZR600', type: 'sport', engineSize: 599, hasABS: false, difficultyLevel: 'intermediate', riskCategory: 'medium', beginnerFriendly: false },
  { id: 'hon_cbr400rr', brand: 'Honda', model: 'CBR400RR', fullName: 'Honda CBR400RR', type: 'sport', engineSize: 399, hasABS: false, difficultyLevel: 'intermediate', riskCategory: 'medium', beginnerFriendly: true },
  { id: 'yam_fzr400', brand: 'Yamaha', model: 'FZR400', fullName: 'Yamaha FZR400', type: 'sport', engineSize: 399, hasABS: false, difficultyLevel: 'intermediate', riskCategory: 'medium', beginnerFriendly: true },
  { id: 'yam_fzr600', brand: 'Yamaha', model: 'FZR600', fullName: 'Yamaha FZR600', type: 'sport', engineSize: 599, hasABS: false, difficultyLevel: 'advanced', riskCategory: 'high', beginnerFriendly: false },
  { id: 'suz_gsx400', brand: 'Suzuki', model: 'GSX400', fullName: 'Suzuki GSX400', type: 'sport', engineSize: 399, hasABS: false, difficultyLevel: 'intermediate', riskCategory: 'medium', beginnerFriendly: true },
  { id: 'suz_rf400', brand: 'Suzuki', model: 'RF400', fullName: 'Suzuki RF400', type: 'sport', engineSize: 399, hasABS: false, difficultyLevel: 'intermediate', riskCategory: 'medium', beginnerFriendly: true },
  { id: 'suz_rf600', brand: 'Suzuki', model: 'RF600', fullName: 'Suzuki RF600', type: 'sport', engineSize: 599, hasABS: false, difficultyLevel: 'intermediate', riskCategory: 'medium', beginnerFriendly: false },
  { id: 'kaw_zephyr400', brand: 'Kawasaki', model: 'Zephyr 400', fullName: 'Kawasaki Zephyr 400', type: 'classic', engineSize: 399, hasABS: false, difficultyLevel: 'beginner', riskCategory: 'low', beginnerFriendly: true },
  { id: 'kaw_zephyr750', brand: 'Kawasaki', model: 'Zephyr 750', fullName: 'Kawasaki Zephyr 750', type: 'classic', engineSize: 738, hasABS: false, difficultyLevel: 'intermediate', riskCategory: 'medium', beginnerFriendly: false },
  { id: 'hon_cb400sf', brand: 'Honda', model: 'CB400SF', fullName: 'Honda CB400 Super Four', type: 'naked', engineSize: 399, hasABS: false, difficultyLevel: 'beginner', riskCategory: 'low', beginnerFriendly: true, popularityRank: 12 },
  { id: 'yam_xjr400', brand: 'Yamaha', model: 'XJR400', fullName: 'Yamaha XJR400', type: 'naked', engineSize: 399, hasABS: false, difficultyLevel: 'beginner', riskCategory: 'low', beginnerFriendly: true },
  { id: 'yam_xjr1300', brand: 'Yamaha', model: 'XJR1300', fullName: 'Yamaha XJR1300', type: 'naked', engineSize: 1251, hasABS: false, difficultyLevel: 'advanced', riskCategory: 'high', beginnerFriendly: false },
  { id: 'hon_vfr400', brand: 'Honda', model: 'VFR400', fullName: 'Honda VFR400', type: 'sport', engineSize: 399, hasABS: false, difficultyLevel: 'intermediate', riskCategory: 'medium', beginnerFriendly: true },
  { id: 'hon_vfr800', brand: 'Honda', model: 'VFR800', fullName: 'Honda VFR800', type: 'sport', engineSize: 781, hasABS: false, difficultyLevel: 'intermediate', riskCategory: 'medium', beginnerFriendly: false },
  { id: 'suz_bandit400', brand: 'Suzuki', model: 'Bandit 400', fullName: 'Suzuki Bandit 400', type: 'naked', engineSize: 399, hasABS: false, difficultyLevel: 'beginner', riskCategory: 'low', beginnerFriendly: true, popularityRank: 11 },
  { id: 'suz_bandit600', brand: 'Suzuki', model: 'Bandit 600', fullName: 'Suzuki Bandit 600', type: 'naked', engineSize: 599, hasABS: false, difficultyLevel: 'intermediate', riskCategory: 'medium', beginnerFriendly: true },
  { id: 'kaw_gpz500', brand: 'Kawasaki', model: 'GPZ500S', fullName: 'Kawasaki GPZ500S', type: 'sport', engineSize: 498, hasABS: false, difficultyLevel: 'beginner', riskCategory: 'low', beginnerFriendly: true },
  { id: 'yam_fz400', brand: 'Yamaha', model: 'FZ400', fullName: 'Yamaha FZ400', type: 'naked', engineSize: 399, hasABS: false, difficultyLevel: 'beginner', riskCategory: 'low', beginnerFriendly: true },
  { id: 'other_custom', brand: 'Other', model: 'Custom/Other', fullName: 'Інше', type: 'naked', engineSize: 0, hasABS: false, difficultyLevel: 'beginner', riskCategory: 'medium', beginnerFriendly: false },
  { id: 'hon_cb300r', brand: 'Honda', model: 'CB300R', fullName: 'Honda CB300R', type: 'naked', engineSize: 286, hasABS: true, difficultyLevel: 'beginner', riskCategory: 'low', beginnerFriendly: true },
  { id: 'hon_cb500f', brand: 'Honda', model: 'CB500F', fullName: 'Honda CB500F', type: 'naked', engineSize: 471, hasABS: true, difficultyLevel: 'beginner', riskCategory: 'low', beginnerFriendly: true, popularityRank: 10 },
  { id: 'hon_cb650r', brand: 'Honda', model: 'CB650R', fullName: 'Honda CB650R', type: 'naked', engineSize: 649, hasABS: true, difficultyLevel: 'intermediate', riskCategory: 'medium', beginnerFriendly: true, popularityRank: 5 },
  { id: 'hon_cb1000r', brand: 'Honda', model: 'CB1000R', fullName: 'Honda CB1000R', type: 'naked', engineSize: 998, hasABS: true, difficultyLevel: 'expert', riskCategory: 'high', beginnerFriendly: false },
  { id: 'hon_cbr300r', brand: 'Honda', model: 'CBR300R', fullName: 'Honda CBR300R', type: 'sport', engineSize: 286, hasABS: true, difficultyLevel: 'beginner', riskCategory: 'low', beginnerFriendly: true },
  { id: 'hon_cbr500r', brand: 'Honda', model: 'CBR500R', fullName: 'Honda CBR500R', type: 'sport', engineSize: 471, hasABS: true, difficultyLevel: 'beginner', riskCategory: 'low', beginnerFriendly: true },
  { id: 'hon_cbr600rr', brand: 'Honda', model: 'CBR600RR', fullName: 'Honda CBR600RR', type: 'sport', engineSize: 599, hasABS: true, difficultyLevel: 'advanced', riskCategory: 'high', beginnerFriendly: false, popularityRank: 7 },
  { id: 'hon_cbr650r', brand: 'Honda', model: 'CBR650R', fullName: 'Honda CBR650R', type: 'sport', engineSize: 649, hasABS: true, difficultyLevel: 'intermediate', riskCategory: 'medium', beginnerFriendly: false },
  { id: 'hon_cbr1000rr', brand: 'Honda', model: 'CBR1000RR', fullName: 'Honda CBR1000RR Fireblade', type: 'sport', engineSize: 999, hasABS: true, difficultyLevel: 'expert', riskCategory: 'high', beginnerFriendly: false },
  { id: 'hon_africa', brand: 'Honda', model: 'Africa Twin', fullName: 'Honda Africa Twin', type: 'adventure', engineSize: 1084, hasABS: true, difficultyLevel: 'advanced', riskCategory: 'medium', beginnerFriendly: false },
  { id: 'hon_nc750x', brand: 'Honda', model: 'NC750X', fullName: 'Honda NC750X', type: 'adventure', engineSize: 745, hasABS: true, difficultyLevel: 'intermediate', riskCategory: 'low', beginnerFriendly: true },
  { id: 'hon_rebel500', brand: 'Honda', model: 'Rebel 500', fullName: 'Honda Rebel 500', type: 'cruiser', engineSize: 471, hasABS: true, difficultyLevel: 'beginner', riskCategory: 'low', beginnerFriendly: true },
  { id: 'hon_hornet', brand: 'Honda', model: 'Hornet', fullName: 'Honda Hornet', type: 'naked', engineSize: 755, hasABS: true, difficultyLevel: 'intermediate', riskCategory: 'medium', beginnerFriendly: false, popularityRank: 6 },

  // KAWASAKI
  { id: 'kaw_ninja300', brand: 'Kawasaki', model: 'Ninja 300', fullName: 'Kawasaki Ninja 300', type: 'sport', engineSize: 296, hasABS: true, difficultyLevel: 'beginner', riskCategory: 'low', beginnerFriendly: true },
  { id: 'kaw_ninja400', brand: 'Kawasaki', model: 'Ninja 400', fullName: 'Kawasaki Ninja 400', type: 'sport', engineSize: 399, hasABS: true, difficultyLevel: 'beginner', riskCategory: 'low', beginnerFriendly: true, popularityRank: 9 },
  { id: 'kaw_ninja650', brand: 'Kawasaki', model: 'Ninja 650', fullName: 'Kawasaki Ninja 650', type: 'sport', engineSize: 649, hasABS: true, difficultyLevel: 'intermediate', riskCategory: 'medium', beginnerFriendly: true, popularityRank: 4 },
  { id: 'kaw_zx6r', brand: 'Kawasaki', model: 'ZX-6R', fullName: 'Kawasaki ZX-6R', type: 'sport', engineSize: 636, hasABS: true, difficultyLevel: 'advanced', riskCategory: 'high', beginnerFriendly: false },
  { id: 'kaw_zx10r', brand: 'Kawasaki', model: 'ZX-10R', fullName: 'Kawasaki ZX-10R', type: 'sport', engineSize: 998, hasABS: true, difficultyLevel: 'expert', riskCategory: 'high', beginnerFriendly: false },
  { id: 'kaw_z400', brand: 'Kawasaki', model: 'Z400', fullName: 'Kawasaki Z400', type: 'naked', engineSize: 399, hasABS: true, difficultyLevel: 'beginner', riskCategory: 'low', beginnerFriendly: true },
  { id: 'kaw_z650', brand: 'Kawasaki', model: 'Z650', fullName: 'Kawasaki Z650', type: 'naked', engineSize: 649, hasABS: true, difficultyLevel: 'intermediate', riskCategory: 'medium', beginnerFriendly: true },
  { id: 'kaw_z900', brand: 'Kawasaki', model: 'Z900', fullName: 'Kawasaki Z900', type: 'naked', engineSize: 948, hasABS: true, difficultyLevel: 'advanced', riskCategory: 'high', beginnerFriendly: false },
  { id: 'kaw_z1000', brand: 'Kawasaki', model: 'Z1000', fullName: 'Kawasaki Z1000', type: 'naked', engineSize: 1043, hasABS: true, difficultyLevel: 'expert', riskCategory: 'high', beginnerFriendly: false },
  { id: 'kaw_versys650', brand: 'Kawasaki', model: 'Versys 650', fullName: 'Kawasaki Versys 650', type: 'adventure', engineSize: 649, hasABS: true, difficultyLevel: 'intermediate', riskCategory: 'low', beginnerFriendly: true },
  { id: 'kaw_vulcan', brand: 'Kawasaki', model: 'Vulcan S', fullName: 'Kawasaki Vulcan S', type: 'cruiser', engineSize: 649, hasABS: true, difficultyLevel: 'intermediate', riskCategory: 'low', beginnerFriendly: true },

  // SUZUKI
  { id: 'suz_gsxr125', brand: 'Suzuki', model: 'GSX-R125', fullName: 'Suzuki GSX-R125', type: 'sport', engineSize: 124, hasABS: true, difficultyLevel: 'beginner', riskCategory: 'low', beginnerFriendly: true },
  { id: 'suz_gsxr600', brand: 'Suzuki', model: 'GSX-R600', fullName: 'Suzuki GSX-R600', type: 'sport', engineSize: 599, hasABS: true, difficultyLevel: 'advanced', riskCategory: 'high', beginnerFriendly: false },
  { id: 'suz_gsxr750', brand: 'Suzuki', model: 'GSX-R750', fullName: 'Suzuki GSX-R750', type: 'sport', engineSize: 749, hasABS: true, difficultyLevel: 'advanced', riskCategory: 'high', beginnerFriendly: false },
  { id: 'suz_gsxr1000', brand: 'Suzuki', model: 'GSX-R1000', fullName: 'Suzuki GSX-R1000', type: 'sport', engineSize: 999, hasABS: true, difficultyLevel: 'expert', riskCategory: 'high', beginnerFriendly: false },
  { id: 'suz_sv650', brand: 'Suzuki', model: 'SV650', fullName: 'Suzuki SV650', type: 'naked', engineSize: 645, hasABS: true, difficultyLevel: 'intermediate', riskCategory: 'medium', beginnerFriendly: true, popularityRank: 2 },
  { id: 'suz_vstrom650', brand: 'Suzuki', model: 'V-Strom 650', fullName: 'Suzuki V-Strom 650', type: 'adventure', engineSize: 645, hasABS: true, difficultyLevel: 'intermediate', riskCategory: 'low', beginnerFriendly: true },
  { id: 'suz_vstrom1000', brand: 'Suzuki', model: 'V-Strom 1000', fullName: 'Suzuki V-Strom 1000', type: 'adventure', engineSize: 1037, hasABS: true, difficultyLevel: 'advanced', riskCategory: 'medium', beginnerFriendly: false },

  // ================ EUROPEAN BRANDS ================

  // BMW
  { id: 'bmw_g310r', brand: 'BMW', model: 'G 310 R', fullName: 'BMW G 310 R', type: 'naked', engineSize: 313, hasABS: true, difficultyLevel: 'beginner', riskCategory: 'low', beginnerFriendly: true },
  { id: 'bmw_g310gs', brand: 'BMW', model: 'G 310 GS', fullName: 'BMW G 310 GS', type: 'adventure', engineSize: 313, hasABS: true, difficultyLevel: 'beginner', riskCategory: 'low', beginnerFriendly: true },
  { id: 'bmw_f750gs', brand: 'BMW', model: 'F 750 GS', fullName: 'BMW F 750 GS', type: 'adventure', engineSize: 853, hasABS: true, difficultyLevel: 'intermediate', riskCategory: 'medium', beginnerFriendly: false },
  { id: 'bmw_f850gs', brand: 'BMW', model: 'F 850 GS', fullName: 'BMW F 850 GS', type: 'adventure', engineSize: 853, hasABS: true, difficultyLevel: 'advanced', riskCategory: 'medium', beginnerFriendly: false },
  { id: 'bmw_f900r', brand: 'BMW', model: 'F 900 R', fullName: 'BMW F 900 R', type: 'naked', engineSize: 895, hasABS: true, difficultyLevel: 'intermediate', riskCategory: 'medium', beginnerFriendly: false },
  { id: 'bmw_r1250gs', brand: 'BMW', model: 'R 1250 GS', fullName: 'BMW R 1250 GS', type: 'adventure', engineSize: 1254, hasABS: true, difficultyLevel: 'expert', riskCategory: 'medium', beginnerFriendly: false },
  { id: 'bmw_s1000r', brand: 'BMW', model: 'S 1000 R', fullName: 'BMW S 1000 R', type: 'naked', engineSize: 999, hasABS: true, difficultyLevel: 'expert', riskCategory: 'high', beginnerFriendly: false },
  { id: 'bmw_s1000rr', brand: 'BMW', model: 'S 1000 RR', fullName: 'BMW S 1000 RR', type: 'sport', engineSize: 999, hasABS: true, difficultyLevel: 'expert', riskCategory: 'high', beginnerFriendly: false },

  // KTM
  { id: 'ktm_125duke', brand: 'KTM', model: '125 Duke', fullName: 'KTM 125 Duke', type: 'naked', engineSize: 125, hasABS: true, difficultyLevel: 'beginner', riskCategory: 'low', beginnerFriendly: true },
  { id: 'ktm_200duke', brand: 'KTM', model: '200 Duke', fullName: 'KTM 200 Duke', type: 'naked', engineSize: 200, hasABS: false, difficultyLevel: 'beginner', riskCategory: 'low', beginnerFriendly: true },
  { id: 'ktm_390duke', brand: 'KTM', model: '390 Duke', fullName: 'KTM 390 Duke', type: 'naked', engineSize: 373, hasABS: true, difficultyLevel: 'beginner', riskCategory: 'medium', beginnerFriendly: true },
  { id: 'ktm_690duke', brand: 'KTM', model: '690 Duke', fullName: 'KTM 690 Duke', type: 'naked', engineSize: 693, hasABS: true, difficultyLevel: 'intermediate', riskCategory: 'medium', beginnerFriendly: false },
  { id: 'ktm_790duke', brand: 'KTM', model: '790 Duke', fullName: 'KTM 790 Duke', type: 'naked', engineSize: 799, hasABS: true, difficultyLevel: 'advanced', riskCategory: 'high', beginnerFriendly: false },
  { id: 'ktm_890duke', brand: 'KTM', model: '890 Duke', fullName: 'KTM 890 Duke', type: 'naked', engineSize: 889, hasABS: true, difficultyLevel: 'advanced', riskCategory: 'high', beginnerFriendly: false },
  { id: 'ktm_1290duke', brand: 'KTM', model: '1290 Super Duke', fullName: 'KTM 1290 Super Duke', type: 'naked', engineSize: 1301, hasABS: true, difficultyLevel: 'expert', riskCategory: 'high', beginnerFriendly: false },
  { id: 'ktm_rc390', brand: 'KTM', model: 'RC 390', fullName: 'KTM RC 390', type: 'sport', engineSize: 373, hasABS: true, difficultyLevel: 'beginner', riskCategory: 'medium', beginnerFriendly: false },
  { id: 'ktm_390adv', brand: 'KTM', model: '390 Adventure', fullName: 'KTM 390 Adventure', type: 'adventure', engineSize: 373, hasABS: true, difficultyLevel: 'beginner', riskCategory: 'low', beginnerFriendly: true },
  { id: 'ktm_790adv', brand: 'KTM', model: '790 Adventure', fullName: 'KTM 790 Adventure', type: 'adventure', engineSize: 799, hasABS: true, difficultyLevel: 'advanced', riskCategory: 'medium', beginnerFriendly: false },

  // DUCATI
  { id: 'duc_scrambler', brand: 'Ducati', model: 'Scrambler Icon', fullName: 'Ducati Scrambler Icon', type: 'classic', engineSize: 803, hasABS: true, difficultyLevel: 'intermediate', riskCategory: 'medium', beginnerFriendly: false },
  { id: 'duc_monster', brand: 'Ducati', model: 'Monster', fullName: 'Ducati Monster', type: 'naked', engineSize: 937, hasABS: true, difficultyLevel: 'advanced', riskCategory: 'high', beginnerFriendly: false },
  { id: 'duc_streetfighter', brand: 'Ducati', model: 'Streetfighter V4', fullName: 'Ducati Streetfighter V4', type: 'naked', engineSize: 1103, hasABS: true, difficultyLevel: 'expert', riskCategory: 'high', beginnerFriendly: false },
  { id: 'duc_panigale', brand: 'Ducati', model: 'Panigale V4', fullName: 'Ducati Panigale V4', type: 'sport', engineSize: 1103, hasABS: true, difficultyLevel: 'expert', riskCategory: 'high', beginnerFriendly: false },
  { id: 'duc_multistrada', brand: 'Ducati', model: 'Multistrada V4', fullName: 'Ducati Multistrada V4', type: 'adventure', engineSize: 1158, hasABS: true, difficultyLevel: 'expert', riskCategory: 'medium', beginnerFriendly: false },

  // TRIUMPH
  { id: 'tri_trident', brand: 'Triumph', model: 'Trident 660', fullName: 'Triumph Trident 660', type: 'naked', engineSize: 660, hasABS: true, difficultyLevel: 'intermediate', riskCategory: 'medium', beginnerFriendly: true },
  { id: 'tri_street', brand: 'Triumph', model: 'Street Triple', fullName: 'Triumph Street Triple', type: 'naked', engineSize: 765, hasABS: true, difficultyLevel: 'advanced', riskCategory: 'high', beginnerFriendly: false },
  { id: 'tri_speedtriple', brand: 'Triumph', model: 'Speed Triple', fullName: 'Triumph Speed Triple', type: 'naked', engineSize: 1200, hasABS: true, difficultyLevel: 'expert', riskCategory: 'high', beginnerFriendly: false },
  { id: 'tri_bonneville', brand: 'Triumph', model: 'Bonneville T120', fullName: 'Triumph Bonneville T120', type: 'classic', engineSize: 1200, hasABS: true, difficultyLevel: 'intermediate', riskCategory: 'low', beginnerFriendly: false },
  { id: 'tri_tiger', brand: 'Triumph', model: 'Tiger 900', fullName: 'Triumph Tiger 900', type: 'adventure', engineSize: 888, hasABS: true, difficultyLevel: 'advanced', riskCategory: 'medium', beginnerFriendly: false },

  // APRILIA
  { id: 'apr_rs125', brand: 'Aprilia', model: 'RS 125', fullName: 'Aprilia RS 125', type: 'sport', engineSize: 125, hasABS: true, difficultyLevel: 'beginner', riskCategory: 'low', beginnerFriendly: true },
  { id: 'apr_rs660', brand: 'Aprilia', model: 'RS 660', fullName: 'Aprilia RS 660', type: 'sport', engineSize: 659, hasABS: true, difficultyLevel: 'intermediate', riskCategory: 'medium', beginnerFriendly: false },
  { id: 'apr_tuono660', brand: 'Aprilia', model: 'Tuono 660', fullName: 'Aprilia Tuono 660', type: 'naked', engineSize: 659, hasABS: true, difficultyLevel: 'intermediate', riskCategory: 'medium', beginnerFriendly: false },
  { id: 'apr_tuonov4', brand: 'Aprilia', model: 'Tuono V4', fullName: 'Aprilia Tuono V4', type: 'naked', engineSize: 1077, hasABS: true, difficultyLevel: 'expert', riskCategory: 'high', beginnerFriendly: false },

  // ================ AMERICAN BRANDS ================

  // HARLEY-DAVIDSON
  { id: 'hd_street500', brand: 'Harley-Davidson', model: 'Street 500', fullName: 'Harley-Davidson Street 500', type: 'cruiser', engineSize: 494, hasABS: true, difficultyLevel: 'beginner', riskCategory: 'low', beginnerFriendly: true },
  { id: 'hd_iron883', brand: 'Harley-Davidson', model: 'Iron 883', fullName: 'Harley-Davidson Iron 883', type: 'cruiser', engineSize: 883, hasABS: true, difficultyLevel: 'intermediate', riskCategory: 'low', beginnerFriendly: false },
  { id: 'hd_sportster', brand: 'Harley-Davidson', model: 'Sportster S', fullName: 'Harley-Davidson Sportster S', type: 'cruiser', engineSize: 1252, hasABS: true, difficultyLevel: 'advanced', riskCategory: 'medium', beginnerFriendly: false },
  { id: 'hd_fatbob', brand: 'Harley-Davidson', model: 'Fat Bob', fullName: 'Harley-Davidson Fat Bob', type: 'cruiser', engineSize: 1868, hasABS: true, difficultyLevel: 'expert', riskCategory: 'medium', beginnerFriendly: false },

  // INDIAN
  { id: 'ind_scout', brand: 'Indian', model: 'Scout', fullName: 'Indian Scout', type: 'cruiser', engineSize: 1133, hasABS: true, difficultyLevel: 'intermediate', riskCategory: 'low', beginnerFriendly: false },
  { id: 'ind_ftr', brand: 'Indian', model: 'FTR 1200', fullName: 'Indian FTR 1200', type: 'naked', engineSize: 1203, hasABS: true, difficultyLevel: 'advanced', riskCategory: 'medium', beginnerFriendly: false },

  // ================ CHINESE BRANDS ================

  // CFMOTO
  { id: 'cfm_300nk', brand: 'CFMOTO', model: '300NK', fullName: 'CFMOTO 300NK', type: 'naked', engineSize: 292, hasABS: true, difficultyLevel: 'beginner', riskCategory: 'low', beginnerFriendly: true },
  { id: 'cfm_650nk', brand: 'CFMOTO', model: '650NK', fullName: 'CFMOTO 650NK', type: 'naked', engineSize: 649, hasABS: true, difficultyLevel: 'intermediate', riskCategory: 'medium', beginnerFriendly: true },
  { id: 'cfm_650mt', brand: 'CFMOTO', model: '650MT', fullName: 'CFMOTO 650MT', type: 'adventure', engineSize: 649, hasABS: true, difficultyLevel: 'intermediate', riskCategory: 'low', beginnerFriendly: true },

  // BENELLI
  { id: 'ben_tnt125', brand: 'Benelli', model: 'TNT 125', fullName: 'Benelli TNT 125', type: 'naked', engineSize: 125, hasABS: false, difficultyLevel: 'beginner', riskCategory: 'low', beginnerFriendly: true },
  { id: 'ben_302s', brand: 'Benelli', model: '302S', fullName: 'Benelli 302S', type: 'sport', engineSize: 300, hasABS: true, difficultyLevel: 'beginner', riskCategory: 'low', beginnerFriendly: true },
  { id: 'ben_502c', brand: 'Benelli', model: '502C', fullName: 'Benelli 502C', type: 'cruiser', engineSize: 500, hasABS: true, difficultyLevel: 'intermediate', riskCategory: 'low', beginnerFriendly: true },
  { id: 'ben_trk502', brand: 'Benelli', model: 'TRK 502', fullName: 'Benelli TRK 502', type: 'adventure', engineSize: 500, hasABS: true, difficultyLevel: 'intermediate', riskCategory: 'low', beginnerFriendly: true },

  // ZONTES
  { id: 'zon_310r', brand: 'Zontes', model: '310R', fullName: 'Zontes 310R', type: 'naked', engineSize: 312, hasABS: true, difficultyLevel: 'beginner', riskCategory: 'low', beginnerFriendly: true },
  { id: 'zon_310x', brand: 'Zontes', model: '310X', fullName: 'Zontes 310X', type: 'adventure', engineSize: 312, hasABS: true, difficultyLevel: 'beginner', riskCategory: 'low', beginnerFriendly: true },

  // LIFAN
  { id: 'lif_kpr150', brand: 'Lifan', model: 'KPR 150', fullName: 'Lifan KPR 150', type: 'sport', engineSize: 150, hasABS: false, difficultyLevel: 'beginner', riskCategory: 'low', beginnerFriendly: true },
  { id: 'lif_kpt200', brand: 'Lifan', model: 'KPT 200', fullName: 'Lifan KPT 200', type: 'adventure', engineSize: 200, hasABS: false, difficultyLevel: 'beginner', riskCategory: 'low', beginnerFriendly: true },

  // LONCIN
  { id: 'lon_voge300', brand: 'Loncin', model: 'Voge 300R', fullName: 'Loncin Voge 300R', type: 'sport', engineSize: 292, hasABS: true, difficultyLevel: 'beginner', riskCategory: 'low', beginnerFriendly: true },
  { id: 'lon_voge500', brand: 'Loncin', model: 'Voge 500R', fullName: 'Loncin Voge 500R', type: 'sport', engineSize: 471, hasABS: true, difficultyLevel: 'intermediate', riskCategory: 'medium', beginnerFriendly: true },

  // ================ INDIAN BRANDS ================

  // BAJAJ
  { id: 'baj_pulsar125', brand: 'Bajaj', model: 'Pulsar 125', fullName: 'Bajaj Pulsar 125', type: 'naked', engineSize: 125, hasABS: false, difficultyLevel: 'beginner', riskCategory: 'low', beginnerFriendly: true },
  { id: 'baj_pulsar200', brand: 'Bajaj', model: 'Pulsar NS200', fullName: 'Bajaj Pulsar NS200', type: 'naked', engineSize: 200, hasABS: true, difficultyLevel: 'beginner', riskCategory: 'low', beginnerFriendly: true },
  { id: 'baj_dominar', brand: 'Bajaj', model: 'Dominar 400', fullName: 'Bajaj Dominar 400', type: 'touring', engineSize: 373, hasABS: true, difficultyLevel: 'intermediate', riskCategory: 'low', beginnerFriendly: true },

  // TVS
  { id: 'tvs_apache160', brand: 'TVS', model: 'Apache RTR 160', fullName: 'TVS Apache RTR 160', type: 'naked', engineSize: 160, hasABS: false, difficultyLevel: 'beginner', riskCategory: 'low', beginnerFriendly: true },
  { id: 'tvs_apache200', brand: 'TVS', model: 'Apache RTR 200', fullName: 'TVS Apache RTR 200', type: 'naked', engineSize: 200, hasABS: true, difficultyLevel: 'beginner', riskCategory: 'low', beginnerFriendly: true },

  // ROYAL ENFIELD
  { id: 're_classic350', brand: 'Royal Enfield', model: 'Classic 350', fullName: 'Royal Enfield Classic 350', type: 'classic', engineSize: 349, hasABS: true, difficultyLevel: 'beginner', riskCategory: 'low', beginnerFriendly: true },
  { id: 're_meteor350', brand: 'Royal Enfield', model: 'Meteor 350', fullName: 'Royal Enfield Meteor 350', type: 'cruiser', engineSize: 349, hasABS: true, difficultyLevel: 'beginner', riskCategory: 'low', beginnerFriendly: true },
  { id: 're_himalayan', brand: 'Royal Enfield', model: 'Himalayan', fullName: 'Royal Enfield Himalayan', type: 'adventure', engineSize: 411, hasABS: true, difficultyLevel: 'beginner', riskCategory: 'low', beginnerFriendly: true },
  { id: 're_interceptor', brand: 'Royal Enfield', model: 'Interceptor 650', fullName: 'Royal Enfield Interceptor 650', type: 'classic', engineSize: 648, hasABS: true, difficultyLevel: 'intermediate', riskCategory: 'low', beginnerFriendly: true },
]

// Helper functions for motorcycle data
export function getPopularMotorcycles(limit: number = 10): Motorcycle[] {
  return MOTORCYCLES_DATABASE
    .filter(m => m.popularityRank !== undefined)
    .sort((a, b) => (a.popularityRank || 999) - (b.popularityRank || 999))
    .slice(0, limit)
}

export function getBeginnerFriendlyMotorcycles(): Motorcycle[] {
  return MOTORCYCLES_DATABASE.filter(m => m.beginnerFriendly)
}

export function searchMotorcycles(query: string): Motorcycle[] {
  const lowercaseQuery = query.toLowerCase()
  return MOTORCYCLES_DATABASE.filter(m => 
    m.brand.toLowerCase().includes(lowercaseQuery) ||
    m.model.toLowerCase().includes(lowercaseQuery) ||
    m.fullName.toLowerCase().includes(lowercaseQuery)
  )
}

export function getMotorcyclesByType(type: Motorcycle['type']): Motorcycle[] {
  return MOTORCYCLES_DATABASE.filter(m => m.type === type)
}

export function categorizeForBeginner(motorcycle: Motorcycle): 'RECOMMENDED' | 'NEUTRAL' | 'NOT_RECOMMENDED' {
  if (motorcycle.engineSize <= 400 && motorcycle.hasABS && motorcycle.beginnerFriendly) {
    return 'RECOMMENDED'
  }
  if (motorcycle.engineSize > 600 && motorcycle.type === 'sport') {
    return 'NOT_RECOMMENDED'
  }
  if (motorcycle.riskCategory === 'high') {
    return 'NOT_RECOMMENDED'
  }
  return 'NEUTRAL'
}