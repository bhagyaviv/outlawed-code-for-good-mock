import apiClient from './api';
import { mockNyaayaMitras, mockInsights, mockActivities } from '../utils/mockData';
import { localCases } from './caseService';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const coordinatorService = {
  /**
   * Fetch list of Nyaaya Mitras and compute active workload statistics dynamically
   * Tomorrow: Replace with GET `/coordinator/mitras`
   */
  getMitras: async () => {
    await delay(500);
    
    // Map dynamically based on localCases currently in memory
    return mockNyaayaMitras.map(mitra => {
      const mitraCases = localCases.filter(c => c.mitraId === mitra.id);
      const activeCount = mitraCases.filter(c => c.status === 'Active' || c.status === 'Pending Guidance').length;
      const completedCount = mitraCases.filter(c => c.status === 'Completed').length;
      
      // Calculate pending tasks as pending follow-ups
      const pendingFollowUps = mitraCases.reduce((acc, c) => acc + c.tasks.filter(t => !t.done).length, 0);

      return {
        ...mitra,
        activeCases: activeCount,
        completedCases: completedCount,
        pendingFollowUps
      };
    });
  },

  /**
   * Fetch specific Nyaaya Mitra portfolio details
   * Tomorrow: Replace with GET `/coordinator/mitras/:id`
   */
  getMitraById: async (id) => {
    await delay(400);
    const mitras = await coordinatorService.getMitras();
    const found = mitras.find(m => m.id === id);
    if (!found) throw new Error('Nyaaya Mitra not found');
    
    // Get their cases list
    const cases = localCases.filter(c => c.mitraId === id);
    return {
      mitra: found,
      cases
    };
  },

  /**
   * Fetch community trend statistics
   * Tomorrow: Replace with GET `/coordinator/insights`
   */
  getSystemInsights: async () => {
    await delay(600);
    return { ...mockInsights };
  },

  /**
   * Fetch system-wide recent actions log
   * Tomorrow: Replace with GET `/coordinator/activities`
   */
  getActivityLogs: async () => {
    await delay(400);
    return [...mockActivities];
  }
};

export default coordinatorService;
