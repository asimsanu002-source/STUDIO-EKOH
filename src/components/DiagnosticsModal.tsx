import { useState, useEffect, FormEvent } from 'react';
import { 
  X, 
  Sparkles, 
  Gauge, 
  FileText, 
  TrendingDown, 
  Layers, 
  HelpCircle,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Info,
  Compass,
  Briefcase,
  Wrench
} from 'lucide-react';
import { Project, DiagnosticResult } from '../types';
import { MOCK_DIAGNOSTIC_REPORTS } from '../data';

interface DiagnosticsModalProps {
  project: Project | null;
  customBlueprintDescription: string | null;
  onClose: () => void;
}

export default function DiagnosticsModal({ 
  project, 
  customBlueprintDescription, 
  onClose 
}: DiagnosticsModalProps) {
  
  const [activeTab, setActiveTab] = useState<'overview' | 'materials' | 'ai-chat'>('overview');
  const [aiQuery, setAiQuery] = useState('');
  const [aiConversation, setAiConversation] = useState<{role: 'user' | 'assistant', text: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Compute or fetch diagnostic results
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      if (project) {
        // Calculate dynamic properties based on the selected project materials
        const isHighlyEco = project.materials.some(m => 
          ['Bamboo', 'Rammed Earth', 'Laterite Stone', 'Thatch', 'Clay Plaster', 'Reclaimed Teak'].includes(m)
        );

        const isConcreteHeavy = project.materials.some(m => 
          ['Concrete', 'Steel', 'Portland Cement', 'Standard Concrete Blocks'].includes(m)
        );

        let calculatedScore = 80;
        let risk: 'Low' | 'Medium' | 'High' = 'Low';
        let co2 = '1.1 tonnes CO2/sqm';
        let recommendations = [
          'Introduce a passive stack ventilation column (Surangam draft) to cool inner thermal zones.',
          'Consider locally-harvested Anjili wood for load-bearing roof rafters to replace imported cedar.',
          'Optimize natural illumination with north-facing skylights positioned at 12-degree angles.'
        ];

        if (isHighlyEco && !isConcreteHeavy) {
          calculatedScore = 94;
          risk = 'Low';
          co2 = '0.45 tonnes CO2/sqm';
          recommendations = [
            'Utilize traditional lime plaster incorporating a jaggery & terminalia chebula mix to water-seal rammed-earth walls.',
            'Introduce deep roof overhangs (chajjas) of at least 1.2m to protect timber structural elements from heavy monsoon vectors.',
            'Configure a perimeter bioswale with local river pebbles to naturally filter rainwater runoff prior to cistern storage.'
          ];
        } else if (isConcreteHeavy) {
          calculatedScore = 62;
          risk = 'Medium';
          co2 = '2.45 tonnes CO2/sqm';
          recommendations = [
            'Substitute at least 40% of standard Portland cement binder with ground granulated blast-furnace slag (GGBS).',
            'Incorporate structural terracotta hollow tiles for inner wall partitions to significantly lower building dead weight and optimize thermal insulation.',
            'Introduce a dual-courtyard layout or breezeway vector to cut down continuous mechanical HVAC dependency.'
          ];
        }

        // Generate material analysis breakdown
        const matsBreakdown = project.materials.map((m, i) => {
          let sust: 'Excellent' | 'Good' | 'Moderate' | 'Poor' = 'Good';
          let score = 80;

          if (['Bamboo', 'Rammed Earth', 'Thatch', 'Reclaimed Teak', 'Clay Roof Tiles'].includes(m)) {
            sust = 'Excellent';
            score = 95 - (i * 2);
          } else if (['Laterite Stone', 'Lime Plaster', 'Clay plaster', 'Anjili Wood'].includes(m)) {
            sust = 'Excellent';
            score = 88;
          } else if (['Concrete', 'Steel', 'Portland Cement', 'Low-carbon Concrete'].includes(m)) {
            sust = 'Moderate';
            score = 55;
          } else if (['Double-glazed Glass', 'Glass', 'Recycled Aluminum'].includes(m)) {
            sust = 'Good';
            score = 75;
          }

          return { material: m, sustainability: sust, score };
        });

        setDiagnostics({
          id: `diag-${project.id}`,
          projectName: `${project.name} Diagnostic Assessment`,
          ecoScore: calculatedScore,
          structuralRisk: risk,
          carbonFootprint: co2,
          recommendations,
          materialsAnalysis: matsBreakdown
        });
      } else if (customBlueprintDescription) {
        // Blueprint upload assessment
        setDiagnostics(MOCK_DIAGNOSTIC_REPORTS['generic-villa']);
      }
      setIsLoading(false);
    }, 900); // realistic diagnostic calculation loading

    return () => clearTimeout(timer);
  }, [project, customBlueprintDescription]);

  const handleAiConsult = (e: FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim() || !diagnostics) return;

    const userMessage = aiQuery;
    setAiConversation(prev => [...prev, { role: 'user', text: userMessage }]);
    setAiQuery('');
    setIsLoading(true);

    setTimeout(() => {
      // Custom responses depending on terms found in the question
      let reply = `Based on the geological and thermodynamic data for ${project?.name || 'this blueprint'}, our recommendation is to optimize spatial ventilation and replace high-carbon binders. `;
      
      const lowerQ = userMessage.toLowerCase();
      if (lowerQ.includes('monsoon') || lowerQ.includes('rain') || lowerQ.includes('water')) {
        reply = `For heavy precipitation vectors in Kerala, we advise integrating sloping terracotta overhangs at 35-degree pitches. Rammed-earth walls must be shielded with deep roof chajjas (overhangs) of at least 1.2m and treated with a traditional lime-and-jaggery water-resistant render.`;
      } else if (lowerQ.includes('bamboo') || lowerQ.includes('wood') || lowerQ.includes('timber')) {
        reply = `Bamboo is structurally magnificent under tension. We recommend treatment with non-toxic borax-boric acid salts to eliminate starch, making it completely resistant to powder-post beetles for up to 50 years. Support it with a basalt pedestal foundation to avoid direct damp ground contact.`;
      } else if (lowerQ.includes('cost') || lowerQ.includes('budget') || lowerQ.includes('expensive')) {
        reply = `Using local materials like laterite stone and rammed earth typically reduces structural material procurement costs by 15-22% compared to standard wire-cut brick. Lime plastering requires skilled local masonry but eliminates frequent painting and plaster crack maintenance over time.`;
      } else {
        reply = `To raise the Eco Score further, we recommend substitution of Portland concrete foundations with lime-stabilized stone footings. Incorporating an open wind breezeway aligned at a 15-degree North-to-South angle will utilize local wind currents, lowering summer indoor temperatures by up to 4°C.`;
      }

      setAiConversation(prev => [...prev, { role: 'assistant', text: reply }]);
      setIsLoading(false);
    }, 1000);
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'Low':
        return <CheckCircle className="h-5 w-5 text-emerald-600" />;
      case 'Medium':
        return <AlertTriangle className="h-5 w-5 text-urgency-amber" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-error" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
      
      {/* Panel container */}
      <div className="bg-[#0c0c0c] w-full max-w-2xl h-full shadow-2xl flex flex-col justify-between border-l border-white/10 relative">
        
        {/* Subtle grid accent inside drawer header */}
        <div className="absolute inset-x-0 top-0 h-40 pointer-events-none opacity-[0.02] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:30px_30px]" />

        {/* Header */}
        <div className="px-6 py-6 border-b border-white/10 flex justify-between items-start relative z-10">
          <div>
            <span className="px-2 py-1 bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold uppercase tracking-widest rounded-md flex items-center gap-1.5 self-start w-fit mb-2">
              <Sparkles className="h-3 w-3" /> Technical Analysis
            </span>
            <h2 className="font-headline text-2xl font-bold text-white">
              {project ? project.name : 'Uploaded Blueprint Assessment'}
            </h2>
            <p className="font-sans text-xs text-on-surface-variant mt-1">
              {project ? `${project.location} • Area: ${project.squareFootage} sqft` : 'Geometrical parsing results'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-all text-on-surface-variant"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-6 border-b border-white/10 flex gap-6 relative z-10">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 font-headline text-xs font-bold uppercase tracking-wider relative select-none ${
              activeTab === 'overview' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Overview
            {activeTab === 'overview' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`py-3 font-headline text-xs font-bold uppercase tracking-wider relative select-none ${
              activeTab === 'materials' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Materials Breakdown
            {activeTab === 'materials' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('ai-chat')}
            className={`py-3 font-headline text-xs font-bold uppercase tracking-wider relative select-none flex items-center gap-1.5 ${
              activeTab === 'ai-chat' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Ask Atelier AI <Sparkles className="h-3 w-3 text-primary" />
            {activeTab === 'ai-chat' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        </div>

        {/* Content Area (Scrollable) */}
        <div className="flex-grow p-6 overflow-y-auto relative z-0 flex flex-col gap-6">
          
          {isLoading ? (
            /* Analysis loading state */
            <div className="flex-grow flex flex-col items-center justify-center py-20 text-center gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <div>
                <p className="font-headline text-sm font-semibold text-white animate-pulse">
                  Synthesizing spatial diagnostics...
                </p>
                <p className="font-sans text-xs text-on-surface-variant mt-1 max-w-xs">
                  Calculating thermodynamic loads, local masonry offset, and materials circularity coefficients.
                </p>
              </div>
            </div>
          ) : diagnostics ? (
            
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (() => {
                const stage = project?.updateStage || 'On Office';
                let updateDetail = '';
                let paymentInfo = { requiredAmount: 150000, paidAmount: 150000, status: 'Fully Paid' as 'Pending' | 'Partially Paid' | 'Fully Paid' };

                if (stage === 'On Office') {
                  updateDetail = project?.officeUpdate || '3D Update';
                  if (project?.officePayment) {
                    paymentInfo = project.officePayment;
                  }
                } else if (stage === 'On Production') {
                  updateDetail = project?.productionUpdate || 'Furniture and art production';
                  paymentInfo = project?.productionPayment || { requiredAmount: 500000, paidAmount: 250000, status: 'Partially Paid' as const };
                } else if (stage === 'On Site') {
                  updateDetail = project?.siteUpdate || 'Site works update';
                  paymentInfo = project?.sitePayment || { requiredAmount: 800000, paidAmount: 0, status: 'Pending' as const };
                }

                const paymentPercentage = paymentInfo.requiredAmount > 0 
                  ? Math.round((paymentInfo.paidAmount / paymentInfo.requiredAmount) * 100) 
                  : 100;

                return (
                  <div className="flex flex-col gap-6 animate-fadeIn">
                    
                    {/* Gauge & Metrics card */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      
                      {/* Eco Score Circular Meter */}
                      <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center text-center justify-center gap-1 shadow-sm">
                        <span className="font-headline text-[10px] font-bold uppercase tracking-widest text-primary">
                          Circular Score
                        </span>
                        <div className="relative flex items-center justify-center my-2">
                          {/* Simple SVG Circular indicator */}
                          <svg className="w-20 h-20 transform -rotate-90">
                            <circle cx="40" cy="40" r="34" stroke="rgba(255,255,255,0.08)" strokeWidth="6" fill="transparent" />
                            <circle 
                              cx="40" 
                              cy="40" 
                              r="34" 
                              stroke="#C5A059" 
                              strokeWidth="6" 
                              fill="transparent" 
                              strokeDasharray={2 * Math.PI * 34}
                              strokeDashoffset={2 * Math.PI * 34 * (1 - diagnostics.ecoScore / 100)}
                              strokeLinecap="round"
                            />
                          </svg>
                          <span className="absolute font-headline text-xl font-bold text-primary">
                            {diagnostics.ecoScore}
                          </span>
                        </div>
                        <span className="font-sans text-xs font-semibold text-emerald-400">
                          Excellent Circularity
                        </span>
                      </div>

                      {/* Structural Risk Card */}
                      <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-between gap-2 shadow-sm">
                        <span className="font-headline text-[10px] font-bold uppercase tracking-widest text-primary">
                          Structural Risk
                        </span>
                        <div className="flex items-center gap-2 my-1">
                          {getRiskIcon(diagnostics.structuralRisk)}
                          <span className="font-headline text-xl font-bold text-white">
                            {diagnostics.structuralRisk}
                          </span>
                        </div>
                        <p className="font-sans text-xs text-on-surface-variant">
                          Evaluated for wind and seismic thresholds of soil.
                        </p>
                      </div>

                      {/* Carbon Footprint Card */}
                      <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-between gap-2 shadow-sm">
                        <span className="font-headline text-[10px] font-bold uppercase tracking-widest text-primary">
                          Embodied CO2
                        </span>
                        <div className="flex items-center gap-1.5 my-1 text-primary">
                          <TrendingDown className="h-5 w-5" />
                          <span className="font-headline text-lg font-bold">
                            {diagnostics.carbonFootprint}
                          </span>
                        </div>
                        <p className="font-sans text-xs text-on-surface-variant">
                          Calculated across materials lifespans.
                        </p>
                      </div>

                    </div>

                    {/* Active Workflow Stage & Payment Update */}
                    <div className="bg-white/5 border border-primary/30 rounded-xl p-5 flex flex-col gap-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
                      
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/10 pb-3">
                        <div>
                          <span className="font-headline text-[10px] font-bold uppercase tracking-widest text-primary/80">Active Stage Workflow</span>
                          <h4 className="font-headline text-lg font-bold text-white mt-0.5">{stage}</h4>
                        </div>
                        <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full font-headline text-xs font-semibold text-primary">
                          {updateDetail}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-1">
                        {/* Left side: Stage Explanation */}
                        <div className="flex gap-3.5 items-start">
                          <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-primary mt-1 shrink-0">
                            {stage === 'On Office' ? (
                              <Briefcase className="h-5 w-5" />
                            ) : stage === 'On Production' ? (
                              <Wrench className="h-5 w-5" />
                            ) : (
                              <Compass className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <span className="font-headline text-xs font-bold text-white/90">Current Work Focus</span>
                            <p className="font-sans text-xs text-on-surface-variant leading-relaxed mt-1">
                              {stage === 'On Office' && "Digital drafting, vernacular form studies, and climate-responsive engineering models are being optimized."}
                              {stage === 'On Production' && "Atelier craft workshops are producing custom elements and finalizing natural material selections."}
                              {stage === 'On Site' && "Physical masonry, foundation settling, and low-embodied carbon assembly is underway on locations."}
                            </p>
                          </div>
                        </div>

                        {/* Right side: Active Stage Payments tracking */}
                        <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3.5 flex flex-col gap-2.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-headline font-bold text-white/60">Stage Payment Term</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-headline font-bold uppercase tracking-wider ${
                              paymentInfo.status === 'Fully Paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                              paymentInfo.status === 'Partially Paid' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                              'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            }`}>
                              {paymentInfo.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs font-sans mt-0.5">
                            <div>
                              <span className="block text-on-surface-variant text-[10px]">Required Budget</span>
                              <span className="font-mono text-sm font-semibold text-white">₹{paymentInfo.requiredAmount.toLocaleString('en-IN')}</span>
                            </div>
                            <div>
                              <span className="block text-on-surface-variant text-[10px]">Collected Paid</span>
                              <span className="font-mono text-sm font-semibold text-primary">₹{paymentInfo.paidAmount.toLocaleString('en-IN')}</span>
                            </div>
                          </div>

                          {/* Progress bar */}
                          <div className="mt-1">
                            <div className="flex justify-between text-[10px] font-mono text-on-surface-variant mb-1">
                              <span>Settled ratio</span>
                              <span>{paymentPercentage}%</span>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className="bg-primary h-full rounded-full transition-all duration-500" 
                                style={{ width: `${paymentPercentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recommendations section */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col gap-4">
                      <h3 className="font-headline text-base font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
                        <Lightbulb className="h-4 w-4 text-primary" />
                        Architectural Recommendations
                      </h3>
                      <ul className="flex flex-col gap-4">
                        {diagnostics.recommendations.map((rec, i) => (
                          <li key={i} className="flex gap-3 items-start">
                            <span className="font-headline text-xs font-bold text-black bg-primary rounded-full h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                              {rec}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>
                );
              })()}

              {/* TAB 2: MATERIALS BREAKDOWN */}
              {activeTab === 'materials' && (
                <div className="flex flex-col gap-6 animate-fadeIn">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <h3 className="font-headline text-base font-bold text-white flex items-center gap-2">
                      <Layers className="h-4 w-4 text-primary" />
                      Material Index Sustainability Ratings
                    </h3>
                    <span className="font-sans text-xs text-on-surface-variant font-medium">
                      {diagnostics.materialsAnalysis.length} indices tracked
                    </span>
                  </div>

                  <div className="flex flex-col gap-4">
                    {diagnostics.materialsAnalysis.map((mat, i) => (
                      <div 
                        key={i} 
                        className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center group hover:border-primary/40 transition-all duration-300 shadow-sm"
                      >
                        <div className="flex flex-col gap-1">
                          <span className="font-headline text-base font-bold text-white transition-colors group-hover:text-primary">
                            {mat.material}
                          </span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded w-fit ${
                            mat.sustainability === 'Excellent' 
                              ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/30' 
                              : mat.sustainability === 'Good'
                              ? 'bg-blue-950/40 text-blue-400 border border-blue-800/30'
                              : 'bg-amber-950/40 text-amber-400 border border-amber-800/30'
                          }`}>
                            {mat.sustainability} Sustainability
                          </span>
                        </div>
                        
                        {/* Score bar */}
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-white/10 rounded-full h-2 overflow-hidden hidden sm:block">
                            <div 
                              className={`h-full rounded-full ${
                                mat.score > 85 ? 'bg-emerald-500' : mat.score > 70 ? 'bg-blue-500' : 'bg-primary'
                              }`}
                              style={{ width: `${mat.score}%` }}
                            />
                          </div>
                          <span className="font-headline text-lg font-bold text-primary">
                            {mat.score}/100
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: AI CONSULTANCY */}
              {activeTab === 'ai-chat' && (
                <div className="flex flex-col h-[480px] justify-between gap-4 animate-fadeIn">
                  
                  {/* Chat logs */}
                  <div className="flex-grow overflow-y-auto flex flex-col gap-4 pr-1">
                    {/* Welcome message */}
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex gap-3 items-start">
                      <div className="p-2 bg-primary text-black rounded-lg shadow-sm">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-headline text-sm font-bold text-white">
                          Atelier AI Assistant
                        </span>
                        <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                          Greetings. I am Studio Ekoh's circular engineering assistant. Ask me questions about seismic soil reinforcement, beetle-proofing bamboo, or thermal cooling angles specific to {project?.name || 'this blueprint'}.
                        </p>
                      </div>
                    </div>

                    {/* Conversation thread */}
                    {aiConversation.map((msg, index) => (
                      <div 
                        key={index} 
                        className={`flex gap-3 items-start p-4 rounded-xl border max-w-[85%] ${
                          msg.role === 'user' 
                            ? 'self-end bg-primary/10 border-primary/25 text-primary' 
                            : 'self-start bg-white/5 border border-white/10 text-on-surface-variant'
                        }`}
                      >
                        {msg.role === 'assistant' && (
                          <div className="p-2 bg-primary text-black rounded-lg shrink-0">
                            <Sparkles className="h-4 w-4" />
                          </div>
                        )}
                        <div className="flex flex-col gap-1">
                          <span className="font-headline text-xs font-bold uppercase tracking-wider text-primary">
                            {msg.role === 'user' ? 'Principal Engineer' : 'Atelier AI'}
                          </span>
                          <p className="font-sans text-sm leading-relaxed">
                            {msg.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick-suggestion chips */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
                    <button 
                      onClick={() => setAiQuery('How do we reinforce walls for heavy monsoon rains?')}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-xs font-sans font-medium text-primary rounded-lg border border-white/10 transition-all text-left"
                    >
                      ☔ Monsoon wall protection
                    </button>
                    <button 
                      onClick={() => setAiQuery('How is organic bamboo beetle-proofed?')}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-xs font-sans font-medium text-primary rounded-lg border border-white/10 transition-all text-left"
                    >
                      🎋 Beetle-proofing bamboo
                    </button>
                    <button 
                      onClick={() => setAiQuery('What are local building material costs?')}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-xs font-sans font-medium text-primary rounded-lg border border-white/10 transition-all text-left"
                    >
                      💰 Local material costs
                    </button>
                  </div>

                  {/* Input form */}
                  <form onSubmit={handleAiConsult} className="flex gap-2 relative z-10 pt-2 border-t border-white/10">
                    <input
                      type="text"
                      placeholder="Ask about materials, ventilation, load thresholds..."
                      value={aiQuery}
                      onChange={(e) => setAiQuery(e.target.value)}
                      className="flex-grow bg-white/5 border border-white/10 focus:border-primary rounded-lg px-4 py-3 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-primary text-white placeholder-white/30 shadow-sm"
                    />
                    <button 
                      type="submit"
                      className="bg-primary hover:bg-white hover:text-black text-black px-5 rounded-lg font-headline text-sm font-semibold transition-all shadow-md flex items-center gap-1.5 active:scale-[0.98]"
                    >
                      Ask AI <ArrowRight className="h-4 w-4" />
                    </button>
                  </form>

                </div>
              )}
            </>

          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="font-sans text-sm text-on-surface-variant">No assessment file loaded.</p>
            </div>
          )}

        </div>

        {/* Footer actions */}
        <div className="px-6 py-5 border-t border-white/10 bg-[#0c0c0c] flex gap-4 relative z-10">
          <button 
            onClick={() => alert('Printing structural report...')}
            className="flex-1 py-3 border border-white/10 text-primary hover:bg-white/5 font-headline text-xs font-bold uppercase tracking-wider rounded-lg transition-all"
          >
            Export Blueprint Report
          </button>
          <button 
            onClick={onClose}
            className="flex-1 py-3 bg-primary hover:bg-white hover:text-black text-black font-headline text-xs font-bold uppercase tracking-wider rounded-lg transition-all"
          >
            Close Diagnostics
          </button>
        </div>

      </div>

    </div>
  );
}
