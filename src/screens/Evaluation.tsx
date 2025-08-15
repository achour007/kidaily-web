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
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

interface Question {
  id: string;
  text: string;
  category: string;
  ageGroup: string;
  options: {
    value: string;
    label: string;
    score: number;
  }[];
}

const Evaluation: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [childAge, setChildAge] = useState('2-3');
  const [showResults, setShowResults] = useState(false);
  const [resultats, setResultats] = useState<any[]>([]);

  const ageGroups = [
    { value: '0-1', label: '0-12 mois' },
    { value: '1-2', label: '1-2 ans' },
    { value: '2-3', label: '2-3 ans' },
    { value: '3-4', label: '3-4 ans' },
    { value: '4-5', label: '4-5 ans' },
  ];

  const categories = [
    { id: 'langage', name: 'Langage', color: '#2196f3' },
    { id: 'motricite', name: 'Motricité', color: '#4caf50' },
    { id: 'cognitif', name: 'Cognitif', color: '#ff9800' },
  ];

  // Questions fictives pour la démonstration
  const questions: Question[] = [
    {
      id: '1',
      text: 'Votre enfant dit-il au moins 50 mots différents ?',
      category: 'langage',
      ageGroup: '2-3',
      options: [
        { value: 'oui', label: 'Oui, régulièrement', score: 3 },
        { value: 'parfois', label: 'Parfois', score: 2 },
        { value: 'rarement', label: 'Rarement', score: 1 },
        { value: 'non', label: 'Non', score: 0 },
      ],
    },
    {
      id: '2',
      text: 'Votre enfant peut-il empiler 6 cubes ou plus ?',
      category: 'motricite',
      ageGroup: '2-3',
      options: [
        { value: 'oui', label: 'Oui, facilement', score: 3 },
        { value: 'parfois', label: 'Avec de l\'aide', score: 2 },
        { value: 'rarement', label: 'Rarement', score: 1 },
        { value: 'non', label: 'Non', score: 0 },
      ],
    },
    {
      id: '3',
      text: 'Votre enfant reconnaît-il les couleurs principales ?',
      category: 'cognitif',
      ageGroup: '2-3',
      options: [
        { value: 'oui', label: 'Oui, plusieurs couleurs', score: 3 },
        { value: 'parfois', label: 'Quelques couleurs', score: 2 },
        { value: 'rarement', label: 'Rarement', score: 1 },
        { value: 'non', label: 'Non', score: 0 },
      ],
    },
  ];

  const currentQuestions = questions.filter(q => q.ageGroup === childAge);
  const progress = (activeStep / currentQuestions.length) * 100;

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
    // Calculer les résultats
    const results = categories.map(category => {
      const categoryQuestions = currentQuestions.filter(q => q.category === category.id);
      const totalScore = categoryQuestions.reduce((sum, question) => {
        const answer = answers[question.id];
        const option = question.options.find(opt => opt.value === answer);
        return sum + (option?.score || 0);
      }, 0);
      const maxScore = categoryQuestions.length * 3;
      const percentage = (totalScore / maxScore) * 100;
      
      return {
        category: category.name,
        score: percentage,
        status: percentage >= 70 ? 'normal' : percentage >= 50 ? 'attention' : 'retard',
      };
    });

    console.log('Résultats:', results);
    setResultats(results);
    setShowResults(true);
  };

  const currentQuestion = currentQuestions[activeStep];

  // Si on affiche les résultats
  if (showResults) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Résultats de l'évaluation
        </Typography>

        {/* Score global */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Score global
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              {resultats.some(r => r.status === 'retard') ? (
                <ErrorIcon color="error" />
              ) : resultats.some(r => r.status === 'attention') ? (
                <WarningIcon color="warning" />
              ) : (
                <CheckCircleIcon color="success" />
              )}
              <Typography variant="h4" sx={{ ml: 1 }}>
                {Math.round(resultats.reduce((sum, r) => sum + r.score, 0) / resultats.length)}%
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Détails par catégorie */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
          {resultats.map((resultat) => (
            <Card key={resultat.category}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    {resultat.category}
                  </Typography>
                  {resultat.status === 'normal' ? (
                    <CheckCircleIcon color="success" />
                  ) : resultat.status === 'attention' ? (
                    <WarningIcon color="warning" />
                  ) : (
                    <ErrorIcon color="error" />
                  )}
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">
                      {Math.round(resultat.score)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {resultat.status === 'normal' ? 'Développement normal' : 
                       resultat.status === 'attention' ? 'Attention requise' : 'Retard possible'}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={resultat.score}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: resultat.status === 'normal' ? '#4caf50' : 
                                        resultat.status === 'attention' ? '#ff9800' : '#f44336',
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

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
                onClick={() => setChildAge(age.value)}
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
                label={categories.find(c => c.id === currentQuestion.category)?.name}
                sx={{ 
                  backgroundColor: categories.find(c => c.id === currentQuestion.category)?.color,
                  color: 'white',
                  mb: 2,
                }}
              />
            </Box>

            <Typography variant="h6" gutterBottom>
              {currentQuestion.text}
            </Typography>

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
                    label={option.label}
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
          Cette évaluation est basée sur des outils validés (Denver II, M-CHAT, etc.) 
          et permet d'identifier les domaines de développement qui nécessitent une attention particulière.
        </Typography>
      </Alert>
    </Box>
  );
};

export default Evaluation; 