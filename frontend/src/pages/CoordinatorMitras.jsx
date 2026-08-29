import React, { useState } from 'react';
import { Users, FileText, ArrowLeft, Activity, Info, Calendar } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Table from '../components/Table';
import { mockNyaayaMitras, mockActivities } from '../utils/mockData';

export default function CoordinatorMitras() {
  const [mitras, setMitras] = useState(mockNyaayaMitras);
  const [selectedMitra, setSelectedMitra] = useState(null);

  const columns = [
    { key: 'name', label: 'Name', render: (val) => <span className="font-bold text-gray-900">{val}</span> },
    { key: 'district', label: 'District' },
    { key: 'joinedDate', label: 'Joined Date' },
    { key: 'activeCases', label: 'Active Cases', render: (val) => <span className="font-semibold text-gray-900">{val}</span> },
    { key: 'completedCases', label: 'Completed Cases', render: (val) => <span className="font-semibold text-gray-900">{val}</span> },
    { key: 'pendingFollowUps', label: 'Pending Follow-ups', render: (val) => <span className="font-semibold text-gray-900">{val}</span> },
    { 
      key: 'status', 
      label: 'Status', 
      render: (val) => (
        <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold border border-green-200">
          {val}
        </span>
      ) 
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <Button
          variant="outline"
          onClick={() => setSelectedMitra(row)}
          className="!py-0.5 !px-2 text-xs border-gray-300 hover:bg-gray-50 text-gray-750 font-semibold bg-white"
        >
          Inspect profile
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Nyaaya Mitra Team Directory</h1>
        <p className="text-xs text-gray-505">Monitor district field worker caseload workloads and recent activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Team Directory List */}
        <div className="md:col-span-2 space-y-4">
          <Card title="Grassroots Field Workers" subtitle="Kaseload monitors for active team members.">
            <Table
              columns={columns}
              data={mitras}
              emptyTitle="No Nyaaya Mitras registered"
            />
          </Card>
        </div>

        {/* Right Column: Profile details */}
        <div>
          {selectedMitra ? (
            <Card title={`Caseload Profile - ${selectedMitra.name}`} subtitle="Mitra overview and recent logs.">
              <div className="space-y-4 text-xs">
                
                <div className="grid grid-cols-2 gap-3 border-b pb-3.5">
                  <div className="bg-gray-50 p-2 rounded border text-center">
                    <span className="text-[10px] text-gray-450 block font-bold uppercase tracking-wider">Active</span>
                    <span className="text-2xl font-black text-gray-900">{selectedMitra.activeCases}</span>
                  </div>
                  <div className="bg-gray-50 p-2 rounded border text-center">
                    <span className="text-[10px] text-gray-450 block font-bold uppercase tracking-wider">Completed</span>
                    <span className="text-2xl font-black text-gray-900">{selectedMitra.completedCases}</span>
                  </div>
                </div>

                <div className="space-y-2 border-b pb-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-450 font-bold">Email address:</span>
                    <span className="text-gray-800 font-mono">{selectedMitra.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-455 font-bold">District scope:</span>
                    <span className="text-gray-800">{selectedMitra.district}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-455 font-bold">Pending follow-ups:</span>
                    <span className="text-gray-900 font-semibold">{selectedMitra.pendingFollowUps} due</span>
                  </div>
                </div>

                {/* Recent Activities list */}
                <div>
                  <span className="text-gray-455 font-bold block text-[10px] uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Activity className="h-3.5 w-3.5 text-gray-400" />
                    Recent Activity Logs
                  </span>
                  
                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                    {mockActivities.filter(act => act.user.includes(selectedMitra.name.split(' ')[0])).map((act, idx) => (
                      <div key={idx} className="p-2 bg-gray-50 border rounded text-xs leading-normal">
                        <span className="font-semibold text-gray-900">{act.action}</span>
                        <div className="flex justify-between text-[9px] text-gray-400 mt-1 font-bold">
                          <span>{act.time}</span>
                          <span>District: {act.district}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedMitra(null)}
                    className="w-full text-center justify-center font-bold bg-white text-gray-700 border-gray-300"
                  >
                    Clear Selection
                  </Button>
                </div>

              </div>
            </Card>
          ) : (
            <Card title="Mitra Profile Instructions">
              <div className="space-y-3 text-xs text-gray-655 leading-relaxed">
                <p>Click "Inspect profile" on any field worker to inspect email, district parameters, pending schedules, and recent caseload activities.</p>
                <div className="bg-gray-150 border p-2.5 rounded text-[10px] text-gray-600 flex gap-1.5">
                  <Info className="h-4.5 w-4.5 text-gray-500 shrink-0 mt-0.5" />
                  <span>Activity logs are audited continuously to identify support needs.</span>
                </div>
              </div>
            </Card>
          )}
        </div>

      </div>

    </div>
  );
}
