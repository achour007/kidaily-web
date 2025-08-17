// Système d'évaluation complet et diversifié pour le développement de l'enfant
// Adapté du système mobile - Basé sur les recherches en psychologie du développement

export interface EvaluationQuestion {
  id: string;
  text: string;
  category: string;
  ageGroup: string;
  options: {
    value: string;
    label: string;
    score: number;
  }[];
  weight: number;
}

export class ComprehensiveEvaluationQuestions {
  
  // Questions pour nourrissons (0-12 mois)
  static getInfantQuestions(): EvaluationQuestion[] {
    return [
      // Développement Sensoriel
      {
        id: 'infant_sensor_1',
        text: 'L\'enfant suit-il du regard un objet en mouvement ?',
        category: 'sensoriel',
        ageGroup: '0-1',
        options: [
          { value: 'toujours', label: 'Toujours', score: 4 },
          { value: 'souvent', label: 'Souvent', score: 3 },
          { value: 'parfois', label: 'Parfois', score: 2 },
          { value: 'rarement', label: 'Rarement', score: 1 },
          { value: 'jamais', label: 'Jamais', score: 0 },
        ],
        weight: 2.0,
      },
      {
        id: 'infant_sensor_2',
        text: 'L\'enfant réagit-il aux sons familiers (voix, musique) ?',
        category: 'sensoriel',
        ageGroup: '0-1',
        options: [
          { value: 'toujours', label: 'Toujours', score: 4 },
          { value: 'souvent', label: 'Souvent', score: 3 },
          { value: 'parfois', label: 'Parfois', score: 2 },
          { value: 'rarement', label: 'Rarement', score: 1 },
          { value: 'jamais', label: 'Jamais', score: 0 },
        ],
        weight: 2.0,
      },
      {
        id: 'infant_sensor_3',
        text: 'L\'enfant explore-t-il les objets avec sa bouche ?',
        category: 'sensoriel',
        ageGroup: '0-1',
        options: [
          { value: 'toujours', label: 'Toujours', score: 4 },
          { value: 'souvent', label: 'Souvent', score: 3 },
          { value: 'parfois', label: 'Parfois', score: 2 },
          { value: 'rarement', label: 'Rarement', score: 1 },
          { value: 'jamais', label: 'Jamais', score: 0 },
        ],
        weight: 1.5,
      },
      // Développement Moteur
      {
        id: 'infant_motor_1',
        text: 'L\'enfant peut-il tenir sa tête droite ?',
        category: 'motricite',
        ageGroup: '0-1',
        options: [
          { value: 'toujours', label: 'Toujours, très stable', score: 4 },
          { value: 'souvent', label: 'La plupart du temps', score: 3 },
          { value: 'parfois', label: 'Parfois', score: 2 },
          { value: 'rarement', label: 'Avec aide', score: 1 },
          { value: 'jamais', label: 'Pas encore', score: 0 },
        ],
        weight: 2.0,
      },
      {
        id: 'infant_motor_2',
        text: 'L\'enfant peut-il se retourner du ventre au dos ?',
        category: 'motricite',
        ageGroup: '0-1',
        options: [
          { value: 'toujours', label: 'Facilement', score: 4 },
          { value: 'souvent', label: 'Souvent', score: 3 },
          { value: 'parfois', label: 'Parfois', score: 2 },
          { value: 'rarement', label: 'Avec aide', score: 1 },
          { value: 'jamais', label: 'Pas encore', score: 0 },
        ],
        weight: 1.5,
      },
      // Développement Social
      {
        id: 'infant_social_1',
        text: 'L\'enfant sourit-il en réponse aux sourires ?',
        category: 'social',
        ageGroup: '0-1',
        options: [
          { value: 'toujours', label: 'Toujours', score: 4 },
          { value: 'souvent', label: 'Souvent', score: 3 },
          { value: 'parfois', label: 'Parfois', score: 2 },
          { value: 'rarement', label: 'Rarement', score: 1 },
          { value: 'jamais', label: 'Jamais', score: 0 },
        ],
        weight: 2.0,
      },
      {
        id: 'infant_social_2',
        text: 'L\'enfant établit-il un contact visuel ?',
        category: 'social',
        ageGroup: '0-1',
        options: [
          { value: 'toujours', label: 'Facilement et longtemps', score: 4 },
          { value: 'souvent', label: 'Souvent', score: 3 },
          { value: 'parfois', label: 'Parfois', score: 2 },
          { value: 'rarement', label: 'Rarement', score: 1 },
          { value: 'jamais', label: 'Évite le regard', score: 0 },
        ],
        weight: 2.0,
      },
    ];
  }

