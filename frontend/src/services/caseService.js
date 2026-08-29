import apiClient from './api';
import { mockCases } from '../utils/mockData';

// Maintain a mock mutable state in memory for live updates during the session
let localCases = [...mockCases];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const caseService = {
  /**
   * Fetch all cases (optional filter by Nyaaya Mitra ID)
   * Tomorrow: Replace with GET `/cases`
   */
  getCases: async (mitraId = null) => {
    await delay(600);
    if (mitraId) {
      return localCases.filter(c => c.mitraId === mitraId);
    }
    return localCases;
  },

  /**
   * Fetch a single case by ID
   * Tomorrow: Replace with GET `/cases/:id`
   */
  getCaseById: async (id) => {
    await delay(400);
    const item = localCases.find(c => c.id === id);
    if (!item) throw new Error('Case not found');
    return { ...item };
  },

  /**
   * Create a new case record
   * Tomorrow: Replace with POST `/cases`
   */
  createCase: async (caseData, authorName = 'Sarah Connor') => {
    await delay(1000);
    const newId = String(1000 + localCases.length + 60); // e.g. #1060
    const newRecord = {
      id: newId,
      issueType: caseData.issueType,
      district: caseData.district,
      location: caseData.location || 'Unknown location',
      urgency: caseData.urgency || 'Normal',
      status: 'Active',
      createdDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      followUpDate: caseData.followUpDate || new Date().toISOString().split('T')[0],
      mitraId: 'm1',
      mitraName: authorName,
      clientName: caseData.clientName || 'Anonymous Client',
      clientPhone: caseData.clientPhone || 'Hidden Phone',
      clientAge: parseInt(caseData.clientAge) || 0,
      clientDetails: caseData.clientDetails || '',
      summary: caseData.clientDetails ? caseData.clientDetails.slice(0, 100) + '...' : '',
      timeline: [
        { date: new Date().toISOString().split('T')[0], title: 'Case Created', description: 'Nyaaya Mitra recorded client details.', user: authorName }
      ],
      notes: caseData.notes ? [{ id: 'n1', date: new Date().toISOString().split('T')[0], author: authorName, text: caseData.notes }] : [],
      documents: caseData.fileName ? [{ id: `d-${Date.now()}`, name: caseData.fileName, size: '2.5 MB', type: 'PDF', uploadDate: new Date().toISOString().split('T')[0] }] : [],
      tasks: [
        { id: 't-init', title: 'Verify credentials and initial brief', done: true, date: new Date().toISOString().split('T')[0] }
      ],
      guidance: {
        requested: false,
        question: '',
        priority: 'Normal',
        status: 'Awaiting Expert',
        expertComments: '',
        answerDate: ''
      },
      similarCases: []
    };

    localCases = [newRecord, ...localCases];
    return newRecord;
  },

  /**
   * Update an existing case
   * Tomorrow: Replace with PUT `/cases/:id`
   */
  updateCase: async (id, updatedFields) => {
    await delay(600);
    const idx = localCases.findIndex(c => c.id === id);
    if (idx === -1) throw new Error('Case not found');
    
    localCases[idx] = {
      ...localCases[idx],
      ...updatedFields,
      lastUpdated: new Date().toISOString().split('T')[0],
      timeline: [
        ...localCases[idx].timeline,
        {
          date: new Date().toISOString().split('T')[0],
          title: 'Case Updated',
          description: 'Details and fields were updated.',
          user: updatedFields.editorName || 'User'
        }
      ]
    };
    return { ...localCases[idx] };
  },

  /**
   * Add a field note to a case
   */
  addNote: async (caseId, noteText, author) => {
    await delay(300);
    const idx = localCases.findIndex(c => c.id === caseId);
    if (idx === -1) throw new Error('Case not found');

    const newNote = {
      id: `n-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      author,
      text: noteText
    };

    localCases[idx].notes = [...localCases[idx].notes, newNote];
    localCases[idx].timeline = [
      ...localCases[idx].timeline,
      { date: new Date().toISOString().split('T')[0], title: 'Note Added', description: 'A new field note was submitted.', user: author }
    ];
    return newNote;
  },

  /**
   * Add a follow-up task to a case
   */
  addTask: async (caseId, taskTitle, date) => {
    await delay(300);
    const idx = localCases.findIndex(c => c.id === caseId);
    if (idx === -1) throw new Error('Case not found');

    const newTask = {
      id: `t-${Date.now()}`,
      title: taskTitle,
      done: false,
      date: date || new Date().toISOString().split('T')[0]
    };

    localCases[idx].tasks = [...localCases[idx].tasks, newTask];
    return newTask;
  },

  /**
   * Toggle follow-up task completion status
   */
  toggleTask: async (caseId, taskId) => {
    await delay(200);
    const idx = localCases.findIndex(c => c.id === caseId);
    if (idx === -1) throw new Error('Case not found');

    localCases[idx].tasks = localCases[idx].tasks.map(t => {
      if (t.id === taskId) {
        return { ...t, done: !t.done };
      }
      return t;
    });

    return localCases[idx].tasks;
  }
};

// Export raw variable to sync with expert/coordinator modifications easily
export { localCases };
export default caseService;
