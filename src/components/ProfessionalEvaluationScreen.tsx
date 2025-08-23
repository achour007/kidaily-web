/**
 * ÉCRAN D'ÉVALUATION PROFESSIONNELLE DU DÉVELOPPEMENT INFANTILE
 * 
 * 🏆 Interface utilisateur pour le système d'évaluation professionnel
 * 📊 Basé sur les standards internationaux (ASQ-3, DDST-II, Bayley, etc.)
 * 🎯 Évaluation complète et scientifiquement validée
 * 
 * @version 1.0.0 - STANDARDS INTERNATIONAUX
 * @author Application Kidaily - Équipe scientifique
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Chip,
  LinearProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  Science as ScienceIcon,
  School as SchoolIcon,
  DirectionsRun as DirectionsRunIcon,
  PanTool as PanToolIcon,
  Psychology as PsychologyIcon,
  People as PeopleIcon,
  Accessibility as AccessibilityIcon,
  Favorite as FavoriteIcon,
  Help as HelpIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import {
  ProfessionalEvaluationSystem,
  PROFESSIONAL_EVALUATION_QUESTIONS,
  DEVELOPMENT_DOMAINS,
  DevelopmentDomain,
  ProfessionalEvaluationQuestion,
  EVALUATION_SYSTEM_INFO
} from '../data/professionalEvaluationSystem';

interface EvaluationState {
  currentStep: number;
  answers: Record<string, string>;
  childAgeInMonths: number;
  showResults: boolean;
  evaluationReport: any;
}

const ProfessionalEvaluationScreen: React.FC = () => {
  const [state, setState] = useState<EvaluationState>({
    currentStep: 0,
    answers: {},
    childAgeInMonths: 12,
    showResults: false,
    evaluationReport: null
  });

  // Récupérer les questions pour l'âge de l'enfant
  const currentQuestions = ProfessionalEvaluationSystem.getQuestionsByAge(state.childAgeInMonths);
  const totalSteps = currentQuestions.length;
  const progress = totalSteps > 0 ? (state.currentStep / totalSteps) * 100 : 0;

  // Questions organisées par domaine
  const questionsByDomain = DEVELOPMENT_DOMAINS.map(domain => ({
    ...domain,
    questions: currentQuestions.filter(q => q.domain === domain.id)
  })).filter(domain => domain.questions.length > 0);

  // Question actuelle
  const currentQuestion = currentQuestions[state.currentStep];

  // Gestion des réponses
  const handleAnswerChange = (questionId: string, value: string) => {
    setState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: value
      }
    }));
  };

  // Navigation
  const handleNext = () => {
    if (state.currentStep < totalSteps - 1) {
      setState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
    }
  };

  const handleBack = () => {
    if (state.currentStep > 0) {
      setState(prev => ({ ...prev, currentStep: prev.currentStep - 1 }));
    }
  };

  // Finaliser l'évaluation
  const handleFinish = () => {
    const report = ProfessionalEvaluationSystem.generateEvaluationReport(
      state.answers,
      state.childAgeInMonths
    );
    
    setState(prev => ({
      ...prev,
      evaluationReport: report,
      showResults: true
    }));
  };

  // Changer l'âge de l'enfant
  const handleAgeChange = (newAge: number) => {
    setState(prev => ({
      ...prev,
      childAgeInMonths: newAge,
      currentStep: 0,
      answers: {},
      showResults: false,
      evaluationReport: null
    }));
  };

  // Obtenir l'icône pour un domaine
  const getDomainIcon = (domainId: DevelopmentDomain) => {
    const domain = DEVELOPMENT_DOMAINS.find(d => d.id === domainId);
    switch (domainId) {
      case 'COMMUNICATION_LANGUAGE': return <SchoolIcon />;
      case 'GROSS_MOTOR': return <DirectionsRunIcon />;
      case 'FINE_MOTOR': return <PanToolIcon />;
      case 'PROBLEM_SOLVING': return <PsychologyIcon />;
      case 'PERSONAL_SOCIAL': return <PeopleIcon />;
      case 'ADAPTIVE_BEHAVIOR': return <AccessibilityIcon />;
      case 'COGNITIVE_DEVELOPMENT': return <SchoolIcon />;
      case 'EMOTIONAL_REGULATION': return <FavoriteIcon />;
      default: return <InfoIcon />;
    }
  };

  // Obtenir la couleur pour un niveau
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'excellent': return 'success';
      case 'normal': return 'primary';
      case 'delayed': return 'warning';
      case 'concerning': return 'error';
      default: return 'default';
    }
  };

  // Si on affiche les résultats
  if (state.showResults && state.evaluationReport) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          {/* En-tête des résultats */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <AssessmentIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              📊 Rapport d'Évaluation Professionnelle
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Enfant de {state.childAgeInMonths} mois - {state.childAgeInMonths < 12 ? 
                `${state.childAgeInMonths} mois` : 
                `${Math.floor(state.childAgeInMonths / 12)} an${Math.floor(state.childAgeInMonths / 12) > 1 ? 's' : ''} et ${state.childAgeInMonths % 12} mois`
              }
            </Typography>
          </Box>

          {/* Score global */}
          <Card sx={{ mb: 4, backgroundColor: 'grey.50' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                🎯 Score Global : {state.evaluationReport.overallScore.toFixed(1)}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={state.evaluationReport.overallScore} 
                sx={{ height: 20, borderRadius: 10, mb: 2 }}
                color={state.evaluationReport.overallScore >= 85 ? 'success' : 
                       state.evaluationReport.overallScore >= 70 ? 'primary' : 
                       state.evaluationReport.overallScore >= 50 ? 'warning' : 'error'}
              />
              <Typography variant="body1" color="text.secondary">
                {state.evaluationReport.overallScore >= 85 ? 'Développement excellent' :
                 state.evaluationReport.overallScore >= 70 ? 'Développement dans la norme' :
                 state.evaluationReport.overallScore >= 50 ? 'Développement légèrement retardé' :
                 'Développement préoccupant - Évaluation spécialisée recommandée'}
              </Typography>
            </CardContent>
          </Card>

          {/* Scores par domaine */}
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            📈 Analyse par Domaine de Développement
          </Typography>
          
          <Grid container spacing={3}>
            {DEVELOPMENT_DOMAINS.map(domain => {
              const domainScore = state.evaluationReport.domainScores[domain.id];
              if (!domainScore || domainScore.score === 0) return null;

              return (
                <Grid item xs={12} md={6} key={domain.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ 
                          color: domain.color, 
                          mr: 2, 
                          display: 'flex', 
                          alignItems: 'center' 
                        }}>
                          {getDomainIcon(domain.id)}
                        </Box>
                        <Typography variant="h6" component="h3">
                          {domain.name}
                        </Typography>
                        <Chip 
                          label={domainScore.level.toUpperCase()} 
                          color={getLevelColor(domainScore.level) as any}
                          size="small"
                          sx={{ ml: 'auto' }}
                        />
                      </Box>
                      
                      <Typography variant="h4" color="primary" gutterBottom>
                        {domainScore.percentage.toFixed(1)}%
                      </Typography>
                      
                      <LinearProgress 
                        variant="determinate" 
                        value={domainScore.percentage} 
                        sx={{ mb: 2 }}
                        color={getLevelColor(domainScore.level) as any}
                      />
                      
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Score: {domainScore.score.toFixed(1)} / {domainScore.maxScore.toFixed(1)}
                      </Typography>

                      {/* Recommandations */}
                      <Accordion sx={{ mt: 2 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="subtitle2">
                            💡 Recommandations ({domainScore.recommendations.length})
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <List dense>
                            {domainScore.recommendations.map((rec: string, index: number) => (
                              <ListItem key={index}>
                                <ListItemIcon>
                                  <InfoIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText primary={rec} />
                              </ListItem>
                            ))}
                          </List>
                        </AccordionDetails>
                      </Accordion>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* Résumé et prochaines étapes */}
          <Card sx={{ mt: 4, backgroundColor: 'warning.50' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🚨 Résumé et Prochaines Étapes
              </Typography>
              
              {state.evaluationReport.criticalFindings.length > 0 && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    ⚠️ Découvertes Préoccupantes :
                  </Typography>
                  <List dense>
                    {state.evaluationReport.criticalFindings.map((finding: string, index: number) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <ErrorIcon color="error" />
                        </ListItemIcon>
                        <ListItemText primary={finding} />
                      </ListItem>
                    ))}
                  </List>
                </Alert>
              )}

              <Typography variant="subtitle1" gutterBottom>
                📋 Recommandations Globales :
              </Typography>
              <List dense>
                {state.evaluationReport.recommendations.map((rec: string, index: number) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={rec} />
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" gutterBottom>
                🎯 Prochaines Étapes :
              </Typography>
              <List dense>
                {state.evaluationReport.nextSteps.map((step: string, index: number) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText primary={step} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Boutons d'action */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button 
              variant="outlined" 
              onClick={() => setState(prev => ({ ...prev, showResults: false }))}
            >
              ← Retour à l'évaluation
            </Button>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => {
                // Ici on pourrait sauvegarder ou imprimer le rapport
                console.log('Rapport sauvegardé');
              }}
            >
              💾 Sauvegarder le rapport
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  // Interface d'évaluation
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* En-tête scientifique */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <ScienceIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            🔬 Évaluation Professionnelle du Développement Infantile
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Système basé sur les standards internationaux (ASQ-3, DDST-II, Bayley, etc.)
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {EVALUATION_SYSTEM_INFO.totalQuestions} questions scientifiquement validées • 
            {EVALUATION_SYSTEM_INFO.domains} domaines de développement • 
            Couverture {EVALUATION_SYSTEM_INFO.ageRange}
          </Typography>
        </Box>

        {/* Sélection de l'âge */}
        <Card sx={{ mb: 4, backgroundColor: 'primary.50' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              👶 Âge de l'enfant à évaluer
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {[3, 6, 9, 12, 18, 24, 30, 36, 48, 60, 72].map(age => (
                <Chip
                  key={age}
                  label={`${age} mois`}
                  onClick={() => handleAgeChange(age)}
                  color={state.childAgeInMonths === age ? 'primary' : 'default'}
                  variant={state.childAgeInMonths === age ? 'filled' : 'outlined'}
                  clickable
                />
              ))}
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Âge sélectionné : {state.childAgeInMonths} mois • 
              {currentQuestions.length} questions disponibles pour cet âge
            </Typography>
          </CardContent>
        </Card>

        {/* Progression */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">
              Question {state.currentStep + 1} sur {totalSteps}
            </Typography>
            <Typography variant="body2">
              {progress.toFixed(1)}% complété
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
        </Box>

        {/* Question actuelle */}
        {currentQuestion && (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              {/* En-tête de la question */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Chip 
                  icon={getDomainIcon(currentQuestion.domain)}
                  label={DEVELOPMENT_DOMAINS.find(d => d.id === currentQuestion.domain)?.name}
                  color="primary"
                  variant="outlined"
                  sx={{ mr: 2 }}
                />
                <Chip 
                  label={currentQuestion.subdomain}
                  size="small"
                  variant="outlined"
                  sx={{ mr: 2 }}
                />
                {currentQuestion.criticalAge && (
                  <Chip 
                    label="ÂGE CRITIQUE"
                    color="warning"
                    size="small"
                    icon={<WarningIcon />}
                  />
                )}
              </Box>

              {/* Texte de la question */}
              <Typography variant="h6" gutterBottom>
                {currentQuestion.text}
              </Typography>

              {/* Options de réponse */}
              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  value={state.answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                >
                  {currentQuestion.options.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="body1">
                            {option.label}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {option.clinicalInterpretation}
                          </Typography>
                        </Box>
                      }
                    />
                  ))}
                </RadioGroup>
              </FormControl>

              {/* Informations scientifiques */}
              <Accordion sx={{ mt: 3 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle2">
                    🔬 Informations scientifiques
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Source :</strong> {currentQuestion.source}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Niveau de preuve :</strong> {currentQuestion.researchEvidence}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Poids :</strong> {currentQuestion.weight}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      {currentQuestion.helpText && (
                        <Typography variant="body2" color="text.secondary">
                          <strong>Aide :</strong> {currentQuestion.helpText}
                        </Typography>
                      )}
                      {currentQuestion.clinicalNotes && (
                        <Typography variant="body2" color="text.secondary">
                          <strong>Notes cliniques :</strong> {currentQuestion.clinicalNotes}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={state.currentStep === 0}
          >
            ← Précédent
          </Button>
          
          <Box>
            {state.currentStep < totalSteps - 1 ? (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!state.answers[currentQuestion?.id || '']}
              >
                Suivant →
              </Button>
            ) : (
              <Button
                variant="contained"
                color="success"
                onClick={handleFinish}
                disabled={Object.keys(state.answers).length < totalSteps * 0.8} // Au moins 80% des questions
              >
                🎯 Terminer l'évaluation
              </Button>
            )}
          </Box>
        </Box>

        {/* Informations sur le système */}
        <Alert severity="info" sx={{ mt: 4 }}>
          <Typography variant="body2">
            <strong>💡 Information :</strong> Ce système d'évaluation est basé sur les standards internationaux 
            scientifiquement validés. Chaque question a été sélectionnée pour sa pertinence clinique et sa 
            capacité à détecter précocement les retards de développement.
          </Typography>
        </Alert>
      </Paper>
    </Container>
  );
};

export default ProfessionalEvaluationScreen;