  // Questions pour tout-petits (1-2 ans)
  static getToddlerQuestions(): EvaluationQuestion[] {
    return [
      // Langage
      {
        id: 'toddler_lang_1',
        text: 'L\'enfant dit-il au moins 10 mots différents ?',
        category: 'langage',
        ageGroup: '1-2',
        options: [
          { value: 'plus20', label: 'Plus de 20 mots', score: 4 },
          { value: 'entre10-20', label: '10-20 mots', score: 3 },
          { value: 'entre5-10', label: '5-10 mots', score: 2 },
          { value: 'moins5', label: 'Moins de 5 mots', score: 1 },
          { value: 'aucun', label: 'Aucun mot clair', score: 0 },
        ],
        weight: 2.5,
      },
      {
        id: 'toddler_lang_2',
        text: 'L\'enfant peut-il suivre des instructions simples ?',
        category: 'langage',
        ageGroup: '1-2',
        options: [
          { value: 'toujours', label: 'Toujours', score: 4 },
          { value: 'souvent', label: 'Souvent', score: 3 },
          { value: 'parfois', label: 'Parfois', score: 2 },
          { value: 'rarement', label: 'Avec gestes', score: 1 },
          { value: 'jamais', label: 'Ne comprend pas', score: 0 },
        ],
        weight: 2.0,
      },
      {
        id: 'toddler_lang_3',
        text: 'L\'enfant peut-il montrer des parties du corps nommées ?',
        category: 'langage',
        ageGroup: '1-2',
        options: [
          { value: 'plusieurs', label: 'Plusieurs parties', score: 4 },
          { value: 'quelques', label: 'Quelques parties', score: 3 },
          { value: 'basiques', label: 'Nez, bouche, yeux', score: 2 },
          { value: 'une', label: 'Une partie', score: 1 },
          { value: 'aucune', label: 'Aucune', score: 0 },
        ],
        weight: 1.5,
      },
      // Motricité
      {
        id: 'toddler_motor_1',
        text: 'L\'enfant marche-t-il seul ?',
        category: 'motricite',
        ageGroup: '1-2',
        options: [
          { value: 'court', label: 'Court et grimpe', score: 4 },
          { value: 'marche_bien', label: 'Marche bien', score: 3 },
          { value: 'marche_stable', label: 'Marche, un peu instable', score: 2 },
          { value: 'avec_aide', label: 'Avec aide/support', score: 1 },
          { value: 'rampe', label: 'Rampe seulement', score: 0 },
        ],
        weight: 2.5,
      },
      {
        id: 'toddler_motor_2',
        text: 'L\'enfant peut-il empiler 3-4 cubes ?',
        category: 'motricite',
        ageGroup: '1-2',
        options: [
          { value: 'plus6', label: 'Plus de 6 cubes', score: 4 },
          { value: 'entre4-6', label: '4-6 cubes', score: 3 },
          { value: 'entre2-3', label: '2-3 cubes', score: 2 },
          { value: 'avec_aide', label: 'Avec aide', score: 1 },
          { value: 'non', label: 'Ne peut pas', score: 0 },
        ],
        weight: 1.5,
      },
      // Social et Émotionnel
      {
        id: 'toddler_social_1',
        text: 'L\'enfant imite-t-il les actions des adultes ?',
        category: 'social',
        ageGroup: '1-2',
        options: [
          { value: 'toujours', label: 'Toujours, spontanément', score: 4 },
          { value: 'souvent', label: 'Souvent', score: 3 },
          { value: 'parfois', label: 'Parfois', score: 2 },
          { value: 'rarement', label: 'Rarement', score: 1 },
          { value: 'jamais', label: 'Jamais', score: 0 },
        ],
        weight: 2.0,
      },
      {
        id: 'toddler_social_2',
        text: 'L\'enfant montre-t-il de l\'affection ?',
        category: 'social',
        ageGroup: '1-2',
        options: [
          { value: 'spontane', label: 'Spontanément et souvent', score: 4 },
          { value: 'souvent', label: 'Souvent', score: 3 },
          { value: 'parfois', label: 'Parfois', score: 2 },
          { value: 'rarement', label: 'Rarement', score: 1 },
          { value: 'jamais', label: 'Jamais', score: 0 },
        ],
        weight: 2.0,
      },
      // Cognitif
      {
        id: 'toddler_cogn_1',
        text: 'L\'enfant cherche-t-il les objets cachés ?',
        category: 'cognitif',
        ageGroup: '1-2',
        options: [
          { value: 'toujours', label: 'Toujours, même difficiles', score: 4 },
          { value: 'souvent', label: 'Souvent', score: 3 },
          { value: 'parfois', label: 'Parfois', score: 2 },
          { value: 'rarement', label: 'Objets simples seulement', score: 1 },
          { value: 'jamais', label: 'N\'essaie pas', score: 0 },
        ],
        weight: 2.0,
      },
    ];
  }

