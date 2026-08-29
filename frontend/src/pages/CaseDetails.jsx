import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Lock, 
  Unlock, 
  Calendar, 
  FileText, 
  Plus, 
  Bot, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import Loading from '../components/Loading';
import caseService from '../services/caseService';

/**
 * Detailed Case Page Component
 * @param {Object} props
 * @param {string} props.caseId - ID of the active case to load
 * @param {Object} props.user - logged-in user
 * @param {function} props.onNavigate - callback to navigate views
 */
export default function CaseDetails({ caseId, user, onNavigate }) {
  const [caseItem, setCaseItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Privacy toggles
  const [revealSensitive, setRevealSensitive] = useState(false);

  // Sub-actions states
  const [newNoteText, setNewNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('');

  // Request Expert Form State
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [alreadyFound, setAlreadyFound] = useState('');
  const [unresolvedIssue, setUnresolvedIssue] = useState('');
  const [whyExpert, setWhyExpert] = useState('');
  const [requestPriority, setRequestPriority] = useState('Normal');
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  useEffect(() => {
    async function loadCase() {
      try {
        const data = await caseService.getCaseById(caseId);
        setCaseItem(data);
        if (data.id === '1056') {
          setAlreadyFound('Asked AI, reviewed similar Case #1021 and Case #987, and checked Inheritance Documentation Guide.');
          setUnresolvedIssue('Need specific guidance on court caveat petitions for notarized partition sheets.');
          setWhyExpert('Cousins are threatening eviction using non-registered agreements notarized by notary public.');
          setRequestPriority('Important');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCase();
  }, [caseId]);

  if (isLoading) {
    return <Loading message="Loading case transcript..." />;
  }

  if (!caseItem) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-gray-505">Case record #{caseId} could not be found.</p>
        <Button onClick={() => onNavigate('dashboard')} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    try {
      const added = await caseService.addNote(caseItem.id, newNoteText, user?.name || 'Ananya Rao');
      setCaseItem(prev => ({
        ...prev,
        notes: [...prev.notes, added],
        timeline: [
          ...prev.timeline,
          { date: new Date().toISOString().split('T')[0], title: 'Note Added', description: 'A new field note was submitted.', user: user?.name || 'Ananya Rao' }
        ]
      }));
      setNewNoteText('');
      setIsAddingNote(false);
    } catch (err) {
      alert('Failed to save note.');
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    try {
      const added = await caseService.addTask(caseItem.id, newTaskTitle, newTaskDate);
      setCaseItem(prev => ({
        ...prev,
        tasks: [...prev.tasks, added]
      }));
      setNewTaskTitle('');
      setNewTaskDate('');
    } catch (err) {
      alert('Failed to add task.');
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      const updatedTasks = await caseService.toggleTask(caseItem.id, taskId);
      setCaseItem(prev => ({
        ...prev,
        tasks: updatedTasks
      }));
    } catch (err) {
      alert('Failed to update task.');
    }
  };

  const handleRequestExpertSubmit = async (e) => {
    e.preventDefault();
    if (!alreadyFound.trim() || !unresolvedIssue.trim()) {
      alert('Please fill out what was already tried and what remains unresolved.');
      return;
    }
    setIsSubmittingRequest(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const updated = await caseService.updateCase(caseItem.id, {
        status: 'Awaiting Coordinator Review',
        guidance: {
          requested: true,
          requestDate: new Date().toISOString().split('T')[0],
          question: unresolvedIssue,
          triedSummary: alreadyFound,
          unresolvedSummary: unresolvedIssue,
          whyExpertText: whyExpert,
          priority: requestPriority,
          status: 'Awaiting Coordinator Review'
        }
      });
      setCaseItem(updated);
      setShowRequestForm(false);
    } catch (err) {
      alert('Failed to submit request.');
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  const handleResolveAI = async () => {
    try {
      const updated = await caseService.updateCase(caseItem.id, {
        status: 'Resolved',
        guidance: {
          requested: false,
          status: 'Case Continued',
          expertComments: 'Resolved by Nyaaya Mitra using AI Assistant knowledge search recommendations.'
        }
      });
      setCaseItem(updated);
      alert('Case status updated to Resolved.');
    } catch (err) {
      alert('Failed to resolve case.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="!p-1.5 bg-white border-gray-200 hover:bg-gray-50"
            onClick={() => onNavigate(user?.role === 'coordinator' ? 'coordinator-cases' : (user?.role === 'expert' ? 'expert-cases' : 'cases'))}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900">Case #{caseItem.id}</h1>
              <StatusBadge status={caseItem.status} />
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border 
                ${caseItem.priority === 'Urgent' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-gray-50 text-gray-700 border-gray-250'}
              `}>
                {caseItem.priority}
              </span>
            </div>
            <p className="text-xs text-gray-550 mt-0.5">{caseItem.title} — {caseItem.issueType}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => onNavigate('ai-assistant', caseItem.id)}
            className="text-xs font-semibold bg-white border-gray-300"
          >
            <Bot className="h-4 w-4 mr-1 text-emerald-600 inline" />
            Ask AI Assistant
          </Button>
          <Button
            variant="outline"
            onClick={() => onNavigate('knowledge')}
            className="text-xs font-semibold bg-white border-gray-300"
          >
            Search Similar Cases
          </Button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        <div className="lg:col-span-2 space-y-6">
          
          <Card title="Case Summary Statement">
            <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded border">
              {caseItem.clientDetails || caseItem.situation}
            </p>
          </Card>

          <Card title="Case History Timeline" subtitle="Logged stages of the legal-aid dispute.">
            <div className="flow-root pl-2">
              <ul className="-mb-8">
                {caseItem.timeline.map((event, idx) => (
                  <li key={idx}>
                    <div className="relative pb-8">
                      {idx !== caseItem.timeline.length - 1 && (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                      )}
                      <div className="relative flex space-x-3">
                        <div className="h-8 w-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div className="flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-xs text-gray-800 font-bold">{event.title}</p>
                            <p className="text-xs text-gray-550 mt-0.5">{event.description}</p>
                            <p className="text-[10px] text-gray-400 mt-1">Logged by: {event.user}</p>
                          </div>
                          <span className="text-[10px] text-gray-400 font-bold">{event.date}</span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          <Card 
            title="Potentially Relevant Previous Cases" 
            subtitle="Anonymized organizational knowledge files matching this dispute type."
          >
            <div className="space-y-4">
              <div className="bg-emerald-50/50 border border-emerald-250 rounded p-4 text-xs text-emerald-800 space-y-2">
                <div className="flex items-center gap-1 font-bold">
                  <Bot className="h-4.5 w-4.5 text-emerald-600" />
                  AI-Assisted Knowledge Discovery:
                </div>
                <p className="leading-relaxed font-semibold">
                  I found 3 potentially relevant previous cases in the organizational knowledge repository: PC-001 (92%), PC-019 (86%), and PC-038 (81%).
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="p-3 bg-white border rounded-lg text-xs flex justify-between items-center shadow-sm">
                  <div>
                    <div className="font-bold text-gray-905">PC-001 — Agricultural Land Inheritance Dispute</div>
                    <div className="text-[10px] text-gray-450 mt-0.5">Similarity: 92% | District: Mandya | Year: 2025</div>
                  </div>
                  <Button
                    variant="outline"
                    className="!py-0.5 !px-2 text-[10px] bg-white border-gray-250 font-bold hover:bg-gray-50 text-gray-750"
                    onClick={() => onNavigate('previous-case-details', 'PC-001')}
                  >
                    View Case
                  </Button>
                </div>

                <div className="p-3 bg-white border rounded-lg text-xs flex justify-between items-center shadow-sm">
                  <div>
                    <div className="font-bold text-gray-905">PC-019 — Property Inheritance Documentation</div>
                    <div className="text-[10px] text-gray-450 mt-0.5">Similarity: 86% | District: Mysuru | Year: 2024</div>
                  </div>
                  <Button
                    variant="outline"
                    className="!py-0.5 !px-2 text-[10px] bg-white border-gray-250 font-bold hover:bg-gray-50 text-gray-755"
                    onClick={() => onNavigate('previous-case-details', 'PC-019')}
                  >
                    View Case
                  </Button>
                </div>

                <div className="p-3 bg-white border rounded-lg text-xs flex justify-between items-center shadow-sm">
                  <div>
                    <div className="font-bold text-gray-905">PC-038 — Land Inheritance Documentation</div>
                    <div className="text-[10px] text-gray-450 mt-0.5">Similarity: 81% | District: Mysuru | Year: 2022</div>
                  </div>
                  <Button
                    variant="outline"
                    className="!py-0.5 !px-2 text-[10px] bg-white border-gray-250 font-bold hover:bg-gray-50 text-gray-755"
                    onClick={() => onNavigate('previous-case-details', 'PC-038')}
                  >
                    View Case
                  </Button>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t">
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                  onClick={() => {
                    window.localStorage.setItem('outlawed_prev_cases_preset', JSON.stringify({
                      search: '',
                      issue: caseItem.issueType || 'Land / Property'
                    }));
                    onNavigate('previous-cases');
                  }}
                >
                  View All Similar Cases
                </Button>
              </div>

              <div className="text-[10px] text-gray-400 border-t pt-2 mt-2">
                💡 <strong>Organizational Disclaimer:</strong> AI-assisted discovery compiles suggestions based on previous case archives. These do not constitute guaranteed legal decisions or automatic law.
              </div>
            </div>
          </Card>

          <Card 
            title="Human Legal Expert Guidance" 
            subtitle="Official recommendations provided by certified senior legal guides."
          >
            {caseItem.guidance?.status === 'Guidance Provided' || caseItem.status === 'Guidance Provided' ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-blue-150">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                      👨⚖️
                    </div>
                    <span className="text-xs font-bold text-blue-900">Provided by: {caseItem.guidance.expertName || 'Human Legal Expert'}</span>
                  </div>
                  <span className="text-[10px] text-blue-700 font-semibold">{caseItem.guidance.answerDate || new Date().toISOString().split('T')[0]}</span>
                </div>
                <div className="text-xs font-bold text-blue-955 leading-relaxed whitespace-pre-line">
                  {caseItem.guidance.expertComments || 
                    "A compulsory partition deed is required under Karnataka Registration Rules. Advise client to file an immediate Caveat Petition (Form Sec 148A CPC) in local civil court to block sibling ex-parte injunctions. Collect RTC copy from Tehsildar office."}
                </div>
                <div className="pt-2 flex justify-end">
                  <Button 
                    onClick={handleResolveAI}
                    className="text-xs font-semibold bg-blue-600 border border-transparent text-white hover:bg-blue-700"
                  >
                    Mark Case as Resolved
                  </Button>
                </div>
              </div>
            ) : caseItem.guidance?.requested ? (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-xs text-amber-800 space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <AlertCircle className="h-4.5 w-4.5 text-amber-600" />
                  Request Status: {caseItem.guidance.status || 'Awaiting Coordinator Review'}
                </div>
                <p>
                  You have requested Human Legal Expert Guidance. This request is currently being reviewed by the district coordinator before assignment to an expert.
                </p>
                <div className="bg-white p-2.5 rounded border border-amber-100 mt-2 font-mono text-[10px] text-gray-650">
                  <strong>Your Question:</strong> "{caseItem.guidance.question}"
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-550 text-xs bg-gray-50 border border-dashed rounded">
                <HelpCircle className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                No human legal guidance requests filed.
              </div>
            )}
          </Card>

          {!caseItem.guidance?.requested && caseItem.status !== 'Resolved' && (
            <div className="bg-gray-100 border rounded-lg p-4 text-center space-y-3 shadow-inner">
              <h3 className="text-xs font-bold text-gray-900">Was the available AI-Assisted information sufficient?</h3>
              <p className="text-[10px] text-gray-505 max-w-md mx-auto">
                First check the suggested similar cases. If you still need clarification, you can escalate the file.
              </p>
              <div className="flex gap-3 justify-center pt-1.5">
                <Button 
                  onClick={handleResolveAI}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                >
                  Yes — Continue Case (Resolve)
                </Button>
                <Button 
                  onClick={() => setShowRequestForm(true)}
                  className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-semibold"
                >
                  No — Request Human Legal Expert
                </Button>
              </div>
            </div>
          )}

          {showRequestForm && (
            <Card title="Request Human Legal Expert Guidance" subtitle="Submit your request details. It will be reviewed by the coordinator first.">
              <form onSubmit={handleRequestExpertSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-705 mb-1">What information did you already find?</label>
                  <textarea
                    rows={2}
                    className="block w-full rounded-md border-gray-300 text-xs focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Describe AI search or suggested references reviewed..."
                    value={alreadyFound}
                    onChange={(e) => setAlreadyFound(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-705 mb-1">What issue remains unresolved?</label>
                  <textarea
                    rows={2}
                    className="block w-full rounded-md border-gray-300 text-xs focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Specify what exact legal question is unanswered..."
                    value={unresolvedIssue}
                    onChange={(e) => setUnresolvedIssue(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-705 mb-1">Why is human expert guidance required?</label>
                  <textarea
                    rows={2}
                    className="block w-full rounded-md border-gray-300 text-xs focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Describe field risks, eviction warnings, or urgency reasons..."
                    value={whyExpert}
                    onChange={(e) => setWhyExpert(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-707 mb-1">Escalation Priority</label>
                    <select
                      className="block w-full rounded-md border-gray-300 text-xs focus:ring-emerald-500 focus:border-emerald-500"
                      value={requestPriority}
                      onChange={(e) => setRequestPriority(e.target.value)}
                    >
                      <option value="Normal">Normal</option>
                      <option value="Important">Important</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-707 mb-1">Attach Supporting Files</label>
                    <input 
                      type="file" 
                      className="block w-full text-xs text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border file:border-gray-300 file:text-xs file:font-semibold file:bg-white hover:file:bg-gray-50"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowRequestForm(false)}
                    disabled={isSubmittingRequest}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isSubmittingRequest}
                    className="bg-emerald-600 text-white font-semibold"
                  >
                    Submit Request
                  </Button>
                </div>
              </form>
            </Card>
          )}

        </div>

        <div className="space-y-6">
          
          <Card title="Client Profile Information">
            <div className="space-y-3 text-xs">
              <div className="bg-gray-50 border rounded p-3 text-center space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-gray-600 font-bold">
                  <Lock className="h-4.5 w-4.5" />
                  Sensitive Information
                </div>
                <p className="text-[10px] text-gray-450 leading-relaxed">
                  Only authorized users can view client details. Local field worker permissions enabled.
                </p>
                <Button
                  variant="outline"
                  className="!py-1 !px-2.5 text-[10px] bg-white border-gray-300 font-semibold"
                  onClick={() => setRevealSensitive(!revealSensitive)}
                >
                  {revealSensitive ? 'Mask Details' : 'Reveal Details'}
                </Button>
              </div>

              <div className="space-y-2 border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-gray-455 font-semibold">Name:</span>
                  <span className="font-bold text-gray-900">
                    {revealSensitive ? caseItem.clientName : caseItem.clientName?.charAt(0) + '*** ' + caseItem.clientName?.split(' ')[1]?.charAt(0) + '***'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-455 font-semibold">Contact:</span>
                  <span className="text-gray-800 font-mono">
                    {revealSensitive ? caseItem.clientPhone : '+91 XXXXX XX456'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-455 font-semibold">Age:</span>
                  <span className="text-gray-800">{revealSensitive ? caseItem.clientAge : 'XX'} Years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-455 font-semibold">District:</span>
                  <span className="text-gray-800">{caseItem.district}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-455 font-semibold">Community Locality:</span>
                  <span className="text-gray-800 font-semibold">{caseItem.location}</span>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Follow-up Checklist" subtitle="Track local outreach tasks.">
            <div className="space-y-3">
              {caseItem.tasks.map(t => (
                <label key={t.id} className="flex items-start gap-2.5 text-xs text-gray-700 bg-gray-50/50 p-2 rounded border hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => handleToggleTask(t.id)}
                    className="h-4.5 w-4.5 text-emerald-600 rounded border-gray-355 focus:ring-emerald-500 mt-0.5"
                  />
                  <div className="flex-1">
                    <span className={t.done ? 'line-through text-gray-400 font-medium' : 'font-semibold text-gray-900'}>{t.title}</span>
                    <span className="block text-[9px] text-gray-455 mt-0.5 font-bold">Due: {t.date}</span>
                  </div>
                </label>
              ))}

              <form onSubmit={handleAddTask} className="border-t pt-3 mt-3 space-y-2">
                <input
                  type="text"
                  placeholder="New task title..."
                  className="block w-full rounded border-gray-300 text-xs focus:ring-emerald-500 focus:border-emerald-500"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                />
                <div className="flex gap-2">
                  <input
                    type="date"
                    className="block w-full rounded border-gray-300 text-xs focus:ring-emerald-500 focus:border-emerald-500"
                    value={newTaskDate}
                    onChange={(e) => setNewTaskDate(e.target.value)}
                  />
                  <Button type="submit" className="!p-1 bg-emerald-600 hover:bg-emerald-700 text-white shrink-0">
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
              </form>
            </div>
          </Card>

          <Card title="Uploaded Evidence Documents">
            <div className="space-y-2 text-xs">
              {caseItem.documents?.length > 0 ? (
                caseItem.documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-emerald-600 shrink-0" />
                      <div>
                        <div className="font-bold text-gray-900 truncate max-w-[140px]">{doc.name}</div>
                        <div className="text-[9px] text-gray-400 mt-0.5">{doc.size} | {doc.type}</div>
                      </div>
                    </div>
                    <a href="#" onClick={(e) => {e.preventDefault(); alert(`Downloading mock file: ${doc.name}`);}} className="text-[10px] font-bold text-emerald-600 hover:text-emerald-500 uppercase tracking-wide">
                      Download
                    </a>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500 text-center py-2">No attachments.</p>
              )}
            </div>
          </Card>

          <Card title="Case Field Notes">
            <div className="space-y-3">
              {caseItem.notes?.length > 0 ? (
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {caseItem.notes.map(note => (
                    <div key={note.id} className="p-2.5 bg-gray-50 border rounded text-xs space-y-1">
                      <p className="text-gray-800 leading-relaxed font-semibold">"{note.text}"</p>
                      <div className="flex justify-between text-[9px] text-gray-400 font-bold pt-1 border-t">
                        <span>By: {note.author}</span>
                        <span>{note.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-550 text-center py-2">No notes.</p>
              )}

              {isAddingNote ? (
                <form onSubmit={handleAddNote} className="space-y-2 pt-2 border-t">
                  <textarea
                    rows={2}
                    placeholder="Type a field note..."
                    className="block w-full rounded border-gray-350 text-xs focus:ring-emerald-500 focus:border-emerald-500"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                  />
                  <div className="flex justify-end gap-2 text-xs">
                    <Button variant="outline" onClick={() => setIsAddingNote(false)}>Cancel</Button>
                    <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">Save</Button>
                  </div>
                </form>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddingNote(true)} 
                  className="w-full text-xs font-semibold justify-center flex items-center gap-1 bg-white border-gray-300"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Note
                </Button>
              )}
            </div>
          </Card>

        </div>

      </div>

    </div>
  );
}
