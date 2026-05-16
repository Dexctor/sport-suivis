// All static program data extracted from the original tracker.
// Keep this file pure data so the schema is easy to tweak.

export type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest: number;
  type: 'compound' | 'mid' | 'isolation';
  tip: string;
};

export type Session = {
  id: string;
  name: string;
  day: 'LUN' | 'MAR' | 'MER' | 'JEU' | 'VEN' | 'SAM' | 'DIM';
  focus: string;
  duration: number;
  exercises: Exercise[];
};

export type Phase = {
  num: number;
  name: string;
  startWeek: number;
  endWeek: number;
  type: 'cut' | 'maintenance';
  startWeight: number;
  endWeight: number;
  desc: string;
  focus: string;
};

export const PROGRAM = {
  startWeight: 98,
  targetWeight: 79,
  height: 184,
  age: 30,
  startBF: 27,
  targetBF: 11,
  totalWeeks: 48,
  diet: {
    maintenanceCalories: 2880,
    cutCalories: 2380,
    refeedCalories: 2880,
    protein: 180,
    fats: 75,
    carbs: 235,
  },
  sessions: [
    {
      id: 'push', name: 'PUSH', day: 'LUN', focus: 'PECS / ÉPAULES / TRICEPS', duration: 65,
      exercises: [
        { id: 'dc-push', name: 'Développé couché machine ou Smith', sets: 4, reps: '8-10', rest: 150, type: 'compound',
          tip: '★ Machine convergente IDÉALE pour ton épaule (trajectoire guidée). Sinon Smith. Évite barre libre si l\'épaule chauffe. Coudes à ~45° du buste, pas écartés à 90°. Descente 2-3s, pas de rebond sur la poitrine.' },
        { id: 'dvi-push', name: 'Développé incliné haltères prise neutre', sets: 3, reps: '10-12', rest: 120, type: 'compound',
          tip: 'Banc à 30°, paumes face à face. La prise neutre réduit massivement le stress sur l\'épaule antérieure et le labrum. Coudes restent légèrement en avant du buste, pas alignés avec les épaules.' },
        { id: 'dep-push', name: 'Développé épaules ASSIS machine', sets: 4, reps: '10-12', rest: 120, type: 'compound',
          tip: '⚠ JAMAIS barre derrière la nuque. Machine assise avec dossier (Hammer Strength ou similaire). Prise neutre si dispo. Ne descend pas en dessous de l\'oreille → pré-pince labrum.' },
        { id: 'lat-push', name: 'Élévations latérales haltères', sets: 4, reps: '12-15', rest: 60, type: 'isolation',
          tip: 'NE PAS dépasser l\'horizontale (acromion → conflit sous-acromial). Légère flexion du coude, pouces légèrement vers le haut (pas vers le bas → impingement). Tempo : 1s montée, 2s descente.' },
        { id: 'pec-push', name: 'Écartés poulie vis-à-vis (de bas en haut)', sets: 3, reps: '12-15', rest: 75, type: 'isolation',
          tip: 'Poulies basses, mouvement de bas vers le haut (hug a tree inversé). Évite la position basse extrême qui sollicite le labrum antérieur. Contraction au centre, pas d\'overstretch.' },
        { id: 'tri-push', name: 'Extensions triceps poulie haute (corde)', sets: 3, reps: '12', rest: 60, type: 'isolation',
          tip: 'Coudes COLLÉS au corps, étirement complet en haut, écarter la corde en bas. Pause 1s en contraction.' },
        { id: 'dip-push', name: 'Extensions triceps barre EZ couché', sets: 3, reps: '10-12', rest: 60, type: 'isolation',
          tip: 'Allongé sur banc plat, barre EZ vers le front (skull crusher). Garde les coudes parallèles, ne les laisse pas s\'écarter. Alternative s\'il tire dans les coudes : kickbacks haltères.' },
      ],
    },
    {
      id: 'pull', name: 'PULL', day: 'MAR', focus: 'DOS / BICEPS / REAR DELTS', duration: 65,
      exercises: [
        { id: 'row-pull', name: 'Rowing machine pectorale soutenue (REPÈRE)', sets: 4, reps: '8-10', rest: 150, type: 'compound',
          tip: '★★ TON EXO REPÈRE pour la surcharge progressive du Pull. Chest-supported : buste calé sur le coussin → ZÉRO charge lombaire. Prise neutre, tirer vers le bas du sternum, scapulas serrées en fin, pause 1s. Vise +2,5kg chaque semaine où tu boucles les reps en RPE 8.' },
        { id: 'tir-pull', name: 'Tirage vertical prise neutre', sets: 4, reps: '10-12', rest: 120, type: 'compound',
          tip: 'Étrier en V ou barre parallèle. JAMAIS derrière la nuque (impingement + risque labrum). Tirer vers le haut de la poitrine, scapulas en bas et arrière en fin de mouvement, pause 1s.' },
        { id: 'pull-pull', name: 'Pull-over poulie haute (bras tendus)', sets: 3, reps: '12-15', rest: 90, type: 'mid',
          tip: 'Debout face à poulie haute, barre droite ou corde. Bras quasi-tendus, descendre jusqu\'aux cuisses en contractant le grand dorsal. Pas d\'arc lombaire excessif.' },
        { id: 'low-pull', name: 'Rowing assis poulie basse prise neutre', sets: 3, reps: '12', rest: 90, type: 'mid',
          tip: 'Étrier en V, dos droit (pas penché en avant), tirer vers le nombril. Scapulas serrées en fin, pause 1s. C\'est un exo d\'isolation du milieu du dos, charge modérée.' },
        { id: 'face-pull', name: 'Face pull poulie haute (corde)', sets: 4, reps: '15-20', rest: 60, type: 'isolation',
          tip: '★★ EXERCICE LE PLUS IMPORTANT POUR TON ÉPAULE. Corde à hauteur de visage, coudes HAUTS (au-dessus des épaules), tirer vers le front en rotation externe. À FAIRE chaque séance Pull. Charge légère, focus contraction.' },
        { id: 'rear-pull', name: 'Rear delt pec-deck UNILATÉRAL', sets: 4, reps: '15-20', rest: 60, type: 'isolation',
          tip: '★ Pec-deck inversé en UNILATÉRAL (un bras à la fois). Charge LÉGÈRE → ça doit brûler comme un exo épaule. Isolation pure de l\'arrière d\'épaule, critique pour ta posture et désengorger l\'avant. L\'unilatéral force le focus mind-muscle.' },
        { id: 'curl-pull', name: 'Curl biceps incliné haltères', sets: 3, reps: '10-12', rest: 60, type: 'isolation',
          tip: 'Banc à 60°, bras complètement pendant pour étirement max du biceps. Supination en montée. Excentrique 3s.' },
        { id: 'mart-pull', name: 'Curl marteau corde poulie basse', sets: 3, reps: '12', rest: 60, type: 'isolation',
          tip: 'Prise neutre (cible le brachial + brachio-radial = bras plus épais). Coudes le long du corps, contraction max en haut.' },
      ],
    },
    {
      id: 'legs', name: 'LEGS', day: 'JEU', focus: 'JAMBES / FESSIERS / CORE', duration: 70,
      exercises: [
        { id: 'hack-legs', name: 'Hack squat ou pendulum squat', sets: 4, reps: '8-10', rest: 180, type: 'compound',
          tip: '★ Substitut PARFAIT du squat barre pour ton dos. La charge passe dans l\'axe vertical sans compression discale. Pieds au milieu de la plate-forme. Descendre jusqu\'à cuisses parallèles (pas plus → flexion lombaire).' },
        { id: 'hip-legs', name: 'Hip thrust barre', sets: 4, reps: '10-12', rest: 150, type: 'compound',
          tip: 'Le ROI des fessiers, ZÉRO charge axiale → safe L5-S1. Dos calé sur banc, mousse épaisse sur la barre. Verrouille les fessiers 1s en haut. Si banc trop haut ou bas → ajuste avec un step.' },
        { id: 'press-legs', name: 'Presse à cuisses 45°', sets: 3, reps: '10-12', rest: 150, type: 'compound',
          tip: '⚠ Bas du dos PLAQUÉ contre le dossier en permanence. Ne descend PAS trop bas (genoux qui rentrent vers la poitrine = lombaires qui se courbent). Pieds en haut de la plate-forme pour cibler fessiers/ischios.' },
        { id: 'rdl-legs', name: 'SDT roumain haltères (light + technique)', sets: 3, reps: '10', rest: 120, type: 'compound',
          tip: '⚠ Dos PARFAITEMENT gainé, charges raisonnables. Bascule la hanche en arrière, légère flexion des genoux. Si ça tire dans le bas du dos AVANT de sentir les ischios → remplace par leg curl assis lourd.' },
        { id: 'curl-legs', name: 'Leg curl couché UNILATÉRAL (séries longues)', sets: 4, reps: '12-20', rest: 75, type: 'isolation',
          tip: '★ Une jambe à la fois, séries LONGUES (12-20 reps). Charge modérée, technique parfaite. Pointes de pieds vers les tibias = recrutement max ischios. Excentrique 3s. Approche "destruction par volume" pour des jambes sans se blesser.' },
        { id: 'ext-legs', name: 'Leg extension UNILATÉRAL (séries longues)', sets: 4, reps: '12-20', rest: 75, type: 'isolation',
          tip: '★ Une jambe à la fois, séries LONGUES (12-20 reps). Charge modérée → brûlure maximale. Amplitude complète, contraction franche 1s en haut. Méthode safe + efficace pour la croissance quadriceps.' },
        { id: 'mol-legs', name: 'Mollets debout machine ou presse', sets: 4, reps: '12-15', rest: 60, type: 'isolation',
          tip: 'Sur machine ou à la presse (charge dans les pieds, pas sur les épaules → safe). Amplitude complète, pause 1s en bas (étirement), pause 1s en haut (contraction).' },
        { id: 'abs-legs', name: 'Crunchs câble agenouillé', sets: 3, reps: '12-15', rest: 60, type: 'isolation',
          tip: 'À genoux face à poulie haute, corde derrière la nuque. Flexion du buste vers le bassin (PAS de traction sur la nuque). Rétroversion du bassin en fin de mouvement, pas d\'hyper-extension lombaire.' },
      ],
    },
    {
      id: 'upper', name: 'UPPER PUMP', day: 'VEN', focus: 'RAPPEL HAUT / BRAS / DELTS', duration: 50,
      exercises: [
        { id: 'pec-upper', name: 'Développé incliné machine', sets: 3, reps: '12-15', rest: 90, type: 'compound',
          tip: 'Séance focus pump : charges plus légères, plus de reps, repos plus courts. Machine pour sécuriser l\'épaule. Inclinaison 30°, contraction au sommet 1s.' },
        { id: 'row-upper', name: 'Rowing machine pectorale soutenue', sets: 3, reps: '12-15', rest: 90, type: 'compound',
          tip: 'Chest-supported, prise neutre. Cherche la brûlure, pas la charge max. Scapulas en fin de mouvement.' },
        { id: 'face-upper', name: 'Face pull poulie (rappel)', sets: 3, reps: '15-20', rest: 60, type: 'isolation',
          tip: 'Encore un rappel face pull. Tu n\'en feras JAMAIS trop pour ton épaule. Charge légère, contraction maximale en rotation externe.' },
        { id: 'lat-upper', name: 'Élévations latérales (drop set sur dernière série)', sets: 4, reps: '12-15', rest: 60, type: 'isolation',
          tip: 'Sur la dernière série : épuisement puis -50% du poids et continuer jusqu\'à l\'échec. Sans dépasser l\'horizontale.' },
        { id: 'rear-upper', name: 'Rear delt poulie ou pec-deck inversé', sets: 4, reps: '15', rest: 60, type: 'isolation',
          tip: 'Pec-deck inversé OU butterfly poulie vis-à-vis. Cible l\'arrière de l\'épaule (souvent négligé). Critique pour équilibrer ta posture et désengorger l\'avant de l\'épaule.' },
        { id: 'curl-upper', name: 'Curl biceps barre EZ', sets: 3, reps: '10-12', rest: 60, type: 'isolation',
          tip: 'Barre EZ = poignets neutres = pas de stress articulaire. Coudes COLLÉS au corps, pas de balancement. Excentrique contrôlé.' },
        { id: 'tri-upper', name: 'Dips entre 2 bancs OU triceps poulie inverse', sets: 3, reps: '10-12', rest: 60, type: 'isolation',
          tip: '⚠ Dips entre 2 bancs (pas dips parallèles → position épaule vulnérable). Descente contrôlée, ne descend pas plus bas que coudes à 90°. Si épaule sensible : remplace par extensions triceps poulie en prise inversée.' },
      ],
    },
  ] as Session[],
  forbidden: [
    { name: 'Squat barre dos lourd', reason: 'Compression L5-S1' },
    { name: 'Soulevé de terre conventionnel barre', reason: 'Compression L5-S1' },
    { name: 'Développé militaire debout charge max', reason: 'Épaule + colonne' },
    { name: 'Dips profonds', reason: 'Position épaule vulnérable' },
    { name: 'Écartés haltères position basse extrême', reason: 'Labrum antérieur' },
    { name: 'Développé nuque / tractions nuque', reason: 'Rotation externe + abduction' },
  ],
  diet_foods: [
    { name: 'Œufs entiers (boîte de 30)', price: '~6,50€', macros: '6g prot/œuf · cycle complet AA' },
    { name: 'Fromage blanc 0% (1kg)', price: '~2€', macros: '80g prot/kg · caséine lente' },
    { name: 'Filet de poulet surgelé (1kg)', price: '~10€', macros: '23g prot/100g · base solide' },
    { name: 'Thon en boîte au naturel', price: '~1,50€/boîte', macros: '20g prot/boîte · oméga-3' },
    { name: 'Lentilles sèches (1kg)', price: '~2€', macros: '25g prot/100g sec + fibres' },
    { name: "Flocons d'avoine (1kg)", price: '~2,50€', macros: 'Glucides lents, satiété' },
    { name: 'Whey (1kg marque éco)', price: '~20€', macros: '23g prot/dose · post-séance' },
    { name: 'Skyr nature (450g)', price: '~2,50€', macros: '50g prot · texture épaisse' },
  ],
};