  // Questions pour préscolaire (2-3 ans)
  static getPreschoolQuestions(): EvaluationQuestion[] {
    return [
      // Langage
      {
        id: 'preschool_lang_1',
        text: 'L\'enfant dit-il au moins 50 mots différents ?',
        category: 'langage',
        ageGroup: '2-3',
        options: [
          { value: 'plus100', label: 'Plus de 100 mots', score: 4 },
          { value: 'entre50-100', label: '50-100 mots', score: 3 },
          { value: 'entre25-50', label: '25-50 mots', score: 2 },
          { value: 'moins25', label: 'Moins de 25 mots', score: 1 },
          { value: 'tres_peu', label: 'Très peu de mots', score: 0 },
        ],
        weight: 2.5,
      },
      {
        id: 'preschool_lang_2',
        text: 'L\'enfant fait-il des phrases de 2-3 mots ?',
        category: 'langage',
        ageGroup: '2-3',
        options: [
          { value: 'phrases_complexes', label: 'Phrases de 4+ mots', score: 4 },
          { value: 'phrases_3mots', label: 'Phrases de 3 mots', score: 3 },
          { value: 'phrases_2mots', label: 'Phrases de 2 mots', score: 2 },
          { value: 'mots_isoles', label: 'Mots isolés', score: 1 },
          { value: 'non', label: 'Ne fait pas de phrases', score: 0 },
        ],
        weight: 2.0,
      },
      {
        id: 'preschool_lang_3',
        text: 'L\'enfant pose-t-il des questions (quoi, où, qui) ?',
        category: 'langage',
        ageGroup: '2-3',
        options: [
          { value: 'beaucoup', label: 'Beaucoup de questions', score: 4 },
          { value: 'souvent', label: 'Souvent', score: 3 },
          { value: 'parfois', label: 'Parfois', score: 2 },
          { value: 'rarement', label: 'Rarement', score: 1 },
          { value: 'jamais', label: 'Jamais', score: 0 },
        ],
        weight: 2.0,
      },
      // Motricité
      {
        id: 'preschool_motor_1',
        text: 'L\'enfant peut-il empiler 6+ cubes ?',
        category: 'motricite',
        ageGroup: '2-3',
        options: [
          { value: 'plus10', label: 'Plus de 10 cubes', score: 4 },
          { value: 'entre6-10', label: '6-10 cubes', score: 3 },
          { value: 'entre4-6', label: '4-6 cubes', score: 2 },
          { value: 'entre2-4', label: '2-4 cubes', score: 1 },
          { value: 'moins2', label: 'Moins de 2 cubes', score: 0 },
        ],
        weight: 1.5,
      },
      {
        id: 'preschool_motor_2',
        text: 'L\'enfant peut-il courir et s\'arrêter ?',
        category: 'motricite',
        ageGroup: '2-3',
        options: [
          { value: 'expert', label: 'Court et change de direction', score: 4 },
          { value: 'bien', label: 'Court bien, s\'arrête', score: 3 },
          { value: 'court', label: 'Court mais trébuche', score: 2 },
          { value: 'marche_rapide', label: 'Marche rapide seulement', score: 1 },
          { value: 'non', label: 'Ne court pas', score: 0 },
        ],
        weight: 2.0,
      },
      // Plus de questions...
    ];
  }

