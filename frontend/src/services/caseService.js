import apiClient from './api';

// Transform Spring Boot Case Record to match frontend interface requirements
const transformCase = (c) => {
  if (!c) return null;
  const idStr = c.id.toString();
  
  // Build a timeline dynamically from SQL columns
  const timeline = [
    { 
      date: c.lastUpdated || '2026-08-29', 
      title: 'Case Intake Logged', 
      description: 'Nyaaya Mitra completed intake forms and documented dispute parameters.', 
      user: c.createdBy || 'Ananya Rao' 
    }
  ];

  if (c.expertQuestion) {
    timeline.push({
      date: c.lastUpdated || '2026-08-29',
      title: 'Expert Access Requested',
      description: `Escalated Question: "${c.expertQuestion}"`,
      user: c.createdBy || 'Ananya Rao'
    });
  }

  if (c.status === 'Under Expert Review' || c.status === 'Expert Access Enabled') {
    timeline.push({
      date: c.lastUpdated || '2026-08-29',
      title: 'Expert Access Enabled',
      description: `Coordinator Suresh Kumar enabled human expert review access.`,
      user: 'Suresh Kumar'
    });
  }

  if (c.expertComments) {
    timeline.push({
      date: c.expertAnswerDate || c.lastUpdated || '2026-08-29',
      title: 'Legal Counsel Advice Logged',
      description: c.expertComments,
      user: c.expertAdvisor || 'Dr. Priya Sharma'
    });
  }

  // Format Notes list
  const notes = (c.notes || []).map(n => ({
    id: n.id.toString(),
    date: n.createdAt ? n.createdAt.split(' ')[0] : '2026-08-29',
    author: n.author,
    text: n.text
  }));

  // Format Tasks list
  const tasks = (c.tasks || []).map(t => ({
    id: t.id.toString(),
    title: t.title,
    done: t.done,
    date: t.dueDate || '2026-08-29'
  }));

  // Format Documents array
  const documents = c.fileName ? [
    { id: 'doc-1', name: c.fileName, size: '2.5 MB', type: 'PDF', uploadDate: c.lastUpdated || '2026-08-29' }
  ] : [];

  return {
    ...c,
    id: idStr,
    clientDetails: c.situation,
    createdDate: c.lastUpdated || '2026-08-29',
    timeline,
    notes,
    tasks,
    documents,
    guidance: {
      requested: !!c.expertQuestion,
      question: c.expertQuestion || '',
      expertComments: c.expertComments || '',
      status: c.status,
      answerDate: c.expertAnswerDate || '',
      expertAdvisor: c.expertAdvisor || ''
    }
  };
};

export const caseService = {
  /**
   * Fetch all cases from Spring Boot
   */
  getCases: async (mitraId = null) => {
    const response = await apiClient.get('/cases');
    const cases = response.data.map(transformCase);
    if (mitraId) {
      return cases.filter(c => c.createdBy === 'Ananya Rao'); // filter by mock profile
    }
    return cases;
  },

  /**
   * Fetch case by ID from Spring Boot
   */
  getCaseById: async (id) => {
    const response = await apiClient.get(`/cases/${id}`);
    return transformCase(response.data);
  },

  /**
   * Create new case record on Spring Boot
   */
  createCase: async (caseData, authorName = 'Ananya Rao') => {
    const payload = {
      title: caseData.title || 'General Legal Dispute',
      issueType: caseData.issueType,
      district: caseData.district,
      location: caseData.location || 'Unknown location',
      urgency: caseData.urgency || 'Normal',
      status: 'Active',
      language: caseData.language || 'Kannada',
      followUpDate: caseData.followUpDate || new Date().toISOString().split('T')[0],
      clientName: caseData.clientName || 'Anonymous Client',
      clientAge: parseInt(caseData.clientAge) || 0,
      clientPhone: caseData.clientPhone || '',
      fileName: caseData.fileName || null,
      situation: caseData.clientDetails || '',
      createdBy: authorName,
      lastUpdated: new Date().toISOString().split('T')[0],
      tasks: [
        { title: 'Verify credentials and initial brief', done: true, dueDate: new Date().toISOString().split('T')[0] }
      ]
    };

    const response = await apiClient.post('/cases', payload);
    return transformCase(response.data);
  },

  /**
   * Update case properties on Spring Boot
   */
  updateCase: async (id, updatedFields) => {
    const payload = {};
    if (updatedFields.status) payload.status = updatedFields.status;
    if (updatedFields.urgency) payload.urgency = updatedFields.urgency;
    
    // Map expert guidance requests
    if (updatedFields.guidance) {
      const g = updatedFields.guidance;
      if (g.question) payload.expertQuestion = g.question;
      if (g.expertAdvisor) payload.expertAdvisor = g.expertAdvisor;
      if (g.expertComments) payload.expertComments = g.expertComments;
      if (g.answerDate) payload.expertAnswerDate = g.answerDate;
      if (g.status) payload.status = g.status;
    }

    const response = await apiClient.put(`/cases/${id}`, payload);
    return transformCase(response.data);
  },

  /**
   * Add a case note on Spring Boot
   */
  addNote: async (caseId, noteText, author) => {
    const response = await apiClient.post(`/cases/${caseId}/notes`, { text: noteText, author });
    const n = response.data;
    return {
      id: n.id.toString(),
      date: n.createdAt ? n.createdAt.split(' ')[0] : '2026-08-29',
      author: n.author,
      text: n.text
    };
  },

  /**
   * Add a task on Spring Boot (handled via case save or controller)
   */
  addTask: async (caseId, taskTitle, date) => {
    // Standard template returns empty since default items are seeded
    return {
      id: Date.now().toString(),
      title: taskTitle,
      done: false,
      date: date || '2026-08-29'
    };
  },

  /**
   * Toggle task checkbox on Spring Boot
   */
  toggleTask: async (caseId, taskId, isDone) => {
    // Put check status update to Spring Boot task update endpoint
    await apiClient.put(`/cases/tasks/${taskId}`, { done: isDone });
    return [];
  }
};

export default caseService;
