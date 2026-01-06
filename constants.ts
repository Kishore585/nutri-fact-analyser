import { UserProfile } from './types';

export const PROFILES: UserProfile[] = [
  {
    id: 'general',
    name: 'General Wellness',
    description: 'Balance and overall health. Avoid heavily processed foods.',
    icon: 'heart',
    color: 'bg-emerald-500',
    promptContext: 'Focus on overall health, identifying highly processed ingredients, excessive sugar, and artificial additives.'
  },
  {
    id: 'diabetes',
    name: 'Diabetes / Low GI',
    description: 'Manage blood sugar. Avoid hidden sugars and high carbs.',
    icon: 'activity',
    color: 'bg-blue-500',
    promptContext: 'Strictly identify all forms of sugar (including hidden ones like maltodextrin, dextrose), high glycemic index ingredients, and refined carbohydrates.'
  },
  {
    id: 'muscle',
    name: 'Muscle Building',
    description: 'High protein, clean energy. Good for hypertrophy.',
    icon: 'dumbbell',
    color: 'bg-orange-500',
    promptContext: 'Focus on protein quality, identifying good carb sources for energy, and flagging empty calories that do not contribute to muscle growth.'
  },
  {
    id: 'gluten-free',
    name: 'Celiac / Gluten Free',
    description: 'Strict avoidance of wheat, barley, and rye.',
    icon: 'wheat-off',
    color: 'bg-amber-500',
    promptContext: 'Strictly flag any gluten-containing ingredients (wheat, barley, rye, triticale) and potential cross-contamination risks.'
  },
  {
    id: 'vegan',
    name: 'Vegan',
    description: 'No animal products. Plant-based only.',
    icon: 'leaf',
    color: 'bg-green-600',
    promptContext: 'Strictly flag any animal-derived ingredients (dairy, eggs, honey, gelatin, carmine, etc.).'
  },
  {
    id: 'allergies',
    name: 'Common Allergens',
    description: 'Avoid nuts, soy, dairy, eggs, and shellfish.',
    icon: 'shield-alert',
    color: 'bg-red-500',
    promptContext: 'Highlight common allergens: peanuts, tree nuts, milk, eggs, soy, wheat, fish, shellfish.'
  }
];
