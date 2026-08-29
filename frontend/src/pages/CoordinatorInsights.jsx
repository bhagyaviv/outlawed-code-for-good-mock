import React from 'react';
import { TrendingUp, BarChart2, AlertCircle, Info } from 'lucide-react';
import Card from '../components/Card';
import { mockInsights } from '../utils/mockData';

export default function CoordinatorInsights() {
  return (
    <div className="space-y-6">
      
      <div className="border-b pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Community Legal Insights</h1>
          <p className="text-xs text-gray-550">Aggregated district trends and common legal disputes. Personal identities are masked.</p>
        </div>
        <div className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-250">
          ⚠️ Mock Demonstration Data
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Column: Common Issues Bar chart representation */}
        <Card title="Most Common Legal Issues" subtitle="Cumulative count of logged dispute categories.">
          <div className="space-y-4 pt-2">
            {mockInsights.issueDistributions.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-gray-700">
                  <span>{item.name}</span>
                  <span className="font-bold">{item.count} cases</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className="bg-emerald-600 h-2 rounded-full" 
                    style={{ width: `${(item.count / 42) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Right Column: District Trends Alerts */}
        <Card title="District Caseload Trends" subtitle="Outstanding alerts across Karnataka regions.">
          <div className="space-y-3">
            {mockInsights.trends.map((item, idx) => (
              <div key={idx} className="p-3 bg-gray-50 border rounded-lg text-xs space-y-1.5 hover:border-emerald-300 transition-colors">
                <div className="flex justify-between font-bold text-gray-900">
                  <span>📍 {item.district} District</span>
                  <span className="text-emerald-700">{item.cases} Active Cases</span>
                </div>
                <p className="text-gray-600 leading-relaxed font-semibold">"{item.alert}"</p>
              </div>
            ))}
          </div>
        </Card>

      </div>

      {/* Privacy Notice Banner */}
      <div className="bg-gray-100 border rounded-lg p-4 text-xs text-gray-600 flex gap-2">
        <Info className="h-5 w-5 text-gray-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-gray-900">🔒 Data Privacy Mandate</span>
          <p className="leading-relaxed mt-1">
            Aggregated trends are generated using anonymized case tags. Client names, contact phone logs, and document references are stripped in analytics databases.
          </p>
        </div>
      </div>

    </div>
  );
}