  // Questions pour enfance précoce (3-4 ans) 
  static getEarlyChildhoodQuestions(): EvaluationQuestion[] {
    return [
      // Langage (6 questions)
      {
        id: 'early_lang_1',
        text: 'L\'enfant forme-t-il des phrases de 4+ mots ?',
        category: 'langage',
        ageGroup: '3-4',
        options: [
          { value: 'phrases_complexes', label: 'Phrases très complexes', score: 4 },
          { value: 'phrases_completes', label: 'Phrases complètes', score: 3 },
          { value: 'phrases_4mots', label: 'Phrases de 4 mots', score: 2 },
          { value: 'phrases_courtes', label: 'Phrases courtes', score: 1 },
          { value: 'non', label: 'Mots isolés', score: 0 },
        ],
        weight: 2.5,
      },
      {
        id: 'early_lang_2',
        text: 'L\'enfant peut-il raconter ce qu\'il a fait ?',
        category: 'langage',
        ageGroup: '3-4',
        options: [
          { value: 'detail', label: 'Avec beaucoup de détails', score: 4 },
          { value: 'bien', label: 'Assez bien', score: 3 },
          { value: 'simple', label: 'De façon simple', score: 2 },
          { value: 'aide', label: 'Avec aide', score: 1 },
          { value: 'non', label: 'Ne peut pas', score: 0 },
        ],
        weight: 2.0,
      },
      {
        id: 'early_lang_3',
        text: 'L\'enfant pose-t-il des questions "Pourquoi?" ?',
        category: 'langage',
        ageGroup: '3-4',
        options: [
          { value: 'beaucoup', label: 'Tout le temps', score: 4 },
          { value: 'souvent', label: 'Souvent', score: 3 },
          { value: 'parfois', label: 'Parfois', score: 2 },
          { value: 'rarement', label: 'Rarement', score: 1 },
          { value: 'jamais', label: 'Jamais', score: 0 },
        ],
        weight: 2.0,
      },
      {
        id: 'early_lang_4',
        text: 'L\'enfant comprend-il les concepts "grand/petit", "dedans/dehors" ?',
        category: 'langage',
        ageGroup: '3-4',
        options: [
          { value: 'tous', label: 'Tous les concepts', score: 4 },
          { value: 'plusieurs', label: 'Plusieurs concepts', score: 3 },
          { value: 'quelques', label: 'Quelques concepts', score: 2 },
          { value: 'peu', label: 'Très peu', score: 1 },
          { value: 'aucun', label: 'Aucun', score: 0 },
        ],
        weight: 1.5,
      },
      // Motricité (5 questions)
      {
        id: 'early_motor_1',
        text: 'L\'enfant peut-il sauter à pieds joints ?',
        category: 'motricite',
        ageGroup: '3-4',
        options: [
          { value: 'expert', label: 'Saute et atterrit bien', score: 4 },
          { value: 'bien', label: 'Saute bien', score: 3 },
          { value: 'essaie', label: 'Essaie de sauter', score: 2 },
          { value: 'aide', label: 'Avec aide', score: 1 },
          { value: 'non', label: 'Ne peut pas', score: 0 },
        ],
        weight: 2.0,
      },
      {
        id: 'early_motor_2',
        text: 'L\'enfant peut-il tenir un crayon correctement ?',
        category: 'motricite',
        ageGroup: '3-4',
        options: [
          { value: 'parfait', label: 'Prise parfaite', score: 4 },
          { value: 'bien', label: 'Bonne prise', score: 3 },
          { value: 'correcte', label: 'Prise correcte', score: 2 },
          { value: 'maladroite', label: 'Prise maladroite', score: 1 },
          { value: 'non', label: 'Ne peut pas', score: 0 },
        ],
        weight: 2.0,
      },
      {
        id: 'early_motor_3',
        text: 'L\'enfant peut-il dessiner un cercle ?',
        category: 'motricite',
        ageGroup: '3-4',
        options: [
          { value: 'parfait', label: 'Cercle parfait', score: 4 },
          { value: 'reconnaissable', label: 'Cercle reconnaissable', score: 3 },
          { value: 'rond', label: 'Forme ronde', score: 2 },
          { value: 'essaie', label: 'Essaie', score: 1 },
          { value: 'non', label: 'Ne peut pas', score: 0 },
        ],
        weight: 1.5,
      },
      // Social et Émotionnel (6 questions)
      {
        id: 'early_social_1',
        text: 'L\'enfant joue-t-il avec d\'autres enfants ?',
        category: 'social',
        ageGroup: '3-4',
        options: [
          { value: 'leader', label: 'Mène les jeux', score: 4 },
          { value: 'coopere', label: 'Joue en coopération', score: 3 },
          { value: 'participe', label: 'Participe aux jeux', score: 2 },
          { value: 'observe', label: 'Observe surtout', score: 1 },
          { value: 'evite', label: 'Évite les autres', score: 0 },
        ],
        weight: 2.5,
      },
      {
        id: 'early_social_2',
        text: 'L\'enfant peut-il attendre son tour ?',
        category: 'social',
        ageGroup: '3-4',
        options: [
          { value: 'patient', label: 'Très patient', score: 4 },
          { value: 'bien', label: 'Attend bien', score: 3 },
          { value: 'parfois', label: 'Parfois', score: 2 },
          { value: 'difficulte', label: 'Avec difficulté', score: 1 },
          { value: 'non', label: 'Ne peut pas', score: 0 },
        ],
        weight: 2.0,
      },
      // Cognitif (4 questions)
      {
        id: 'early_cogn_1',
        text: 'L\'enfant peut-il compter jusqu\'à 5 ?',
        category: 'cognitif',
        ageGroup: '3-4',
        options: [
          { value: 'plus10', label: 'Compte au-delà de 10', score: 4 },
          { value: 'jusqua10', label: 'Compte jusqu\'à 10', score: 3 },
          { value: 'jusqua5', label: 'Compte jusqu\'à 5', score: 2 },
          { value: 'jusqua3', label: 'Compte jusqu\'à 3', score: 1 },
          { value: 'non', label: 'Ne compte pas', score: 0 },
        ],
        weight: 2.0,
      },
      {
        id: 'early_cogn_2',
        text: 'L\'enfant reconnaît-il les couleurs de base ?',
        category: 'cognitif',
        ageGroup: '3-4',
        options: [
          { value: 'toutes', label: 'Toutes les couleurs', score: 4 },
          { value: 'plusieurs', label: 'Plusieurs couleurs', score: 3 },
          { value: 'primaires', label: 'Couleurs primaires', score: 2 },
          { value: 'quelques', label: 'Quelques couleurs', score: 1 },
          { value: 'aucune', label: 'Aucune couleur', score: 0 },
        ],
        weight: 1.5,
      },
    ];
  }

