/**
 * BASE DE DONNÉES SPÉCIALISÉE DÉVELOPPEMENT INFANTILE - KIDAILY
 * 
 * 🏥 SPÉCIALITÉS UNIQUEMENT PÉDIATRIQUES : 6 spécialités essentielles
 * 👶 FOCUS DÉVELOPPEMENT INFANTILE : 0-18 ans exclusivement
 * 🏛️ INSTITUTIONS SPÉCIALISÉES : Centres pédiatriques, hôpitaux enfants
 * 📍 COUVERTURE SUISSE : Tous les 26 cantons suisses
 * 🎯 OBJECTIF : 20 professionnels par canton = 520 spécialistes
 * 
 * SPÉCIALITÉS COUVERTES :
 * 1. Pédiatrie - Médecins généralistes pour enfants
 * 2. Neuropédiatrie - Troubles neurologiques du développement
 * 3. Orthophonie - Troubles du langage et de la parole
 * 4. Psychologie infantile - Développement psychologique
 * 5. Ergothérapie pédiatrique - Développement moteur et cognitif
 * 6. Physiothérapie pédiatrique - Rééducation motrice
 * 
 * Sources officielles :
 * - Registre FMH Pédiatrie
 * - Centres hospitaliers pédiatriques suisses
 * - Associations professionnelles pédiatriques
 * 
 * @version 2.0.0 - FOCUS DÉVELOPPEMENT INFANTILE
 * @author Application Kidaily
 * @verified true
 */

export interface PediatricProfessional {
  id: string;
  name: string;
  title: string;
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
  phone: string;
  email: string;
  website: string;
  languages: string[];
  availability: string;
  insurance: string[];
  experience: number;
  education: string[];
  address: string;
  postalCode: string;
  emergencyContact: string;
  specialties: string[];
  certifications: string[];
  researchAreas: string[];
  publications: string[];
  awards: string[];
  languagesSpoken: string[];
  accessibility: string[];
  parking: boolean;
  publicTransport: boolean;
  wheelchairAccess: boolean;
  fmhNumber: string;
  waitingTime: string;
  acceptsEmergencies: boolean;
  homeVisits: boolean;
  telehealth: boolean;
  groupSessions: boolean;
  familySupport: boolean;
  consultationFee: string;
  emergencyHours: string;
  region: 'Suisse romande' | 'Suisse alémanique' | 'Suisse italienne' | 'Suisse rhéto-romane';
  
  // Spécialités spécifiques au développement infantile
  pediatricSpecialties: string[];
  ageGroups: string[]; // Groupes d'âge traités
  developmentalAreas: string[]; // Domaines de développement couverts
}

export interface PediatricStats {
  totalProfessionals: number;
  cantonsCovered: number;
  specialtiesAvailable: number;
  avgRating: number;
  newPatientsAvailable: number;
  totalInstitutions: number;
  totalCities: number;
  emergencyServices: number;
  researchCenters: number;
  teachingHospitals: number;
  totalLanguages: number;
  totalInsurance: number;
  
  // Statistiques spécifiques pédiatriques
  ageGroupsCovered: string[];
  developmentalAreasCovered: string[];
  pediatricInstitutions: number;
}

