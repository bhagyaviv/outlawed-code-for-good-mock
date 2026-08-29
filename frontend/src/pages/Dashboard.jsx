import React, { useState } from 'react';
import { 
  Users, 
  Folder, 
  TrendingUp, 
  Activity, 
  PlusCircle, 
  FileText, 
  Database,
  Eye,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Table from '../components/Table';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { mockCases } from '../utils/mockData';

/**
 * Redesigned Nyaaya Mitra Dashboard (Phase 1)
 * @param {Object} props
 * @param {Object} props.user - current logged in user metadata
 * @param {function} props.onNavigate - navigation callback
 */
export default function Dashboard({ user = { name: 'Ananya Rao' }, onNavigate }) {
  const [tableData, setTableData] = useState(mockCases);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Form States (Demo Case Logging)
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCategory, setFormCategory] = useState('Land / Property');
  const [formErrors, setFormErrors] = useState({});
  const [formStatus, setFormStatus] = useState('idle');

  // Statistics cards showing legal-aid activity
  const stats = [
    { label: 'Active Cases', value: '3', icon: Folder, desc: 'Cases currently open', color: 'text-blue-600 bg-blue-50 border-blue-100' },
    { label: 'Awaiting Expert', value: '1', icon: Users, desc: 'Case #1056 submitted', color: 'text-amber-600 bg-amber-50 border-amber-100' },
    { label: 'Resolved Disputes', value: '1', icon: CheckCircle2, desc: 'Case #1038 resolved', color: 'text-green-600 bg-green-50 border-green-100' },
    { label: 'Pending Follow-ups', value: '2', icon: Activity, desc: 'Outreach tasks remaining', color: 'text-indigo-650 bg-indigo-50 border-indigo-100' },
  ];

  const validateForm = () => {
    const tempErrors = {};
    if (!formName.trim()) tempErrors.name = 'Case Title is required';
    if (!formDesc.trim()) tempErrors.desc = 'Dispute description is required';
    setFormErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setFormStatus('loading');
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newRecord = {
        id: String(1000 + tableData.length + 72),
        title: formName,
        issueType: formCategory,
        district: 'Mandya',
        status: 'Active',
        priority: 'Normal',
        situation: formDesc,
        lastUpdated: new Date().toISOString().split('T')[0],
        followUpDate: new Date().toISOString().split('T')[0],
        notes: [],
        timeline: [{ date: new Date().toISOString().split('T')[0], title: 'Case Filed', description: 'Intake logged.', user: user.name }]
      };
      setTableData([newRecord, ...tableData]);
      setFormStatus('success');
      setFormName('');
      setFormDesc('');
    } catch (err) {
      setFormStatus('error');
    }
  };

  const handleOpenDetails = (record) => {
    setSelectedRecord(record);
    setIsDetailsModalOpen(true);
  };

  const columns = [
    { key: 'id', label: 'ID', render: (val) => <span className="font-bold text-gray-900">#{val}</span> },
    { 
      key: 'title', 
      label: 'Dispute Title', 
      render: (val, row) => (
        <div>
          <div className="font-semibold text-gray-900">{val || row.title}</div>
          <div className="text-[9px] text-gray-400 mt-0.5">{row.issueType}</div>
        </div>
      )
    },
    { key: 'district', label: 'District' },
    { 
      key: 'status', 
      label: 'Status',
      render: (status) => <StatusBadge status={status} />
    },
    { 
      key: 'priority', 
      label: 'Priority',
      render: (val) => (
        <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold border
          ${val === 'Urgent' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-gray-50 text-gray-700 border-gray-250'}
        `}>
          {val}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="!px-2 !py-0.5 text-[10px] flex items-center gap-1 border-gray-250 bg-white"
            onClick={() => handleOpenDetails(row)}
          >
            <Eye className="h-3 w-3" />
            Inspect
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Good morning, {user.name} 👋
          </h1>
          <p className="text-xs text-gray-500">
            Grassroots Legal-Aid Workspace — Mandya caseload monitor.
          </p>
        </div>
        <div className="text-xs font-semibold text-gray-450 bg-white border border-gray-250 px-3 py-1.5 rounded shadow-sm">
          📍 Role: Nyaaya Mitra (Doer)
        </div>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="!px-4 !py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-450 uppercase tracking-wider">{stat.label}</p>
                  <p className="mt-1.5 text-2xl font-black text-gray-900 leading-none">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg border ${stat.color}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
              </div>
              <p className="text-[9px] text-gray-400 mt-2 font-medium">{stat.desc}</p>
            </Card>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Left Column: Form & Table */}
        <div className="xl:col-span-2 space-y-6">
          
          <Card title="Register Case Record" subtitle="Logs new field disputes. Uses local mockup states for review.">
            {formStatus === 'success' && (
              <div className="mb-4 rounded bg-green-50 p-3 border border-green-200 text-xs font-semibold text-green-800">
                ✓ Case record registered. Added to caseload table below.
              </div>
            )}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Dispute brief title"
                  id="case-name"
                  placeholder="e.g. Agricultural boundary encroached"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  error={formErrors.name}
                />
                <Select
                  label="Issue Category"
                  id="case-category"
                  options={['Land / Property', 'Domestic Violence', 'Employment', 'Documentation', 'Family']}
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Detailed Situation Statement</label>
                <textarea
                  rows={2}
                  placeholder="Summarize the client dispute details..."
                  className="block w-full rounded border-gray-300 text-xs focus:ring-emerald-500 focus:border-emerald-500"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                />
                {formErrors.desc && <p className="text-red-600 text-xs font-bold mt-1">{formErrors.desc}</p>}
              </div>
              <div className="flex justify-end gap-2 text-xs">
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                  File Case Intake
                </Button>
              </div>
            </form>
          </Card>

          <Card title="Caseload Registry Table" subtitle="List of open or completed field files.">
            <Table
              columns={columns}
              data={tableData}
              emptyTitle="No records found"
            />
          </Card>

        </div>

        {/* Right Column: Information Visuals */}
        <div className="space-y-6">
          <Card title="Quick Actions">
            <div className="grid grid-cols-1 gap-2.5">
              <Button
                variant="outline"
                className="w-full justify-start text-[11px] font-bold border-gray-250 bg-white"
                onClick={() => {
                  if (onNavigate) onNavigate('ai-assistant');
                }}
              >
                🤖 Ask AI Assistant
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-[11px] font-bold border-gray-250 bg-white"
                onClick={() => {
                  if (onNavigate) onNavigate('knowledge');
                }}
              >
                🔍 Search citations
              </Button>
            </div>
          </Card>

          <Card title="Role Clarification">
            <div className="space-y-3 text-xs text-gray-650 leading-relaxed">
              <div className="flex gap-2 items-start border-b pb-2.5">
                <span className="text-base shrink-0 mt-0.5">🤖</span>
                <div>
                  <span className="font-bold text-gray-900 block">AI Assistant</span>
                  "Helps discover and understand organizational knowledge. AI is NOT the Legal Expert."
                </div>
              </div>
              <div className="flex gap-2 items-start border-b pb-2.5">
                <span className="text-base shrink-0 mt-0.5">👨‍⚖️</span>
                <div>
                  <span className="font-bold text-gray-900 block">Human Legal Expert</span>
                  "Provides professional human guidance when AI and resources are insufficient."
                </div>
              </div>
              <div className="flex gap-2 items-start">
                <span className="text-base shrink-0 mt-0.5">📊</span>
                <div>
                  <span className="font-bold text-gray-900 block">Coordinator</span>
                  "Monitors cases, requests, and progress. Facilitates expert access review."
                </div>
              </div>
            </div>
          </Card>

          <Card title="Previous Cases" subtitle="50 Resolved Cases">
            <div className="space-y-2 text-xs">
              <div className="p-2 bg-gray-50 border rounded font-semibold text-gray-800">
                <span className="font-bold text-gray-400 block text-[9px]">PC-001</span>
                Agricultural Land Inheritance
              </div>
              <div className="p-2 bg-gray-50 border rounded font-semibold text-gray-800">
                <span className="font-bold text-gray-400 block text-[9px]">PC-002</span>
                Property Boundary Dispute
              </div>
              <div className="p-2 bg-gray-50 border rounded font-semibold text-gray-800">
                <span className="font-bold text-gray-400 block text-[9px]">PC-003</span>
                Government Scheme Documentation
              </div>
              <Button
                variant="outline"
                className="w-full text-center justify-center font-bold text-emerald-705 bg-white border-gray-300 mt-2 hover:bg-emerald-50"
                onClick={() => {
                  if (onNavigate) onNavigate('previous-cases');
                }}
              >
                View Previous Cases
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Inspect Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Case Dossier Details"
        footer={<Button onClick={() => setIsDetailsModalOpen(false)}>Close Dossier</Button>}
      >
        {selectedRecord ? (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-3 border-b pb-2">
              <span className="font-bold text-gray-500">Case ID:</span>
              <span className="font-bold text-gray-900 col-span-2">#{selectedRecord.id}</span>
            </div>
            <div className="grid grid-cols-3 border-b pb-2">
              <span className="font-bold text-gray-500">Title:</span>
              <span className="font-bold text-gray-900 col-span-2">{selectedRecord.title}</span>
            </div>
            <div className="grid grid-cols-3 border-b pb-2">
              <span className="font-bold text-gray-500">District:</span>
              <span className="text-gray-800 col-span-2">{selectedRecord.district}</span>
            </div>
            <div className="grid grid-cols-3 border-b pb-2">
              <span className="font-bold text-gray-500">Language:</span>
              <span className="text-gray-800 col-span-2">{selectedRecord.language || 'Kannada'}</span>
            </div>
            <div className="grid grid-cols-3 border-b pb-2">
              <span className="font-bold text-gray-500">Status:</span>
              <div className="col-span-2">
                <StatusBadge status={selectedRecord.status} />
              </div>
            </div>
            <div className="pt-2">
              <span className="font-bold text-gray-500 block mb-1">Situation description:</span>
              <p className="p-2 bg-gray-50 rounded border italic text-gray-700">"{selectedRecord.situation}"</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-550">No case selected.</p>
        )}
      </Modal>
    </div>
  );
}
