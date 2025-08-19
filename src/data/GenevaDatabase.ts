// Base de données factice pour les professionnels de Genève
// Utilisée pour les tests et le développement

export interface Professional {
  id: string;
  name: string;
  specialty: string;
  specialtyCode: string;
  cantonCode: string;
  canton: string;
  city: string;
  institution: string;
  coordinates: { lat: number; lng: number };
  acceptsNewPatients: boolean;
  rating: number;
  reviews: number;
  phone?: string;
  email?: string;
  website?: string;
  languages?: string[];
  availability?: string;
  insurance?: string[];
  experience?: number;
  education?: string[];
}

export interface GenevaStats {
  totalProfessionals: number;
  specialtiesAvailable: number;
  acceptsNewPatients: number;
  averageRating: number;
  languagesAvailable: string[];
}

// Données factices des professionnels de Genève
const genevaProfessionals: Professional[] = [
  {
    id: '1',
    name: 'Dr. Marie Dubois',
    specialty: 'Pédiatrie',
    specialtyCode: 'PED',
    cantonCode: 'ge',
    canton: 'Genève',
    city: 'Genève',
    institution: 'Hôpital des Enfants',
    coordinates: { lat: 46.2044, lng: 6.1432 },
    acceptsNewPatients: true,
    rating: 4.8,
    reviews: 127,
    phone: '+41 22 123 45 67',
    email: 'marie.dubois@hopital-enfants.ch',
    website: 'https://hopital-enfants.ch',
    languages: ['Français', 'Anglais'],
    availability: 'Lun-Ven 9h-17h',
    insurance: ['LAMal', 'Privée'],
    experience: 15,
    education: ['Université de Genève', 'Spécialisation Pédiatrie']
  },
  {
    id: '2',
    name: 'Dr. Jean-Luc Martin',
    specialty: 'Orthophonie',
    specialtyCode: 'ORT',
    cantonCode: 'ge',
    canton: 'Genève',
    city: 'Genève',
    institution: 'Centre d\'Orthophonie',
    coordinates: { lat: 46.1984, lng: 6.1422 },
    acceptsNewPatients: false,
    rating: 4.6,
    reviews: 89,
    phone: '+41 22 234 56 78',
    email: 'jean-luc.martin@orthophonie.ch',
    website: 'https://orthophonie-geneve.ch',
    languages: ['Français', 'Allemand'],
    availability: 'Mar-Sam 8h-18h',
    insurance: ['LAMal'],
    experience: 12,
    education: ['Université de Lausanne', 'Formation Orthophonie']
  },
  {
    id: '3',
    name: 'Dr. Sophie Laurent',
    specialty: 'Psychologie de l\'Enfant',
    specialtyCode: 'PSY',
    cantonCode: 'ge',
    canton: 'Genève',
    city: 'Genève',
    institution: 'Institut de Psychologie',
    coordinates: { lat: 46.2104, lng: 6.1502 },
    acceptsNewPatients: true,
    rating: 4.9,
    reviews: 203,
    phone: '+41 22 345 67 89',
    email: 'sophie.laurent@psychologie.ch',
    website: 'https://psychologie-enfant.ch',
    languages: ['Français', 'Anglais', 'Italien'],
    availability: 'Lun-Ven 8h-19h',
    insurance: ['LAMal', 'Privée'],
    experience: 18,
    education: ['Université de Genève', 'Doctorat Psychologie']
  },
  {
    id: '4',
    name: 'Dr. Pierre Moreau',
    specialty: 'Kinésithérapie',
    specialtyCode: 'KIN',
    cantonCode: 'ge',
    canton: 'Genève',
    city: 'Genève',
    institution: 'Centre de Kinésithérapie',
    coordinates: { lat: 46.1954, lng: 6.1382 },
    acceptsNewPatients: true,
    rating: 4.7,
    reviews: 156,
    phone: '+41 22 456 78 90',
    email: 'pierre.moreau@kinesitherapie.ch',
    website: 'https://kinesitherapie-geneve.ch',
    languages: ['Français', 'Anglais'],
    availability: 'Lun-Sam 7h-20h',
    insurance: ['LAMal'],
    experience: 10,
    education: ['École de Kinésithérapie', 'Formation Continue']
  },
  {
    id: '5',
    name: 'Dr. Anne-Claire Bernard',
    specialty: 'Ergothérapie',
    specialtyCode: 'ERG',
    cantonCode: 'ge',
    canton: 'Genève',
    city: 'Genève',
    institution: 'Centre d\'Ergothérapie',
    coordinates: { lat: 46.2084, lng: 6.1452 },
    acceptsNewPatients: false,
    rating: 4.5,
    reviews: 78,
    phone: '+41 22 567 89 01',
    email: 'anne-claire.bernard@ergotherapie.ch',
    website: 'https://ergotherapie-geneve.ch',
    languages: ['Français', 'Allemand', 'Anglais'],
    availability: 'Lun-Ven 9h-17h',
    insurance: ['LAMal'],
    experience: 8,
    education: ['École d\'Ergothérapie', 'Spécialisation Pédiatrie']
  },
  {
    id: '6',
    name: 'Dr. Marc-André Petit',
    specialty: 'Psychomotricité',
    specialtyCode: 'PSM',
    cantonCode: 'ge',
    canton: 'Genève',
    city: 'Genève',
    institution: 'Institut de Psychomotricité',
    coordinates: { lat: 46.2024, lng: 6.1402 },
    acceptsNewPatients: true,
    rating: 4.4,
    reviews: 92,
    phone: '+41 22 678 90 12',
    email: 'marc-andre.petit@psychomotricite.ch',
    website: 'https://psychomotricite-geneve.ch',
    languages: ['Français', 'Anglais'],
    availability: 'Mar-Sam 8h-18h',
    insurance: ['LAMal'],
    experience: 11,
    education: ['Formation Psychomotricité', 'Spécialisation Enfant']
  },
  {
    id: '7',
    name: 'Dr. Isabelle Rousseau',
    specialty: 'Logopédie',
    specialtyCode: 'LOG',
    cantonCode: 'ge',
    canton: 'Genève',
    city: 'Genève',
    institution: 'Centre de Logopédie',
    coordinates: { lat: 46.2064, lng: 6.1482 },
    acceptsNewPatients: true,
    rating: 4.8,
    reviews: 134,
    phone: '+41 22 789 01 23',
    email: 'isabelle.rousseau@logopedie.ch',
    website: 'https://logopedie-geneve.ch',
    languages: ['Français', 'Italien', 'Anglais'],
    availability: 'Lun-Ven 8h-18h',
    insurance: ['LAMal', 'Privée'],
    experience: 14,
    education: ['Université de Genève', 'Formation Logopédie']
  },
  {
    id: '8',
    name: 'Dr. Thomas Dubois',
    specialty: 'Neuropsychologie',
    specialtyCode: 'NEU',
    cantonCode: 'ge',
    canton: 'Genève',
    city: 'Genève',
    institution: 'Centre de Neuropsychologie',
    coordinates: { lat: 46.2004, lng: 6.1422 },
    acceptsNewPatients: false,
    rating: 4.9,
    reviews: 167,
    phone: '+41 22 890 12 34',
    email: 'thomas.dubois@neuropsychologie.ch',
    website: 'https://neuropsychologie-geneve.ch',
    languages: ['Français', 'Anglais', 'Allemand'],
    availability: 'Lun-Jeu 9h-17h',
    insurance: ['LAMal', 'Privée'],
    experience: 16,
    education: ['Université de Genève', 'Doctorat Neuropsychologie']
  },
  {
    id: '9',
    name: 'Dr. Caroline Mercier',
    specialty: 'Psychiatrie de l\'Enfant',
    specialtyCode: 'PSY',
    cantonCode: 'ge',
    canton: 'Genève',
    city: 'Genève',
    institution: 'Hôpital Psychiatrique',
    coordinates: { lat: 46.2044, lng: 6.1462 },
    acceptsNewPatients: true,
    rating: 4.7,
    reviews: 189,
    phone: '+41 22 901 23 45',
    email: 'caroline.mercier@psychiatrie.ch',
    website: 'https://psychiatrie-enfant.ch',
    languages: ['Français', 'Anglais'],
    availability: 'Lun-Ven 8h-18h',
    insurance: ['LAMal'],
    experience: 13,
    education: ['Université de Genève', 'Spécialisation Psychiatrie']
  },
  {
    id: '10',
    name: 'Dr. François Leroy',
    specialty: 'Pédopsychiatrie',
    specialtyCode: 'PED',
    cantonCode: 'ge',
    canton: 'Genève',
    city: 'Genève',
    institution: 'Centre de Pédopsychiatrie',
    coordinates: { lat: 46.1984, lng: 6.1442 },
    acceptsNewPatients: true,
    rating: 4.6,
    reviews: 145,
    phone: '+41 22 012 34 56',
    email: 'francois.leroy@pedopsychiatrie.ch',
    website: 'https://pedopsychiatrie-geneve.ch',
    languages: ['Français', 'Allemand'],
    availability: 'Mar-Sam 9h-17h',
    insurance: ['LAMal', 'Privée'],
    experience: 9,
    education: ['Université de Lausanne', 'Formation Pédopsychiatrie']
  }
];

