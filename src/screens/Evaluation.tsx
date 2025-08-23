import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Chip,
  LinearProgress,
  Alert,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Science as ScienceIcon,
  Assessment as AssessmentIcon,
  Verified as VerifiedIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { ComprehensiveEvaluationQuestions } from '../data/comprehensiveEvaluationQuestions';
import { ProfessionalEvaluationSystem, DEVELOPMENT_DOMAINS } from '../data/professionalEvaluationSystem';

const Evaluation: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [childAge, setChildAge] = useState('2-3');
  const [childAgeInMonths, setChildAgeInMonths] = useState(30); // 2-3 ans = 30 mois
  const [showResults, setShowResults] = useState(false);
  const [resultats, setResultats] = useState<any[]>([]);

  const ageGroups = [
    { value: '0-1', label: '0-12 mois', months: 12 },
    { value: '1-2', label: '1-2 ans', months: 24 },
    { value: '2-3', label: '2-3 ans', months: 30 },
    { value: '3-4', label: '3-4 ans', months: 42 },
    { value: '4-5', label: '4-5 ans', months: 54 },
  ];

  // Combiner toutes les questions disponibles
  const getAllQuestions = () => {
    const standardQuestions = ComprehensiveEvaluationQuestions.getQuestionsByAge(childAge);
    const professionalQuestions = ProfessionalEvaluationSystem.getQuestionsByAge(childAgeInMonths);
    
    // Combiner et dédupliquer si nécessaire
    const allQuestions = [...standardQuestions, ...professionalQuestions];
    return allQuestions;
  };

  const currentQuestions = getAllQuestions();
  const progress = currentQuestions.length > 0 ? (activeStep / currentQuestions.length) * 100 : 0;

  const handleAgeChange = (ageValue: string) => {
    setChildAge(ageValue);
    const ageGroup = ageGroups.find(ag => ag.value === ageValue);
    if (ageGroup) {
      setChildAgeInMonths(ageGroup.months);
    }
    setActiveStep(0);
    setAnswers({});
    setShowResults(false);
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (activeStep < currentQuestions.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleFinish = () => {
    // Générer un rapport complet avec toutes les questions
    const report = ProfessionalEvaluationSystem.generateEvaluationReport(answers, childAgeInMonths);
    setResultats([{
      overallScore: report.overallScore,
      domainScores: report.domainScores,
      criticalFindings: report.criticalFindings,
      recommendations: report.recommendations,
      nextSteps: report.nextSteps,
      clinicalNotes: report.clinicalNotes
    }]);
    
    setShowResults(true);
  };

  const currentQuestion = currentQuestions[activeStep];

  // Si on affiche les résultats
  if (showResults) {
    const report = resultats[0];
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          🏆 Rapport d'Évaluation Complète
        </Typography>

        {/* Score global */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Score Global
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              {report.overallScore >= 75 ? (
                <CheckCircleIcon color="success" />
              ) : report.overallScore >= 60 ? (
                <WarningIcon color="warning" />
              ) : (
                <ErrorIcon color="error" />
              )}
              <Typography variant="h4" sx={{ ml: 1 }}>
                {report.overallScore.toFixed(1)}%
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {report.clinicalNotes}
            </Typography>
          </CardContent>
        </Card>

        {/* Scores par domaine */}
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Scores par Domaine de Développement
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {Object.entries(report.domainScores).map(([domainId, domainScore]) => {
            const domain = DEVELOPMENT_DOMAINS.find(d => d.id === domainId);
            const score = domainScore as { score: number; level: string };
            return (
              <Grid item xs={12} sm={6} md={4} key={domainId}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {domain?.name || domainId}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">
                          {score.score.toFixed(1)}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {score.level === 'excellent' ? 'Excellent' : 
                           score.level === 'normal' ? 'Normal' : 
                           score.level === 'concerning' ? 'Préoccupant' : 'À surveiller'}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={score.score}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: score.level === 'excellent' ? '#4caf50' : 
                                            score.level === 'normal' ? '#2196f3' : 
                                            score.level === 'concerning' ? '#f44336' : '#ff9800',
                          },
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Recommandations */}
        {report.recommendations.length > 0 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📋 Recommandations
              </Typography>
              <List>
                {report.recommendations.map((rec: string, index: number) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <VerifiedIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={rec} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}

        {/* Prochaines étapes */}
        {report.nextSteps.length > 0 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🚀 Prochaines Étapes
              </Typography>
              <List>
                {report.nextSteps.map((step: string, index: number) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <AssessmentIcon color="success" />
                    </ListItemIcon>
                    <ListItemText primary={step} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => {
              setShowResults(false);
              setActiveStep(0);
              setAnswers({});
            }}
          >
            Nouvelle évaluation
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/dashboard')}
          >
            Retour au tableau de bord
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Évaluation du développement
      </Typography>

      {/* Bannière d'introduction du système complet */}
      <Paper 
        elevation={2} 
        sx={{ 
          mb: 4, 
          p: 3, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ScienceIcon sx={{ fontSize: 32, mr: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                SYSTÈME D'ÉVALUATION COMPLET
              </Typography>
            </Box>
            
            <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
              Évaluation complète et scientifiquement validée du développement infantile
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Chip 
                icon={<AssessmentIcon />} 
                label={`${currentQuestions.length} questions`}
                sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} 
              />
              <Chip 
                icon={<VerifiedIcon />} 
                label="8 domaines" 
                sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} 
              />
              <Chip 
                icon={<SchoolIcon />} 
                label="Standards internationaux" 
                sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} 
              />
            </Box>
            
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Basé sur ASQ-3, DDST-II, Bayley, Mullen, Vineland • Théories Piaget, Vygotsky, Bowlby
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/ressources')}
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                border: '2px solid rgba(255,255,255,0.3)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  border: '2px solid rgba(255,255,255,0.5)',
                }
              }}
            >
              En savoir plus
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Sélection de l'âge */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Âge de l'enfant
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {ageGroups.map((age) => (
              <Chip
                key={age.value}
                label={age.label}
                onClick={() => handleAgeChange(age.value)}
                color={childAge === age.value ? 'primary' : 'default'}
                variant={childAge === age.value ? 'filled' : 'outlined'}
              />
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Progression */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">
            Question {activeStep + 1} sur {currentQuestions.length}
          </Typography>
          <Typography variant="body2">
            {Math.round(progress)}%
          </Typography>
        </Box>
        <LinearProgress variant="determinate" value={progress} />
      </Box>

      {/* Question actuelle */}
      {currentQuestion && (
        <Card>
          <CardContent>
            <Box sx={{ mb: 2 }}>
              <Chip
                label={(currentQuestion as any).domain ? 
                  DEVELOPMENT_DOMAINS.find(d => d.id === (currentQuestion as any).domain)?.name :
                  (currentQuestion as any).category ? 
                  ComprehensiveEvaluationQuestions.getCategories().find(c => c.id === (currentQuestion as any).category)?.name :
                  'Développement'
                }
                sx={{ 
                  backgroundColor: (currentQuestion as any).domain ? 
                    DEVELOPMENT_DOMAINS.find(d => d.id === (currentQuestion as any).domain)?.color :
                    (currentQuestion as any).category ? 
                    ComprehensiveEvaluationQuestions.getCategories().find(c => c.id === (currentQuestion as any).category)?.color :
                    '#2196f3',
                  color: 'white',
                  mb: 2,
                }}
              />
              {(currentQuestion as any).criticalAge && (
                <Chip
                  label="Âge critique"
                  color="warning"
                  size="small"
                  sx={{ ml: 1 }}
                />
              )}
            </Box>

            <Typography variant="h6" gutterBottom>
              {currentQuestion.text}
            </Typography>

            {(currentQuestion as any).helpText && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  {(currentQuestion as any).helpText}
                </Typography>
              </Alert>
            )}

            <FormControl component="fieldset" sx={{ mt: 2 }}>
              <RadioGroup
                value={answers[currentQuestion.id] || ''}
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
                        {(option as any).clinicalInterpretation && (
                          <Typography variant="caption" color="text.secondary">
                            {(option as any).clinicalInterpretation}
                          </Typography>
                        )}
                      </Box>
                    }
                    sx={{ mb: 1 }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          variant="outlined"
          onClick={handleBack}
          disabled={activeStep === 0}
        >
          Précédent
        </Button>

        {activeStep === currentQuestions.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleFinish}
            disabled={!answers[currentQuestion?.id]}
          >
            Terminer l'évaluation
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!answers[currentQuestion?.id]}
          >
            Suivant
          </Button>
        )}
      </Box>

      {/* Informations */}
      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          Cette évaluation complète est basée sur des standards internationaux validés (ASQ-3, DDST-II, Bayley, etc.) 
          et permet une analyse complète du développement de votre enfant avec {currentQuestions.length} questions 
          couvrant 8 domaines de développement majeurs.
        </Typography>
      </Alert>
    </Box>
  );
};

export default Evaluation; 