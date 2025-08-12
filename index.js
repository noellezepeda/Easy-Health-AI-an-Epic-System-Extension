
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Sample patient data
const patientData = {
  name: "Sarah Johnson",
  memberId: "KP123456789",
  dateOfBirth: "March 15, 1985",
  insurance: "Kaiser Permanente HMO",
  primaryCare: "Dr. Michael Chen",
  medicalHistory: [
    "Type 2 Diabetes (diagnosed 2018)",
    "Hypertension (diagnosed 2020)",
    "Seasonal allergies",
    "Previous knee surgery (2019)",
    "Family history of heart disease"
  ],
  recentProcedures: [
    "Annual physical exam - January 2024",
    "Blood work panel - December 2023",
    "Eye exam - November 2023",
    "Mammogram - October 2023",
    "Colonoscopy - September 2023"
  ],
  upcomingAppointment: {
    date: "February 28, 2024",
    time: "2:30 PM",
    location: "Kaiser Permanente Medical Center - South Bay",
    provider: "Dr. Michael Chen"
  }
};

// Store the latest survey summary for provider view
let latestSummary = null;
let enhancedPatientData = null;

// Routes
app.get('/', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  // Fake login - any input logs you in
  res.redirect('/portal');
});

app.get('/portal', (req, res) => {
  res.render('portal', { patient: patientData });
});

app.get('/provider', (req, res) => {
  res.render('provider', { patient: patientData, summary: latestSummary, enhancedData: enhancedPatientData });
});

app.get('/provider-feedback', (req, res) => {
  res.render('provider-feedback', { feedback: latestPostSurveyFeedback });
});

app.get('/survey', (req, res) => {
  res.render('survey');
});

app.get('/billing', (req, res) => {
  res.render('billing');
});

app.get('/post-survey', (req, res) => {
  res.render('post-survey');
});

// Store the latest post-survey feedback for provider insights
let latestPostSurveyFeedback = null;

app.post('/submit-post-survey', (req, res) => {
    // Store post-survey data (in a real app, this would go to a database)
    const feedbackData = req.body;
    console.log('Post-survey feedback received:', feedbackData);
    
    // Process feedback for provider insights (focused on improvement, not judgment)
    latestPostSurveyFeedback = {
        overallExperience: feedbackData.overallRating || 'not provided',
        communicationRating: feedbackData.communicationRating || 'not provided',
        connectionEffectiveness: feedbackData.connectionRating || 'not provided',
        waitTimeRating: feedbackData.waitTimeRating || 'not provided',
        timeSpentRating: feedbackData.timeSpentRating || 'not provided',
        positiveHighlights: feedbackData.positiveComments || 'none provided',
        improvementSuggestions: feedbackData.improvementSuggestions || 'none provided',
        easyHealthFeedback: feedbackData.easyHealthFeedback || 'none provided',
        timestamp: new Date().toISOString(),
        // Create constructive summary focused on improvement opportunities
        providerInsights: generateProviderInsights(feedbackData)
    };
    
    // Redirect to thank you page
    res.render('thank_you');
});

function generateProviderInsights(feedback) {
    const insights = [];
    
    // Focus on constructive feedback rather than ratings
    if (feedback.positiveComments && feedback.positiveComments.trim()) {
        insights.push(`✅ Patient appreciated: ${feedback.positiveComments.trim()}`);
    }
    
    if (feedback.improvementSuggestions && feedback.improvementSuggestions.trim()) {
        insights.push(`💡 Improvement opportunity: ${feedback.improvementSuggestions.trim()}`);
    }
    
    if (feedback.easyHealthFeedback && feedback.easyHealthFeedback.trim()) {
        insights.push(`🤖 EasyHealth AI feedback: ${feedback.easyHealthFeedback.trim()}`);
    }
    
    // Add general insights based on ratings without being judgmental
    const connectionRating = parseInt(feedback.connectionRating) || 5;
    const communicationRating = parseInt(feedback.communicationRating) || 5;
    
    if (connectionRating >= 8) {
        insights.push('🎯 Strong patient connection achieved');
    } else if (connectionRating <= 4) {
        insights.push('📋 Consider more personal connection opportunities');
    }
    
    if (communicationRating >= 8) {
        insights.push('💬 Excellent communication effectiveness');
    } else if (communicationRating <= 4) {
        insights.push('📢 Patient may benefit from additional explanation time');
    }
    
    return insights.join('\n');
}

