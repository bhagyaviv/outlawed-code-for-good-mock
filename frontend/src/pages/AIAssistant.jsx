import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  ArrowLeft, 
  AlertTriangle, 
  FileText, 
  User, 
  ExternalLink
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import caseService from '../services/caseService';
import { mockPreviousCases } from '../utils/mockPreviousCases';

/**
 * AI Assistant Chat Component
 * @param {Object} props
 * @param {string} props.caseId - context case ID
 * @param {Object} props.user - logged-in user
 * @param {function} props.onNavigate - callback to navigate views
 */
export default function AIAssistant({ caseId = '1056', user, onNavigate }) {
  const [messages, setMessages] = useState([
    {
      id: 'm-system',
      sender: 'ai',
      text: '🤖 Hello! I am your AI Knowledge Assistant. I help you search organizational case files, identify similar disputes, and summarize templates. I do not provide legal decisions or represent myself as a human lawyer.',
      timestamp: 'Intake Assistant Online'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState(1); 
  const [caseContext, setCaseContext] = useState(null);

  // Request Expert Form State
  const [alreadyFound, setAlreadyFound] = useState('');
  const [unresolvedIssue, setUnresolvedIssue] = useState('');
  const [whyExpert, setWhyExpert] = useState('');
  const [requestPriority, setRequestPriority] = useState('Important');
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    async function loadCaseContext() {
      if (caseId) {
        try {
          const item = await caseService.getCaseById(caseId);
          setCaseContext(item);
          
          setAlreadyFound('Asked AI, reviewed similar Case #1021 and Case #987, and checked Inheritance Documentation Guide.');
          setUnresolvedIssue('Need specific guidance on court caveat petitions for notarized partition sheets.');
          setWhyExpert('Cousins are threatening eviction using non-registered agreements notarized by notary public.');
        } catch (err) {
          console.error(err);
        }
      }
    }
    loadCaseContext();
  }, [caseId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    await new Promise(resolve => setTimeout(resolve, 1200));
    setIsTyping(false);

    let aiMsg = {};
    const lowerText = text.toLowerCase();

    if (lowerText.includes('similar land inheritance') || lowerText.includes('handled similar') || lowerText.includes('1056')) {
      const pc001 = mockPreviousCases.find(c => c.id === 'PC-001');
      const pc019 = mockPreviousCases.find(c => c.id === 'PC-019');
      const pc038 = mockPreviousCases.find(c => c.id === 'PC-038');
      aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: 'I found 3 potentially relevant previous cases.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        disclaimer: 'AI-generated information is for assistance and should be reviewed by an authorized Human Legal Expert when further legal guidance is required.',
        similarCases: [
          { id: 'PC-001', title: pc001.title, district: pc001.district, similarity: '92%', summary: pc001.problem },
          { id: 'PC-019', title: pc019.title, district: pc019.district, similarity: '86%', summary: pc019.problem },
          { id: 'PC-038', title: pc038.title, district: pc038.district, similarity: '81%', summary: pc038.problem }
        ],
        resources: [
          { title: 'Inheritance Documentation Guide', relevance: 'High', description: 'Mandatory registration checklist for agricultural land partitions.' }
        ],
        summary: 'Based on the retrieved organizational knowledge, similar cases involved verification of property documents, family relationship information, and additional supporting records.'
      };
      setStep(2);
    } else if (lowerText.includes('another') || lowerText.includes('mandya')) {
      const pc010 = mockPreviousCases.find(c => c.id === 'PC-010');
      const pc026 = mockPreviousCases.find(c => c.id === 'PC-026');
      aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: 'Searching Mandya database... 2 potentially relevant results found.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        disclaimer: 'AI-generated information is for assistance and should be reviewed by an authorized Human Legal Expert when further legal guidance is required.',
        similarCases: [
          { id: 'PC-010', title: pc010.title, district: pc010.district, similarity: '82%', summary: pc010.problem },
          { id: 'PC-026', title: pc026.title, district: pc026.district, similarity: '79%', summary: pc026.problem }
        ],
        resources: [],
        summary: 'Additional records matching Mandya show partition disputes related to registered deed verification.'
      };
      setStep(3);
    } else {
      aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: 'Searched database. No high confidence similar cases found. Try checking general documentation requirements.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        disclaimer: 'AI-generated information is for assistance and should be reviewed by an authorized Human Legal Expert when further legal guidance is required.',
        similarCases: [],
        resources: [
          { title: 'General Intake Checklist', relevance: 'Normal', description: 'Outline of essential client details.' }
        ],
        summary: 'No specific matches. Collect property certificates and RTC documents.'
      };
    }

    setMessages(prev => [...prev, aiMsg]);
  };

  const handleResolveYes = async () => {
    if (!caseContext) return;
    try {
      await caseService.updateCase(caseContext.id, {
        status: 'Active',
        notes: {
          id: `n-ai-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          author: 'AI Assistant',
          text: 'AI assistance completed. Relevant similar cases reviewed by Nyaaya Mitra.'
        }
      });
      alert('AI Assistance marked as completed. Returning to Case details.');
      onNavigate('cases-detail', caseContext.id);
    } catch (err) {
      alert('Failed to update case.');
    }
  };

  const handleResolveNo = () => {
    setStep(4);
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!alreadyFound.trim() || !unresolvedIssue.trim()) {
      alert('Please fill out all request parameters.');
      return;
    }
    setIsSubmittingRequest(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1400));
      await caseService.updateCase(caseContext.id, {
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

      alert('Expert guidance requested. Awaiting Coordinator review.');
      onNavigate('cases-detail', caseContext.id);
    } catch (err) {
      alert('Failed to submit expert request.');
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex items-center gap-2 border-b pb-4">
        <Button
          variant="outline"
          className="!p-1.5 bg-white border-gray-200 hover:bg-gray-50"
          onClick={() => onNavigate(caseContext ? 'cases-detail' : 'dashboard', caseContext?.id)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span>🤖</span>
            AI Assistant
          </h1>
          <p className="text-xs text-gray-505">Helps discover and understand organizational knowledge.</p>
        </div>
      </div>

      {caseContext && (
        <div className="bg-emerald-50 border border-emerald-250 rounded-lg p-3 text-xs flex justify-between items-center shadow-sm">
          <div>
            <span className="font-bold text-emerald-800">Context Case:</span>{' '}
            <span className="font-bold text-gray-950">#{caseContext.id}</span> — {caseContext.title} ({caseContext.district})
          </div>
          <Button
            variant="outline"
            className="!py-0.5 !px-2 text-[10px] bg-white border-emerald-300 text-emerald-700 hover:bg-emerald-100 font-semibold"
            onClick={() => onNavigate('cases-detail', caseContext.id)}
          >
            Go to File
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        <div className="lg:col-span-2 flex flex-col h-[560px] bg-white border rounded-lg shadow-sm">
          
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map(msg => (
              <div 
                key={msg.id} 
                className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div className={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center font-bold text-sm border
                  ${msg.sender === 'user' ? 'bg-gray-100 text-gray-700' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}
                `}>
                  {msg.sender === 'user' ? <User className="h-4 w-4" /> : '🤖'}
                </div>

                <div className="space-y-3">
                  <div className={`p-3 rounded-lg text-xs leading-relaxed
                    ${msg.sender === 'user' ? 'bg-emerald-600 text-white font-semibold' : 'bg-gray-50 border text-gray-800'}
                  `}>
                    {msg.text}
                  </div>

                  {msg.similarCases && msg.similarCases.length > 0 && (
                    <div className="space-y-3 pl-1">
                      <h4 className="text-[10px] font-bold text-gray-450 uppercase tracking-wider">Potentially Relevant Cases:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {msg.similarCases.map(sc => (
                          <div key={sc.id} className="p-3 bg-white border rounded-lg shadow-sm text-xs space-y-1.5">
                            <div className="flex justify-between font-bold text-gray-900 border-b pb-1">
                              <span>Case #{sc.id}</span>
                              <span className="text-emerald-700">{sc.similarity} Match</span>
                            </div>
                            <div className="font-bold text-gray-800">{sc.title}</div>
                            <div className="text-[10px] text-gray-450">District: {sc.district}</div>
                            <p className="text-[10px] text-gray-605 leading-normal">{sc.summary}</p>
                            <Button 
                              variant="outline" 
                              onClick={() => onNavigate('previous-case-details', sc.id)}
                              className="w-full !py-1 text-[10px] justify-center mt-1 border-gray-250 bg-gray-50 font-semibold animate-pulse"
                            >
                              <ExternalLink className="h-3 w-3 mr-1 inline" />
                              View Previous Case
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {msg.resources && msg.resources.length > 0 && (
                    <div className="space-y-2 pl-1">
                      <h4 className="text-[10px] font-bold text-gray-450 uppercase tracking-wider">Suggested Resource:</h4>
                      {msg.resources.map((res, rIdx) => (
                        <div key={rIdx} className="p-3 bg-white border rounded-lg shadow-sm text-xs space-y-1">
                          <div className="flex justify-between items-center font-bold text-gray-800">
                            <span className="flex items-center gap-1">
                              <FileText className="h-4 w-4 text-emerald-600" />
                              {res.title}
                            </span>
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold">Relevance: {res.relevance}</span>
                          </div>
                          <p className="text-[10px] text-gray-500 leading-normal">{res.description}</p>
                          <Button 
                            variant="outline" 
                            onClick={() => alert(`Reviewing PDF: ${res.title}`)}
                            className="!py-0.5 !px-2 text-[10px] border-gray-255 bg-gray-50 font-semibold"
                          >
                            View Resource
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {msg.summary && (
                    <div className="bg-emerald-50/50 border border-emerald-250 rounded-lg p-3 text-xs text-emerald-800 space-y-1.5">
                      <div className="font-bold flex items-center gap-1">
                        <Bot className="h-4 w-4 text-emerald-600" />
                        AI-Assisted Summary:
                      </div>
                      <p className="leading-relaxed font-semibold">"{msg.summary}"</p>
                    </div>
                  )}

                  {msg.disclaimer && (
                    <div className="bg-amber-50 border border-amber-200 rounded p-2.5 text-[10px] text-amber-800 flex items-start gap-1.5 leading-normal">
                      <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{msg.disclaimer}</span>
                    </div>
                  )}

                  <span className="block text-[9px] text-gray-400 font-bold">{msg.timestamp}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 max-w-[85%] mr-auto">
                <div className="h-8 w-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center font-bold text-sm">
                  🤖
                </div>
                <div className="bg-gray-50 border p-3 rounded-lg text-xs text-gray-500 flex items-center gap-1.5 font-semibold">
                  <span className="animate-ping h-2.5 w-2.5 rounded-full bg-emerald-600 shrink-0" />
                  Searching organizational knowledge...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {(step === 2 || step === 3) && !isTyping && (
            <div className="bg-gray-50 border-t p-4 text-center space-y-3">
              <h4 className="text-xs font-bold text-gray-900">Was the available information sufficient?</h4>
              <div className="flex gap-3 justify-center">
                <Button 
                  onClick={handleResolveYes}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                >
                  Yes — Continue Case
                </Button>
                <Button 
                  onClick={handleResolveNo}
                  className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-bold"
                >
                  No — Request Human Legal Expert
                </Button>
              </div>
            </div>
          )}

          <div className="border-t p-3 bg-gray-50 rounded-b-lg">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask AI Assistant about templates or cases..."
                className="block w-full rounded border-gray-350 text-xs focus:ring-emerald-500 focus:border-emerald-500"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend();
                }}
                disabled={step === 4}
              />
              <Button 
                onClick={() => handleSend()}
                disabled={step === 4 || !inputValue.trim()}
                className="bg-emerald-650 text-white shrink-0 font-semibold"
              >
                Send
              </Button>
            </div>
          </div>

        </div>

        <div>
          {step === 4 ? (
            <Card title="Escalate to Human Expert" subtitle="Submit your review request to the coordinator.">
              <form onSubmit={handleRequestSubmit} className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded p-2.5 text-[10px] text-amber-800 flex items-start gap-1.5 leading-normal">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>Request will be triaged by district coordinator before assignment.</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-707 mb-1">What information did you already find?</label>
                  <textarea
                    rows={2}
                    className="block w-full rounded border-gray-300 text-xs focus:ring-emerald-500 focus:border-emerald-500"
                    value={alreadyFound}
                    onChange={(e) => setAlreadyFound(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-707 mb-1">What issue remains unresolved?</label>
                  <textarea
                    rows={2}
                    className="block w-full rounded border-gray-300 text-xs focus:ring-emerald-500 focus:border-emerald-500"
                    value={unresolvedIssue}
                    onChange={(e) => setUnresolvedIssue(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-707 mb-1">Why is human expert guidance required?</label>
                  <textarea
                    rows={2}
                    className="block w-full rounded border-gray-300 text-xs focus:ring-emerald-500 focus:border-emerald-500"
                    value={whyExpert}
                    onChange={(e) => setWhyExpert(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-707 mb-2">Priority</label>
                  <div className="flex gap-4">
                    {['Normal', 'Important', 'Urgent'].map(level => (
                      <label key={level} className="flex items-center text-xs font-semibold text-gray-700 cursor-pointer">
                        <input
                          type="radio"
                          name="expert-priority"
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 mr-1.5"
                          checked={requestPriority === level}
                          onChange={() => setRequestPriority(level)}
                        />
                        {level}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <Button variant="outline" onClick={() => setStep(2)}>Cancel</Button>
                  <Button 
                    type="submit" 
                    isLoading={isSubmittingRequest}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  >
                    Submit Expert Request
                  </Button>
                </div>
              </form>
            </Card>
          ) : (
            <Card title="Quick Suggestions" subtitle="Click suggestions to test simulated responses.">
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full text-left justify-start text-[11px] font-semibold border-gray-250 bg-white text-gray-705"
                  onClick={() => handleSend("Have we handled similar land inheritance cases before?")}
                  disabled={step === 4}
                >
                  💡 "Have we handled similar land inheritance cases?"
                </Button>
                
                {step >= 2 && (
                  <Button
                    variant="outline"
                    className="w-full text-left justify-start text-[11px] font-semibold border-gray-250 bg-white text-emerald-700 hover:bg-emerald-50"
                    onClick={() => handleSend("Is there another similar case from Mandya?")}
                    disabled={step === 4}
                  >
                    💡 "Is there another similar case from Mandya?"
                  </Button>
                )}

                <Button
                  variant="outline"
                  className="w-full text-left justify-start text-[11px] font-semibold border-gray-255 bg-white text-gray-705"
                  onClick={() => handleSend("What documents are required for government pensions?")}
                  disabled={step === 4}
                >
                  💡 "What documents are required for welfare pensions?"
                </Button>

                <div className="border-t pt-3 text-[10px] text-gray-450 leading-relaxed">
                  <span className="font-bold block text-gray-750 mb-1">How AI Assistant works:</span>
                  The assistant queries semantic matches across local registries and suggested guides, generating key outlines. Unresolved cases are escalated to the district coordinator.
                </div>
              </div>
            </Card>
          )}
        </div>

      </div>

    </div>
  );
}
