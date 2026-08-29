import apiClient from './api';
import { mockKnowledgeResults } from '../utils/mockData';
import { localCases } from './caseService';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const knowledgeService = {
  /**
   * Search knowledge base and return matching resources and similar cases
   * Tomorrow: Replace with GET `/knowledge/search`
   */
  searchKnowledge: async (query, filters = {}) => {
    await delay(700);

    const lowercaseQuery = query.toLowerCase();
    
    // 1. Search legal resources
    let filteredResources = [...mockKnowledgeResults];
    if (lowercaseQuery.trim()) {
      filteredResources = mockKnowledgeResults.filter(k => 
        k.title.toLowerCase().includes(lowercaseQuery) || 
        k.summary.toLowerCase().includes(lowercaseQuery) ||
        k.category.toLowerCase().includes(lowercaseQuery)
      );
    }

    if (filters.category) {
      filteredResources = filteredResources.filter(k => k.category === filters.category);
    }

    // 2. Mock finding similar cases in the system database
    let similarCases = [];
    if (lowercaseQuery.trim()) {
      similarCases = localCases
        .filter(c => c.issueType.toLowerCase().includes(lowercaseQuery) || c.summary.toLowerCase().includes(lowercaseQuery))
        .map(c => ({
          id: c.id,
          title: `${c.issueType} Dispute`,
          similarity: '89%',
          location: c.district,
          status: c.status
        }));
    }

    // If query is empty, offer default results
    if (!lowercaseQuery.trim() && similarCases.length === 0) {
      similarCases = localCases.slice(0, 2).map(c => ({
        id: c.id,
        title: `${c.issueType} Dispute`,
        similarity: '80%',
        location: c.district,
        status: c.status
      }));
    }

    return {
      resources: filteredResources,
      similarCases
    };
  }
};

export default knowledgeService;
