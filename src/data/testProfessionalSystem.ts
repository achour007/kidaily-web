/**
 * Test du système d'évaluation professionnel
 * Ce fichier permet de vérifier que toutes les fonctionnalités sont opérationnelles
 */

import { ProfessionalEvaluationSystem, PROFESSIONAL_EVALUATION_QUESTIONS, DEVELOPMENT_DOMAINS } from './professionalEvaluationSystem';

export function testProfessionalSystem() {
  console.log('🧪 TEST DU SYSTÈME D\'ÉVALUATION PROFESSIONNEL');
  console.log('================================================');
  
  // Test 1: Vérification des questions
  console.log('\n1️⃣ VÉRIFICATION DES QUESTIONS:');
  console.log(`   Total des questions: ${PROFESSIONAL_EVALUATION_QUESTIONS.length}`);
  console.log(`   Domaines couverts: ${DEVELOPMENT_DOMAINS.length}`);
  
  // Test 2: Questions par âge
  console.log('\n2️⃣ QUESTIONS PAR ÂGE:');
  const ages = [6, 12, 24, 36, 48, 60];
  ages.forEach(age => {
    const questions = ProfessionalEvaluationSystem.getQuestionsByAge(age);
    console.log(`   ${age} mois: ${questions.length} questions`);
  });
  
  // Test 3: Questions par domaine
  console.log('\n3️⃣ QUESTIONS PAR DOMAINE:');
  DEVELOPMENT_DOMAINS.forEach(domain => {
    const questions = ProfessionalEvaluationSystem.getQuestionsByDomain(domain.id);
    console.log(`   ${domain.name}: ${questions.length} questions`);
  });
  
  // Test 4: Questions critiques
  console.log('\n4️⃣ QUESTIONS CRITIQUES:');
  const criticalQuestions = PROFESSIONAL_EVALUATION_QUESTIONS.filter(q => q.criticalAge);
  console.log(`   Questions critiques: ${criticalQuestions.length}`);
  
  // Test 5: Simulation d'évaluation
  console.log('\n5️⃣ SIMULATION D\'ÉVALUATION:');
  const testAnswers: Record<string, string> = {};
  
  // Répondre à quelques questions pour un enfant de 24 mois
  const questions24mois = ProfessionalEvaluationSystem.getQuestionsByAge(24);
  questions24mois.slice(0, 5).forEach((question, index) => {
    // Choisir une réponse aléatoire
    const randomOption = question.options[Math.floor(Math.random() * question.options.length)];
    testAnswers[question.id] = randomOption.value;
    console.log(`   Q${index + 1}: ${question.text.substring(0, 50)}... → ${randomOption.label}`);
  });
  
  // Générer le rapport
  try {
    const report = ProfessionalEvaluationSystem.generateEvaluationReport(testAnswers, 24);
    console.log(`\n   ✅ Rapport généré avec succès!`);
    console.log(`   Score global: ${report.overallScore.toFixed(1)}%`);
    console.log(`   Domaines évalués: ${Object.keys(report.domainScores).length}`);
    console.log(`   Recommandations: ${report.recommendations.length}`);
    console.log(`   Prochaines étapes: ${report.nextSteps.length}`);
  } catch (error) {
    console.log(`\n   ❌ Erreur lors de la génération du rapport:`, error);
  }
  
  // Test 6: Vérification des domaines
  console.log('\n6️⃣ VÉRIFICATION DES DOMAINES:');
  DEVELOPMENT_DOMAINS.forEach(domain => {
    const domainInfo = ProfessionalEvaluationSystem.getDomainInfo(domain.id);
    if (domainInfo) {
      console.log(`   ✅ ${domain.name}: ${domain.criticalMilestones.length} étapes critiques`);
    } else {
      console.log(`   ❌ ${domain.name}: Information manquante`);
    }
  });
  
  console.log('\n🎯 TEST TERMINÉ!');
  console.log('================================================');
  
  return {
    totalQuestions: PROFESSIONAL_EVALUATION_QUESTIONS.length,
    totalDomains: DEVELOPMENT_DOMAINS.length,
    questionsByAge: ages.map(age => ({
      age,
      count: ProfessionalEvaluationSystem.getQuestionsByAge(age).length
    })),
    questionsByDomain: DEVELOPMENT_DOMAINS.map(domain => ({
      domain: domain.name,
      count: ProfessionalEvaluationSystem.getQuestionsByDomain(domain.id).length
    })),
    criticalQuestions: criticalQuestions.length
  };
}

// Export pour utilisation dans la console du navigateur
if (typeof window !== 'undefined') {
  (window as any).testProfessionalSystem = testProfessionalSystem;
}