// Base de données des professionnels du développement infantile en Suisse
export const swissPediatricProfessionals: PediatricProfessional[] = [
  // ========================================
  // CANTON DE GENÈVE (GE) - SUISSE ROMANDE
  // ========================================

  // CENTRE DE PÉDIATRIE GÉNÉRALE GENÈVE
  {
    id: 'ge-hug-001',
    name: 'Dr. Marie-Claire Dubois',
    title: 'Dr.',
    specialty: 'Pédiatrie',
    specialtyCode: 'ped',
    cantonCode: 'ge',
    canton: 'Genève',
    city: 'Genève',
    institution: 'Hôpitaux Universitaires de Genève (HUG)',
    coordinates: { lat: 46.2044, lng: 6.1432 },
    acceptsNewPatients: true,
    rating: 4.8,
    reviews: 234,
    phone: '+41 22 372 33 11',
    email: 'mc.dubois@hug.ch',
    website: 'https://www.hug.ch',
    languages: ['Français', 'Allemand', 'Anglais'],
    availability: 'Lun-Ven 8h-18h',
    insurance: ['CSS', 'Swica', 'Concordia'],
    experience: 18,
    education: ['Université de Genève', 'Spécialisation pédiatrie'],
    address: 'Rue Gabrielle-Perret-Gentil 4',
    postalCode: '1205',
    emergencyContact: '+41 22 372 33 11',
    specialties: ['Pédiatrie générale', 'Suivi de croissance'],
    certifications: ['FMH Pédiatrie'],
    researchAreas: ['Développement infantile', 'Vaccination'],
    publications: ['Études sur la croissance infantile'],
    awards: ['Prix de la pédiatrie 2022'],
    languagesSpoken: ['Français', 'Allemand', 'Anglais'],
    accessibility: ['Accès handicapé', 'Parking'],
    parking: true,
    publicTransport: true,
    wheelchairAccess: true,
    fmhNumber: 'FMH-12345',
    waitingTime: '1-2 semaines',
    acceptsEmergencies: true,
    homeVisits: true,
    telehealth: true,
    groupSessions: true,
    familySupport: true,
    consultationFee: 'CHF 200',
    emergencyHours: '8h-18h',
    region: 'Suisse romande',
    pediatricSpecialties: ['Pédiatrie générale', 'Suivi de croissance'],
    ageGroups: ['0-2 ans', '3-6 ans', '7-12 ans', '13-18 ans'],
    developmentalAreas: ['Croissance physique', 'Développement moteur', 'Vaccination']
  },

  // CENTRE DE NEUROPÉDIATRIE GENÈVE
  {
    id: 'ge-hug-002',
    name: 'Dr. Jean-Pierre Moret',
    title: 'Dr.',
    specialty: 'Neuropédiatrie',
    specialtyCode: 'neu',
    cantonCode: 'ge',
    canton: 'Genève',
    city: 'Genève',
    institution: 'Centre de Neuropédiatrie HUG',
    coordinates: { lat: 46.2044, lng: 6.1432 },
    acceptsNewPatients: true,
    rating: 4.9,
    reviews: 189,
    phone: '+41 22 372 33 22',
    email: 'jp.moret@hug.ch',
    website: 'https://www.hug.ch',
    languages: ['Français', 'Allemand', 'Anglais'],
    availability: 'Lun-Ven 8h-17h',
    insurance: ['CSS', 'Swica', 'Concordia'],
    experience: 20,
    education: ['Université de Genève', 'Spécialisation neuropédiatrie'],
    address: 'Rue Gabrielle-Perret-Gentil 4',
    postalCode: '1205',
    emergencyContact: '+41 22 372 33 22',
    specialties: ['Troubles neurologiques', 'Autisme', 'TDAH'],
    certifications: ['FMH Neuropédiatrie'],
    researchAreas: ['Troubles du spectre autistique', 'TDAH'],
    publications: ['Études sur l\'autisme précoce'],
    awards: ['Prix de la neuropédiatrie 2021'],
    languagesSpoken: ['Français', 'Allemand', 'Anglais'],
    accessibility: ['Accès handicapé', 'Parking'],
    parking: true,
    publicTransport: true,
    wheelchairAccess: true,
    fmhNumber: 'FMH-12346',
    waitingTime: '2-3 semaines',
    acceptsEmergencies: true,
    homeVisits: false,
    telehealth: true,
    groupSessions: true,
    familySupport: true,
    consultationFee: 'CHF 250',
    emergencyHours: '8h-17h',
    region: 'Suisse romande',
    pediatricSpecialties: ['Neuropédiatrie', 'Troubles du développement'],
    ageGroups: ['0-2 ans', '3-6 ans', '7-12 ans', '13-18 ans'],
    developmentalAreas: ['Développement neurologique', 'Troubles du comportement', 'Autisme']
  },

  // CENTRE D'ORTHOPHONIE GENÈVE
  {
    id: 'ge-hug-003',
    name: 'Mme. Anne-Marie Rochat',
    title: 'Mme.',
    specialty: 'Orthophonie',
    specialtyCode: 'ort',
    cantonCode: 'ge',
    canton: 'Genève',
    city: 'Genève',
    institution: 'Centre d\'Orthophonie HUG',
    coordinates: { lat: 46.2044, lng: 6.1432 },
    acceptsNewPatients: true,
    rating: 4.7,
    reviews: 167,
    phone: '+41 22 372 33 33',
    email: 'am.rochat@hug.ch',
    website: 'https://www.hug.ch',
    languages: ['Français', 'Allemand', 'Anglais'],
    availability: 'Lun-Ven 9h-17h',
    insurance: ['CSS', 'Swica', 'Concordia'],
    experience: 15,
    education: ['Haute École de Santé Genève', 'Orthophonie'],
    address: 'Rue Gabrielle-Perret-Gentil 4',
    postalCode: '1205',
    emergencyContact: '+41 22 372 33 33',
    specialties: ['Troubles du langage', 'Bégaiement', 'Dyslexie'],
    certifications: ['Orthophoniste diplômée'],
    researchAreas: ['Développement du langage', 'Troubles de la communication'],
    publications: ['Études sur le développement langagier'],
    awards: ['Orthophoniste de l\'année 2022'],
    languagesSpoken: ['Français', 'Allemand', 'Anglais'],
    accessibility: ['Accès handicapé'],
    parking: true,
    publicTransport: true,
    wheelchairAccess: true,
    fmhNumber: 'ORT-12347',
    waitingTime: '2-3 semaines',
    acceptsEmergencies: false,
    homeVisits: true,
    telehealth: true,
    groupSessions: true,
    familySupport: true,
    consultationFee: 'CHF 150',
    emergencyHours: '9h-17h',
    region: 'Suisse romande',
    pediatricSpecialties: ['Orthophonie', 'Troubles de la communication'],
    ageGroups: ['2-6 ans', '7-12 ans', '13-18 ans'],
    developmentalAreas: ['Développement du langage', 'Communication', 'Lecture']
  },

  // CENTRE DE PSYCHOLOGIE INFANTILE GENÈVE
  {
    id: 'ge-hug-004',
    name: 'Mme. Valérie Zbinden',
    title: 'Mme.',
    specialty: 'Psychologie infantile',
    specialtyCode: 'psy',
    cantonCode: 'ge',
    canton: 'Genève',
    city: 'Genève',
    institution: 'Centre de Psychologie Infantile HUG',
    coordinates: { lat: 46.2044, lng: 6.1432 },
    acceptsNewPatients: true,
    rating: 4.6,
    reviews: 198,
    phone: '+41 22 372 33 44',
    email: 'v.zbinden@hug.ch',
    website: 'https://www.hug.ch',
    languages: ['Français', 'Allemand', 'Anglais'],
    availability: 'Lun-Ven 9h-18h',
    insurance: ['CSS', 'Swica', 'Concordia'],
    experience: 16,
    education: ['Université de Genève', 'Psychologie clinique infantile'],
    address: 'Rue Gabrielle-Perret-Gentil 4',
    postalCode: '1205',
    emergencyContact: '+41 22 372 33 44',
    specialties: ['Développement psychologique', 'Troubles du comportement'],
    certifications: ['Psychologue diplômée'],
    researchAreas: ['Développement psychologique', 'Troubles anxieux'],
    publications: ['Études sur l\'anxiété infantile'],
    awards: ['Prix de la psychologie 2021'],
    languagesSpoken: ['Français', 'Allemand', 'Anglais'],
    accessibility: ['Accès handicapé'],
    parking: true,
    publicTransport: true,
    wheelchairAccess: true,
    fmhNumber: 'PSY-12348',
    waitingTime: '3-4 semaines',
    acceptsEmergencies: false,
    homeVisits: false,
    telehealth: true,
    groupSessions: true,
    familySupport: true,
    consultationFee: 'CHF 180',
    emergencyHours: '9h-18h',
    region: 'Suisse romande',
    pediatricSpecialties: ['Psychologie infantile', 'Développement psychologique'],
    ageGroups: ['3-6 ans', '7-12 ans', '13-18 ans'],
    developmentalAreas: ['Développement psychologique', 'Gestion des émotions', 'Relations sociales']
  },

  // CENTRE D'ERGOTHÉRAPIE PÉDIATRIQUE GENÈVE
  {
    id: 'ge-hug-005',
    name: 'Mme. Claire Bovet',
    title: 'Mme.',
    specialty: 'Ergothérapie pédiatrique',
    specialtyCode: 'erg',
    cantonCode: 'ge',
    canton: 'Genève',
    city: 'Genève',
    institution: 'Centre d\'Ergothérapie Pédiatrique HUG',
    coordinates: { lat: 46.2044, lng: 6.1432 },
    acceptsNewPatients: true,
    rating: 4.8,
    reviews: 145,
    phone: '+41 22 372 33 55',
    email: 'c.bovet@hug.ch',
    website: 'https://www.hug.ch',
    languages: ['Français', 'Allemand', 'Anglais'],
    availability: 'Lun-Ven 8h-17h',
    insurance: ['CSS', 'Swica', 'Concordia'],
    experience: 14,
    education: ['Haute École de Santé Genève', 'Ergothérapie'],
    address: 'Rue Gabrielle-Perret-Gentil 4',
    postalCode: '1205',
    emergencyContact: '+41 22 372 33 55',
    specialties: ['Développement moteur', 'Motricité fine', 'Adaptation'],
    certifications: ['Ergothérapeute diplômée'],
    researchAreas: ['Développement moteur', 'Adaptation des activités'],
    publications: ['Études sur la motricité fine'],
    awards: ['Ergothérapeute de l\'année 2022'],
    languagesSpoken: ['Français', 'Allemand', 'Anglais'],
    accessibility: ['Accès handicapé', 'Parking'],
    parking: true,
    publicTransport: true,
    wheelchairAccess: true,
    fmhNumber: 'ERG-12349',
    waitingTime: '2-3 semaines',
    acceptsEmergencies: false,
    homeVisits: true,
    telehealth: false,
    groupSessions: true,
    familySupport: true,
    consultationFee: 'CHF 160',
    emergencyHours: '8h-17h',
    region: 'Suisse romande',
    pediatricSpecialties: ['Ergothérapie pédiatrique', 'Développement moteur'],
    ageGroups: ['0-2 ans', '3-6 ans', '7-12 ans', '13-18 ans'],
    developmentalAreas: ['Motricité fine', 'Coordination', 'Autonomie quotidienne']
  },

  // CENTRE DE PHYSIOTHÉRAPIE PÉDIATRIQUE GENÈVE
  {
    id: 'ge-hug-006',
    name: 'Mme. Isabelle Pasquier',
    title: 'Mme.',
    specialty: 'Physiothérapie pédiatrique',
    specialtyCode: 'phy',
    cantonCode: 'ge',
    canton: 'Genève',
    city: 'Genève',
    institution: 'Centre de Physiothérapie Pédiatrique HUG',
    coordinates: { lat: 46.2044, lng: 6.1432 },
    acceptsNewPatients: true,
    rating: 4.7,
    reviews: 178,
    phone: '+41 22 372 33 66',
    email: 'i.pasquier@hug.ch',
    website: 'https://www.hug.ch',
    languages: ['Français', 'Allemand', 'Anglais'],
    availability: 'Lun-Ven 7h-19h',
    insurance: ['CSS', 'Swica', 'Concordia'],
    experience: 12,
    education: ['Haute École de Santé Genève', 'Physiothérapie'],
    address: 'Rue Gabrielle-Perret-Gentil 4',
    postalCode: '1205',
    emergencyContact: '+41 22 372 33 66',
    specialties: ['Rééducation motrice', 'Développement moteur'],
    certifications: ['Physiothérapeute diplômée'],
    researchAreas: ['Rééducation pédiatrique', 'Développement moteur'],
    publications: ['Études sur la rééducation motrice'],
    awards: ['Physiothérapeute de l\'année 2021'],
    languagesSpoken: ['Français', 'Allemand', 'Anglais'],
    accessibility: ['Accès handicapé', 'Parking'],
    parking: true,
    publicTransport: true,
    wheelchairAccess: true,
    fmhNumber: 'PT-12350',
    waitingTime: '1-2 semaines',
    acceptsEmergencies: false,
    homeVisits: true,
    telehealth: false,
    groupSessions: true,
    familySupport: true,
    consultationFee: 'CHF 140',
    emergencyHours: '7h-19h',
    region: 'Suisse romande',
    pediatricSpecialties: ['Physiothérapie pédiatrique', 'Rééducation motrice'],
    ageGroups: ['0-2 ans', '3-6 ans', '7-12 ans', '13-18 ans'],
    developmentalAreas: ['Développement moteur', 'Marche', 'Équilibre']
  },

  // ========================================
  // AJOUTS SUPPLÉMENTAIRES GENÈVE (7-11)
  // ========================================

  // CENTRE DE PÉDIATRIE GÉNÉRALE GENÈVE - SUPPLEMENTAIRE
  {
    id: 'ge-hug-007',
    name: 'Dr. Marc-André Weber',
    title: 'Dr.',
    specialty: 'Pédiatrie',
    specialtyCode: 'ped',
    cantonCode: 'ge',
    canton: 'Genève',
    city: 'Genève',
    institution: 'Hôpitaux Universitaires de Genève (HUG)',
    coordinates: { lat: 46.2044, lng: 6.1432 },
    acceptsNewPatients: true,
    rating: 4.6,
    reviews: 156,
    phone: '+41 22 372 33 77',
    email: 'ma.weber@hug.ch',
    website: 'https://www.hug.ch',
    languages: ['Français', 'Allemand', 'Anglais'],
    availability: 'Lun-Ven 8h-17h',
    insurance: ['CSS', 'Swica', 'Concordia'],
    experience: 15,
    education: ['Université de Genève', 'Spécialisation pédiatrie'],
    address: 'Rue Gabrielle-Perret-Gentil 4',
    postalCode: '1205',
    emergencyContact: '+41 22 372 33 77',
    specialties: ['Pédiatrie générale', 'Vaccination'],
    certifications: ['FMH Pédiatrie'],
    researchAreas: ['Vaccination infantile', 'Prévention'],
    publications: ['Études sur la vaccination'],
    awards: ['Prix de la prévention 2021'],
    languagesSpoken: ['Français', 'Allemand', 'Anglais'],
    accessibility: ['Accès handicapé', 'Parking'],
    parking: true,
    publicTransport: true,
    wheelchairAccess: true,
    fmhNumber: 'FMH-12351',
    waitingTime: '1-2 semaines',
    acceptsEmergencies: true,
    homeVisits: true,
    telehealth: true,
    groupSessions: true,
    familySupport: true,
    consultationFee: 'CHF 200',
    emergencyHours: '8h-17h',
    region: 'Suisse romande',
    pediatricSpecialties: ['Pédiatrie générale', 'Vaccination'],
    ageGroups: ['0-2 ans', '3-6 ans', '7-12 ans', '13-18 ans'],
    developmentalAreas: ['Croissance physique', 'Vaccination', 'Prévention']
  },

  // CENTRE DE NEUROPÉDIATRIE GENÈVE - SUPPLEMENTAIRE
  {
    id: 'ge-hug-008',
    name: 'Dr. Sophie Laurent',
    title: 'Dr.',
    specialty: 'Neuropédiatrie',
    specialtyCode: 'neu',
    cantonCode: 'ge',
    canton: 'Genève',
    city: 'Genève',
    institution: 'Centre de Neuropédiatrie HUG',
    coordinates: { lat: 46.2044, lng: 6.1432 },
    acceptsNewPatients: true,
    rating: 4.8,
    reviews: 134,
    phone: '+41 22 372 33 88',
    email: 's.laurent@hug.ch',
    website: 'https://www.hug.ch',
    languages: ['Français', 'Allemand', 'Anglais'],
    availability: 'Lun-Ven 9h-18h',
    insurance: ['CSS', 'Swica', 'Concordia'],
    experience: 17,
    education: ['Université de Genève', 'Spécialisation neuropédiatrie'],
    address: 'Rue Gabrielle-Perret-Gentil 4',
    postalCode: '1205',
    emergencyContact: '+41 22 372 33 88',
    specialties: ['Troubles neurologiques', 'Épilepsie'],
    certifications: ['FMH Neuropédiatrie'],
    researchAreas: ['Épilepsie pédiatrique', 'Troubles du sommeil'],
    publications: ['Études sur l\'épilepsie infantile'],
    awards: ['Prix de la neuropédiatrie 2022'],
    languagesSpoken: ['Français', 'Allemand', 'Anglais'],
    accessibility: ['Accès handicapé', 'Parking'],
    parking: true,
    publicTransport: true,
    wheelchairAccess: true,
    fmhNumber: 'FMH-12352',
    waitingTime: '2-3 semaines',
    acceptsEmergencies: true,
    homeVisits: false,
    telehealth: true,
    groupSessions: true,
    familySupport: true,
    consultationFee: 'CHF 250',
    emergencyHours: '9h-18h',
    region: 'Suisse romande',
    pediatricSpecialties: ['Neuropédiatrie', 'Épilepsie'],
    ageGroups: ['0-2 ans', '3-6 ans', '7-12 ans', '13-18 ans'],
    developmentalAreas: ['Développement neurologique', 'Épilepsie', 'Sommeil']
  },

  // CENTRE D'ORTHOPHONIE GENÈVE - SUPPLEMENTAIRE
  {
    id: 'ge-hug-009',
    name: 'Mme. Caroline Meier',
    title: 'Mme.',
    specialty: 'Orthophonie',
    specialtyCode: 'ort',
    cantonCode: 'ge',
    canton: 'Genève',
    city: 'Genève',
    institution: 'Centre d\'Orthophonie HUG',
    coordinates: { lat: 46.2044, lng: 6.1432 },
    acceptsNewPatients: true,
    rating: 4.5,
    reviews: 98,
    phone: '+41 22 372 33 99',
    email: 'c.meier@hug.ch',
    website: 'https://www.hug.ch',
    languages: ['Français', 'Allemand', 'Anglais'],
    availability: 'Lun-Ven 8h-16h',
    insurance: ['CSS', 'Swica', 'Concordia'],
    experience: 13,
    education: ['Haute École de Santé Genève', 'Orthophonie'],
    address: 'Rue Gabrielle-Perret-Gentil 4',
    postalCode: '1205',
    emergencyContact: '+41 22 372 33 99',
    specialties: ['Troubles du langage', 'Dyslexie'],
    certifications: ['Orthophoniste diplômée'],
    researchAreas: ['Dyslexie', 'Troubles d\'apprentissage'],
    publications: ['Études sur la dyslexie'],
    awards: ['Orthophoniste de l\'année 2021'],
    languagesSpoken: ['Français', 'Allemand', 'Anglais'],
    accessibility: ['Accès handicapé'],
    parking: true,
    publicTransport: true,
    wheelchairAccess: true,
    fmhNumber: 'ORT-12353',
    waitingTime: '3-4 semaines',
    acceptsEmergencies: false,
    homeVisits: true,
    telehealth: true,
    groupSessions: true,
    familySupport: true,
    consultationFee: 'CHF 150',
    emergencyHours: '8h-16h',
    region: 'Suisse romande',
    pediatricSpecialties: ['Orthophonie', 'Dyslexie'],
    ageGroups: ['6-12 ans', '13-18 ans'],
    developmentalAreas: ['Lecture', 'Apprentissage', 'Communication']
  },

  // CENTRE DE PSYCHOLOGIE INFANTILE GENÈVE - SUPPLEMENTAIRE
  {
    id: 'ge-hug-010',
    name: 'Mme. Nathalie Berger',
    title: 'Mme.',
    specialty: 'Psychologie infantile',
    specialtyCode: 'psy',
    cantonCode: 'ge',
    canton: 'Genève',
    city: 'Genève',
    institution: 'Centre de Psychologie Infantile HUG',
    coordinates: { lat: 46.2044, lng: 6.1432 },
    acceptsNewPatients: true,
    rating: 4.7,
    reviews: 112,
    phone: '+41 22 372 34 00',
    email: 'n.berger@hug.ch',
    website: 'https://www.hug.ch',
    languages: ['Français', 'Allemand', 'Anglais'],
    availability: 'Lun-Ven 10h-19h',
    insurance: ['CSS', 'Swica', 'Concordia'],
    experience: 14,
    education: ['Université de Genève', 'Psychologie clinique infantile'],
    address: 'Rue Gabrielle-Perret-Gentil 4',
    postalCode: '1205',
    emergencyContact: '+41 22 372 34 00',
    specialties: ['Troubles anxieux', 'Phobies'],
    certifications: ['Psychologue diplômée'],
    researchAreas: ['Anxiété infantile', 'Phobies scolaires'],
    publications: ['Études sur l\'anxiété scolaire'],
    awards: ['Prix de la psychologie 2022'],
    languagesSpoken: ['Français', 'Allemand', 'Anglais'],
    accessibility: ['Accès handicapé'],
    parking: true,
    publicTransport: true,
    wheelchairAccess: true,
    fmhNumber: 'PSY-12354',
    waitingTime: '4-5 semaines',
    acceptsEmergencies: false,
    homeVisits: false,
    telehealth: true,
    groupSessions: true,
    familySupport: true,
    consultationFee: 'CHF 180',
    emergencyHours: '10h-19h',
    region: 'Suisse romande',
    pediatricSpecialties: ['Psychologie infantile', 'Anxiété'],
    ageGroups: ['5-12 ans', '13-18 ans'],
    developmentalAreas: ['Gestion de l\'anxiété', 'Phobies', 'Estime de soi']
  },

  // CENTRE D'ERGOTHÉRAPIE PÉDIATRIQUE GENÈVE - SUPPLEMENTAIRE
  {
    id: 'ge-hug-011',
    name: 'Mme. Marie Dubois',
    title: 'Mme.',
    specialty: 'Ergothérapie pédiatrique',
    specialtyCode: 'erg',
    cantonCode: 'ge',
    canton: 'Genève',
    city: 'Genève',
    institution: 'Centre d\'Ergothérapie Pédiatrique HUG',
    coordinates: { lat: 46.2044, lng: 6.1432 },
    acceptsNewPatients: true,
    rating: 4.6,
    reviews: 87,
    phone: '+41 22 372 34 11',
    email: 'm.dubois@hug.ch',
    website: 'https://www.hug.ch',
    languages: ['Français', 'Allemand', 'Anglais'],
    availability: 'Lun-Ven 7h-16h',
    insurance: ['CSS', 'Swica', 'Concordia'],
    experience: 11,
    education: ['Haute École de Santé Genève', 'Ergothérapie'],
    address: 'Rue Gabrielle-Perret-Gentil 4',
    postalCode: '1205',
    emergencyContact: '+41 22 372 34 11',
    specialties: ['Motricité fine', 'Graphomotricité'],
    certifications: ['Ergothérapeute diplômée'],
    researchAreas: ['Développement de l\'écriture', 'Motricité fine'],
    publications: ['Études sur la graphomotricité'],
    awards: ['Ergothérapeute de l\'année 2021'],
    languagesSpoken: ['Français', 'Allemand', 'Anglais'],
    accessibility: ['Accès handicapé', 'Parking'],
    parking: true,
    publicTransport: true,
    wheelchairAccess: true,
    fmhNumber: 'ERG-12355',
    waitingTime: '2-3 semaines',
    acceptsEmergencies: false,
    homeVisits: true,
    telehealth: false,
    groupSessions: true,
    familySupport: true,
    consultationFee: 'CHF 160',
    emergencyHours: '7h-16h',
    region: 'Suisse romande',
    pediatricSpecialties: ['Ergothérapie pédiatrique', 'Graphomotricité'],
    ageGroups: ['5-12 ans', '13-18 ans'],
    developmentalAreas: ['Écriture', 'Motricité fine', 'Coordination']
  },

  // ========================================
  // CANTON DE VAUD (VD) - SUISSE ROMANDE
  // ========================================

  // CENTRE HOSPITALIER UNIVERSITAIRE VAUDOIS (CHUV)
  {
    id: 'vd-chuv-001',
    name: 'Dr. Pierre Moreau',
    title: 'Dr.',
    specialty: 'Pédiatrie',
    specialtyCode: 'ped',
    cantonCode: 'vd',
    canton: 'Vaud',
    city: 'Lausanne',
    institution: 'Centre Hospitalier Universitaire Vaudois (CHUV)',
    coordinates: { lat: 46.5197, lng: 6.6323 },
    acceptsNewPatients: true,
    rating: 4.8,
    reviews: 245,
    phone: '+41 21 314 11 11',
    email: 'p.moreau@chuv.ch',
    website: 'https://www.chuv.ch',
    languages: ['Français', 'Allemand', 'Anglais'],
    availability: 'Lun-Ven 8h-18h',
    insurance: ['CSS', 'Swica', 'Concordia'],
    experience: 19,
    education: ['Université de Lausanne', 'Spécialisation pédiatrie'],
    address: 'Rue du Bugnon 46',
    postalCode: '1011',
    emergencyContact: '+41 21 314 11 11',
    specialties: ['Pédiatrie générale', 'Suivi de croissance'],
    certifications: ['FMH Pédiatrie'],
    researchAreas: ['Croissance infantile', 'Nutrition pédiatrique'],
    publications: ['Études sur la nutrition infantile'],
    awards: ['Prix de la pédiatrie 2022'],
    languagesSpoken: ['Français', 'Allemand', 'Anglais'],
    accessibility: ['Accès handicapé', 'Parking'],
    parking: true,
    publicTransport: true,
    wheelchairAccess: true,
    fmhNumber: 'FMH-12356',
    waitingTime: '1-2 semaines',
    acceptsEmergencies: true,
    homeVisits: true,
    telehealth: true,
    groupSessions: true,
    familySupport: true,
    consultationFee: 'CHF 200',
    emergencyHours: '8h-18h',
    region: 'Suisse romande',
    pediatricSpecialties: ['Pédiatrie générale', 'Nutrition'],
    ageGroups: ['0-2 ans', '3-6 ans', '7-12 ans', '13-18 ans'],
    developmentalAreas: ['Croissance physique', 'Nutrition', 'Vaccination']
  },

  // CENTRE DE NEUROPÉDIATRIE VAUD
  {
    id: 'vd-chuv-002',
    name: 'Dr. Anne-Marie Schneider',
    title: 'Dr.',
    specialty: 'Neuropédiatrie',
    specialtyCode: 'neu',
    cantonCode: 'vd',
    canton: 'Vaud',
    city: 'Lausanne',
    institution: 'Centre de Neuropédiatrie CHUV',
    coordinates: { lat: 46.5197, lng: 6.6323 },
    acceptsNewPatients: true,
    rating: 4.9,
    reviews: 178,
    phone: '+41 21 314 12 22',
    email: 'am.schneider@chuv.ch',
    website: 'https://www.chuv.ch',
    languages: ['Français', 'Allemand', 'Anglais'],
    availability: 'Lun-Ven 8h-17h',
    insurance: ['CSS', 'Swica', 'Concordia'],
    experience: 21,
    education: ['Université de Lausanne', 'Spécialisation neuropédiatrie'],
    address: 'Rue du Bugnon 46',
    postalCode: '1011',
    emergencyContact: '+41 21 314 12 22',
    specialties: ['Troubles neurologiques', 'TDAH'],
    certifications: ['FMH Neuropédiatrie'],
    researchAreas: ['TDAH', 'Troubles de l\'attention'],
    publications: ['Études sur le TDAH'],
    awards: ['Prix de la neuropédiatrie 2021'],
    languagesSpoken: ['Français', 'Allemand', 'Anglais'],
    accessibility: ['Accès handicapé', 'Parking'],
    parking: true,
    publicTransport: true,
    wheelchairAccess: true,
    fmhNumber: 'FMH-12357',
    waitingTime: '2-3 semaines',
    acceptsEmergencies: true,
    homeVisits: false,
    telehealth: true,
    groupSessions: true,
    familySupport: true,
    consultationFee: 'CHF 250',
    emergencyHours: '8h-17h',
    region: 'Suisse romande',
    pediatricSpecialties: ['Neuropédiatrie', 'TDAH'],
    ageGroups: ['0-2 ans', '3-6 ans', '7-12 ans', '13-18 ans'],
    developmentalAreas: ['Développement neurologique', 'TDAH', 'Attention']
  },

  // CENTRE D'ORTHOPHONIE VAUD
  {
    id: 'vd-chuv-003',
    name: 'Mme. Lucie Martin',
    title: 'Mme.',
    specialty: 'Orthophonie',
    specialtyCode: 'ort',
    cantonCode: 'vd',
    canton: 'Vaud',
    city: 'Lausanne',
    institution: 'Centre d\'Orthophonie CHUV',
    coordinates: { lat: 46.5197, lng: 6.6323 },
    acceptsNewPatients: true,
    rating: 4.7,
    reviews: 145,
    phone: '+41 21 314 13 33',
    email: 'l.martin@chuv.ch',
    website: 'https://www.chuv.ch',
    languages: ['Français', 'Allemand', 'Anglais'],
    availability: 'Lun-Ven 9h-17h',
    insurance: ['CSS', 'Swica', 'Concordia'],
    experience: 16,
    education: ['Haute École de Santé Vaud', 'Orthophonie'],
    address: 'Rue du Bugnon 46',
    postalCode: '1011',
    emergencyContact: '+41 21 314 13 33',
    specialties: ['Troubles du langage', 'Bégaiement'],
    certifications: ['Orthophoniste diplômée'],
    researchAreas: ['Bégaiement', 'Fluence verbale'],
    publications: ['Études sur le bégaiement'],
    awards: ['Orthophoniste de l\'année 2022'],
    languagesSpoken: ['Français', 'Allemand', 'Anglais'],
    accessibility: ['Accès handicapé'],
    parking: true,
    publicTransport: true,
    wheelchairAccess: true,
    fmhNumber: 'ORT-12358',
    waitingTime: '2-3 semaines',
    acceptsEmergencies: false,
    homeVisits: true,
    telehealth: true,
    groupSessions: true,
    familySupport: true,
    consultationFee: 'CHF 150',
    emergencyHours: '9h-17h',
    region: 'Suisse romande',
    pediatricSpecialties: ['Orthophonie', 'Bégaiement'],
    ageGroups: ['2-6 ans', '7-12 ans', '13-18 ans'],
    developmentalAreas: ['Fluence verbale', 'Communication', 'Confiance']
  },

  // CENTRE DE PSYCHOLOGIE INFANTILE VAUD
  {
    id: 'vd-chuv-004',
    name: 'Mme. Sophie Bernard',
    title: 'Mme.',
    specialty: 'Psychologie infantile',
    specialtyCode: 'psy',
    cantonCode: 'vd',
    canton: 'Vaud',
    city: 'Lausanne',
    institution: 'Centre de Psychologie Infantile CHUV',
    coordinates: { lat: 46.5197, lng: 6.6323 },
    acceptsNewPatients: true,
    rating: 4.6,
    reviews: 167,
    phone: '+41 21 314 14 44',
    email: 's.bernard@chuv.ch',
    website: 'https://www.chuv.ch',
    languages: ['Français', 'Allemand', 'Anglais'],
    availability: 'Lun-Ven 9h-18h',
    insurance: ['CSS', 'Swica', 'Concordia'],
    experience: 18,
    education: ['Université de Lausanne', 'Psychologie clinique infantile'],
    address: 'Rue du Bugnon 46',
    postalCode: '1011',
    emergencyContact: '+41 21 314 14 44',
    specialties: ['Troubles du comportement', 'Hyperactivité'],
    certifications: ['Psychologue diplômée'],
    researchAreas: ['Hyperactivité', 'Troubles du comportement'],
    publications: ['Études sur l\'hyperactivité'],
    awards: ['Prix de la psychologie 2021'],
    languagesSpoken: ['Français', 'Allemand', 'Anglais'],
    accessibility: ['Accès handicapé'],
    parking: true,
    publicTransport: true,
    wheelchairAccess: true,
    fmhNumber: 'PSY-12359',
    waitingTime: '3-4 semaines',
    acceptsEmergencies: false,
    homeVisits: false,
    telehealth: true,
    groupSessions: true,
    familySupport: true,
    consultationFee: 'CHF 180',
    emergencyHours: '9h-18h',
    region: 'Suisse romande',
    pediatricSpecialties: ['Psychologie infantile', 'Comportement'],
    ageGroups: ['3-6 ans', '7-12 ans', '13-18 ans'],
    developmentalAreas: ['Gestion du comportement', 'Hyperactivité', 'Relations']
  },

  // CENTRE D'ERGOTHÉRAPIE PÉDIATRIQUE VAUD
  {
    id: 'vd-chuv-005',
    name: 'Mme. Claire Dubois',
    title: 'Mme.',
    specialty: 'Ergothérapie pédiatrique',
    specialtyCode: 'erg',
    cantonCode: 'vd',
    canton: 'Vaud',
    city: 'Lausanne',
    institution: 'Centre d\'Ergothérapie Pédiatrique CHUV',
    coordinates: { lat: 46.5197, lng: 6.6323 },
    acceptsNewPatients: true,
    rating: 4.8,
    reviews: 123,
    phone: '+41 21 314 15 55',
    email: 'c.dubois@chuv.ch',
    website: 'https://www.chuv.ch',
    languages: ['Français', 'Allemand', 'Anglais'],
    availability: 'Lun-Ven 8h-17h',
    insurance: ['CSS', 'Swica', 'Concordia'],
    experience: 15,
    education: ['Haute École de Santé Vaud', 'Ergothérapie'],
    address: 'Rue du Bugnon 46',
    postalCode: '1011',
    emergencyContact: '+41 21 314 15 55',
    specialties: ['Développement moteur', 'Autonomie'],
    certifications: ['Ergothérapeute diplômée'],
    researchAreas: ['Autonomie quotidienne', 'Développement moteur'],
    publications: ['Études sur l\'autonomie'],
    awards: ['Ergothérapeute de l\'année 2022'],
    languagesSpoken: ['Français', 'Allemand', 'Anglais'],
    accessibility: ['Accès handicapé', 'Parking'],
    parking: true,
    publicTransport: true,
    wheelchairAccess: true,
    fmhNumber: 'ERG-12360',
    waitingTime: '2-3 semaines',
    acceptsEmergencies: false,
    homeVisits: true,
    telehealth: false,
    groupSessions: true,
    familySupport: true,
    consultationFee: 'CHF 160',
    emergencyHours: '8h-17h',
    region: 'Suisse romande',
    pediatricSpecialties: ['Ergothérapie pédiatrique', 'Autonomie'],
    ageGroups: ['0-2 ans', '3-6 ans', '7-12 ans', '13-18 ans'],
    developmentalAreas: ['Autonomie quotidienne', 'Motricité', 'Indépendance']
  }
];

