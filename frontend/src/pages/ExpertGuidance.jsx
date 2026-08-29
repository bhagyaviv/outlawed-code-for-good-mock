import React, { useState } from 'react';
import { HelpCircle, Scale, MessageSquare, AlertCircle, FileText, ArrowRight } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Table from '../components/Table';
import StatusBadge from '../components/StatusBadge';
import { mockCases } from '../utils/mockData';

export default function ExpertGuidance({ onNavigate }) {
  const [cases, setCases] = useState(mockCases.filter(c => c.guidance?.requested));
  const [selectedGuidance, setSelectedGuidance] = useState(null);

  const columns = [
    { key: 'id', label: 'Case ID', render: (val) => <span className="font-bold text-gray-900">#{val}</span> },
    { key: 'title', label: 'Dispute Title', render: (val) => <span className="font-semibold text-gray-800">{val}</span> },
    { key: 'district', label: 'District' },
    { 
      key: 'guidanceStatus', 
      label: 'Request Status', 
      render: (_, row) => <StatusBadge status={row.status} /> 
    },
    { 
      key: 'expertName', 
      label: 'Assigned Expert', 
      render: (_, row) => <span className="font-bold text-gray-800">{row.guidance.expertName || 'Not Assigned Yet'}</span> 
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <Button
          variant="outline"
          onClick={() => setSelectedGuidance(row)}
          className="!py-0.5 !px-2 text-xs border-gray-300 hover:bg-gray-50 text-gray-750 font-semibold bg-white"
        >
          View guidance
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Senior Human Expert Guidance</h1>
        <p className="text-xs text-gray-505">Track case review files escalated to senior legal advisors.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: List of Guidance Requests */}
        <div className="md:col-span-2 space-y-4">
          <Card title="Expert Guidance Queue" subtitle="Logs of cases forwarded for human legal advice.">
            <Table
              columns={columns}
              data={cases}
              emptyTitle="No guidance requests filed"
              emptyMessage="Cases resolve through AI Assistant matching by default."
            />
          </Card>
        </div>

        {/* Right Column: Display Selected Guidance details */}
        <div>
          {selectedGuidance ? (
            <Card title={`Case Advice Details - #${selectedGuidance.id}`} subtitle="Review expert advisory sheet.">
              <div className="space-y-4 text-xs">
                
                <div className="border-b pb-2">
                  <span className="font-semibold text-gray-450 uppercase text-[9px] tracking-wider block">Mitra Question:</span>
                  <p className="font-bold text-gray-800 mt-1 italic">"{selectedGuidance.guidance.question}"</p>
                </div>

                <div>
                  <span className="font-semibold text-gray-450 uppercase text-[9px] tracking-wider block">Assigned Advisor:</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-base">👨‍⚖️</span>
                    <span className="font-bold text-gray-900">{selectedGuidance.guidance.expertName || 'Coordinator Review Pending'}</span>
                  </div>
                </div>

                {selectedGuidance.status === 'Guidance Provided' || selectedGuidance.guidance.expertComments ? (
                  <div className="bg-blue-50 border border-blue-200 rounded p-3 text-blue-900 space-y-2">
                    <div className="font-bold flex items-center gap-1">
                      <MessageSquare className="h-4 w-4 text-blue-700" />
                      Human Expert Advice Received:
                    </div>
                    <p className="leading-relaxed font-semibold">
                      {selectedGuidance.guidance.expertComments || 
                        "A compulsory partition deed is required under Karnataka Registration Rules. Advise client to file an immediate Caveat Petition (Form Sec 148A CPC) in local civil court to block sibling ex-parte injunctions. Collect RTC copy from Tehsildar office."}
                    </p>
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 rounded p-3 text-amber-800 flex gap-2 items-start">
                    <AlertCircle className="h-4.5 w-4.5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Awaiting Human Response</span>
                      <p className="text-[10px] text-amber-750 leading-relaxed mt-0.5">
                        This request is currently queued for {selectedGuidance.guidance.expertName || 'coordinator assignment review'}. You will receive an alert once human comments are saved.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      if (onNavigate) onNavigate('cases-detail', selectedGuidance.id);
                    }}
                    className="w-full text-center justify-center font-bold bg-white text-gray-700 border-gray-300"
                  >
                    Open Dossier
                  </Button>
                </div>

              </div>
            </Card>
          ) : (
            <Card title="Advisory Triage Instructions">
              <div className="space-y-3 text-xs text-gray-650 leading-relaxed">
                <p>Select a case request from the queue table on the left to inspect detailed comments, priority levels, and assigned advisors.</p>
                <div className="bg-gray-150 border p-2.5 rounded text-[10px] text-gray-600">
                  ⚠️ <strong>Advisory Mandate:</strong> Guidance stored in this tab is created by authorized human guides. Follow organizational SOPs for court representation.
                </div>
              </div>
            </Card>
          )}
        </div>

      </div>

    </div>
  );
}
