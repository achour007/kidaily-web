/**
 * SERVICE UNIFIÉ - BASE DE DONNÉES PÉDIATRIQUE COMPLÈTE
 * 
 * 🏥 Combine toutes les bases de données pédiatriques
 * 📍 Couverture nationale complète : 26 cantons
 * 👶 565+ spécialistes pédiatriques
 * 🎯 Service centralisé pour l'application
 * 
 * @author Application Kidaily
 * @version 1.0.0
 */

import { swissPediatricProfessionals } from '../data/SwissPediatricDatabase';
import { collectedPediatricProfessionals } from '../data/CollectedPediatricData';
import { extendedSwissPediatricProfessionals } from '../data/ExtendedSwissPediatricDatabase';

// Interface unifiée pour tous les professionnels
export interface UnifiedPediatricProfessional {
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
  ageGroups: string[];
  developmentalAreas: string[];
  
  // Source des données
  dataSource: 'original' | 'collected' | 'extended';
}

// Statistiques unifiées
export interface UnifiedPediatricStats {
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
  
  // Sources des données
  dataSources: {
    original: number;
    collected: number;
    extended: number;
  };
}

// Classe principale du service unifié
export class UnifiedPediatricService {
  
  private static allProfessionals: UnifiedPediatricProfessional[] = [];
  private static isInitialized = false;

  // Initialisation du service
  private static initialize() {
    if (this.isInitialized) return;

    console.log('🚀 Initialisation du service pédiatrique unifié...');

    // Combiner toutes les bases de données
    const original = swissPediatricProfessionals.map(p => ({
      ...p,
      dataSource: 'original' as const
    }));

    const collected = collectedPediatricProfessionals.map(p => ({
      ...p,
      dataSource: 'collected' as const
    }));

    const extended = extendedSwissPediatricProfessionals.map(p => ({
      ...p,
      dataSource: 'extended' as const
    }));

    this.allProfessionals = [...original, ...collected, ...extended];
    
    // Supprimer les doublons basés sur l'ID
    const uniqueMap = new Map();
    this.allProfessionals.forEach(prof => {
      if (!uniqueMap.has(prof.id)) {
        uniqueMap.set(prof.id, prof);
      }
    });
    
    this.allProfessionals = Array.from(uniqueMap.values());
    
    console.log(`✅ Service initialisé avec ${this.allProfessionals.length} professionnels uniques`);
    this.isInitialized = true;
  }

  // Récupérer tous les professionnels
  static getAllProfessionals(): UnifiedPediatricProfessional[] {
    this.initialize();
    return this.allProfessionals;
  }

  // Récupérer par spécialité
  static getProfessionalsBySpecialty(specialty: string): UnifiedPediatricProfessional[] {
    this.initialize();
    return this.allProfessionals.filter(p => 
      p.specialty.toLowerCase().includes(specialty.toLowerCase()) ||
      p.specialtyCode.toLowerCase().includes(specialty.toLowerCase())
    );
  }

  // Récupérer par canton
  static getProfessionalsByCanton(cantonCode: string): UnifiedPediatricProfessional[] {
    this.initialize();
    return this.allProfessionals.filter(p => 
      p.cantonCode.toLowerCase() === cantonCode.toLowerCase()
    );
  }

  // Récupérer par région linguistique
  static getProfessionalsByRegion(region: string): UnifiedPediatricProfessional[] {
    this.initialize();
    return this.allProfessionals.filter(p => 
      p.region.toLowerCase().includes(region.toLowerCase())
    );
  }

  // Récupérer par groupe d'âge
  static getProfessionalsByAgeGroup(ageGroup: string): UnifiedPediatricProfessional[] {
    this.initialize();
    return this.allProfessionals.filter(p => 
      p.ageGroups.some(age => 
        age.toLowerCase().includes(ageGroup.toLowerCase())
      )
    );
  }

  // Récupérer par domaine de développement
  static getProfessionalsByDevelopmentalArea(area: string): UnifiedPediatricProfessional[] {
    this.initialize();
    return this.allProfessionals.filter(p => 
      p.developmentalAreas.some(devArea => 
        devArea.toLowerCase().includes(area.toLowerCase())
      )
    );
  }

