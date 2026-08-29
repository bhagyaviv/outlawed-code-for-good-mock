import React, { useState, useEffect } from 'react';
import { Shield, Eye, CheckCircle2, Info, ArrowLeft, Bot, FileText, Clock } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Table from '../components/Table';
import StatusBadge from '../components/StatusBadge';
import Loading from '../components/Loading';
import caseService from '../services/caseService';

/**
 * Coordinator Expert Access Requests Triage Component
 * @param {Object} props
 * @param {function} props.onNavigate - navigation callback
 */
export default function CoordinatorRequests({ onNavigate }) {
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null);
  const [triageStatus, setTriageStatus] = useState('idle'); // idle | success

  useEffect(() => {
    async function loadRequests() {
      try {
        const all = await caseService.getCases();
        // Filter cases that have requested expert guidance
        setCases(all.filter(c => c.guidance?.requested));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadRequests();
  }, []);

  const handleEnableAccess = async (caseId) => {
    setTriageStatus('loading');
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      const updated = await caseService.updateCase(caseId, {
        status: 'Expert Access Enabled',
        guidance: {
          ...selectedCase.guidance,
          status: 'Expert Access Enabled',
          expertName: 'Dr. Priya Sharma'
        }
      });
      setSelectedCase(updated);
      setCases(prev => prev.map(c => c.id === caseId ? updated : c));
      setTriageStatus('success');
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const columns = [
    { key: 'id', label: 'ID', render: (val) => <span className="font-bold text-gray-900">#{val}</span> },
    { key: 'title', label: 'Dispute Title', render: (val) => <span className="font-semibold text-gray-800">{val}</span> },
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
      label: 'Triage Status', 
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
            setTriageStatus('idle');
          }}
          className="!py-0.5 !px-2 text-xs border-gray-300 hover:bg-gray-50 text-gray-750 font-semibold bg-white"
        >
          <Eye className="h-3.5 w-3.5 mr-1 inline" />
          View Request
        </Button>
      )
    }
  ];

  if (isLoading) {
    return <Loading message="Loading expert access queues..." />;
  }

  return (
    <div className="space-y-6">
      
      <div className="border-b pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Human Expert Requests</h1>
          <p className="text-xs text-gray-505">Review field worker queries and enable expert security clearance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Triage Table */}
        <div className="md:col-span-2 space-y-4">
          <Card title="Guidance Requests Waiting Triage" subtitle="Approve or review pending case escalations.">
            <Table
              columns={columns}
              data={cases}
              emptyTitle="No pending requests"
            />
          </Card>
        </div>

        {/* Right Column: Request details / Actions */}
        <div>
          {selectedCase ? (
            <Card title={`Review Request - Case #${selectedCase.id}`} subtitle=" Triage access credentials.">
              
              {triageStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 rounded p-3 text-green-800 space-y-1.5 mb-4 text-xs font-semibold">
                  <div className="flex items-center gap-1 font-bold">
                    <CheckCircle2 className="h-4.5 w-4.5 text-green-600 animate-bounce" />
                    Human Expert Access Enabled
                  </div>
                  <p>
                    Case #{selectedCase.id} has been made available to Dr. Priya Sharma for review.
                  </p>
                </div>
              )}

              <div className="space-y-4 text-xs">
                
                <div className="grid grid-cols-2 gap-2 bg-gray-50 p-2.5 rounded border">
                  <div>
                    <span className="text-gray-450 block text-[9px] uppercase tracking-wider font-bold">Nyaaya Mitra:</span>
                    <span className="font-bold text-gray-800">{selectedCase.mitraName}</span>
                  </div>
                  <div>
                    <span className="text-gray-455 block text-[9px] uppercase tracking-wider font-bold">District Scope:</span>
                    <span className="font-semibold text-gray-800">{selectedCase.district}</span>
                  </div>
                </div>

                <div className="border-b pb-2">
                  <span className="text-gray-450 font-bold block text-[9px] uppercase tracking-wider mb-1">What was already tried:</span>
                  <div className="space-y-1 text-gray-700 font-semibold">
                    <div>✓ Asked AI Assistant</div>
                    <div>✓ Searched Knowledge Base</div>
                    <div>✓ Reviewed Similar Cases</div>
                    <div>✓ Reviewed Suggested Resources</div>
                  </div>
                </div>

                <div className="border-b pb-2">
                  <span className="text-gray-450 font-bold block text-[9px] uppercase tracking-wider mb-1">Why expert support is requested:</span>
                  <p className="p-2 bg-amber-50 border border-amber-100 rounded italic text-amber-900 font-medium">
                    "{selectedCase.guidance.unresolvedSummary || selectedCase.guidance.question}"
                  </p>
                </div>

                {/* Case File details link */}
                <div className="bg-gray-50 p-2 rounded border flex items-center justify-between">
                  <span className="font-semibold text-gray-600">Inspect Case dossier details:</span>
                  <Button 
                    variant="outline" 
                    onClick={() => alert(`Reviewing documents: Property and family files.`)}
                    className="!py-0.5 !px-2 text-[10px] bg-white border-gray-250 font-semibold"
                  >
                    View Case Dossier
                  </Button>
                </div>

                {/* Action Controls */}
                {selectedCase.status === 'Awaiting Coordinator Review' && triageStatus !== 'success' && (
                  <div className="space-y-2 pt-2 border-t">
                    <Button
                      onClick={() => handleEnableAccess(selectedCase.id)}
                      isLoading={triageStatus === 'loading'}
                      className="w-full justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                    >
                      Enable Human Legal Expert Access
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => alert('Information request notification sent to Nyaaya Mitra.')}
                        className="text-[10px] !py-1.5 justify-center font-bold bg-white text-gray-750"
                      >
                        Request More Info
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => alert('Support guidance marked as continued.')}
                        className="text-[10px] !py-1.5 justify-center font-bold bg-white text-gray-750"
                      >
                        Continue existing support
                      </Button>
                    </div>
                  </div>
                )}

              </div>
            </Card>
          ) : (
            <Card title="Triage Instructions">
              <div className="space-y-3 text-xs text-gray-650 leading-relaxed">
                <p>Select an escalation file from the list to review the Mitra's requested details, documents check, and context parameters.</p>
                <div className="bg-gray-150 border p-2.5 rounded text-[10px] text-gray-600 flex gap-2">
                  <Info className="h-5 w-5 text-gray-500 shrink-0 mt-0.5" />
                  <span><strong>Triage Mandate:</strong> Coordinators facilitate expert clearance allocations only. Do not type legal advice comments.</span>
                </div>
              </div>
            </Card>
          )}
        </div>

      </div>

    </div>
  );
}
