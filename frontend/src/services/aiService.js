import apiClient from './api';
import { mockKnowledgeResults } from '../utils/mockData';
import { localCases } from './caseService';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const aiService = {
  /**
   * Ask the AI Assistant about available organizational knowledge
   * Tomorrow: Replace with POST `/ai/ask`
   */
  askQuestion: async (caseId, question) => {
    await delay(900);

    const lowercaseQuestion = question.toLowerCase();
    
    // Default mock AI response database based on typical queries
    let matchingCases = [];
    let matchingResources = [];
    let summaryText = '';

    if (lowercaseQuestion.includes('land') || lowercaseQuestion.includes('inheritance') || lowercaseQuestion.includes('property')) {
      matchingCases = [
        { id: '1012', title: 'Land inheritance dispute partition deed', similarity: '92%', location: 'Mandya', status: 'Completed' },
        { id: '1043', title: 'Property partition notary public deed validity', similarity: '87%', location: 'Mysuru', status: 'Completed' }
      ];
      matchingResources = [mockKnowledgeResults[0], mockKnowledgeResults[1]];
      summaryText = 'Under Compulsory Registration rules (Section 17 of the Registration Act, 1908), any partition deed involving immovable property valued over Rs. 100 must be registered with the sub-registrar to establish valid legal title. Simple notarization is insufficient. However, adverse possession (Article 65 of the Limitation Act, 1963) may be argued if the client has maintained continuous, open possession for over 12 years.';
    } else if (lowercaseQuestion.includes('domestic') || lowercaseQuestion.includes('violence') || lowercaseQuestion.includes('abuse')) {
      matchingCases = [
        { id: '0988', title: 'Interim protection order Dowry prohibition act', similarity: '95%', location: 'Mysuru', status: 'Completed' }
      ];
      matchingResources = [];
      summaryText = 'Under the Protection of Women from Domestic Violence Act, 2005, the Nyaaya Mitra should file an application directly to the Protection Officer to secure an emergency residence or protection order. If the police refuse to record an FIR, a representation can be sent to the SP under Sec 154(3) CrPC.';
    } else {
      // Generic fallback
      matchingCases = [
        { id: '1059', title: 'Sandhya Suraksha Name Mismatch', similarity: '70%', location: 'Bengaluru Rural', status: 'Completed' }
      ];
      matchingResources = [mockKnowledgeResults[2]];
      summaryText = 'For general queries, check spelling matching on Aadhaar records against death or partition deeds. Notarized name clarification affidavits verified by local Panchayat members are typically required by block revenue officers.';
    }

    return {
      suggestedSummary: summaryText,
      similarCases: matchingCases,
      resources: matchingResources,
      disclaimer: 'AI-generated suggestions are for assistance and should be reviewed by an authorized human Legal Expert when further legal guidance is required.'
    };
  }
};

export default aiService;
