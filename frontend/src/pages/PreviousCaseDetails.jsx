import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { mockPreviousCases } from '../utils/mockPreviousCases';

export default function PreviousCaseDetails({ previousCaseId, onNavigate }) {
  const [caseItem, setCaseItem] = useState(null);

  useEffect(() => {
    if (previousCaseId) {
      const match = mockPreviousCases.find(c => c.id === previousCaseId);
      setCaseItem(match);
    }
  }, [previousCaseId]);

  if (!caseItem) {
    return (
      <div className="text-center py-12">
        <p className="text-xs text-gray-500">Previous Case #{previousCaseId} could not be found.</p>
        <Button onClick={() => onNavigate('previous-cases')} className="mt-4">
          Go to Index
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="!p-1.5 bg-white border-gray-200 hover:bg-gray-50 shrink-0"
            onClick={() => onNavigate('previous-cases')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-450 font-mono text-sm tracking-wider">{caseItem.id}</span>
              <h1 className="text-lg font-bold text-gray-900">{caseItem.title}</h1>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Anonymized Case Dossier — Previous Resolved Registry</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-250 leading-none">
            ⚠️ Anonymized Case Record
          </div>
          <span className="text-[9px] text-gray-400 font-semibold italic">Demo / Mock Organizational Data</span>
        </div>
      </div>

      {/* Roster Metadata Summary */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="!p-3 text-center shadow-sm">
          <span className="text-[9px] font-bold text-gray-455 block uppercase tracking-wider">Status</span>
          <span className="text-xs font-black text-emerald-800 mt-1 block">✓ {caseItem.outcome}</span>
        </Card>
        <Card className="!p-3 text-center shadow-sm">
          <span className="text-[9px] font-bold text-gray-455 block uppercase tracking-wider">Issue</span>
          <span className="text-xs font-black text-gray-900 mt-1 block truncate">{caseItem.issueType}</span>
        </Card>
        <Card className="!p-3 text-center shadow-sm">
          <span className="text-[9px] font-bold text-gray-455 block uppercase tracking-wider">District</span>
          <span className="text-xs font-black text-gray-900 mt-1 block">{caseItem.district} ({caseItem.state || 'Karnataka'})</span>
        </Card>
        <Card className="!p-3 text-center shadow-sm">
          <span className="text-[9px] font-bold text-gray-455 block uppercase tracking-wider">Year</span>
          <span className="text-xs font-black text-gray-900 mt-1 block">{caseItem.year}</span>
        </Card>
        <Card className="!p-3 text-center shadow-sm">
          <span className="text-[9px] font-bold text-gray-455 block uppercase tracking-wider">Language</span>
          <span className="text-xs font-black text-gray-900 mt-1 block">{caseItem.language}</span>
        </Card>
        <Card className="!p-3 text-center shadow-sm">
          <span className="text-[9px] font-bold text-gray-455 block uppercase tracking-wider">Priority</span>
          <span className="text-xs font-black text-blue-900 mt-1 block">{caseItem.priority}</span>
        </Card>
      </div>

      {/* Main Grid details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Case Text */}
        <div className="md:col-span-2 space-y-6">
          
          <Card title="PROBLEM STATEMENT">
            <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 border p-3 rounded">
              {caseItem.problem}
            </p>
          </Card>

          <Card title="ACTIONS TAKEN">
            <ol className="list-decimal pl-5 space-y-2 text-xs text-gray-700">
              {caseItem.actionsTaken?.map((act, index) => (
                <li key={index} className="font-semibold text-gray-800">
                  {act}
                </li>
              ))}
              {(!caseItem.actionsTaken || caseItem.actionsTaken.length === 0) && (
                <>
                  <li>Case information collected</li>
                  <li>Relevant documents reviewed</li>
                  <li>Organizational knowledge searched</li>
                  <li>Similar cases reviewed</li>
                  <li>Follow-up completed</li>
                </>
              )}
            </ol>
          </Card>

          <Card title="RESOLUTION SUMMARY">
            <p className="text-xs text-gray-705 leading-relaxed bg-emerald-50/50 border border-emerald-100 p-3 rounded font-semibold text-emerald-950">
              {caseItem.resolutionSummary || 'Required documentation was collected and resolved through the standard organizational process.'}
            </p>
          </Card>

          <Card title="LESSONS LEARNED">
            <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 border p-3 rounded font-semibold">
              {caseItem.lessonsLearned || 'Early collection of records helped mitigate process delays.'}
            </p>
          </Card>

        </div>

        {/* Right Column: Knowledge and references */}
        <div className="space-y-6">
          
          <Card title="ORGANIZATIONAL KNOWLEDGE USED">
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white border rounded-lg flex items-start gap-2 shadow-sm">
                <span className="text-base">💡</span>
                <div>
                  <span className="font-bold text-gray-900 block">Documentation Method:</span>
                  <span className="text-gray-650 mt-0.5 block">{caseItem.knowledgeUsed || 'Previous documentation case files.'}</span>
                </div>
              </div>
            </div>
          </Card>

          <Card title="RELEVANT DOCUMENTS">
            <div className="space-y-2 text-xs">
              {caseItem.documents?.map((doc, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 border rounded">
                  <FileText className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-gray-800 truncate">{doc}</span>
                </div>
              ))}
              {(!caseItem.documents || caseItem.documents.length === 0) && (
                <p className="text-[10px] text-gray-450 text-center italic">No documents attached.</p>
              )}
            </div>
          </Card>

          <Card title="TAGS">
            <div className="flex flex-wrap gap-1.5">
              {caseItem.tags?.map((t, idx) => (
                <span key={idx} className="bg-gray-100 border text-gray-800 px-2 py-0.5 rounded text-[10px] font-bold">
                  {t}
                </span>
              ))}
            </div>
          </Card>

          <div className="bg-gray-100 border rounded-lg p-3 text-xs text-gray-600 flex gap-2">
            <ShieldAlert className="h-5 w-5 text-gray-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-gray-900">Anonymization Statement</span>
              <p className="leading-relaxed mt-0.5 text-[10px]">
                This dossier belongs to previous legal-aid work. Client names and address credentials have been completely stripped for protection compliance.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
