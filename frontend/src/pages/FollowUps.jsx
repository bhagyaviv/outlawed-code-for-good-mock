import React, { useState } from 'react';
import { Calendar, CheckCircle2, AlertCircle, Trash2, FolderOpen } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Table from '../components/Table';
import { mockCases } from '../utils/mockData';

export default function FollowUps() {
  const [cases, setCases] = useState(mockCases);

  const allTasks = cases.flatMap(c => 
    c.tasks.map(t => ({
      ...t,
      caseId: c.id,
      caseTitle: c.title,
      clientName: c.clientName,
      district: c.district
    }))
  );

  const [tasksList, setTasksList] = useState(allTasks);

  const handleToggleTask = (taskId, caseId) => {
    setTasksList(prev => 
      prev.map(t => t.id === taskId ? { ...t, done: !t.done } : t)
    );
  };

  const handleDeleteTask = (taskId) => {
    setTasksList(prev => prev.filter(t => t.id !== taskId));
  };

  const columns = [
    { key: 'caseId', label: 'Case ID', render: (val) => <span className="font-bold text-gray-900">#{val}</span> },
    { key: 'caseTitle', label: 'Dispute Title', render: (val) => <span className="font-semibold text-gray-800">{val}</span> },
    { key: 'title', label: 'Action Checklist', render: (val, row) => <span className={row.done ? 'line-through text-gray-400 font-medium' : 'font-semibold text-gray-900'}>{val}</span> },
    { key: 'date', label: 'Due Date', render: (val) => <span className="text-gray-500 font-mono text-xs">{val}</span> },
    { 
      key: 'done', 
      label: 'Checklist Status', 
      render: (val, row) => (
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={val}
            onChange={() => handleToggleTask(row.id, row.caseId)}
            className="h-4.5 w-4.5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
          />
          <span className={`text-[10px] font-bold ${val ? 'text-emerald-700' : 'text-amber-700 bg-amber-50 rounded border px-1.5 py-0.5'}`}>
            {val ? 'Action Completed' : 'Pending Action'}
          </span>
        </label>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <Button
          variant="outline"
          onClick={() => handleDeleteTask(row.id)}
          className="!py-0.5 !px-2 text-[10px] text-red-600 border-red-200 hover:bg-red-50"
        >
          <Trash2 className="h-3 w-3 inline mr-1" />
          Delete
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Field Follow-ups Calendar</h1>
        <p className="text-xs text-gray-505">Track community outreach schedules and document verification appointments.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="!p-4 text-center">
          <p className="text-[10px] font-bold text-gray-450 uppercase tracking-wider">Total Tasks</p>
          <p className="text-2xl font-black text-gray-900 mt-1">{tasksList.length}</p>
        </Card>
        <Card className="!p-4 text-center">
          <p className="text-[10px] font-bold text-gray-450 uppercase tracking-wider">Completed Tasks</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{tasksList.filter(t => t.done).length}</p>
        </Card>
        <Card className="!p-4 text-center">
          <p className="text-[10px] font-bold text-gray-450 uppercase tracking-wider">Pending Tasks</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{tasksList.filter(t => !t.done).length}</p>
        </Card>
        <Card className="!p-4 text-center">
          <p className="text-[10px] font-bold text-gray-450 uppercase tracking-wider">Overdue Actions</p>
          <p className="text-2xl font-black text-red-650 mt-1">0</p>
        </Card>
      </div>

      <Card title="Task Follow-up Registry" subtitle="Outreach actions planned by Nyaaya Mitra.">
        <Table
          columns={columns}
          data={tasksList}
          emptyTitle="No tasks scheduled"
          emptyMessage="You have completed all pending caseload outreach checklists."
        />
      </Card>

    </div>
  );
}
