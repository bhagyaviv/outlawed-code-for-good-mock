import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Mic, 
  MicOff, 
  FileText 
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import caseService from '../services/caseService';

/**
 * Multi-Step Create Case Component
 * @param {Object} props
 * @param {Object} props.user - logged-in user
 * @param {function} props.onNavigate - callback to navigate views
 */
export default function CreateCase({ user, onNavigate }) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdCaseId, setCreatedCaseId] = useState(null);

  // Form Fields State
  const [issueType, setIssueType] = useState('Land / Property');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('Kannada');
  const [district, setDistrict] = useState('Mandya');
  const [location, setLocation] = useState('');
  const [urgency, setUrgency] = useState('Normal');
  const [followUpDate, setFollowUpDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientAge, setClientAge] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  // Voice Input Simulation State
  const [isListening, setIsListening] = useState(false);

  // File Upload State
  const [fileName, setFileName] = useState('');

  const [errors, setErrors] = useState({});

  const validateStep = () => {
    const tempErrors = {};
    if (step === 1) {
      if (!title.trim()) tempErrors.title = 'Case brief title is required';
    } else if (step === 2) {
      if (!description.trim()) tempErrors.description = 'Case details description is required';
    } else if (step === 3) {
      if (!clientName.trim()) tempErrors.clientName = 'Client name is required';
      if (!location.trim()) tempErrors.location = 'Specific community location is required';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleVoiceInputSimulate = () => {
    setIsListening(true);
    setTimeout(() => {
      setDescription(prev => 
        prev + (prev ? ' ' : '') + "The client inherited agricultural property from their late father in Mandya. Siblings have generated false notarized partition documents to claim title."
      );
      setIsListening(false);
    }, 2000);
  };

  const handleFileChangeSimulate = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        issueType,
        title,
        clientDetails: description,
        district,
        location,
        urgency,
        followUpDate,
        notes,
        clientName,
        clientAge,
        clientPhone,
        fileName
      };

      const res = await caseService.createCase(payload, user?.name || 'Ananya Rao');
      setCreatedCaseId(res.id);
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      alert('Failed to register case record.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-6 bg-white p-8 rounded-lg border border-gray-200 shadow-sm mt-8">
        <div className="mx-auto h-16 w-16 bg-emerald-50 border border-emerald-250 text-emerald-600 rounded-full flex items-center justify-center shadow-inner">
          <CheckCircle className="h-10 w-10 animate-pulse" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900">Case Created Successfully</h2>
          <p className="text-gray-550 text-xs mt-1.5">Your record has been logged in the OutLawed database.</p>
          <div className="inline-block mt-4 bg-gray-50 border border-gray-255 px-4 py-2 rounded-md font-mono text-sm font-bold text-gray-800">
            Case ID: #{createdCaseId}
          </div>
        </div>

        <div className="flex gap-3 pt-4 justify-center">
          <Button
            variant="outline"
            className="w-full font-semibold border-gray-300 bg-white text-gray-700"
            onClick={() => onNavigate('cases-detail', createdCaseId)}
          >
            View Case
          </Button>
          <Button
            className="w-full font-semibold bg-emerald-600 text-white"
            onClick={() => onNavigate('ai-assistant', createdCaseId)}
          >
            Ask AI Assistant
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="!p-1.5 bg-white border-gray-200 hover:bg-gray-50"
          onClick={() => onNavigate('dashboard')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Register Legal-Aid Case</h1>
          <p className="text-xs text-gray-500">Step {step} of 4 — Intake Wizard</p>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div 
          className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300" 
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900 border-b pb-2">Step 1: Classification & Brief</h3>
              <Input
                label="Case Brief Title"
                id="case-title"
                placeholder="e.g. Ancestral land partition dispute between siblings"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={errors.title}
              />
              <Select
                label="Primary Issue Category"
                id="issue-type"
                options={[
                  'Land / Property',
                  'Domestic Violence',
                  'Employment',
                  'Family',
                  'Government Scheme',
                  'Police / Criminal',
                  'Documentation',
                  'Other'
                ]}
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900 border-b pb-2">Step 2: Case Details & Language</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Spoken Language"
                  id="case-language"
                  options={['Kannada', 'English', 'Hindi']}
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Voice Intake Placeholder</label>
                  <Button
                    type="button"
                    onClick={handleVoiceInputSimulate}
                    isLoading={isListening}
                    className={`w-full flex items-center justify-center gap-2 border text-xs font-semibold
                      ${isListening ? 'bg-red-50 border-red-200 text-red-700' : 'bg-gray-50 border-gray-350 text-gray-655 hover:bg-gray-100'}
                    `}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="h-4 w-4 animate-bounce" />
                        Listening to field note...
                      </>
                    ) : (
                      <>
                        <Mic className="h-4 w-4 text-emerald-600" />
                        Simulate Voice Translation (Kannada)
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Situation Statement</label>
                <textarea
                  rows={6}
                  placeholder="Record client grievances, possession dates, document status, and notes..."
                  className={`block w-full rounded-md shadow-sm text-sm focus:ring-emerald-500 focus:border-emerald-500
                    ${errors.description ? 'border-red-300' : 'border-gray-350'}
                  `}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-650 font-semibold">{errors.description}</p>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900 border-b pb-2">Step 3: Client Details & Location</h3>
              <div className="bg-amber-50 border border-amber-200 rounded p-3 text-[11px] text-amber-800 flex items-start gap-2">
                <span className="font-bold">🔒 Privacy Notice:</span>
                <span>Names and phone numbers will be masked automatically in caseload views.</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Client Name"
                  id="client-name"
                  placeholder="e.g. Gowramma K."
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  error={errors.clientName}
                />
                <Input
                  label="Client Age"
                  id="client-age"
                  type="number"
                  placeholder="e.g. 52"
                  value={clientAge}
                  onChange={(e) => setClientAge(e.target.value)}
                />
                <Input
                  label="Client Phone Number"
                  id="client-phone"
                  placeholder="e.g. +91 94480..."
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="District"
                  id="case-district"
                  options={['Mandya', 'Mysuru', 'Tumakuru', 'Bengaluru']}
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                />
                <Input
                  label="Location / Community"
                  id="case-location"
                  placeholder="e.g. K R Pet Taluk"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  error={errors.location}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level</label>
                  <div className="flex gap-4">
                    {['Normal', 'Important', 'Urgent'].map(level => (
                      <label key={level} className="flex items-center text-xs font-semibold text-gray-750">
                        <input
                          type="radio"
                          name="urgency-level"
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 mr-1.5"
                          checked={urgency === level}
                          onChange={() => setUrgency(level)}
                        />
                        {level}
                      </label>
                    ))}
                  </div>
                </div>
                <Input
                  label="Target Follow-up Date"
                  id="followup-date"
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Supporting Documents</label>
                <div className="flex items-center justify-center rounded-md border-2 border-dashed border-gray-300 px-6 py-4 hover:border-emerald-500 transition-colors bg-gray-50">
                  <div className="space-y-1 text-center text-xs text-gray-500">
                    <FileText className="mx-auto h-8 w-8 text-gray-450" />
                    <label className="cursor-pointer font-semibold text-emerald-600 hover:text-emerald-505">
                      <span>Upload property/family documents</span>
                      <input type="file" className="sr-only" onChange={handleFileChangeSimulate} />
                    </label>
                    {fileName && <p className="text-emerald-700 font-bold mt-1">Uploaded: {fileName}</p>}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Field Notes</label>
                <textarea
                  rows={2}
                  placeholder="Record immediate witness reports or field notes..."
                  className="block w-full rounded-md border-gray-300 shadow-sm text-sm focus:ring-emerald-500 focus:border-emerald-500"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900 border-b pb-2">Step 4: Review Application details</h3>
              <div className="bg-gray-50 rounded-lg p-4 text-xs space-y-3 border">
                <div className="grid grid-cols-3 gap-2">
                  <span className="font-semibold text-gray-450">Case Brief:</span>
                  <span className="col-span-2 font-bold text-gray-900">{title}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="font-semibold text-gray-455">Category:</span>
                  <span className="col-span-2 text-gray-800">{issueType}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="font-semibold text-gray-455">Client Identity:</span>
                  <span className="col-span-2 text-gray-800 font-semibold">{clientName} (Age: {clientAge || 'N/A'}, Ph: {clientPhone || 'N/A'})</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="font-semibold text-gray-455">Location:</span>
                  <span className="col-span-2 text-gray-850">{location}, {district} District</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="font-semibold text-gray-455">Urgency & Language:</span>
                  <span className="col-span-2 text-gray-855">{urgency} ({language})</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="font-semibold text-gray-455">Uploaded File:</span>
                  <span className="col-span-2 text-emerald-700 font-bold">{fileName || 'None'}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 border-t pt-2">
                  <span className="font-semibold text-gray-455">Case Description summary:</span>
                  <span className="col-span-2 text-gray-650 block italic">"{description}"</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center border-t pt-4">
            {step > 1 ? (
              <Button variant="outline" onClick={handleBack} disabled={isLoading}>
                Previous Step
              </Button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <Button onClick={handleNext} className="flex items-center gap-1.5">
                Next Step
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            ) : (
              <Button type="submit" isLoading={isLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                Create Case File
              </Button>
            )}
          </div>

        </form>
      </Card>
    </div>
  );
}
