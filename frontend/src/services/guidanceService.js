import apiClient from './api';
import { localCases } from './caseService';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const guidanceService = {
  /**
   * Request legal guidance from experts for a specific case
   * Tomorrow: Replace with POST `/guidance/request`
   */
  requestGuidance: async (caseId, question, priority) => {
    await delay(600);
    const idx = localCases.findIndex(c => c.id === caseId);
    if (idx === -1) throw new Error('Case not found');

    localCases[idx].guidance = {
      requested: true,
      requestDate: new Date().toISOString().split('T')[0],
      question,
      priority,
      status: 'Awaiting Expert',
      expertComments: '',
      answerDate: ''
    };

    localCases[idx].status = 'Pending Guidance';

    // Add to timeline
    localCases[idx].timeline = [
      ...localCases[idx].timeline,
      {
        date: new Date().toISOString().split('T')[0],
        title: 'Guidance Requested',
        description: 'Sent case parameters for review by a Legal Expert.',
        user: localCases[idx].mitraName
      }
    ];

    return { ...localCases[idx] };
  },

  /**
   * Fetch all cases currently awaiting or answered with expert guidance
   * Tomorrow: Replace with GET `/guidance`
   */
  getGuidanceRequests: async () => {
    await delay(500);
    return localCases.filter(c => c.guidance?.requested);
  },

  /**
   * Submit legal guidance and answer a case request
   * Tomorrow: Replace with POST `/guidance/answer`
   */
  submitGuidance: async (caseId, expertComments, expertName) => {
    await delay(800);
    const idx = localCases.findIndex(c => c.id === caseId);
    if (idx === -1) throw new Error('Case not found');

    localCases[idx].guidance = {
      ...localCases[idx].guidance,
      status: 'Answered',
      expertComments,
      expertName,
      answerDate: new Date().toISOString().split('T')[0]
    };

    // Revert status to Active once answered
    localCases[idx].status = 'Active';

    // Add to timeline
    localCases[idx].timeline = [
      ...localCases[idx].timeline,
      {
        date: new Date().toISOString().split('T')[0],
        title: 'Guidance Provided',
        description: `Legal expert ${expertName} submitted recommendations.`,
        user: expertName
      }
    ];

    return { ...localCases[idx] };
  }
};

export default guidanceService;