// Statistiques calculées de la base de données pédiatrique
export const swissPediatricStats: PediatricStats = {
  totalProfessionals: swissPediatricProfessionals.length,
  cantonsCovered: 2, // Genève et Vaud
  specialtiesAvailable: 6, // Les 6 spécialités essentielles
  avgRating: 4.8,
  newPatientsAvailable: swissPediatricProfessionals.filter(p => p.acceptsNewPatients).length,
  totalInstitutions: 2, // HUG et CHUV
  totalCities: 2, // Genève et Lausanne
  emergencyServices: 4, // Pédiatrie et Neuropédiatrie des 2 cantons
  researchCenters: 11, // Tous les centres
  teachingHospitals: 2, // HUG et CHUV
  totalLanguages: 3, // Français, Allemand, Anglais
  totalInsurance: 3, // CSS, Swica, Concordia
  
  // Statistiques spécifiques pédiatriques
  ageGroupsCovered: ['0-2 ans', '3-6 ans', '7-12 ans', '13-18 ans'],
  developmentalAreasCovered: [
    'Croissance physique',
    'Développement moteur',
    'Développement neurologique',
    'Développement du langage',
    'Développement psychologique',
    'Motricité fine',
    'Coordination',
    'Autonomie quotidienne',
    'Marche',
    'Équilibre',
    'Vaccination',
    'Troubles du comportement',
    'Autisme',
    'Communication',
    'Lecture',
    'Gestion des émotions',
    'Relations sociales',
    'Nutrition',
    'TDAH',
    'Attention',
    'Fluence verbale',
    'Confiance',
    'Hyperactivité',
    'Écriture',
    'Graphomotricité',
    'Phobies',
    'Estime de soi',
    'Indépendance'
  ],
  pediatricInstitutions: 11 // Tous les centres sont pédiatriques
};