  // Récupérer par disponibilité
  static getProfessionalsByAvailability(acceptsNewPatients: boolean): UnifiedPediatricProfessional[] {
    this.initialize();
    return this.allProfessionals.filter(p => p.acceptsNewPatients === acceptsNewPatients);
  }

  // Récupérer par note minimale
  static getProfessionalsByRating(minRating: number): UnifiedPediatricProfessional[] {
    this.initialize();
    return this.allProfessionals.filter(p => p.rating >= minRating);
  }

  // Récupérer par langues
  static getProfessionalsByLanguages(languages: string[]): UnifiedPediatricProfessional[] {
    this.initialize();
    return this.allProfessionals.filter(p =>
      languages.some(lang => 
        p.languages.some(profLang => 
          profLang.toLowerCase().includes(lang.toLowerCase())
        )
      )
    );
  }

  // Recherche avancée
  static searchProfessionals(query: string): UnifiedPediatricProfessional[] {
    this.initialize();
    const searchTerm = query.toLowerCase();
    return this.allProfessionals.filter(p =>
      p.name.toLowerCase().includes(searchTerm) ||
      p.specialty.toLowerCase().includes(searchTerm) ||
      p.city.toLowerCase().includes(searchTerm) ||
      p.institution.toLowerCase().includes(searchTerm) ||
      p.canton.toLowerCase().includes(searchTerm) ||
      p.specialties.some(s => s.toLowerCase().includes(searchTerm))
    );
  }

  // Obtenir toutes les spécialités disponibles
  static getAllSpecialties(): string[] {
    this.initialize();
    return [...new Set(this.allProfessionals.map(p => p.specialty))].sort();
  }

  // Obtenir tous les cantons disponibles
  static getAllCantons(): string[] {
    this.initialize();
    return [...new Set(this.allProfessionals.map(p => p.canton))].sort();
  }

  // Obtenir toutes les villes disponibles
  static getAllCities(): string[] {
    this.initialize();
    return [...new Set(this.allProfessionals.map(p => p.city))].sort();
  }

  // Obtenir toutes les institutions disponibles
  static getAllInstitutions(): string[] {
    this.initialize();
    return [...new Set(this.allProfessionals.map(p => p.institution))].sort();
  }

  // Statistiques par canton
  static getCantonStats(cantonCode: string) {
    this.initialize();
    const cantonProfessionals = this.getProfessionalsByCanton(cantonCode);
    
    if (cantonProfessionals.length === 0) return null;

    return {
      total: cantonProfessionals.length,
      specialties: [...new Set(cantonProfessionals.map(p => p.specialty))],
      avgRating: cantonProfessionals.reduce((sum, p) => sum + p.rating, 0) / cantonProfessionals.length,
      newPatients: cantonProfessionals.filter(p => p.acceptsNewPatients).length,
      emergencyServices: cantonProfessionals.filter(p => p.acceptsEmergencies).length,
      institutions: [...new Set(cantonProfessionals.map(p => p.institution))],
      cities: [...new Set(cantonProfessionals.map(p => p.city))]
    };
  }

  // Statistiques par spécialité
  static getSpecialtyStats(specialty: string) {
    this.initialize();
    const specialtyProfessionals = this.getProfessionalsBySpecialty(specialty);
    
    if (specialtyProfessionals.length === 0) return null;

    return {
      total: specialtyProfessionals.length,
      cantons: [...new Set(specialtyProfessionals.map(p => p.cantonCode))],
      avgRating: specialtyProfessionals.reduce((sum, p) => sum + p.rating, 0) / specialtyProfessionals.length,
      newPatients: specialtyProfessionals.filter(p => p.acceptsNewPatients).length,
      emergencyServices: specialtyProfessionals.filter(p => p.acceptsEmergencies).length,
      institutions: [...new Set(specialtyProfessionals.map(p => p.institution))],
      cities: [...new Set(specialtyProfessionals.map(p => p.city))]
    };
  }

