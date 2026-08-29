import apiClient from './api';
import { localCases } from './caseService';
import guidanceService from './guidanceService';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const expertService = {
  /**
   * Fetch all cases where human Legal Expert Access has been granted by the Coordinator
   * Tomorrow: Replace with GET `/expert/cases`
   */
  getCasesForReview: async () => {
    await delay(500);
    // Filter cases with access status: 'Expert Access Enabled' or 'Under Expert Review' or 'Guidance Provided'
    return localCases.filter(c => 
      c.status === 'Expert Access Enabled' || 
      c.status === 'Under Expert Review' || 
      c.status === 'Guidance Provided' ||
      (c.guidance?.requested && c.status === 'Active' && c.guidance.status === 'Answered')
    );
  },

  /**
   * Submit human guidance and answer a case request
   * Tomorrow: Replace with POST `/expert/guidance`
   */
  submitGuidance: async (caseId, comments, expertName) => {
    // Utilize guidanceService to finalize comments and change status
    const result = await guidanceService.submitGuidance(caseId, comments, expertName);
    
    // Explicitly update case status back to 'Guidance Provided' for clear visual feedback
    const idx = localCases.findIndex(c => c.id === caseId);
    if (idx !== -1) {
      localCases[idx].status = 'Guidance Provided';
    }
    
    return result;
  }
};

export default expertService;