// Statistiques calculées
const genevaStats: GenevaStats = {
  totalProfessionals: genevaProfessionals.length,
  specialtiesAvailable: [...new Set(genevaProfessionals.map(p => p.specialty))].length,
  acceptsNewPatients: genevaProfessionals.filter(p => p.acceptsNewPatients).length,
  averageRating: Math.round((genevaProfessionals.reduce((sum, p) => sum + p.rating, 0) / genevaProfessionals.length) * 10) / 10,
  languagesAvailable: [...new Set(genevaProfessionals.flatMap(p => p.languages || []))].sort()
};

// Classe pour gérer la base de données
export class GenevaDatabase {
  // Récupérer tous les professionnels
  static getAllProfessionals(): Professional[] {
    return [...genevaProfessionals];
  }

  // Récupérer les statistiques
  static getStatistics(): GenevaStats {
    return { ...genevaStats };
  }

  // Rechercher par spécialité
  static getProfessionalsBySpecialty(specialty: string): Professional[] {
    return genevaProfessionals.filter(p => p.specialty === specialty);
  }

  // Rechercher par canton
  static getProfessionalsByCanton(cantonCode: string): Professional[] {
    return genevaProfessionals.filter(p => p.cantonCode === cantonCode);
  }

  // Rechercher par disponibilité
  static getProfessionalsByAvailability(acceptsNewPatients: boolean): Professional[] {
    return genevaProfessionals.filter(p => p.acceptsNewPatients === acceptsNewPatients);
  }