// Add endpoint for provider to view feedback insights
app.get('/provider-feedback', (req, res) => {
    res.json({
        feedback: latestPostSurveyFeedback,
        message: 'Patient feedback focused on care improvement opportunities'
    });
});

app.post('/submit-survey', async (req, res) => {
  const surveyData = req.body;

  // Store enhanced patient data
  enhancedPatientData = {
    mood: surveyData.mood || 'not specified',
    visitGoals: surveyData.visitGoals || 'not specified',
    lifeUpdates: surveyData.lifeUpdates || 'none',
    previousVisitFeedback: surveyData.previousVisitFeedback || 'not provided',
    pronouns: surveyData.pronouns || 'not specified',
    stressLevel: surveyData.stress || '0',
    painLevel: surveyData.painLevel || '0'
  };

  try {
    // Enhanced AI prompt for better provider insights
    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyBkMI8qR5x9AW_dj7Rhysg8arKw1bi9tnM`, {
      contents: [{
        parts: [{
          text: `You are an AI assistant integrated into Epic electronic health records at Kaiser Permanente. Create a comprehensive provider summary for an upcoming patient visit. Focus on emotional intelligence, patient goals, and personalized care insights.

PATIENT INTAKE DATA:
- Primary reason for visit: ${surveyData.primaryReason}
- Current symptoms: ${surveyData.symptoms}
- Pain level: ${surveyData.painLevel}/10
- Current mood: ${surveyData.mood}
- Stress level: ${surveyData.stress}/10
- Patient's goals for visit: ${surveyData.visitGoals}
- Life updates: ${surveyData.lifeUpdates}
- Previous visit feedback: ${surveyData.previousVisitFeedback}
- Preferred pronouns: ${surveyData.pronouns || 'not specified'}
- Recent medications/treatments tried: ${surveyData.medications}
- Health changes & allergies: ${surveyData.healthChanges}
- Personal interests: ${surveyData.favoriteMovie}
- Fun fact: ${surveyData.funFact}
- Additional comments: ${surveyData.additionalComments || 'none'}

Please provide a clinical summary in bullet points that includes:
1. Primary medical concerns and symptom assessment
2. Patient emotional state and stress factors
3. Specific goals the patient wants to accomplish
4. Personal connection opportunities
5. Any red flags or areas requiring special attention

Format as clear, actionable bullet points for quick physician review in Epic.`
        }]
      }]
    });

    latestSummary = response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    // Enhanced fallback response with emotional intelligence
    latestSummary = `🎯 ENHANCED PATIENT SUMMARY

• Primary concern: ${surveyData.primaryReason} with ${surveyData.symptoms || 'symptoms not specified'}

• Pain/Discomfort: ${surveyData.painLevel}/10 • Stress level: ${surveyData.stress}/10 • Current mood: ${surveyData.mood || 'not specified'}

• Patient Goals for Today: ${surveyData.visitGoals || 'General health discussion'}

• Life Context: ${surveyData.lifeUpdates || 'No significant updates'} • Pronouns: ${surveyData.pronouns || 'not specified'}

• Recent treatments tried: ${surveyData.medications || 'none mentioned'}

• Personal Connection: Enjoys ${surveyData.favoriteMovie || 'not specified'} • Fun fact: ${surveyData.funFact || 'not provided'}

• Previous visit feedback: ${surveyData.previousVisitFeedback || 'not provided'}

• Health changes/allergies: ${surveyData.healthChanges || 'none reported'}

⚠️ PROVIDER NOTES: ${surveyData.previousVisitFeedback === 'felt-rushed' ? 'Patient felt rushed in previous visit - allow extra time' : 'Standard appointment approach recommended'}`;
  }

  // Show thank you page to patient
  res.render('summary', { patient: patientData });
});

app.listen(5000, '0.0.0.0', () => {
  console.log('Kaiser Permanente Epic MyChart with EasyHealth AI Integration running on port 5000');
});
