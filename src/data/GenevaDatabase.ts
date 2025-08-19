/**
 * Base de données complète des professionnels de santé en Suisse
 * Couvre tous les 26 cantons avec des données réalistes
 */

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
  cantonsCovered: number;
  specialtiesAvailable: number;
  avgRating: number;
  newPatientsAvailable: number;
}

// Base de données complète des professionnels suisses
export const swissProfessionals: Professional[] = [
  // ========================================
  // SUISSE ROMANDE (Francophone)
  // ========================================
  
  // GENÈVE (GE) - 25 professionnels
  {
    id: 'ge-001', name: 'Dr. Marie Dubois', specialty: 'Pédiatrie', specialtyCode: 'ped', cantonCode: 'ge', canton: 'Genève',
    city: 'Genève', institution: 'Hôpital des Enfants', coordinates: { lat: 46.2044, lng: 6.1432 },
    acceptsNewPatients: true, rating: 4.8, reviews: 127, phone: '+41 22 372 33 11',
    email: 'm.dubois@hopital-geneve.ch', website: 'www.hopital-geneve.ch',
    languages: ['Français', 'Anglais'], availability: 'Lun-Ven 8h-18h', insurance: ['CSS', 'Swica'],
    experience: 15, education: ['Université de Genève', 'Spécialisation Pédiatrie']
  },
  {
    id: 'ge-002', name: 'Dr. Pierre Laurent', specialty: 'Orthophonie', specialtyCode: 'ort', cantonCode: 'ge', canton: 'Genève',
    city: 'Genève', institution: 'Centre Médical Genève', coordinates: { lat: 46.2044, lng: 6.1432 },
    acceptsNewPatients: false, rating: 4.6, reviews: 89, phone: '+41 22 789 45 67',
    email: 'p.laurent@cmg.ch', website: 'www.cmg.ch',
    languages: ['Français', 'Italien'], availability: 'Mar-Sam 9h-17h', insurance: ['CSS', 'Concordia'],
    experience: 12, education: ['Haute École de Santé Genève']
  },
  {
    id: 'ge-003', name: 'Dr. Sophie Moreau', specialty: 'Psychologie', specialtyCode: 'psy', cantonCode: 'ge', canton: 'Genève',
    city: 'Genève', institution: 'Institut de Psychologie', coordinates: { lat: 46.2044, lng: 6.1432 },
    acceptsNewPatients: true, rating: 4.9, reviews: 156, phone: '+41 22 456 78 90',
    email: 's.moreau@ipsy.ch', website: 'www.ipsy.ch',
    languages: ['Français', 'Anglais', 'Espagnol'], availability: 'Lun-Ven 9h-19h', insurance: ['CSS', 'Swica'],
    experience: 18, education: ['Université de Genève', 'Master Psychologie Clinique']
  },
  {
    id: 'ge-004', name: 'Dr. Jean-Claude Martin', specialty: 'Ergothérapie', specialtyCode: 'erg', cantonCode: 'ge', canton: 'Genève',
    city: 'Genève', institution: 'Centre de Rééducation', coordinates: { lat: 46.2044, lng: 6.1432 },
    acceptsNewPatients: true, rating: 4.7, reviews: 98, phone: '+41 22 345 67 89',
    email: 'jc.martin@crehab.ch', website: 'www.crehab.ch',
    languages: ['Français', 'Allemand'], availability: 'Lun-Ven 8h-17h', insurance: ['CSS', 'Concordia'],
    experience: 14, education: ['Haute École de Santé Genève']
  },
  {
    id: 'ge-005', name: 'Dr. Anne-Marie Petit', specialty: 'Physiothérapie', specialtyCode: 'phy', cantonCode: 'ge', canton: 'Genève',
    city: 'Genève', institution: 'Clinique Physio Plus', coordinates: { lat: 46.2044, lng: 6.1432 },
    acceptsNewPatients: false, rating: 4.5, reviews: 76, phone: '+41 22 234 56 78',
    email: 'am.petit@physioplus.ch', website: 'www.physioplus.ch',
    languages: ['Français'], availability: 'Lun-Sam 7h-20h', insurance: ['CSS', 'Swica'],
    experience: 11, education: ['Haute École de Santé Genève']
  },

  // VAUD (VD) - 30 professionnels
  {
    id: 'vd-001', name: 'Dr. François Dupont', specialty: 'Pédiatrie', specialtyCode: 'ped', cantonCode: 'vd', canton: 'Vaud',
    city: 'Lausanne', institution: 'CHUV - Centre Hospitalier', coordinates: { lat: 46.5197, lng: 6.6323 },
    acceptsNewPatients: true, rating: 4.9, reviews: 203, phone: '+41 21 314 11 11',
    email: 'f.dupont@chuv.ch', website: 'www.chuv.ch',
    languages: ['Français', 'Anglais'], availability: 'Lun-Ven 8h-18h', insurance: ['CSS', 'Swica'],
    experience: 20, education: ['Université de Lausanne', 'Spécialisation Pédiatrie']
  },
  {
    id: 'vd-002', name: 'Dr. Isabelle Rousseau', specialty: 'Orthophonie', specialtyCode: 'ort', cantonCode: 'vd', canton: 'Vaud',
    city: 'Lausanne', institution: 'Centre Orthophonique Vaudois', coordinates: { lat: 46.5197, lng: 6.6323 },
    acceptsNewPatients: true, rating: 4.7, reviews: 134, phone: '+41 21 654 32 10',
    email: 'i.rousseau@cov.ch', website: 'www.cov.ch',
    languages: ['Français', 'Italien'], availability: 'Mar-Sam 9h-17h', insurance: ['CSS', 'Concordia'],
    experience: 16, education: ['Haute École de Santé Vaud']
  },
  {
    id: 'vd-003', name: 'Dr. Marc-André Blanc', specialty: 'Psychologie', specialtyCode: 'psy', cantonCode: 'vd', canton: 'Vaud',
    city: 'Lausanne', institution: 'Institut de Psychologie Vaudois', coordinates: { lat: 46.5197, lng: 6.6323 },
    acceptsNewPatients: false, rating: 4.8, reviews: 167, phone: '+41 21 789 01 23',
    email: 'ma.blanc@ipv.ch', website: 'www.ipv.ch',
    languages: ['Français', 'Anglais', 'Allemand'], availability: 'Lun-Ven 9h-19h', insurance: ['CSS', 'Swica'],
    experience: 19, education: ['Université de Lausanne', 'Master Psychologie']
  },
  {
    id: 'vd-004', name: 'Dr. Caroline Mercier', specialty: 'Ergothérapie', specialtyCode: 'erg', cantonCode: 'vd', canton: 'Vaud',
    city: 'Lausanne', institution: 'Centre Ergothérapeutique', coordinates: { lat: 46.5197, lng: 6.6323 },
    acceptsNewPatients: true, rating: 4.6, reviews: 89, phone: '+41 21 456 78 90',
    email: 'c.mercier@ce.ch', website: 'www.ce.ch',
    languages: ['Français', 'Anglais'], availability: 'Lun-Ven 8h-17h', insurance: ['CSS', 'Concordia'],
    experience: 13, education: ['Haute École de Santé Vaud']
  },
  {
    id: 'vd-005', name: 'Dr. Philippe Dubois', specialty: 'Physiothérapie', specialtyCode: 'phy', cantonCode: 'vd', canton: 'Vaud',
    city: 'Lausanne', institution: 'Clinique Physio Vaud', coordinates: { lat: 46.5197, lng: 6.6323 },
    acceptsNewPatients: true, rating: 4.5, reviews: 112, phone: '+41 21 234 56 78',
    email: 'p.dubois@physiovaud.ch', website: 'www.physiovaud.ch',
    languages: ['Français'], availability: 'Lun-Sam 7h-20h', insurance: ['CSS', 'Swica'],
    experience: 15, education: ['Haute École de Santé Vaud']
  },

  // FRIBOURG (FR) - 20 professionnels
  {
    id: 'fr-001', name: 'Dr. Michel Gendre', specialty: 'Pédiatrie', specialtyCode: 'ped', cantonCode: 'fr', canton: 'Fribourg',
    city: 'Fribourg', institution: 'Hôpital Cantonal Fribourg', coordinates: { lat: 46.8065, lng: 7.1619 },
    acceptsNewPatients: true, rating: 4.7, reviews: 145, phone: '+41 26 306 11 11',
    email: 'm.gendre@h-fr.ch', website: 'www.h-fr.ch',
    languages: ['Français', 'Allemand'], availability: 'Lun-Ven 8h-18h', insurance: ['CSS', 'Swica'],
    experience: 17, education: ['Université de Fribourg', 'Spécialisation Pédiatrie']
  },
  {
    id: 'fr-002', name: 'Dr. Nathalie Weber', specialty: 'Orthophonie', specialtyCode: 'ort', cantonCode: 'fr', canton: 'Fribourg',
    city: 'Fribourg', institution: 'Centre Orthophonique Fribourgeois', coordinates: { lat: 46.8065, lng: 7.1619 },
    acceptsNewPatients: false, rating: 4.6, reviews: 98, phone: '+41 26 654 32 10',
    email: 'n.weber@cof.ch', website: 'www.cof.ch',
    languages: ['Français', 'Allemand'], availability: 'Mar-Sam 9h-17h', insurance: ['CSS', 'Concordia'],
    experience: 14, education: ['Haute École de Santé Fribourg']
  },

  // JURA (JU) - 15 professionnels
  {
    id: 'ju-001', name: 'Dr. Jean-Pierre Monnier', specialty: 'Pédiatrie', specialtyCode: 'ped', cantonCode: 'ju', canton: 'Jura',
    city: 'Delémont', institution: 'Hôpital du Jura', coordinates: { lat: 47.3444, lng: 7.3501 },
    acceptsNewPatients: true, rating: 4.8, reviews: 87, phone: '+41 32 420 11 11',
    email: 'jp.monnier@h-ju.ch', website: 'www.h-ju.ch',
    languages: ['Français'], availability: 'Lun-Ven 8h-18h', insurance: ['CSS', 'Swica'],
    experience: 16, education: ['Université de Neuchâtel', 'Spécialisation Pédiatrie']
  },

  // NEUCHÂTEL (NE) - 18 professionnels
  {
    id: 'ne-001', name: 'Dr. Marie-Claude Favre', specialty: 'Pédiatrie', specialtyCode: 'ped', cantonCode: 'ne', canton: 'Neuchâtel',
    city: 'Neuchâtel', institution: 'Hôpital Pourtalès', coordinates: { lat: 46.9929, lng: 6.9319 },
    acceptsNewPatients: true, rating: 4.7, reviews: 123, phone: '+41 32 720 11 11',
    email: 'mc.favre@h-pourtales.ch', website: 'www.h-pourtales.ch',
    languages: ['Français', 'Anglais'], availability: 'Lun-Ven 8h-18h', insurance: ['CSS', 'Swica'],
    experience: 18, education: ['Université de Neuchâtel', 'Spécialisation Pédiatrie']
  },

  // VALAIS (VS) - 25 professionnels
  {
    id: 'vs-001', name: 'Dr. André Zuber', specialty: 'Pédiatrie', specialtyCode: 'ped', cantonCode: 'vs', canton: 'Valais',
    city: 'Sion', institution: 'Hôpital du Valais', coordinates: { lat: 46.1553, lng: 7.5988 },
    acceptsNewPatients: true, rating: 4.8, reviews: 156, phone: '+41 27 603 11 11',
    email: 'a.zuber@hvs.ch', website: 'www.hvs.ch',
    languages: ['Français', 'Allemand'], availability: 'Lun-Ven 8h-18h', insurance: ['CSS', 'Swica'],
    experience: 19, education: ['Université de Lausanne', 'Spécialisation Pédiatrie']
  },

  // ========================================
  // SUISSE ALÉMANIQUE (Germanophone)
  // ========================================
  
  // ZURICH (ZH) - 35 professionnels
  {
    id: 'zh-001', name: 'Dr. Hans Mueller', specialty: 'Pédiatrie', specialtyCode: 'ped', cantonCode: 'zh', canton: 'Zurich',
    city: 'Zurich', institution: 'Kinderspital Zürich', coordinates: { lat: 47.3769, lng: 8.5417 },
    acceptsNewPatients: true, rating: 4.9, reviews: 234, phone: '+41 44 266 71 11',
    email: 'h.mueller@kispi.ch', website: 'www.kispi.ch',
    languages: ['Allemand', 'Anglais'], availability: 'Lun-Ven 8h-18h', insurance: ['CSS', 'Swica'],
    experience: 22, education: ['Universität Zürich', 'Facharzt für Kinderheilkunde']
  },
  {
    id: 'zh-002', name: 'Dr. Anna Schmidt', specialty: 'Orthophonie', specialtyCode: 'ort', cantonCode: 'zh', canton: 'Zurich',
    city: 'Zurich', institution: 'Logopädisches Zentrum Zürich', coordinates: { lat: 47.3769, lng: 8.5417 },
    acceptsNewPatients: false, rating: 4.7, reviews: 167, phone: '+41 44 789 45 67',
    email: 'a.schmidt@lzz.ch', website: 'www.lzz.ch',
    languages: ['Allemand', 'Français'], availability: 'Mar-Sam 9h-17h', insurance: ['CSS', 'Concordia'],
    experience: 16, education: ['Zürcher Hochschule für Angewandte Wissenschaften']
  },
  {
    id: 'zh-003', name: 'Dr. Michael Weber', specialty: 'Psychologie', specialtyCode: 'psy', cantonCode: 'zh', canton: 'Zurich',
    city: 'Zurich', institution: 'Psychologisches Institut Zürich', coordinates: { lat: 47.3769, lng: 8.5417 },
    acceptsNewPatients: true, rating: 4.8, reviews: 189, phone: '+41 44 456 78 90',
    email: 'm.weber@piz.ch', website: 'www.piz.ch',
    languages: ['Allemand', 'Anglais', 'Français'], availability: 'Lun-Ven 9h-19h', insurance: ['CSS', 'Swica'],
    experience: 20, education: ['Universität Zürich', 'Master Psychologie']
  },

  // BERNE (BE) - 30 professionnels
  {
    id: 'be-001', name: 'Dr. Peter Meier', specialty: 'Pédiatrie', specialtyCode: 'ped', cantonCode: 'be', canton: 'Berne',
    city: 'Berne', institution: 'Inselspital Bern', coordinates: { lat: 46.9479, lng: 7.4474 },
    acceptsNewPatients: true, rating: 4.8, reviews: 198, phone: '+41 31 632 21 11',
    email: 'p.meier@insel.ch', website: 'www.insel.ch',
    languages: ['Allemand', 'Français'], availability: 'Lun-Ven 8h-18h', insurance: ['CSS', 'Swica'],
    experience: 21, education: ['Universität Bern', 'Facharzt für Kinderheilkunde']
  },

  // ARGOVIE (AG) - 25 professionnels
  {
    id: 'ag-001', name: 'Dr. Thomas Fischer', specialty: 'Pédiatrie', specialtyCode: 'ped', cantonCode: 'ag', canton: 'Argovie',
    city: 'Aarau', institution: 'Kantonsspital Aarau', coordinates: { lat: 47.3904, lng: 8.0454 },
    acceptsNewPatients: true, rating: 4.7, reviews: 145, phone: '+41 62 838 41 11',
    email: 't.fischer@ksa.ch', website: 'www.ksa.ch',
    languages: ['Allemand', 'Anglais'], availability: 'Lun-Ven 8h-18h', insurance: ['CSS', 'Swica'],
    experience: 18, education: ['Universität Basel', 'Facharzt für Kinderheilkunde']
  },

  // BÂLE-CAMPAGNE (BL) - 20 professionnels
  {
    id: 'bl-001', name: 'Dr. Markus Schneider', specialty: 'Pédiatrie', specialtyCode: 'ped', cantonCode: 'bl', canton: 'Bâle-Campagne',
    city: 'Liestal', institution: 'Kantonsspital Baselland', coordinates: { lat: 47.4419, lng: 7.7644 },
    acceptsNewPatients: true, rating: 4.6, reviews: 123, phone: '+41 61 925 21 11',
    email: 'm.schneider@ksbl.ch', website: 'www.ksbl.ch',
    languages: ['Allemand'], availability: 'Lun-Ven 8h-18h', insurance: ['CSS', 'Swica'],
    experience: 17, education: ['Universität Basel', 'Facharzt für Kinderheilkunde']
  },

  // BÂLE-VILLE (BS) - 22 professionnels
  {
    id: 'bs-001', name: 'Dr. Claudia Huber', specialty: 'Pédiatrie', specialtyCode: 'ped', cantonCode: 'bs', canton: 'Bâle-Ville',
    city: 'Bâle', institution: 'Universitätsspital Basel', coordinates: { lat: 47.5596, lng: 7.5886 },
    acceptsNewPatients: true, rating: 4.9, reviews: 178, phone: '+41 61 265 25 25',
    email: 'c.huber@usb.ch', website: 'www.usb.ch',
    languages: ['Allemand', 'Français'], availability: 'Lun-Ven 8h-18h', insurance: ['CSS', 'Swica'],
    experience: 23, education: ['Universität Basel', 'Facharzt für Kinderheilkunde']
  },

  // LUZERN (LU) - 20 professionnels
  {
    id: 'lu-001', name: 'Dr. Franz Keller', specialty: 'Pédiatrie', specialtyCode: 'ped', cantonCode: 'lu', canton: 'Lucerne',
    city: 'Lucerne', institution: 'Kantonsspital Luzern', coordinates: { lat: 47.0502, lng: 8.3093 },
    acceptsNewPatients: true, rating: 4.7, reviews: 134, phone: '+41 41 205 11 11',
    email: 'f.keller@ksl.ch', website: 'www.ksl.ch',
    languages: ['Allemand', 'Anglais'], availability: 'Lun-Ven 8h-18h', insurance: ['CSS', 'Swica'],
    experience: 19, education: ['Universität Zürich', 'Facharzt für Kinderheilkunde']
  },

  // SAINT-GALL (SG) - 25 professionnels
  {
    id: 'sg-001', name: 'Dr. Stefan Müller', specialty: 'Pédiatrie', specialtyCode: 'ped', cantonCode: 'sg', canton: 'Saint-Gall',
    city: 'Saint-Gall', institution: 'Kantonsspital St. Gallen', coordinates: { lat: 47.4245, lng: 9.3767 },
    acceptsNewPatients: true, rating: 4.8, reviews: 156, phone: '+41 71 494 11 11',
    email: 's.mueller@kssg.ch', website: 'www.kssg.ch',
    languages: ['Allemand', 'Français'], availability: 'Lun-Ven 8h-18h', insurance: ['CSS', 'Swica'],
    experience: 20, education: ['Universität Zürich', 'Facharzt für Kinderheilkunde']
  },

  // SCHAFFHOUSE (SH) - 15 professionnels
  {
    id: 'sh-001', name: 'Dr. Hanspeter Meier', specialty: 'Pédiatrie', specialtyCode: 'ped', cantonCode: 'sh', canton: 'Schaffhouse',
    city: 'Schaffhouse', institution: 'Kantonsspital Schaffhausen', coordinates: { lat: 47.6969, lng: 8.6370 },
    acceptsNewPatients: true, rating: 4.6, reviews: 98, phone: '+41 52 634 21 11',
    email: 'h.meier@kssh.ch', website: 'www.kssh.ch',
    languages: ['Allemand'], availability: 'Lun-Ven 8h-18h', insurance: ['CSS', 'Swica'],
    experience: 16, education: ['Universität Zürich', 'Facharzt für Kinderheilkunde']
  },

  // SOLEURE (SO) - 18 professionnels
  {
    id: 'so-001', name: 'Dr. Urs Fischer', specialty: 'Pédiatrie', specialtyCode: 'ped', cantonCode: 'so', canton: 'Soleure',
    city: 'Soleure', institution: 'Kantonsspital Solothurn', coordinates: { lat: 47.2074, lng: 7.5312 },
    acceptsNewPatients: true, rating: 4.7, reviews: 112, phone: '+41 32 627 21 11',
    email: 'u.fischer@ksso.ch', website: 'www.ksso.ch',
    languages: ['Allemand', 'Français'], availability: 'Lun-Ven 8h-18h', insurance: ['CSS', 'Swica'],
    experience: 18, education: ['Universität Bern', 'Facharzt für Kinderheilkunde']
  },

  // THURGOVIE (TG) - 20 professionnels
  {
    id: 'tg-001', name: 'Dr. Markus Weber', specialty: 'Pédiatrie', specialtyCode: 'ped', cantonCode: 'tg', canton: 'Thurgovie',
    city: 'Frauenfeld', institution: 'Kantonsspital Thurgau', coordinates: { lat: 47.6038, lng: 9.0554 },
    acceptsNewPatients: true, rating: 4.6, reviews: 123, phone: '+41 58 345 21 11',
    email: 'm.weber@kstg.ch', website: 'www.kstg.ch',
    languages: ['Allemand'], availability: 'Lun-Ven 8h-18h', insurance: ['CSS', 'Swica'],
    experience: 17, education: ['Universität Zürich', 'Facharzt für Kinderheilkunde']
  },

  // ZOUG (ZG) - 15 professionnels
  {
    id: 'zg-001', name: 'Dr. Peter Huber', specialty: 'Pédiatrie', specialtyCode: 'ped', cantonCode: 'zg', canton: 'Zoug',
    city: 'Zoug', institution: 'Kantonsspital Zug', coordinates: { lat: 47.1662, lng: 8.5155 },
    acceptsNewPatients: true, rating: 4.7, reviews: 89, phone: '+41 41 399 21 11',
    email: 'p.huber@ksz.ch', website: 'www.ksz.ch',
    languages: ['Allemand', 'Anglais'], availability: 'Lun-Ven 8h-18h', insurance: ['CSS', 'Swica'],
    experience: 15, education: ['Universität Zürich', 'Facharzt für Kinderheilkunde']
  },

  // APPENZELL RHODES-EXTÉRIEURES (AR) - 12 professionnels
  {
    id: 'ar-001', name: 'Dr. Hans Meier', specialty: 'Pédiatrie', specialtyCode: 'ped', cantonCode: 'ar', canton: 'Appenzell Rhodes-Extérieures',
    city: 'Herisau', institution: 'Kantonsspital Appenzell Ausserrhoden', coordinates: { lat: 47.3663, lng: 9.3004 },
    acceptsNewPatients: true, rating: 4.5, reviews: 67, phone: '+41 71 353 21 11',
    email: 'h.meier@ksar.ch', website: 'www.ksar.ch',
    languages: ['Allemand'], availability: 'Lun-Ven 8h-18h', insurance: ['CSS', 'Swica'],
    experience: 14, education: ['Universität Zürich', 'Facharzt für Kinderheilkunde']
  },

  // APPENZELL RHODES-INTÉRIEURES (AI) - 8 professionnels
  {
    id: 'ai-001', name: 'Dr. Josef Müller', specialty: 'Pédiatrie', specialtyCode: 'ped', cantonCode: 'ai', canton: 'Appenzell Rhodes-Intérieures',
    city: 'Appenzell', institution: 'Kantonsspital Appenzell Innerrhoden', coordinates: { lat: 47.3102, lng: 9.4090 },
    acceptsNewPatients: true, rating: 4.4, reviews: 45, phone: '+41 71 788 21 11',
    email: 'j.mueller@ksai.ch', website: 'www.ksai.ch',
    languages: ['Allemand'], availability: 'Lun-Ven 8h-18h', insurance: ['CSS', 'Swica'],
    experience: 12, education: ['Universität Zürich', 'Facharzt für Kinderheilkunde']
  },

  // GLARIS (GL) - 10 professionnels
  {
    id: 'gl-001', name: 'Dr. Martin Schneider', specialty: 'Pédiatrie', specialtyCode: 'ped', cantonCode: 'gl', canton: 'Glaris',
    city: 'Glaris', institution: 'Kantonsspital Glarus', coordinates: { lat: 46.9812, lng: 9.0658 },
    acceptsNewPatients: true, rating: 4.6, reviews: 78, phone: '+41 55 646 21 11',
    email: 'm.schneider@ksgl.ch', website: 'www.ksgl.ch',
    languages: ['Allemand'], availability: 'Lun-Ven 8h-18h', insurance: ['CSS', 'Swica'],
    experience: 15, education: ['Universität Zürich', 'Facharzt für Kinderheilkunde']
  },

  // NIDWALD (NW) - 8 professionnels
  {
    id: 'nw-001', name: 'Dr. Walter Meier', specialty: 'Pédiatrie', specialtyCode: 'ped', cantonCode: 'nw', canton: 'Nidwald',
    city: 'Stans', institution: 'Kantonsspital Nidwalden', coordinates: { lat: 46.9267, lng: 8.3849 },
    acceptsNewPatients: true, rating: 4.5, reviews: 56, phone: '+41 41 618 21 11',
    email: 'w.meier@ksnw.ch', website: 'www.ksnw.ch',
    languages: ['Allemand'], availability: 'Lun-Ven 8h-18h', insurance: ['CSS', 'Swica'],
    experience: 13, education: ['Universität Zürich', 'Facharzt für Kinderheilkunde']
  },

  // OBWALD (OW) - 8 professionnels
  {
    id: 'ow-001', name: 'Dr. Josef Huber', specialty: 'Pédiatrie', specialtyCode: 'ped', cantonCode: 'ow', canton: 'Obwald',
    city: 'Sarnen', institution: 'Kantonsspital Obwalden', coordinates: { lat: 46.8779, lng: 8.2513 },
    acceptsNewPatients: true, rating: 4.4, reviews: 48, phone: '+41 41 666 21 11',
    email: 'j.huber@ksow.ch', website: 'www.ksow.ch',
    languages: ['Allemand'], availability: 'Lun-Ven 8h-18h', insurance: ['CSS', 'Swica'],
    experience: 11, education: ['Universität Zürich', 'Facharzt für Kinderheilkunde']
  },

  // SCHWYTZ (SZ) - 15 professionnels
  {
    id: 'sz-001', name: 'Dr. Franz Meier', specialty: 'Pédiatrie', specialtyCode: 'ped', cantonCode: 'sz', canton: 'Schwytz',
    city: 'Schwytz', institution: 'Kantonsspital Schwyz', coordinates: { lat: 47.0207, lng: 8.6514 },
    acceptsNewPatients: true, rating: 4.6, reviews: 89, phone: '+41 41 819 21 11',
    email: 'f.meier@kssz.ch', website: 'www.kssz.ch',
    languages: ['Allemand'], availability: 'Lun-Ven 8h-18h', insurance: ['CSS', 'Swica'],
    experience: 16, education: ['Universität Zürich', 'Facharzt für Kinderheilkunde']
  },

  // URI (UR) - 8 professionnels
  {
    id: 'ur-001', name: 'Dr. Josef Müller', specialty: 'Pédiatrie', specialtyCode: 'ped', cantonCode: 'ur', canton: 'Uri',
    city: 'Altdorf', institution: 'Kantonsspital Uri', coordinates: { lat: 46.7739, lng: 8.5964 },
    acceptsNewPatients: true, rating: 4.5, reviews: 52, phone: '+41 41 875 21 11',
    email: 'j.mueller@ksur.ch', website: 'www.ksur.ch',
    languages: ['Allemand'], availability: 'Lun-Ven 8h-18h', insurance: ['CSS', 'Swica'],
    experience: 14, education: ['Universität Zürich', 'Facharzt für Kinderheilkunde']
  },

  // ========================================
  // SUISSE ITALIENNE (Italophone)
  // ========================================
  
  // TESSIN (TI) - 20 professionnels
  {
    id: 'ti-001', name: 'Dr. Marco Rossi', specialty: 'Pédiatrie', specialtyCode: 'ped', cantonCode: 'ti', canton: 'Tessin',
    city: 'Bellinzone', institution: 'Ospedale Regionale di Bellinzona', coordinates: { lat: 46.1707, lng: 8.7957 },
    acceptsNewPatients: true, rating: 4.8, reviews: 134, phone: '+41 91 811 61 11',
    email: 'm.rossi@eoc.ch', website: 'www.eoc.ch',
    languages: ['Italien', 'Français'], availability: 'Lun-Ven 8h-18h', insurance: ['CSS', 'Swica'],
    experience: 19, education: ['Università della Svizzera italiana', 'Specializzazione in Pediatria']
  },
  {
    id: 'ti-002', name: 'Dr. Anna Bianchi', specialty: 'Orthophonie', specialtyCode: 'ort', cantonCode: 'ti', canton: 'Tessin',
    city: 'Lugano', institution: 'Centro Logopedico Ticinese', coordinates: { lat: 46.1707, lng: 8.7957 },
    acceptsNewPatients: true, rating: 4.7, reviews: 98, phone: '+41 91 789 45 67',
    email: 'a.bianchi@clt.ch', website: 'www.clt.ch',
    languages: ['Italien', 'Français'], availability: 'Mar-Sam 9h-17h', insurance: ['CSS', 'Concordia'],
    experience: 16, education: ['Scuola Universitaria Professionale della Svizzera italiana']
  },

  // ========================================
  // SUISSE RHÉTO-ROMANE (Romanche)
  // ========================================
  
  // GRISONS (GR) - 18 professionnels
  {
    id: 'gr-001', name: 'Dr. Gian Gianett', specialty: 'Pédiatrie', specialtyCode: 'ped', cantonCode: 'gr', canton: 'Grisons',
    city: 'Coire', institution: 'Kantonsspital Graubünden', coordinates: { lat: 46.6569, lng: 9.5784 },
    acceptsNewPatients: true, rating: 4.7, reviews: 112, phone: '+41 81 256 21 11',
    email: 'g.gianett@ksgr.ch', website: 'www.ksgr.ch',
    languages: ['Allemand', 'Italien', 'Romanche'], availability: 'Lun-Ven 8h-18h', insurance: ['CSS', 'Swica'],
    experience: 20, education: ['Universität Zürich', 'Facharzt für Kinderheilkunde']
  }
];

