export type KnowledgeItem = { title: string; text: string };
export type KnowledgeCategory = {
  key: string;
  title: string;
  iconName: 'sleep' | 'nutrition' | 'training' | 'recovery' | 'mindset';
  intro: string;
  items: KnowledgeItem[];
};

export const KNOWLEDGE: KnowledgeCategory[] = [
  {
    key: 'sleep',
    title: 'SOMMEIL',
    iconName: 'sleep',
    intro:
      "Le sommeil est LE facteur le plus sous-estimé. Une nuit blanche = ~25% de testostérone en moins le lendemain et ~20% de capacité de construction musculaire perdue. C'est pendant le sommeil profond que la GH et la testo culminent.",
    items: [
      { title: '7 À 9 HEURES NON-NÉGOCIABLES', text: 'En dessous de 7h, hormones anaboliques (testo, GH, IGF-1) chutent et cortisol monte. Au-dessus de 9h, peu de bénéfices supplémentaires.' },
      { title: 'HORAIRES CONSTANTS', text: 'Se coucher et se lever à des horaires fixes (±30 min) est plus important que la durée totale. Le rythme circadien régule la sécrétion de mélatonine et testostérone.' },
      { title: 'CHAMBRE FRAÎCHE ET NOIRE', text: '18-19°C optimum. Obscurité totale (rideaux occultants, masque). La lumière supprime la mélatonine, même les yeux fermés via les photorécepteurs cutanés.' },
      { title: "PAS D'ÉCRAN 60 MIN AVANT", text: "Lumière bleue retarde l'endormissement de 30-90 min. Si impossible : mode nuit + luminosité minimale. Lire sur papier ou écouter podcast." },
      { title: 'CAFÉINE STOP À 14H', text: 'La demi-vie de la caféine est de 5-6h. Un café à 16h a encore la moitié de sa dose active dans le sang à 22h. Impacte profondeur du sommeil même si endormissement OK.' },
      { title: 'PROTÉINE AU COUCHER', text: '30-40g de caséine lente (fromage blanc, skyr, ou casein powder) 30 min avant le lit. Maintient synthèse protéique pendant les 7-9h de jeûne nocturne.' },
      { title: 'ALCOOL = TUE LE SOMMEIL PROFOND', text: "Aide à s'endormir mais réduit drastiquement le sommeil paradoxal (REM) et profond. Réduit GH nocturne de 70%. Stop minimum 3h avant coucher." },
      { title: 'POWER NAP 20 MIN MAX', text: 'Si fatigue : sieste de 20 min max, avant 15h. Plus long → entre dans cycle profond et réveil difficile + perturbation du sommeil nocturne.' },
    ],
  },
  {
    key: 'nutrition',
    title: 'NUTRITION',
    iconName: 'nutrition',
    intro:
      "Les abdos se font à la cuisine, pas à la salle. Le déficit calorique est le seul facteur non-négociable pour perdre du gras. Tout le reste optimise le ratio gras/muscle.",
    items: [
      { title: 'DÉFICIT MODÉRÉ (500 KCAL)', text: '20-25% sous maintenance. Plus agressif → perte musculaire et chute hormonale. Pour toi : 2,380 kcal/jour environ. Recalcule tous les 4-6 semaines (TDEE baisse en mangeant moins).' },
      { title: 'PROTÉINES : 1,8-2,2 G/KG', text: 'Pour toi : 175-200g/jour. Étalées sur 4 repas de 40-50g (plus efficace qu\'un seul gros repas). Source #1 pour préserver le muscle en déficit.' },
      { title: 'LIPIDES MINIMUM 0,8 G/KG', text: '~80g/jour minimum. Indispensable pour testo (cholestérol = précurseur). Privilégier oméga-3 (poissons gras, huile lin), huile olive, avocat. Limiter trans/saturés.' },
      { title: 'GLUCIDES = LE RESTE', text: "Compléter avec glucides pour énergie d'entraînement. Privilégier IG bas-moyen (avoine, riz complet, patate douce, légumineuses). Plus de glucides les jours de muscu." },
      { title: 'HYDRATATION 3-4L/JOUR', text: '500ml dès le réveil. La déshydratation simule la faim et réduit de 5-10% les performances. Eau plate + 1-2 tisanes/jour OK.' },
      { title: 'FIBRES 30-40G/JOUR', text: 'Légumes à chaque repas, légumineuses, fruits. Satiété, transit, microbiote. Le levier #1 pour tenir un déficit sans faim.' },
      { title: 'TIMING : PEU IMPORTANT', text: "L'idée de \"fenêtre anabolique\" 30 min post-séance est dépassée. Manger 1-2h avant ET 2-3h après séance suffit. Le total quotidien prime." },
      { title: 'CHEAT MEAL ≠ CHEAT DAY', text: 'Un repas plaisir/semaine (vendredi soir ou midi familial) = OK et bénéfique psychologiquement. Pas une journée entière qui annule 3 jours de déficit.' },
      { title: 'TRACKING : 4 SEMAINES MINIMUM', text: 'Pesée des aliments + app (MyFitnessPal, YAZIO) pendant 1 mois pour calibrer ton œil. Ensuite tu peux estimer. Les portions "approximatives" sont presque toujours sous-estimées de 20-30%.' },
    ],
  },
  {
    key: 'training',
    title: 'ENTRAÎNEMENT',
    iconName: 'training',
    intro:
      "Progressive overload est LE principe central. Sans surcharge progressive, pas d'adaptation. Le corps n'a aucune raison de construire du muscle s'il n'y est pas forcé.",
    items: [
      { title: 'SURCHARGE PROGRESSIVE', text: 'Augmenter charge OU reps OU séries chaque semaine. Règle simple : si tu boucles les reps prévues avec 2 reps "en réserve" sur la dernière série → +2,5kg (haut) ou +5kg (bas) la fois suivante.' },
      { title: 'RPE 7-9 PAR SÉRIE', text: 'RPE (Rate of Perceived Exertion) sur 10. RPE 7 = 3 reps en réserve. RPE 8 = 2 reps. RPE 9 = 1 rep. Cible RPE 7-8 sur séries de travail, RPE 9-10 sur dernière série seulement.' },
      { title: "PROXIMITÉ DE L'ÉCHEC", text: "Recherche 2024 : effort proche de l'échec (RPE 8-9) est ce qui compte le plus pour l'hypertrophie. Pas besoin d'aller à l'échec total à chaque série (épuise le système nerveux)." },
      { title: 'REPOS : 60-180 SECONDES', text: 'Compound (presse, dev couché, hip thrust) : 2-3 min. Mid (rowing, fentes) : 90-120s. Isolation (curls, élévations) : 60-90s. Plus de repos = plus de volume = plus de gains.' },
      { title: 'TEMPO : 2-1-2-0', text: "2s en descente (excentrique) - 1s pause étirement - 2s en montée (concentrique) - 0s pause contraction. Le tempo lent en excentrique recrute plus de fibres et réduit le risque de blessure." },
      { title: 'VOLUME : 10-20 SÉRIES/SEMAINE', text: 'Par groupe musculaire, séries effectives (RPE 7+). Sous 10 séries/sem → sous-stimulation. Au-delà de 20 → diminishing returns. Ton programme = 14-18 séries par groupe principal.' },
      { title: 'AMPLITUDE COMPLÈTE', text: "Étirement complet sous tension > demi-reps. Études montrent que l'étirement profond stimule plus de croissance que la contraction maximale." },
      { title: 'CONNEXION CERVEAU-MUSCLE', text: 'Sur les isolations, concentre-toi mentalement sur le muscle ciblé. Recherche : améliore le recrutement de 20-30%. Ralentis le mouvement si nécessaire.' },
      { title: 'JOUR DE REPOS = SACRÉ', text: 'Le muscle ne grossit PAS pendant la séance, il se reconstruit après. 48-72h entre séances ciblant le même groupe musculaire. Pas de FOMO.' },
      { title: 'DELOAD TOUTES LES 6-8 SEMAINES', text: 'Semaine légère (-30-40% charges, mêmes mouvements) pour décharger système nerveux et tissus. Critique pour éviter blessures et plateau.' },
    ],
  },
  {
    key: 'recovery',
    title: 'RÉCUPÉRATION',
    iconName: 'recovery',
    intro:
      "La récupération est où la croissance se passe réellement. Négliger ça = annuler les bénéfices de la salle.",
    items: [
      { title: 'NEAT (ACTIVITÉ NON-SPORTIVE)', text: 'Marcher 8-10K pas/jour. Ne compte pas comme cardio mais augmente significativement TDEE. 1h marche = 250-300 kcal sans fatigue. Booster #1 du déficit.' },
      { title: 'ÉTIREMENTS POST-SÉANCE', text: '10 min de mobilité après chaque séance. Pas pour les courbatures (mythe) mais pour amplitude articulaire et drainage. Focus hanches, dorsaux, épaules.' },
      { title: 'JOURS DE REPOS ACTIFS', text: '30-60 min de marche, vélo léger, ou natation. Augmente flux sanguin et accélère récupération comparé à repos total.' },
      { title: 'CRÉATINE 5G/JOUR', text: "★ Supplément le mieux étudié au monde. +5-10% force, +2-4kg masse maigre sur 12 semaines. 5g monohydrate, n'importe quand dans la journée. Pas besoin de phase de charge." },
      { title: 'STRESS = CORTISOL = CATABOLIQUE', text: 'Stress chronique élève cortisol qui dégrade le muscle et favorise le stockage abdominal. Méditation, respiration, marche extérieure quotidienne aident énormément.' },
      { title: 'FROID/CHAUD ALTERNÉ', text: 'Douches froides post-séance peuvent ATTÉNUER la croissance musculaire si <1h après. Au lever ou jour off : OK pour mental et inflammation. Sauna 15-20 min 2-3x/sem : bénéfices clairs.' },
      { title: 'MASSAGE ET FOAM ROLLER', text: '10-15 min de foam roller 2-3x/sem sur zones tendues. Pas magique mais améliore récupération subjective et amplitude.' },
      { title: 'ÉCOUTER LE CORPS', text: 'Si fatigue chronique, irritabilité, baisse de libido, charge qui stagne ou recule : signe de surentraînement OU sous-récupération. Réduire volume ou ajouter jour off.' },
    ],
  },
  {
    key: 'mindset',
    title: 'MENTAL',
    iconName: 'mindset',
    intro:
      "Sur 10-12 mois, c'est ton mental qui décide, pas ton corps. La discipline > la motivation.",
    items: [
      { title: 'PROGRESSION NON-LINÉAIRE', text: 'Le poids fluctue de ±1-2kg sur 48h pour des raisons hormonales, hydriques, glycémiques. Juge UNIQUEMENT sur la moyenne hebdomadaire (pèse-toi tous les jours, fais la moyenne).' },
      { title: 'PHOTOS > BALANCE', text: 'Une photo mensuelle même angle/éclairage/heure raconte une histoire que la balance ne peut pas. Garde-les toutes pour comparaison cumulative.' },
      { title: 'PLATEAUX SONT NORMAUX', text: "2-3 plateaux de 1-3 semaines sont attendus sur un cut long. Ne PAS réduire les calories pendant un plateau si déficit déjà OK. C'est souvent l'eau qui masque le gras perdu." },
      { title: 'COMPRENDRE LA "WHOOSH"', text: "Phénomène fréquent : 3 semaines sans bouger sur la balance, puis -1,5kg en 2 jours. Le corps libère l'eau retenue dans les cellules adipeuses vidées de leur lipide." },
      { title: 'PRÊT À MANGER MOINS RIGIDE', text: "L'objectif n'est pas de manger \"parfait\" mais \"cohérent\". 80% nutrition propre + 20% flexible = durable. 100% strict = échec à 3 mois quasi-garanti." },
      { title: 'TROUVER UN POURQUOI FORT', text: 'Au-delà de "avoir des abdos". Santé long-terme, énergie au quotidien, confiance, exemple pour proches. Quand la motivation baisse, le "pourquoi" porte.' },
      { title: 'ENVIRONNEMENT > VOLONTÉ', text: 'Ne pas avoir de chips dans le placard est plus efficace que résister 30 fois par jour. Préparer ses repas le dimanche est plus efficace que décider à chaque repas.' },
      { title: 'CÉLÉBRER LES VICTOIRES', text: 'Premier 1kg perdu, première traction, première fois moins de 95kg. Marquer mentalement chaque palier. Le cerveau a besoin de récompenses pour maintenir la discipline.' },
    ],
  },
];
