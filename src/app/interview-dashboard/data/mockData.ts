// Mock data types
export type InterviewScore = {
  date: string;
  score: number;
  formattedDate?: string; // For display purposes
};

export type TimeRangeOption = "7" | "30" | "all";

// Generate recent dates for mock data
const generateRecentDates = () => {
  const today = new Date();
  const formatDate = (date: Date) => {
    return {
      fullDate: date.toISOString().split('T')[0],
      formatted: `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`
    };
  };

  // Create 5 dates: today, 4 days ago, 10 days ago, 18 days ago, and 25 days ago
  const dates = [
    formatDate(new Date(today)), // today
    formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4)), // 4 days ago
    formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10)), // 10 days ago
    formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 18)), // 18 days ago
    formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 25)), // 25 days ago
  ];

  return dates.reverse(); // Reverse to have chronological order (oldest first)
};

const recentDates = generateRecentDates();

// Sample data for the performance chart
export const interviewScores: InterviewScore[] = [
  { date: recentDates[0].fullDate, score: 40, formattedDate: recentDates[0].formatted },
  { date: recentDates[1].fullDate, score: 53, formattedDate: recentDates[1].formatted },
  { date: recentDates[2].fullDate, score: 51, formattedDate: recentDates[2].formatted },
  { date: recentDates[3].fullDate, score: 60, formattedDate: recentDates[3].formatted },
  { date: recentDates[4].fullDate, score: 75, formattedDate: recentDates[4].formatted },
];

// Sample data for recent interviews
export type InterviewType = "MD" | "VP" | "Associate";
export type CategoryType = "Behavioral" | "Technical" | "Market Sizing";

export type InterviewSession = {
  id: string;
  date: string;
  formattedDate: string;
  score: number;
  interviewType: InterviewType;
  interviewPosition: string;
  categories: CategoryType[];
  feedback: string[];
  strengths: string[];
  areasToImprove: string[];
};

// Sample interviews data
export const recentInterviews: InterviewSession[] = [
  {
    id: "1",
    date: recentDates[4].fullDate,
    formattedDate: recentDates[4].formatted,
    score: 75,
    interviewType: "MD",
    interviewPosition: "VP",
    categories: ["Behavioral", "Technical"],
    feedback: [
      "Good understanding of DCF modeling concepts",
      "Try structuring your DCF answer with assumptions first"
    ],
    strengths: ["Behavioral", "Market Sizing"],
    areasToImprove: ["Technical"]
  },
  {
    id: "2",
    date: recentDates[3].fullDate,
    formattedDate: recentDates[3].formatted,
    score: 60,
    interviewType: "VP",
    interviewPosition: "VP",
    categories: ["Behavioral", "Market Sizing"],
    feedback: [
      "Strong communication skills",
      "Need to work on market sizing frameworks"
    ],
    strengths: ["Behavioral"],
    areasToImprove: ["Behavioral", "Technical"]
  },
  {
    id: "3",
    date: recentDates[1].fullDate,
    formattedDate: recentDates[1].formatted,
    score: 72,
    interviewType: "Associate",
    interviewPosition: "Associate",
    categories: ["Technical"],
    feedback: [
      "Detailed technical knowledge",
      "Consider practicing more behavioral questions"
    ],
    strengths: ["Technical"],
    areasToImprove: ["Behavioral"]
  }
];

// Filter interview scores based on time range
export const getFilteredScores = (timeRange: TimeRangeOption): InterviewScore[] => {
  const now = new Date();
  let cutoffDate = new Date();
  
  if (timeRange === "7") {
    cutoffDate.setDate(now.getDate() - 7);
  } else if (timeRange === "30") {
    cutoffDate.setDate(now.getDate() - 30);
  } else {
    // Return all scores for "all" option
    return interviewScores;
  }
  
  return interviewScores.filter(score => {
    const scoreDate = new Date(score.date);
    return scoreDate >= cutoffDate;
  });
};

// Get aggregate data about strengths and weaknesses
export const getSkillsSummary = () => {
  const strengths: Record<string, number> = {};
  const weaknesses: Record<string, number> = {};
  
  recentInterviews.forEach(interview => {
    // Count strengths
    interview.strengths.forEach(skill => {
      if (strengths[skill]) {
        strengths[skill] += 1;
      } else {
        strengths[skill] = 1;
      }
    });
    
    // Count areas to improve
    interview.areasToImprove.forEach(skill => {
      if (weaknesses[skill]) {
        weaknesses[skill] += 1;
      } else {
        weaknesses[skill] = 1;
      }
    });
  });
  
  // Sort by frequency
  const sortedStrengths = Object.entries(strengths)
    .sort((a, b) => b[1] - a[1])
    .map(([skill]) => skill);
    
  const sortedWeaknesses = Object.entries(weaknesses)
    .sort((a, b) => b[1] - a[1])
    .map(([skill]) => skill);
  
  return {
    strengths: sortedStrengths,
    weaknesses: sortedWeaknesses
  };
};

// Get feedback highlights from recent interviews
export const getFeedbackHighlights = (): string[] => {
  const allFeedback: string[] = [];
  
  recentInterviews.forEach(interview => {
    allFeedback.push(...interview.feedback);
  });
  
  // Return unique feedback points
  return Array.from(new Set(allFeedback));
}; 