  // Questions pour âge scolaire (4-5 ans)
  static getSchoolAgeQuestions(): EvaluationQuestion[] {
    return [
      // Langage (7 questions)
      {
        id: 'school_lang_1',
        text: 'L\'enfant raconte-t-il des histoires complètes ?',
        category: 'langage',
        ageGroup: '4-5',
        options: [
          { value: 'histoires_complexes', label: 'Histoires avec détails', score: 4 },
          { value: 'histoires_simples', label: 'Histoires simples', score: 3 },
          { value: 'recit_court', label: 'Récits courts', score: 2 },
          { value: 'phrases_liees', label: 'Phrases liées', score: 1 },
          { value: 'non', label: 'Ne raconte pas', score: 0 },
        ],
        weight: 2.5,
      },
      {
        id: 'school_lang_2',
        text: 'L\'enfant utilise-t-il des phrases avec "parce que", "si", "quand" ?',
        category: 'langage',
        ageGroup: '4-5',
        options: [
          { value: 'toujours', label: 'Toujours correctement', score: 4 },
          { value: 'souvent', label: 'Souvent', score: 3 },
          { value: 'parfois', label: 'Parfois', score: 2 },
          { value: 'rarement', label: 'Rarement', score: 1 },
          { value: 'jamais', label: 'Jamais', score: 0 },
        ],
        weight: 2.0,
      },
      {
        id: 'school_lang_3',
        text: 'L\'enfant peut-il expliquer les règles d\'un jeu ?',
        category: 'langage',
        ageGroup: '4-5',
        options: [
          { value: 'clairement', label: 'Très clairement', score: 4 },
          { value: 'bien', label: 'Assez bien', score: 3 },
          { value: 'simplement', label: 'De façon simple', score: 2 },
          { value: 'aide', label: 'Avec aide', score: 1 },
          { value: 'non', label: 'Ne peut pas', score: 0 },
        ],
        weight: 2.0,
      },
      // Motricité Fine (5 questions)
      {
        id: 'school_motor_1',
        text: 'L\'enfant peut-il dessiner une personne avec détails ?',
        category: 'motricite',
        ageGroup: '4-5',
        options: [
          { value: 'detaillee', label: 'Très détaillée', score: 4 },
          { value: 'complete', label: 'Complète', score: 3 },
          { value: 'basique', label: 'Basique', score: 2 },
          { value: 'simple', label: 'Très simple', score: 1 },
          { value: 'non', label: 'Ne peut pas', score: 0 },
        ],
        weight: 2.0,
      },
      {
        id: 'school_motor_2',
        text: 'L\'enfant peut-il découper avec des ciseaux ?',
        category: 'motricite',
        ageGroup: '4-5',
        options: [
          { value: 'precision', label: 'Avec précision', score: 4 },
          { value: 'bien', label: 'Assez bien', score: 3 },
          { value: 'lignes_droites', label: 'Lignes droites', score: 2 },
          { value: 'aide', label: 'Avec aide', score: 1 },
          { value: 'non', label: 'Ne peut pas', score: 0 },
        ],
        weight: 2.0,
      },
      {
        id: 'school_motor_3',
        text: 'L\'enfant peut-il écrire son prénom ?',
        category: 'motricite',
        ageGroup: '4-5',
        options: [
          { value: 'parfait', label: 'Parfaitement lisible', score: 4 },
          { value: 'lisible', label: 'Lisible', score: 3 },
          { value: 'reconnaissable', label: 'Reconnaissable', score: 2 },
          { value: 'lettres', label: 'Quelques lettres', score: 1 },
          { value: 'non', label: 'Ne peut pas', score: 0 },
        ],
        weight: 2.5,
      },
      // Cognitif (6 questions)
      {
        id: 'school_cogn_1',
        text: 'L\'enfant peut-il compter jusqu\'à 20 ?',
        category: 'cognitif',
        ageGroup: '4-5',
        options: [
          { value: 'plus50', label: 'Au-delà de 50', score: 4 },
          { value: 'jusqua50', label: 'Jusqu\'à 50', score: 3 },
          { value: 'jusqua20', label: 'Jusqu\'à 20', score: 2 },
          { value: 'jusqua10', label: 'Jusqu\'à 10', score: 1 },
          { value: 'moins', label: 'Moins de 10', score: 0 },
        ],
        weight: 2.0,
      },
      {
        id: 'school_cogn_2',
        text: 'L\'enfant reconnaît-il les lettres de l\'alphabet ?',
        category: 'cognitif',
        ageGroup: '4-5',
        options: [
          { value: 'toutes', label: 'Toutes les lettres', score: 4 },
          { value: 'plupart', label: 'La plupart', score: 3 },
          { value: 'plusieurs', label: 'Plusieurs lettres', score: 2 },
          { value: 'quelques', label: 'Quelques lettres', score: 1 },
          { value: 'aucune', label: 'Aucune lettre', score: 0 },
        ],
        weight: 2.5,
      },
      {
        id: 'school_cogn_3',
        text: 'L\'enfant peut-il résoudre des problèmes simples ?',
        category: 'cognitif',
        ageGroup: '4-5',
        options: [
          { value: 'seul', label: 'Seul et rapidement', score: 4 },
          { value: 'reflechit', label: 'Après réflexion', score: 3 },
          { value: 'aide_legere', label: 'Avec aide légère', score: 2 },
          { value: 'aide_beaucoup', label: 'Avec beaucoup d\'aide', score: 1 },
          { value: 'non', label: 'Ne peut pas', score: 0 },
        ],
        weight: 2.0,
      },
      // Social et Émotionnel (5 questions)
      {
        id: 'school_social_1',
        text: 'L\'enfant peut-il jouer en groupe de façon coopérative ?',
        category: 'social',
        ageGroup: '4-5',
        options: [
          { value: 'leader', label: 'Organise les jeux', score: 4 },
          { value: 'coopere', label: 'Coopère bien', score: 3 },
          { value: 'participe', label: 'Participe', score: 2 },
          { value: 'observe', label: 'Observe plus', score: 1 },
          { value: 'difficulte', label: 'A des difficultés', score: 0 },
        ],
        weight: 2.5,
      },
      {
        id: 'school_social_2',
        text: 'L\'enfant exprime-t-il ses émotions avec des mots ?',
        category: 'social',
        ageGroup: '4-5',
        options: [
          { value: 'clairement', label: 'Très clairement', score: 4 },
          { value: 'bien', label: 'Assez bien', score: 3 },
          { value: 'parfois', label: 'Parfois', score: 2 },
          { value: 'difficilement', label: 'Difficilement', score: 1 },
          { value: 'non', label: 'Ne peut pas', score: 0 },
        ],
        weight: 2.0,
      },
      {
        id: 'school_social_3',
        text: 'L\'enfant peut-il consoler un ami triste ?',
        category: 'social',
        ageGroup: '4-5',
        options: [
          { value: 'spontane', label: 'Spontanément', score: 4 },
          { value: 'souvent', label: 'Souvent', score: 3 },
          { value: 'parfois', label: 'Parfois', score: 2 },
          { value: 'encourage', label: 'Si encouragé', score: 1 },
          { value: 'non', label: 'Ne le fait pas', score: 0 },
        ],
        weight: 2.0,
      },
    ];
  }

  // Méthode principale pour obtenir toutes les questions par âge
  static getQuestionsByAge(ageGroup: string): EvaluationQuestion[] {
    switch (ageGroup) {
      case '0-1':
        return this.getInfantQuestions();
      case '1-2':
        return this.getToddlerQuestions();
      case '2-3':
        return this.getPreschoolQuestions();
      case '3-4':
        return this.getEarlyChildhoodQuestions();
      case '4-5':
        return this.getSchoolAgeQuestions();
      default:
        return this.getToddlerQuestions();
    }
  }

  // Obtenir les catégories disponibles
  static getCategories(): Array<{id: string, name: string, color: string}> {
    return [
      { id: 'langage', name: 'Langage', color: '#2196f3' },
      { id: 'motricite', name: 'Motricité', color: '#4caf50' },
      { id: 'cognitif', name: 'Cognitif', color: '#ff9800' },
      { id: 'social', name: 'Social', color: '#9c27b0' },
      { id: 'sensoriel', name: 'Sensoriel', color: '#00bcd4' },
    ];
  }
}