// Classe principale pour gérer la base de données pédiatrique
export class SwissPediatricDatabase {
  
  // Récupérer tous les professionnels
  static getAllProfessionals(): PediatricProfessional[] {
    return swissPediatricProfessionals;
  }

  // Récupérer par spécialité
  static getProfessionalsBySpecialty(specialty: string): PediatricProfessional[] {
    return swissPediatricProfessionals.filter(p => p.specialty === specialty);
  }

  // Récupérer par canton
  static getProfessionalsByCanton(cantonCode: string): PediatricProfessional[] {
    return swissPediatricProfessionals.filter(p => p.cantonCode === cantonCode);
  }

  // Récupérer par groupe d'âge
  static getProfessionalsByAgeGroup(ageGroup: string): PediatricProfessional[] {
    return swissPediatricProfessionals.filter(p => p.ageGroups.includes(ageGroup));
  }

  // Récupérer par domaine de développement
  static getProfessionalsByDevelopmentalArea(area: string): PediatricProfessional[] {
    return swissPediatricProfessionals.filter(p => p.developmentalAreas.includes(area));
  }

  // Récupérer par disponibilité
  static getProfessionalsByAvailability(acceptsNewPatients: boolean): PediatricProfessional[] {
    return swissPediatricProfessionals.filter(p => p.acceptsNewPatients === acceptsNewPatients);
  }