  // Rechercher par note minimum
  static getProfessionalsByRating(minRating: number): Professional[] {
    return genevaProfessionals.filter(p => p.rating >= minRating);
  }

  // Rechercher par langues
  static getProfessionalsByLanguages(languages: string[]): Professional[] {
    return genevaProfessionals.filter(p => 
      languages.some(lang => p.languages?.includes(lang))
    );
  }

  // Recherche textuelle
  static searchProfessionals(query: string): Professional[] {
    const lowerQuery = query.toLowerCase();
    return genevaProfessionals.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.specialty.toLowerCase().includes(lowerQuery) ||
      p.city.toLowerCase().includes(lowerQuery) ||
      p.institution.toLowerCase().includes(lowerQuery)
    );
  }

  // Obtenir les spécialités disponibles
  static getAvailableSpecialties(): string[] {
    return [...new Set(genevaProfessionals.map(p => p.specialty))].sort();
  }

  // Obtenir les langues disponibles
  static getAvailableLanguages(): string[] {
    return [...new Set(genevaProfessionals.flatMap(p => p.languages || []))].sort();
  }

  // Obtenir les cantons disponibles
  static getAvailableCantons(): string[] {
    return [...new Set(genevaProfessionals.map(p => p.cantonCode))].sort();
  }
}

export default GenevaDatabase;
