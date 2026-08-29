import React, { useState, useEffect } from 'react';
import { Search, FolderOpen, Plus } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Table from '../components/Table';
import StatusBadge from '../components/StatusBadge';
import Loading from '../components/Loading';
import caseService from '../services/caseService';

/**
 * Filterable Case List Page Component
 * @param {Object} props
 * @param {Object} props.user - logged-in user
 * @param {function} props.onNavigate - callback to navigate views
 */
export default function CaseList({ user, onNavigate }) {
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  useEffect(() => {
    async function loadCases() {
      try {
        const data = await caseService.getCases('m1');
        setCases(data);
        setFilteredCases(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCases();
  }, []);

  useEffect(() => {
    let result = [...cases];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(c => 
        c.id.includes(term) || 
        c.title.toLowerCase().includes(term) || 
        c.clientName?.toLowerCase().includes(term)
      );
    }

    if (statusFilter) {
      result = result.filter(c => c.status === statusFilter);
    }

    if (priorityFilter) {
      result = result.filter(c => c.priority === priorityFilter);
    }

    setFilteredCases(result);
  }, [searchTerm, statusFilter, priorityFilter, cases]);

  const columns = [
    { key: 'id', label: 'ID', render: (val) => <span className="font-bold text-gray-900">#{val}</span> },
    { 
      key: 'title', 
      label: 'Case Title', 
      render: (val, row) => (
        <div>
          <div className="font-semibold text-gray-900">{val}</div>
          <div className="text-[10px] text-gray-400 mt-0.5">{row.issueType}</div>
        </div>
      )
    },
    { key: 'district', label: 'District' },
    { 
      key: 'status', 
      label: 'Access Status', 
      render: (val) => <StatusBadge status={val} /> 
    },
    { 
      key: 'priority', 
      label: 'Priority',
      render: (val) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border
          ${val === 'Urgent' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-gray-50 text-gray-705 border-gray-250'}
        `}>
          {val}
        </span>
      )
    },
    { key: 'lastUpdated', label: 'Last Updated' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <Button
          variant="outline"
          onClick={() => onNavigate('cases-detail', row.id)}
          className="!py-0.5 !px-2 text-xs border-gray-300 hover:bg-gray-50 text-gray-750 font-semibold bg-white"
        >
          <FolderOpen className="h-3.5 w-3.5 mr-1 inline" />
          Details
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Registered Cases</h1>
          <p className="text-xs text-gray-505">Caseload index — OutLawed India legal-aid project.</p>
        </div>
        <Button
          onClick={() => onNavigate('cases-new')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 text-xs font-semibold shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Register New Case
        </Button>
      </div>

      <Card className="!py-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          
          <div className="relative">
            <label className="block text-xs font-bold text-gray-707 mb-1">Search Cases</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Case ID, title, client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-9 rounded border-gray-350 text-xs focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-707 mb-1">Status Filter</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full rounded border-gray-350 text-xs focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="AI Assistance">AI Assistance</option>
              <option value="Awaiting Coordinator Review">Awaiting Coordinator Review</option>
              <option value="Expert Access Enabled">Expert Access Enabled</option>
              <option value="Under Expert Review">Under Expert Review</option>
              <option value="Guidance Provided">Guidance Provided</option>
              <option value="Pending Follow-up">Pending Follow-up</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-707 mb-1">Priority Filter</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="block w-full rounded border-gray-355 text-xs focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
            >
              <option value="">All Priorities</option>
              <option value="Normal">Normal</option>
              <option value="Important">Important</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
                setPriorityFilter('');
              }}
              className="w-full text-xs font-semibold justify-center border-gray-300 bg-white text-gray-700"
            >
              Clear Filters
            </Button>
          </div>

        </div>
      </Card>

      {isLoading ? (
        <Loading message="Loading database records..." />
      ) : (
        <Card>
          <Table
            columns={columns}
            data={filteredCases}
            emptyTitle="No cases match criteria"
            emptyMessage="Clear filters or try searching for another Case ID or client name."
          />
        </Card>
      )}

    </div>
  );
}