export const PHASES: Phase[] = [
  { num: 1, name: 'CUT #1 · FOUNDATION', startWeek: 1, endWeek: 12, type: 'cut',
    startWeight: 98, endWeight: 91.5,
    desc: 'Établir le déficit, sortir du surpoids. Perte rapide initiale (eau + glycogène) puis stabilisation à 0,5kg/sem.',
    focus: 'Mise en place des habitudes : 4 séances/sem, 180g protéines, 7-8h sommeil, 2,200-2,400 kcal.' },
  { num: 2, name: 'MAINTENANCE #1', startWeek: 13, endWeek: 14, type: 'maintenance',
    startWeight: 91.5, endWeight: 91.5,
    desc: 'Refeed hormonal. Remontée calories à maintenance pour restaurer leptine, T3 et préserver la masse maigre.',
    focus: 'Augmenter à 2,800 kcal. Garder les protéines hautes. Bien dormir. Pas de pesée stressante.' },
  { num: 3, name: 'CUT #2 · MOMENTUM', startWeek: 15, endWeek: 26, type: 'cut',
    startWeight: 91.5, endWeight: 86,
    desc: 'Reprise du déficit avec sensibilité métabolique restaurée. Visible début de définition abdominale.',
    focus: 'Déficit 500 kcal. Charges en muscu ne baissent pas (signe que muscle préservé).' },
  { num: 4, name: 'MAINTENANCE #2', startWeek: 27, endWeek: 28, type: 'maintenance',
    startWeight: 86, endWeight: 86,
    desc: 'Deuxième refeed. Plus important psychologiquement à ce stade.',
    focus: "Profiter, manger des glucides, recharger glycogène. Repérer photos d'avancement." },
  { num: 5, name: 'CUT #3 · DEFINITION', startWeek: 29, endWeek: 38, type: 'cut',
    startWeight: 86, endWeight: 81.5,
    desc: 'Zone où les abdos commencent à émerger franchement. Patience requise, progression plus lente.',
    focus: 'Déficit légèrement plus agressif possible si forme tient. Ajout de NEAT (marche).' },
  { num: 6, name: 'FINAL SHRED', startWeek: 39, endWeek: 48, type: 'cut',
    startWeight: 81.5, endWeight: 79,
    desc: 'Dernière phase pour atteindre 10-12% BF. Plateaux fréquents, demande discipline maximale.',
    focus: 'Tracking précis. Mini-refeeds (1 jour/sem en maintenance). Cardio 3x/sem.' },
];
