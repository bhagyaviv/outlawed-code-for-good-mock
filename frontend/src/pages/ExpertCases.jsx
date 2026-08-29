import React, { useState, useEffect } from 'react';
import { Bot, CheckCircle2, FileText, ArrowLeft, Send, ShieldAlert } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Table from '../components/Table';
import StatusBadge from '../components/StatusBadge';
import Loading from '../components/Loading';
import caseService from '../services/caseService';

/**
 * Human Legal Expert Case Review Component
 * @param {Object} props
 * @param {function} props.onNavigate - navigation callback
 */
export default function ExpertCases({ onNavigate }) {
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null);

  // Form State
  const [guidanceText, setGuidanceText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    async function loadCases() {
      try {
        const all = await caseService.getCases();
        // Load cases that have expert access enabled
        setCases(all.filter(c => c.status === 'Expert Access Enabled' || c.status === 'Under Expert Review' || c.status === 'Guidance Provided'));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCases();
  }, []);

  const handleGuidanceSubmit = async (e) => {
    e.preventDefault();
    if (!guidanceText.trim()) {
      alert('Please enter your professional guidance.');
      return;
    }
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1400));
      const updated = await caseService.updateCase(selectedCase.id, {
        status: 'Guidance Provided',
        guidance: {
          ...selectedCase.guidance,
          status: 'Guidance Provided',
          expertComments: guidanceText,
          expertName: 'Dr. Priya Sharma',
          answerDate: new Date().toISOString().split('T')[0]
        }
      });
      setSelectedCase(updated);
      setCases(prev => prev.map(c => c.id === selectedCase.id ? updated : c));
      setIsSuccess(true);
    } catch (err) {
      alert('Failed to submit guidance.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { key: 'id', label: 'ID', render: (val) => <span className="font-bold text-gray-900">#{val}</span> },
    { key: 'title', label: 'Case Title', render: (val) => <span className="font-semibold text-gray-800">{val}</span> },
    { key: 'mitraName', label: 'Nyaaya Mitra' },
    { key: 'district', label: 'District' },
    { 
      key: 'priority', 
      label: 'Priority',
      render: (val) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border
          ${val === 'Urgent' ? 'bg-red-50 text-red-750 border-red-200' : 'bg-gray-50 text-gray-700 border-gray-250'}
        `}>
          {val}
        </span>
      )
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (val) => <StatusBadge status={val} /> 
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <Button
          variant="outline"
          onClick={() => {
            setSelectedCase(row);
            setGuidanceText('');
            setIsSuccess(false);
          }}
          className="!py-0.5 !px-2 text-xs border-gray-300 hover:bg-gray-50 text-gray-750 font-semibold bg-white"
        >
          Review Case
        </Button>
      )
    }
  ];

  if (isLoading) {
    return <Loading message="Loading legal advisories backlog..." />;
  }

  return (
    <div className="space-y-6">
      
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Expert Case Review</h1>
        <p className="text-xs text-gray-505">Inspect files, compare suggested references, and submit professional legal advice.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Case Review Queue */}
        <div className="md:col-span-2 space-y-4">
          <Card title="Guidance Requests Awaiting Review" subtitle="Cases approved for human guidance by district coordinators.">
            <Table
              columns={columns}
              data={cases}
              emptyTitle="No cases currently awaiting guidance"
            />
          </Card>
        </div>

        {/* Right Column: Case Details and Guidance Input Form */}
        <div>
          {selectedCase ? (
            <Card title={`Expert Advisory Desk - #${selectedCase.id}`} subtitle="Inspect file logs and submit counsel.">
              
              {isSuccess && (
                <div className="bg-green-50 border border-green-200 rounded p-3 text-green-800 space-y-1.5 mb-4 text-xs font-semibold">
                  <div className="flex items-center gap-1 font-bold">
                    <CheckCircle2 className="h-4.5 w-4.5 text-green-600 animate-bounce" />
                    ✓ Human Legal Expert Guidance Provided
                  </div>
                  <p>
                    Advice has been recorded and will display on Nyaaya Mitra Ananya Rao's timeline immediately.
                  </p>
                </div>
              )}

              <div className="space-y-4 text-xs max-h-[500px] overflow-y-auto pr-1">
                
                <div>
                  <span className="text-gray-450 uppercase text-[9px] tracking-wider font-bold">Case Summary</span>
                  <p className="p-2 bg-gray-50 border rounded text-gray-750 italic leading-relaxed mt-1">
                    "{selectedCase.clientDetails || selectedCase.situation}"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 border-t pt-2.5">
                  <div>
                    <span className="text-gray-450 block text-[9px] uppercase tracking-wider font-bold">District:</span>
                    <span className="font-bold text-gray-800">{selectedCase.district} ({selectedCase.language})</span>
                  </div>
                  <div>
                    <span className="text-gray-450 block text-[9px] uppercase tracking-wider font-bold">Nyaaya Mitra:</span>
                    <span className="font-bold text-emerald-800">{selectedCase.mitraName}</span>
                  </div>
                </div>

                {/* Evidence Docs */}
                <div className="border-t pt-2.5">
                  <span className="text-gray-450 font-bold block text-[9px] uppercase tracking-wider mb-1">Attached Documents:</span>
                  <div className="space-y-1">
                    {selectedCase.documents?.map(doc => (
                      <div key={doc.id} className="flex justify-between items-center bg-gray-50 border rounded p-1.5">
                        <span className="font-semibold text-gray-750">{doc.name}</span>
                        <a href="#" onClick={(e) => {e.preventDefault(); alert(`Viewing mock doc: ${doc.name}`);}} className="text-emerald-700 font-bold text-[9px] uppercase tracking-wider">
                          View
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Question */}
                <div className="border-t pt-2.5">
                  <span className="text-gray-450 font-bold block text-[9px] uppercase tracking-wider mb-1">Nyaaya Mitra's Question:</span>
                  <p className="p-2 bg-amber-50 border border-amber-100 rounded text-amber-900 font-semibold italic">
                    "{selectedCase.guidance?.question || 'No question details logged.'}"
                  </p>
                </div>

                {/* AI Assisted Knowledge */}
                {selectedCase.similarCases?.length > 0 && (
                  <div className="border-t pt-2.5 space-y-1.5">
                    <span className="text-gray-455 font-bold block text-[9px] uppercase tracking-wider flex items-center gap-1">
                      <Bot className="h-3.5 w-3.5 text-emerald-600" />
                      AI-Assisted Knowledge References
                    </span>
                    <div className="bg-emerald-50/50 border border-emerald-250 p-2.5 rounded text-[10px] text-emerald-850 leading-relaxed italic">
                      "Similar cases in Mandya involved RTC registry verification. Unregistered sheets have zero partition decree validity."
                    </div>
                  </div>
                )}

                {/* Submit Guidance Form */}
                {selectedCase.status === 'Expert Access Enabled' && !isSuccess && (
                  <form onSubmit={handleGuidanceSubmit} className="space-y-3 pt-3 border-t">
                    <label className="block text-xs font-bold text-gray-700">HUMAN LEGAL EXPERT GUIDANCE</label>
                    <textarea
                      rows={3}
                      className="block w-full rounded border-gray-300 text-xs focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
                      placeholder="Enter professional guidance details..."
                      value={guidanceText}
                      onChange={(e) => setGuidanceText(e.target.value)}
                    />
                    
                    <Button 
                      type="submit" 
                      isLoading={isSubmitting}
                      className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold"
                    >
                      Submit Human Guidance
                    </Button>
                  </form>
                )}

              </div>
            </Card>
          ) : (
            <Card title="Expert Case Desk">
              <div className="space-y-3 text-xs text-gray-655 leading-relaxed">
                <p>Select a case from the triage queue to view the case dossiers, Nyaaya Mitra questions, and AI-assisted background matches.</p>
                <div className="bg-gray-150 border p-2.5 rounded text-[10px] text-gray-600 flex gap-2">
                  <ShieldAlert className="h-5 w-5 text-gray-500 shrink-0 mt-0.5" />
                  <span><strong>Expert Scope:</strong> Advise on statutory rules (CPC caveat filing, partition registrations, DV Act PO escalations).</span>
                </div>
              </div>
            </Card>
          )}
        </div>

      </div>

    </div>
  );
}
