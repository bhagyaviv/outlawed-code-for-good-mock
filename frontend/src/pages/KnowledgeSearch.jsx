import React, { useState } from 'react';
import { Search, Filter, BookOpen, AlertTriangle, ArrowRight } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import { mockKnowledgeResults } from '../utils/mockData';

export default function KnowledgeSearch() {
  const [query, setQuery] = useState("land inheritance dispute after father's death");
  const [district, setDistrict] = useState('Mandya');
  const [category, setCategory] = useState('Land / Property');
  const [language, setLanguage] = useState('Kannada');
  const [hasSearched, setHasSearched] = useState(true);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setHasSearched(true);
  };

  return (
    <div className="space-y-6">
      
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-900">AI Knowledge Search</h1>
        <p className="text-xs text-gray-505">Search previous case files, legal guidelines, and revenue records.</p>
      </div>

      {/* Query Search Panel */}
      <Card>
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="relative">
            <label className="block text-xs font-bold text-gray-700 mb-1">Enter your legal question / query</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4.5 w-4.5 text-gray-400" />
              <input
                type="text"
                placeholder="Ask a question or enter keywords..."
                className="block w-full pl-10 rounded border-gray-300 text-xs focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Spoken Language"
              id="search-lang"
              options={['Kannada', 'English', 'Hindi']}
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            />
            <Select
              label="Target District"
              id="search-dist"
              options={['Mandya', 'Mysuru', 'Tumakuru', 'Bengaluru']}
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            />
            <Select
              label="Issue Category"
              id="search-cat"
              options={['Land / Property', 'Domestic Violence', 'Employment', 'Documentation', 'Family']}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div className="flex justify-end pt-2 border-t">
            <Button type="submit" className="bg-emerald-600 text-white font-bold text-xs">
              Search Knowledge Base
            </Button>
          </div>
        </form>
      </Card>

      {/* Results Section */}
      {hasSearched && (
        <div className="space-y-6">
          
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-gray-700">Search Results matching: "{query}"</span>
            <span className="text-gray-450">Found 3 potentially relevant records</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left 2 cols: Results List */}
            <div className="md:col-span-2 space-y-4">
              
              {mockKnowledgeResults.map((item, idx) => (
                <Card key={idx}>
                  <div className="flex justify-between items-start border-b pb-2 mb-2.5">
                    <div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold border mr-2
                        ${item.similarity === 'High' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}
                      `}>
                        {item.similarity === 'High' ? 'Suggested Resource' : 'AI-Assisted Match'}
                      </span>
                      <span className="text-xs font-bold text-gray-900">{item.title}</span>
                    </div>
                    <span className="text-emerald-700 text-xs font-bold">{item.similarity} Match</span>
                  </div>

                  <p className="text-xs text-gray-650 leading-relaxed mb-3">
                    {item.summary}
                  </p>

                  <div className="bg-gray-50 border rounded p-2.5 text-[10px] text-gray-600 flex justify-between items-center">
                    <span><strong>Citation source:</strong> {item.citation}</span>
                    <Button 
                      variant="outline" 
                      onClick={() => alert(`Reviewing details for citation: ${item.title}`)}
                      className="!py-0.5 !px-2 text-[10px] bg-white border-gray-250 font-semibold"
                    >
                      Inspect Source
                    </Button>
                  </div>
                </Card>
              ))}

            </div>

            {/* Right col: Disclaimer & Info */}
            <div className="space-y-4">
              
              <Card title="Knowledge Base Guidance">
                <div className="space-y-3 text-xs text-gray-650 leading-relaxed">
                  <p>
                    <strong>Potentially Relevant:</strong> These matches are retrieved from cases previously resolved by grassroots Nyaaya Mitras in Karnataka.
                  </p>
                  <p>
                    <strong>Document Verification:</strong> Ensure local revenue deeds are inspected under sub-registrar checklists. Unregistered paperwork has zero inheritance claim.
                  </p>
                </div>
              </Card>

              <div className="bg-amber-50 border border-amber-250 rounded-lg p-4 text-xs text-amber-800 space-y-2">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="h-4.5 w-4.5 text-amber-600" />
                  Legal Disclaimer
                </div>
                <p className="leading-relaxed">
                  AI-generated information is for assistance only. It does not constitute legal advice, a legal decision, or legally correct answers. Review supporting documents and consult a Human Legal Expert when required.
                </p>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