  // Obtenir les statistiques globales
  static getGlobalStats(): UnifiedPediatricStats {
    this.initialize();
    
    const stats: UnifiedPediatricStats = {
      totalProfessionals: this.allProfessionals.length,
      cantonsCovered: new Set(this.allProfessionals.map(p => p.cantonCode)).size,
      specialtiesAvailable: new Set(this.allProfessionals.map(p => p.specialty)).size,
      avgRating: this.allProfessionals.reduce((sum, p) => sum + p.rating, 0) / this.allProfessionals.length,
      newPatientsAvailable: this.allProfessionals.filter(p => p.acceptsNewPatients).length,
      totalInstitutions: new Set(this.allProfessionals.map(p => p.institution)).size,
      totalCities: new Set(this.allProfessionals.map(p => p.city)).size,
      emergencyServices: this.allProfessionals.filter(p => p.acceptsEmergencies).length,
      researchCenters: this.allProfessionals.filter(p => p.researchAreas && p.researchAreas.length > 0).length,
      teachingHospitals: this.allProfessionals.filter(p => p.institution.toLowerCase().includes('universitaire') || p.institution.toLowerCase().includes('universität')).length,
      totalLanguages: new Set(this.allProfessionals.flatMap(p => p.languages)).size,
      totalInsurance: new Set(this.allProfessionals.flatMap(p => p.insurance)).size,
      
      ageGroupsCovered: [...new Set(this.allProfessionals.flatMap(p => p.ageGroups))],
      developmentalAreasCovered: [...new Set(this.allProfessionals.flatMap(p => p.developmentalAreas))],
      pediatricInstitutions: new Set(this.allProfessionals.map(p => p.institution)).size,
      
      dataSources: {
        original: this.allProfessionals.filter(p => p.dataSource === 'original').length,
        collected: this.allProfessionals.filter(p => p.dataSource === 'collected').length,
        extended: this.allProfessionals.filter(p => p.dataSource === 'extended').length
      }
    };

    return stats;
  }

  // Obtenir les professionnels les mieux notés
  static getTopRatedProfessionals(limit: number = 10): UnifiedPediatricProfessional[] {
    this.initialize();
    return this.allProfessionals
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  // Obtenir les professionnels acceptant de nouveaux patients
  static getAvailableProfessionals(): UnifiedPediatricProfessional[] {
    this.initialize();
    return this.allProfessionals.filter(p => p.acceptsNewPatients);
  }

  // Obtenir les professionnels d'urgence
  static getEmergencyProfessionals(): UnifiedPediatricProfessional[] {
    this.initialize();
    return this.allProfessionals.filter(p => p.acceptsEmergencies);
  }

  // Filtrer par critères multiples
  static filterProfessionals(filters: {
    canton?: string;
    specialty?: string;
    acceptsNewPatients?: boolean;
    minRating?: number;
    languages?: string[];
    ageGroups?: string[];
    developmentalAreas?: string[];
  }): UnifiedPediatricProfessional[] {
    this.initialize();
    
    let filtered = this.allProfessionals;

    if (filters.canton) {
      filtered = filtered.filter(p => p.cantonCode.toLowerCase() === filters.canton!.toLowerCase());
    }

    if (filters.specialty) {
      filtered = filtered.filter(p => p.specialty.toLowerCase().includes(filters.specialty!.toLowerCase()));
    }

    if (filters.acceptsNewPatients !== undefined) {
      filtered = filtered.filter(p => p.acceptsNewPatients === filters.acceptsNewPatients);
    }

    if (filters.minRating) {
      filtered = filtered.filter(p => p.rating >= filters.minRating!);
    }

    if (filters.languages && filters.languages.length > 0) {
      filtered = filtered.filter(p =>
        filters.languages!.some(lang =>
          p.languages.some(profLang => profLang.toLowerCase().includes(lang.toLowerCase()))
        )
      );
    }

    if (filters.ageGroups && filters.ageGroups.length > 0) {
      filtered = filtered.filter(p =>
        filters.ageGroups!.some(ageGroup =>
          p.ageGroups.some(age => age.toLowerCase().includes(ageGroup.toLowerCase()))
        )
      );
    }

    if (filters.developmentalAreas && filters.developmentalAreas.length > 0) {
      filtered = filtered.filter(p =>
        filters.developmentalAreas!.some(area =>
          p.developmentalAreas.some(devArea => devArea.toLowerCase().includes(area.toLowerCase()))
        )
      );
    }

    return filtered;
  }
}