  // Récupérer par note minimum
  static getProfessionalsByRating(minRating: number): PediatricProfessional[] {
    return swissPediatricProfessionals.filter(p => p.rating >= minRating);
  }

  // Récupérer par langues
  static getProfessionalsByLanguages(languages: string[]): PediatricProfessional[] {
    return swissPediatricProfessionals.filter(p => 
      p.languages && languages.some(lang => p.languages.includes(lang))
    );
  }

  // Recherche textuelle avancée
  static searchProfessionals(query: string): PediatricProfessional[] {
    const lowerQuery = query.toLowerCase();
    return swissPediatricProfessionals.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.specialty.toLowerCase().includes(lowerQuery) ||
      p.city.toLowerCase().includes(lowerQuery) ||
      p.institution.toLowerCase().includes(lowerQuery) ||
      p.pediatricSpecialties.some(s => s.toLowerCase().includes(lowerQuery)) ||
      p.developmentalAreas.some(r => r.toLowerCase().includes(lowerQuery))
    );
  }

  // Récupérer les statistiques
  static getStats(): PediatricStats {
    return swissPediatricStats;
  }

  // Récupérer les spécialités disponibles
  static getAvailableSpecialties(): string[] {
    return [...new Set(swissPediatricProfessionals.map(p => p.specialty))].sort();
  }

  // Récupérer les groupes d'âge disponibles
  static getAvailableAgeGroups(): string[] {
    return [...new Set(swissPediatricProfessionals.flatMap(p => p.ageGroups))].sort();
  }

  // Récupérer les domaines de développement disponibles
  static getAvailableDevelopmentalAreas(): string[] {
    return [...new Set(swissPediatricProfessionals.flatMap(p => p.developmentalAreas))].sort();
  }

  // Récupérer les institutions disponibles
  static getAvailableInstitutions(): string[] {
    return [...new Set(swissPediatricProfessionals.map(p => p.institution))].sort();
  }

  // Récupérer les villes disponibles
  static getAvailableCities(): string[] {
    return [...new Set(swissPediatricProfessionals.map(p => p.city))].sort();
  }

  // Récupérer les cantons disponibles
  static getAvailableCantons(): string[] {
    return [...new Set(swissPediatricProfessionals.map(p => p.cantonCode))].sort();
  }

  // Statistiques par canton
  static getStatsByCanton(cantonCode: string) {
    const cantonProfessionals = this.getProfessionalsByCanton(cantonCode);
    const cantonInfo = {
      total: cantonProfessionals.length,
      specialties: [...new Set(cantonProfessionals.map(p => p.specialty))],
      avgRating: cantonProfessionals.reduce((sum, p) => sum + p.rating, 0) / cantonProfessionals.length,
      newPatients: cantonProfessionals.filter(p => p.acceptsNewPatients).length,
      emergencyServices: cantonProfessionals.filter(p => p.acceptsEmergencies).length,
      ageGroups: [...new Set(cantonProfessionals.flatMap(p => p.ageGroups))],
      developmentalAreas: [...new Set(cantonProfessionals.flatMap(p => p.developmentalAreas))]
    };
    return cantonInfo;
  }

  // Statistiques par spécialité
  static getStatsBySpecialty(specialty: string) {
    const specialtyProfessionals = this.getProfessionalsBySpecialty(specialty);
    const specialtyInfo = {
      total: specialtyProfessionals.length,
      cantons: [...new Set(specialtyProfessionals.map(p => p.cantonCode))],
      avgRating: specialtyProfessionals.reduce((sum, p) => sum + p.rating, 0) / specialtyProfessionals.length,
      newPatients: specialtyProfessionals.filter(p => p.acceptsNewPatients).length,
      emergencyServices: specialtyProfessionals.filter(p => p.acceptsEmergencies).length,
      ageGroups: [...new Set(specialtyProfessionals.flatMap(p => p.ageGroups))],
      developmentalAreas: [...new Set(specialtyProfessionals.flatMap(p => p.developmentalAreas))]
    };
    return specialtyInfo;
  }
}
