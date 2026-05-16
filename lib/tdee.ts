// TDEE calculation - Mifflin-St Jeor + activity factor.

export type Sex = 'M' | 'F';

// Mifflin-St Jeor BMR (kcal/day) — the most accurate equation for general use.
// Men:   10 * kg + 6.25 * cm - 5 * age + 5
// Women: 10 * kg + 6.25 * cm - 5 * age - 161
export function bmr(weightKg: number, heightCm: number, age: number, sex: Sex): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return Math.round(sex === 'M' ? base + 5 : base - 161);
}

export const ACTIVITY_LEVELS = [
  { value: 1.2, label: 'Sédentaire', desc: 'Bureau, peu de marche, 0 sport' },
  { value: 1.375, label: 'Léger', desc: '1-3 séances/sem, marche occasionnelle' },
  { value: 1.55, label: 'Modéré', desc: '4-5 séances/sem + activité quotidienne' },
  { value: 1.725, label: 'Élevé', desc: '6+ séances/sem ou job physique' },
  { value: 1.9, label: 'Très élevé', desc: 'Athlète, 2 séances/jour, job très physique' },
] as const;

export function tdee(weightKg: number, heightCm: number, age: number, sex: Sex, activityLevel: number): number {
  return Math.round(bmr(weightKg, heightCm, age, sex) * activityLevel);
}

// Macro split for cut/recomp:
// - Protein: 2.0g per kg body weight (preserves lean mass in deficit)
// - Fats: 0.9g per kg (minimum for hormonal health)
// - Carbs: the remainder
export type MacroTargets = {
  calories: number;
  protein_g: number;
  fats_g: number;
  carbs_g: number;
};

export function macros(targetCalories: number, weightKg: number): MacroTargets {
  const protein_g = Math.round(weightKg * 2.0);
  const fats_g = Math.round(weightKg * 0.9);
  const proteinKcal = protein_g * 4;
  const fatKcal = fats_g * 9;
  const carbKcal = Math.max(0, targetCalories - proteinKcal - fatKcal);
  const carbs_g = Math.round(carbKcal / 4);
  return { calories: targetCalories, protein_g, fats_g, carbs_g };
}
