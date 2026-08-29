import React, { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, AlertCircle, Eye, ArrowUpDown } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Select from '../components/Select';
import { mockPreviousCases } from '../utils/mockPreviousCases';
import apiClient from '../services/api';

export default function PreviousCases({ onNavigate }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [issueFilter, setIssueFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [langFilter, setLangFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  
  const [sortBy, setSortBy] = useState('Most Recent');
  const [allCases, setAllCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreviousCases = async () => {
      try {
        const response = await apiClient.get('/previous-cases');
        const transformed = response.data.map(c => ({
          ...c,
          actionsTaken: typeof c.actionsTaken === 'string' ? c.actionsTaken.split(',') : (c.actionsTaken || []),
          documents: typeof c.documents === 'string' ? c.documents.split(',') : (c.documents || []),
          tags: typeof c.tags === 'string' ? c.tags.split(',') : (c.tags || [])
        }));
        setAllCases(transformed);
        setFilteredCases(transformed);
      } catch (err) {
        console.warn('Failed to fetch from Spring Boot, falling back to local dataset:', err);
        setAllCases(mockPreviousCases);
        setFilteredCases(mockPreviousCases);
      } finally {
        setLoading(false);
      }
    };
    fetchPreviousCases();
  }, []);

  useEffect(() => {
    // Apply filters and search query
    let result = [...allCases];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(c => 
        c.id.toLowerCase().includes(term) ||
        c.title.toLowerCase().includes(term) ||
        c.issueType.toLowerCase().includes(term) ||
        c.district.toLowerCase().includes(term) ||
        c.language.toLowerCase().includes(term) ||
        c.problem.toLowerCase().includes(term) ||
        c.resolutionSummary.toLowerCase().includes(term) ||
        c.lessonsLearned?.toLowerCase().includes(term) ||
        c.tags.some(t => t.toLowerCase().includes(term))
      );
    }

    if (issueFilter) {
      result = result.filter(c => c.issueType === issueFilter);
    }

    if (districtFilter) {
      result = result.filter(c => c.district === districtFilter);
    }

    if (langFilter) {
      result = result.filter(c => c.language === langFilter);
    }

    if (yearFilter) {
      result = result.filter(c => c.year === parseInt(yearFilter, 10));
    }

    if (outcomeFilter) {
      result = result.filter(c => c.outcome === outcomeFilter);
    }

    if (priorityFilter) {
      result = result.filter(c => c.priority === priorityFilter);
    }

    // Apply Sorting
    if (sortBy === 'Most Recent') {
      result.sort((a, b) => b.year - a.year);
    } else if (sortBy === 'Oldest') {
      result.sort((a, b) => a.year - b.year);
    } else if (sortBy === 'Priority') {
      const priorityWeights = { Urgent: 3, Important: 2, Normal: 1 };
      result.sort((a, b) => (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0));
    } else if (sortBy === 'Issue Type') {
      result.sort((a, b) => a.issueType.localeCompare(b.issueType));
    }

    setFilteredCases(result);
  }, [searchTerm, issueFilter, districtFilter, langFilter, yearFilter, outcomeFilter, priorityFilter, sortBy]);

  // Initializing presets if any (e.g. from case details routing)
  useEffect(() => {
    // Check if window has a preset search query
    const preset = window.localStorage.getItem('outlawed_prev_cases_preset');
    if (preset) {
      const parsed = JSON.parse(preset);
      if (parsed.search) setSearchTerm(parsed.search);
      if (parsed.issue) setIssueFilter(parsed.issue);
      window.localStorage.removeItem('outlawed_prev_cases_preset');
    }
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Page Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">View Previous Cases</h1>
          <p className="text-xs text-gray-505">Explore resolved cases and organizational knowledge from previous legal-aid work.</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-250 leading-none">
            ⚠️ Demo / Mock Organizational Data
          </div>
          <span className="text-[10px] text-gray-400 font-semibold italic">Anonymized Case Records</span>
        </div>
      </div>

      {/* Categories Summary Widget */}
      <Card title="Resolved Case Knowledge Statistics" subtitle="Aggregated organizational resolved counts.">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 pt-2">
          <div className="p-2.5 bg-gray-50 border rounded-lg text-center shadow-inner">
            <p className="text-[9px] font-bold text-gray-450 uppercase tracking-wider">Total Resolved</p>
            <p className="text-xl font-black text-gray-900 mt-1 leading-none">50</p>
          </div>
          <div className="p-2.5 bg-emerald-50/50 border border-emerald-100 rounded-lg text-center">
            <p className="text-[9px] font-bold text-emerald-800 uppercase tracking-wider">Land / Property</p>
            <p className="text-xl font-black text-emerald-900 mt-1 leading-none">12</p>
          </div>
          <div className="p-2.5 bg-gray-50 border rounded-lg text-center">
            <p className="text-[9px] font-bold text-gray-450 uppercase tracking-wider">Family</p>
            <p className="text-xl font-black text-gray-950 mt-1 leading-none">8</p>
          </div>
          <div className="p-2.5 bg-red-50/50 border border-red-100 rounded-lg text-center">
            <p className="text-[9px] font-bold text-red-800 uppercase tracking-wider">Domestic Violence</p>
            <p className="text-xl font-black text-red-900 mt-1 leading-none">7</p>
          </div>
          <div className="p-2.5 bg-gray-50 border rounded-lg text-center">
            <p className="text-[9px] font-bold text-gray-450 uppercase tracking-wider">Employment</p>
            <p className="text-xl font-black text-gray-955 mt-1 leading-none">6</p>
          </div>
          <div className="p-2.5 bg-blue-50/50 border border-blue-100 rounded-lg text-center">
            <p className="text-[9px] font-bold text-blue-800 uppercase tracking-wider">Govt Schemes</p>
            <p className="text-xl font-black text-blue-900 mt-1 leading-none">6</p>
          </div>
          <div className="p-2.5 bg-gray-50 border rounded-lg text-center">
            <p className="text-[9px] font-bold text-gray-450 uppercase tracking-wider">Documentation</p>
            <p className="text-xl font-black text-gray-955 mt-1 leading-none">5</p>
          </div>
          <div className="p-2.5 bg-gray-50 border rounded-lg text-center">
            <p className="text-[9px] font-bold text-gray-455 uppercase tracking-wider">Other</p>
            <p className="text-xl font-black text-gray-950 mt-1 leading-none">6</p>
          </div>
        </div>
      </Card>

      {/* Search & Filters */}
      <Card className="!py-4">
        <div className="space-y-4">
          <div className="relative">
            <label className="block text-xs font-bold text-gray-700 mb-1">Search previous cases...</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4.5 w-4.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by issue, district, case type, or keyword"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-9 rounded border-gray-350 text-xs focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 items-end">
            <div>
              <label className="block text-[10px] font-bold text-gray-705 mb-1">Issue Type</label>
              <select
                value={issueFilter}
                onChange={(e) => setIssueFilter(e.target.value)}
                className="block w-full rounded border-gray-350 text-xs focus:ring-emerald-500 focus:border-emerald-500 shadow-sm py-1"
              >
                <option value="">All Issues</option>
                <option value="Land / Property">Land / Property</option>
                <option value="Domestic Violence">Domestic Violence</option>
                <option value="Employment">Employment</option>
                <option value="Family">Family</option>
                <option value="Government Scheme">Government Scheme</option>
                <option value="Documentation">Documentation</option>
                <option value="Police / Criminal">Police / Criminal</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-705 mb-1">District</label>
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="block w-full rounded border-gray-350 text-xs focus:ring-emerald-500 focus:border-emerald-500 shadow-sm py-1"
              >
                <option value="">All Districts</option>
                <option value="Mandya">Mandya</option>
                <option value="Mysuru">Mysuru</option>
                <option value="Tumakuru">Tumakuru</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Kolar">Kolar</option>
                <option value="Hassan">Hassan</option>
                <option value="Chikkamagaluru">Chikkamagaluru</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-705 mb-1">Language</label>
              <select
                value={langFilter}
                onChange={(e) => setLangFilter(e.target.value)}
                className="block w-full rounded border-gray-350 text-xs focus:ring-emerald-500 focus:border-emerald-500 shadow-sm py-1"
              >
                <option value="">All Languages</option>
                <option value="English">English</option>
                <option value="Kannada">Kannada</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-705 mb-1">Year</label>
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="block w-full rounded border-gray-350 text-xs focus:ring-emerald-500 focus:border-emerald-500 shadow-sm py-1"
              >
                <option value="">All Years</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-705 mb-1">Case Outcome</label>
              <select
                value={outcomeFilter}
                onChange={(e) => setOutcomeFilter(e.target.value)}
                className="block w-full rounded border-gray-350 text-xs focus:ring-emerald-500 focus:border-emerald-500 shadow-sm py-1"
              >
                <option value="">All Outcomes</option>
                <option value="Resolved">Resolved</option>
                <option value="Successfully Referred">Successfully Referred</option>
                <option value="Support Completed">Support Completed</option>
                <option value="Documentation Completed">Documentation Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-705 mb-1">Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="block w-full rounded border-gray-350 text-xs focus:ring-emerald-500 focus:border-emerald-500 shadow-sm py-1"
              >
                <option value="">All Priorities</option>
                <option value="Normal">Normal</option>
                <option value="Important">Important</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-705 mb-1 flex items-center gap-1">
                <ArrowUpDown className="h-3 w-3" />
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-full rounded border-gray-355 text-xs focus:ring-emerald-500 focus:border-emerald-500 shadow-sm py-1 font-semibold text-emerald-800"
              >
                <option value="Most Recent">Most Recent</option>
                <option value="Oldest">Oldest</option>
                <option value="Priority">Priority</option>
                <option value="Issue Type">Issue Type</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Grid of Case Cards */}
      {loading ? (
        <div className="flex justify-center items-center py-16 bg-white border rounded-lg shadow-sm">
          <svg className="animate-spin h-6 w-6 text-emerald-600 mr-2.5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-xs font-semibold text-gray-500">Querying SQL database repository...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCases.map(item => (
            <Card key={item.id} className="hover:border-emerald-300 transition-colors shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-bold text-gray-400 font-mono text-[10px] tracking-wider">{item.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold border
                    ${item.priority === 'Urgent' ? 'bg-red-50 text-red-700 border-red-200 animate-pulse' : 
                      item.priority === 'Important' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                      'bg-gray-50 text-gray-700 border-gray-250'}
                  `}>
                    {item.priority}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-gray-955 text-sm leading-snug">{item.title}</h3>
                  <p className="text-[10px] font-medium text-gray-450 mt-1 uppercase tracking-wide">
                    {item.issueType}
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium">
                    {item.district} • {item.language} • {item.year}
                  </p>
                </div>

                <div className="pt-2 pb-2">
                  <span className="text-[10px] text-gray-455 block font-bold uppercase tracking-wider">Lessons Learned:</span>
                  <p className="text-xs text-gray-600 leading-normal italic mt-0.5 font-medium">
                    "{item.lessonsLearned || 'Early document verification prevented delays.'}"
                  </p>
                </div>
              </div>

              <div className="border-t pt-3 mt-3 flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border
                  ${item.outcome === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-250' : 
                    item.outcome === 'Support Completed' ? 'bg-indigo-50 text-indigo-700 border-indigo-250' : 
                    'bg-amber-50 text-amber-700 border-amber-250'}
                `}>
                  {item.outcome}
                </span>

                <Button 
                  variant="outline" 
                  className="!py-1 !px-2.5 text-[11px] font-bold hover:bg-emerald-50 border-emerald-300 text-emerald-800 bg-white"
                  onClick={() => onNavigate('previous-case-details', item.id)}
                >
                  <Eye className="h-3.5 w-3.5" />
                  View Case
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {filteredCases.length === 0 && !loading && (
        <div className="text-center py-12 bg-white border rounded shadow-inner">
          <BookOpen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-xs text-gray-505 font-bold">No resolved cases match your filter criteria.</p>
        </div>
      )}

    </div>
  );
}