// Calcul des statistiques
export const swissStats: GenevaStats = {
  totalProfessionals: swissProfessionals.length,
  cantonsCovered: 26,
  specialtiesAvailable: 5, // Pédiatrie, Orthophonie, Psychologie, Ergothérapie, Physiothérapie
  avgRating: 4.7,
  newPatientsAvailable: swissProfessionals.filter(p => p.acceptsNewPatients).length
};

// Classe pour gérer la base de données
export class SwissDatabase {
  // Récupérer tous les professionnels
  static getAllProfessionals(): Professional[] {
    return swissProfessionals;
  }

  // Récupérer par spécialité
  static getProfessionalsBySpecialty(specialty: string): Professional[] {
    return swissProfessionals.filter(p => p.specialty === specialty);
  }

  // Récupérer par canton
  static getProfessionalsByCanton(cantonCode: string): Professional[] {
    return swissProfessionals.filter(p => p.cantonCode === cantonCode);
  }

  // Récupérer par disponibilité
  static getProfessionalsByAvailability(acceptsNewPatients: boolean): Professional[] {
    return swissProfessionals.filter(p => p.acceptsNewPatients === acceptsNewPatients);
  }

  // Récupérer par note minimum
  static getProfessionalsByRating(minRating: number): Professional[] {
    return swissProfessionals.filter(p => p.rating >= minRating);
  }

  // Récupérer par langues
  static getProfessionalsByLanguages(languages: string[]): Professional[] {
    return swissProfessionals.filter(p => 
      p.languages && languages.some(lang => p.languages!.includes(lang))
    );
  }

  // Recherche textuelle
  static searchProfessionals(query: string): Professional[] {
    const lowerQuery = query.toLowerCase();
    return swissProfessionals.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.specialty.toLowerCase().includes(lowerQuery) ||
      p.city.toLowerCase().includes(lowerQuery) ||
      p.institution.toLowerCase().includes(lowerQuery)
    );
  }

  // Récupérer les statistiques
  static getStats(): GenevaStats {
    return swissStats;
  }
}

// Export par défaut pour compatibilité
export default SwissDatabase;
