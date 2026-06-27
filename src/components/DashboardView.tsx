import { useState, FormEvent, useEffect } from 'react';
import { 
  Building2, 
  IndianRupee, 
  Clock, 
  ArrowRight, 
  Compass, 
  Package, 
  CreditCard, 
  Upload, 
  Sparkles,
  ChevronRight,
  Trash2,
  Plus,
  Pencil,
  ShieldCheck,
  Briefcase,
  Users,
  CheckCircle,
  FileText
} from 'lucide-react';
import { Project, StudioUpdate, UserSession } from '../types';
import { motion } from 'motion/react';
import { triggerHaptic } from '../utils/haptic';

interface DashboardViewProps {
  projects: Project[];
  updates: StudioUpdate[];
  onUploadClick: () => void;
  onProjectClick: (project: Project) => void;
  setActiveTab: (tab: string) => void;
  currentUser: UserSession | null;
  onAddProject: (newProj: Omit<Project, 'id' | 'timeAgo' | 'dateAdded'>) => void;
  onDeleteProject: (id: string) => void;
  onUpdateProject: (updatedProj: Project) => void;
}

export default function DashboardView({ 
  projects, 
  updates, 
  onUploadClick, 
  onProjectClick,
  setActiveTab,
  currentUser,
  onAddProject,
  onDeleteProject,
  onUpdateProject
}: DashboardViewProps) {
  
  // Scroll tactile haptic trigger on page scroll
  useEffect(() => {
    let lastScrollTop = window.scrollY || document.documentElement.scrollTop;
    let accumulatedDelta = 0;
    const pixelsPerTick = 65; // tick every 65px of scroll delta

    const handleScroll = () => {
      const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
      const delta = Math.abs(currentScrollTop - lastScrollTop);
      lastScrollTop = currentScrollTop;

      accumulatedDelta += delta;
      if (accumulatedDelta >= pixelsPerTick) {
        triggerHaptic('scroll');
        accumulatedDelta = accumulatedDelta % pixelsPerTick;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Quick project addition form states
  const [quickName, setQuickName] = useState('');
  const [quickLocation, setQuickLocation] = useState('');
  const [quickBudget, setQuickBudget] = useState(5000000);
  const [quickStatus, setQuickStatus] = useState<string>('Active');
  const [customStatus, setCustomStatus] = useState('');
  const [showCustomStatusInput, setShowCustomStatusInput] = useState(false);
  const [quickMsg, setQuickMsg] = useState('');

  // Quick edit project states
  const [editingProjId, setEditingProjId] = useState<string | null>(null);
  const [editPhase, setEditPhase] = useState('');
  const [editBudget, setEditBudget] = useState(0);
  const [editStatus, setEditStatus] = useState<string>('Active');

  const handleQuickAddSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!quickName || !quickLocation) return;
    
    triggerHaptic('success');
    const finalStatus = showCustomStatusInput ? (customStatus.trim() || 'Active') : quickStatus;

    onAddProject({
      name: quickName,
      description: 'Quick site registered from principal admin dashboard console.',
      location: quickLocation,
      phase: 'Initial Concept Planning',
      status: finalStatus,
      squareFootage: 2200,
      budget: Number(quickBudget) || 5000000,
      revenue: Math.round((Number(quickBudget) || 5000000) * 1.2),
      materials: ['Laterite Stone', 'Teak Wood']
    });

    setQuickName('');
    setQuickLocation('');
    setQuickBudget(5000000);
    setQuickStatus('Active');
    setCustomStatus('');
    setShowCustomStatusInput(false);
    setQuickMsg('Project registered successfully!');
    setTimeout(() => setQuickMsg(''), 3000);
  };

  const handleQuickSave = (proj: Project) => {
    triggerHaptic('success');
    onUpdateProject({
      ...proj,
      phase: editPhase || proj.phase,
      budget: Number(editBudget) || proj.budget,
      status: editStatus,
      revenue: Math.round((Number(editBudget) || proj.budget) * 1.2)
    });
    setEditingProjId(null);
  };

  const startQuickEdit = (proj: Project) => {
    triggerHaptic('light');
    setEditingProjId(proj.id);
    setEditPhase(proj.phase);
    setEditBudget(proj.budget);
    setEditStatus(proj.status);
  };

  // Calculate dynamic stats
  const activeProjects = projects.filter(p => p.status === 'Active');
  const activeCount = activeProjects.length;
  const completedCount = projects.filter(p => p.status === 'Completed').length;
  
  // Total square footage under active workflow
  const totalActiveSqFt = activeProjects.reduce((acc, p) => acc + (p.squareFootage || 0), 0);
  
  // Calculate unique active locations
  const activeLocations = Array.from(new Set(activeProjects.map(p => p.location.split(',')[0]))).filter(Boolean);

  // Active stages breakdown
  const officeStageCount = activeProjects.filter(p => p.updateStage === 'On Office').length;
  const productionStageCount = activeProjects.filter(p => p.updateStage === 'On Production').length;
  const siteStageCount = activeProjects.filter(p => p.updateStage === 'On Site').length;

  // Rich financial stage payment stats aggregated from all projects
  let totalStageRequired = 0;
  let totalStagePaid = 0;
  let fullyPaidCount = 0;
  let partiallyPaidCount = 0;
  let pendingCount = 0;

  projects.forEach(p => {
    const stage = p.updateStage || 'On Office';
    let pInfo = { requiredAmount: 150000, paidAmount: 150000, status: 'Fully Paid' as 'Pending' | 'Partially Paid' | 'Fully Paid' };
    
    if (stage === 'On Office') {
      pInfo = p.officePayment || pInfo;
    } else if (stage === 'On Production') {
      pInfo = p.productionPayment || { requiredAmount: 500000, paidAmount: 250000, status: 'Partially Paid' };
    } else if (stage === 'On Site') {
      pInfo = p.sitePayment || { requiredAmount: 800000, paidAmount: 0, status: 'Pending' };
    }

    totalStageRequired += pInfo.requiredAmount;
    totalStagePaid += pInfo.paidAmount;

    if (pInfo.status === 'Fully Paid') fullyPaidCount++;
    else if (pInfo.status === 'Partially Paid') partiallyPaidCount++;
    else if (pInfo.status === 'Pending') pendingCount++;
  });

  const paymentSettledPercent = totalStageRequired > 0 
    ? Math.round((totalStagePaid / totalStageRequired) * 100) 
    : 100;

  // Active drafting & pipeline projects count
  const draftingCount = projects.filter(p => p.status === 'Drafting').length;

  // Distinct eco-materials in catalog
  const distinctMaterials = Array.from(new Set(projects.flatMap(p => p.materials || []))).slice(0, 5);

  // Find Featured Project
  const featuredProject = projects.find(p => p.id === 'proj-3') || projects[0];

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'architecture':
        return <Compass className="h-5 w-5 text-teak-brown" />;
      case 'inventory_2':
        return <Package className="h-5 w-5 text-teak-brown" />;
      case 'payments':
        return <CreditCard className="h-5 w-5 text-teak-brown" />;
      default:
        return <Building2 className="h-5 w-5 text-teak-brown" />;
    }
  };

  return (
    <div className="flex flex-col gap-12 md:gap-16">
      
      {/* Header Section */}
      <header className="flex flex-col gap-2">
        <h1 className="font-headline text-5xl md:text-6xl font-bold text-charcoal-text tracking-tight">
          Dashboard
        </h1>
        <p className="font-sans text-base md:text-lg text-on-surface-variant leading-relaxed">
          Overview of project analytics and studio operations.
        </p>
      </header>

      {/* Quick Stats Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Banner 1: Active Operations & Construction Footprint */}
        <div className="bg-white/40 backdrop-blur-md p-6 rounded-xl shadow-[0_8px_32px_rgba(139,94,60,0.04)] border border-white/30 flex flex-col gap-4 relative overflow-hidden group hover:scale-[1.01] transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full pointer-events-none" />
          
          <div className="flex justify-between items-center">
            <span className="font-headline text-xs font-bold text-teak-brown uppercase tracking-widest">
              Active Footprint
            </span>
            <span className="px-2 py-0.5 bg-primary/10 border border-primary/20 text-primary font-headline text-[10px] font-bold uppercase rounded">
              Live Operations
            </span>
          </div>

          <div className="flex items-baseline gap-2 relative">
            <span className="font-headline text-5xl font-bold text-laterite-red">
              {activeCount}
            </span>
            <span className="font-headline text-sm font-semibold text-charcoal-text uppercase tracking-wider">
              Sites Active
            </span>
          </div>

          <div className="border-t border-white/20 pt-3 flex flex-col gap-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Total Built Area:</span>
              <span className="font-mono font-semibold text-charcoal-text">{totalActiveSqFt.toLocaleString('en-IN')} SQ.FT</span>
            </div>
            
            {/* Stage breakdown progress visualizer */}
            <div className="flex flex-col gap-1">
              <span className="text-on-surface-variant">Active Stages Breakdown:</span>
              <div className="flex gap-2 text-[10px] font-headline font-bold uppercase mt-0.5">
                <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 border border-emerald-500/15 rounded">
                  {officeStageCount} Office
                </span>
                <span className="px-1.5 py-0.5 bg-yellow-500/10 text-yellow-600 border border-yellow-500/15 rounded">
                  {productionStageCount} Production
                </span>
                <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-600 border border-amber-500/15 rounded">
                  {siteStageCount} Site
                </span>
              </div>
            </div>

            {activeLocations.length > 0 && (
              <div className="flex justify-between items-center text-[11px] mt-1 text-on-surface-variant">
                <span>Locations spread:</span>
                <span className="font-sans font-semibold text-charcoal-text line-clamp-1">{activeLocations.join(', ')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Banner 2: Treasury & Stage Payments Tracking */}
        <div className="bg-white/40 backdrop-blur-md p-6 rounded-xl shadow-[0_8px_32px_rgba(139,94,60,0.04)] border border-white/30 flex flex-col gap-4 relative overflow-hidden group hover:scale-[1.01] transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-bl-full pointer-events-none" />
          
          <div className="flex justify-between items-center">
            <span className="font-headline text-xs font-bold text-teak-brown uppercase tracking-widest">
              Stage Payments
            </span>
            <div className="flex items-center gap-1.5 text-emerald-600 font-headline text-xs font-bold">
              <span>{paymentSettledPercent}% Collected</span>
            </div>
          </div>

          <div className="flex flex-col gap-0.5">
            <div className="flex items-baseline gap-1 relative">
              <span className="font-mono text-3xl font-bold text-charcoal-text">
                ₹{totalStagePaid.toLocaleString('en-IN')}
              </span>
              <span className="text-on-surface-variant text-[11px] font-medium">
                collected of ₹{totalStageRequired.toLocaleString('en-IN')}
              </span>
            </div>
            
            {/* Simple elegant progress bar */}
            <div className="w-full bg-black/5 rounded-full h-1.5 mt-2 overflow-hidden">
              <div 
                className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${paymentSettledPercent}%` }}
              />
            </div>
          </div>

          <div className="border-t border-white/20 pt-3 flex flex-col gap-2 text-xs">
            <span className="text-on-surface-variant font-sans">Active Term Statuses:</span>
            <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-headline font-bold uppercase">
              <div className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/15 rounded p-1">
                {fullyPaidCount} Paid
              </div>
              <div className="bg-yellow-500/10 text-yellow-600 border border-yellow-500/15 rounded p-1">
                {partiallyPaidCount} Partial
              </div>
              <div className="bg-rose-500/10 text-rose-600 border border-rose-500/15 rounded p-1">
                {pendingCount} Pending
              </div>
            </div>
          </div>
        </div>

        {/* Banner 3: Craft & Sustainable Specs */}
        <div className="bg-white/40 backdrop-blur-md p-6 rounded-xl shadow-[0_8px_32px_rgba(139,94,60,0.04)] border border-white/30 flex flex-col gap-4 relative overflow-hidden group hover:scale-[1.01] transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-laterite-red/10 to-transparent rounded-bl-full pointer-events-none" />
          
          <div className="flex justify-between items-center">
            <span className="font-headline text-xs font-bold text-teak-brown uppercase tracking-widest">
              Atelier Catalog
            </span>
            <span className="px-2 py-0.5 bg-laterite-red/10 border border-laterite-red/20 text-laterite-red font-headline text-[10px] font-bold uppercase rounded">
              Handcrafted specs
            </span>
          </div>

          <div className="flex items-baseline gap-2 relative">
            <span className="font-headline text-5xl font-bold text-laterite-red">
              {completedCount}
            </span>
            <span className="font-headline text-sm font-semibold text-charcoal-text uppercase tracking-wider">
              Sites Completed
            </span>
          </div>

          <div className="border-t border-white/20 pt-3 flex flex-col gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Drafting Pipeline:</span>
              <span className="font-sans font-bold text-charcoal-text">{draftingCount} in design stage</span>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-on-surface-variant">Vernacular Materials Deployed:</span>
              <div className="flex flex-wrap gap-1 mt-0.5">
                {distinctMaterials.map((mat, idx) => (
                  <span 
                    key={idx} 
                    className="text-[9px] font-sans px-1.5 py-0.5 bg-white/50 text-charcoal-text rounded border border-white/40"
                  >
                    {mat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Admin Control Panel & Quick Sandbox Login */}
      {currentUser?.role === 'Admin' ? (
        <section className="bg-white/5 border border-emerald-900/40 rounded-xl p-6 shadow-md flex flex-col gap-6 relative overflow-hidden animate-fadeIn">
          <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-950/15 rounded-bl-full pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="px-2.5 py-0.5 bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 text-[10px] font-bold uppercase tracking-widest rounded-md inline-flex items-center gap-1.5 mb-1.5">
                <ShieldCheck className="h-3.5 w-3.5" /> Central Operations Control Active
              </span>
              <h2 className="font-headline text-2xl font-bold text-white">Atelier Principal Admin Override Console</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  triggerHaptic('light');
                  setActiveTab('team');
                }}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-primary border border-white/10 rounded-lg text-xs font-headline font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 select-none cursor-pointer"
              >
                <Users className="h-4 w-4" /> Schedule Team Work
              </button>
              <button
                onClick={() => {
                  triggerHaptic('light');
                  setActiveTab('projects');
                }}
                className="px-4 py-2 bg-primary hover:bg-white hover:text-black text-white rounded-lg text-xs font-headline font-bold uppercase tracking-wider transition-all shadow-sm select-none cursor-pointer"
              >
                Go to Projects View
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Quick Add Project Box (col-span-4) */}
            <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col gap-4">
              <h3 className="font-headline text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="h-4 w-4" /> Quick Register Site
              </h3>
              
              {quickMsg && (
                <div className="p-3 bg-emerald-950/30 text-emerald-400 border border-emerald-900/30 rounded-lg text-xs font-sans flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" /> {quickMsg}
                </div>
              )}

              <form onSubmit={handleQuickAddSubmit} className="flex flex-col gap-3">
                <div>
                  <label className="block text-[10px] font-headline font-bold uppercase tracking-wider text-on-surface-variant mb-1">Site Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wayanad Tree Cabins"
                    value={quickName}
                    onChange={(e) => setQuickName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-primary rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary placeholder-white/20"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-headline font-bold uppercase tracking-wider text-on-surface-variant mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kalpetta, Wayanad"
                    value={quickLocation}
                    onChange={(e) => setQuickLocation(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-primary rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary placeholder-white/20"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-headline font-bold uppercase tracking-wider text-on-surface-variant mb-1">Initial Status</label>
                  <select
                    value={showCustomStatusInput ? 'Custom' : quickStatus}
                    onChange={(e) => {
                      if (e.target.value === 'Custom') {
                        setShowCustomStatusInput(true);
                      } else {
                        setShowCustomStatusInput(false);
                        setQuickStatus(e.target.value);
                      }
                    }}
                    className="w-full bg-[#0c0c0c] border border-white/10 focus:border-primary rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary mb-2"
                  >
                    <option className="bg-[#0c0c0c]" value="Active">Active</option>
                    <option className="bg-[#0c0c0c]" value="Drafting">Drafting</option>
                    <option className="bg-[#0c0c0c]" value="Completed">Completed</option>
                    <option className="bg-[#0c0c0c]" value="Custom">Custom / Other (Type Manually)...</option>
                  </select>

                  {showCustomStatusInput && (
                    <input
                      type="text"
                      required
                      placeholder="Enter custom initial status (e.g. On Hold, Planning)"
                      value={customStatus}
                      onChange={(e) => setCustomStatus(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 focus:border-primary rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary placeholder-white/20 animate-fadeIn"
                    />
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-2.5 bg-primary hover:bg-white hover:text-black text-white font-headline text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] select-none cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> Add to Registry
                </button>
              </form>
            </div>

            {/* Interactive Registry Directory (col-span-8) */}
            <div className="lg:col-span-8 bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col gap-4">
              <h3 className="font-headline text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="h-4 w-4" /> Live Interactive Registry Modifier
              </h3>

              <div className="overflow-x-auto max-h-[300px] overflow-y-auto pr-1">
                <table className="w-full text-left border-collapse text-xs font-sans">
                  <thead>
                    <tr className="border-b border-white/10 text-on-surface-variant font-headline uppercase font-bold tracking-wider text-[10px]">
                      <th className="py-2.5 px-3">Project / Site</th>
                      <th className="py-2.5 px-3">Current Phase</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {projects.map((proj) => {
                      const isEditing = editingProjId === proj.id;
                      return (
                        <tr key={proj.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-3 px-3">
                            <div className="font-semibold text-white truncate max-w-[130px]" title={proj.name}>
                              {proj.name}
                            </div>
                            <div className="text-[10px] text-on-surface-variant truncate max-w-[130px]">
                              {proj.location}
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editPhase}
                                onChange={(e) => setEditPhase(e.target.value)}
                                className="bg-[#0c0c0c] border border-white/10 focus:border-primary px-2 py-1 rounded text-xs text-white w-28 focus:outline-none focus:ring-1 focus:ring-primary"
                              />
                            ) : (
                              <span className="text-white">{proj.phase}</span>
                            )}
                          </td>

                          <td className="py-3 px-3">
                            {isEditing ? (
                              <select
                                value={editStatus}
                                onChange={(e) => setEditStatus(e.target.value as any)}
                                className="bg-[#0c0c0c] border border-white/10 focus:border-primary px-1.5 py-1 rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary"
                              >
                                <option value="Active">Active</option>
                                <option value="Drafting">Drafting</option>
                                <option value="Completed">Completed</option>
                              </select>
                            ) : (
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                proj.status === 'Active' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' :
                                proj.status === 'Completed' ? 'bg-blue-950/40 text-blue-400 border border-blue-900/30' :
                                'bg-amber-950/40 text-amber-400 border border-amber-900/30'
                              }`}>
                                {proj.status}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right">
                            {isEditing ? (
                              <div className="flex justify-end gap-1.5">
                                <button
                                  onClick={() => handleQuickSave(proj)}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-bold uppercase active:scale-[0.98] transition-all cursor-pointer select-none"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => {
                                    triggerHaptic('light');
                                    setEditingProjId(null);
                                  }}
                                  className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-white rounded text-[10px] active:scale-[0.98] transition-all cursor-pointer select-none"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex justify-end gap-1">
                                <button
                                  onClick={() => startQuickEdit(proj)}
                                  className="p-1 text-on-surface-variant hover:text-primary hover:bg-white/10 rounded transition-colors"
                                  title="Edit Project parameters"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    triggerHaptic('medium');
                                    if (confirm(`Remove ${proj.name} from studio registry?`)) {
                                      onDeleteProject(proj.id);
                                    }
                                  }}
                                  className="p-1 text-on-surface-variant hover:text-error hover:bg-white/10 rounded transition-colors"
                                  title="Delete Project"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </section>
      ) : (
        /* Guest prompt box to quick sign in as Admin */
        <section className="bg-white/5 border border-amber-900/30 rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-amber-950/40 text-amber-500 rounded-lg shrink-0 mt-0.5">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-headline text-base font-bold text-white">Central Studio Operations Console</h3>
              <p className="font-sans text-xs text-on-surface-variant mt-1 leading-relaxed max-w-2xl">
                Log in as the Atelier Principal Admin (`admin@123` / `12345`) to unlock complete real-time database modifications, direct site registers, phase editing, and team work allocation schedules.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              triggerHaptic('success');
              const adminSession: UserSession = {
                email: 'admin@123',
                name: 'Aravind Menon',
                role: 'Admin',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80'
              };
              localStorage.setItem('ekoh_user', JSON.stringify(adminSession));
              window.location.reload();
            }}
            className="px-5 py-3 bg-amber-950/50 hover:bg-amber-900/60 text-amber-300 border border-amber-800/40 font-headline text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-sm shrink-0 self-stretch sm:self-auto text-center cursor-pointer select-none"
          >
            One-Click Admin Login
          </button>
        </section>
      )}

      {/* Bento Grid Layout for Main Content */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Recent Updates Column (8 cols) */}
        <div className="lg:col-span-8 bg-white/40 backdrop-blur-md rounded-xl shadow-[0_8px_32px_rgba(139,94,60,0.04)] border border-white/30 p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-white/60 to-transparent rounded-tl-xl pointer-events-none" />
          
          <div className="flex justify-between items-center border-b border-white/30 pb-4 relative z-10">
            <h2 className="font-headline text-xl font-bold text-charcoal-text">
              Recent Updates
            </h2>
            <button 
              onClick={() => {
                triggerHaptic('light');
                setActiveTab('projects');
              }}
              className="font-headline text-xs font-bold text-terracotta hover:text-laterite-red transition-all flex items-center gap-1.5 group select-none"
            >
              View All 
              <ChevronRight className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <ul className="flex flex-col relative z-10 divide-y divide-white/30">
            {updates.map((update) => (
              <li 
                key={update.id} 
                className="py-4 first:pt-0 last:pb-0 flex gap-4 items-start group"
              >
                <div className="p-2.5 bg-white/50 rounded-full text-teak-brown group-hover:bg-terracotta group-hover:text-white transition-all duration-300 shadow-sm">
                  {getUpdateIcon(update.type)}
                </div>
                <div className="flex-grow flex flex-col gap-1">
                  <div className="flex justify-between items-baseline gap-2">
                    <span className="font-headline text-sm font-semibold text-charcoal-text group-hover:text-primary transition-colors">
                      {update.title}
                    </span>
                    <span className="font-sans text-xs text-on-surface-variant whitespace-nowrap opacity-80">
                      {update.timeAgo}
                    </span>
                  </div>
                  <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                    {update.subtitle}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Actions / Context Column (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Start New Analysis Card */}
          <div className="bg-primary-container/85 backdrop-blur-md border border-white/20 text-on-primary-container rounded-xl p-8 shadow-md flex flex-col gap-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-tl-xl pointer-events-none" />
            
            {/* Subtle grid pattern */}
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none" 
              style={{
                backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }} 
            />

            <div className="relative z-10 flex flex-col gap-2">
              <h3 className="font-headline text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-tertiary-fixed" />
                Start New Analysis
              </h3>
              <p className="font-sans text-sm text-primary-fixed-dim leading-relaxed">
                Run environmental or structural diagnostics on any blueprint parameters or design schemes.
              </p>
            </div>

            <button 
              onClick={() => {
                triggerHaptic('light');
                onUploadClick();
              }}
              className="relative z-10 w-full py-3.5 px-4 bg-white/90 hover:bg-white text-primary font-headline text-sm font-bold rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 active:scale-[0.98] select-none"
            >
              <Upload className="h-4.5 w-4.5" /> 
              Upload & Analyze
            </button>
          </div>

          {/* Featured Image Card */}
          {featuredProject && (
            <div 
              onClick={() => {
                triggerHaptic('light');
                onProjectClick(featuredProject);
              }}
              className="bg-white/40 backdrop-blur-md rounded-xl shadow-[0_8px_32px_rgba(139,94,60,0.04)] border border-white/30 p-4 flex flex-col gap-4 relative overflow-hidden cursor-pointer group hover:shadow-[0_8px_32px_rgba(139,94,60,0.08)] hover:scale-[1.01] transition-all duration-300"
            >
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-white/60 to-transparent rounded-tl-xl pointer-events-none z-10" />
              
              <div 
                className="w-full h-48 rounded-lg overflow-hidden relative z-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.02]"
                style={{ backgroundImage: `url('${featuredProject.image}')` }}
                title="Wayanad Retreat Concept Model"
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
              </div>

              <div className="relative z-10 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <span className="px-2.5 py-1 bg-white/60 text-teak-brown font-headline text-xs font-bold rounded-full border border-white/40 shadow-sm">
                    Featured Project
                  </span>
                  <span className="px-2 py-0.5 bg-primary/10 border border-primary/20 text-primary font-headline text-[10px] font-bold uppercase rounded tracking-wider">
                    {featuredProject.updateStage || 'On Office'}
                  </span>
                </div>
                <h4 className="font-headline text-base font-bold text-charcoal-text group-hover:text-primary transition-colors">
                  {featuredProject.name}
                </h4>
                <p className="font-sans text-xs text-on-surface-variant mt-1">
                  {featuredProject.location} • Rammed Earth & Passive Solar
                </p>

                {/* Micro payment bar inside featured card */}
                {(() => {
                  const stage = featuredProject.updateStage || 'On Office';
                  let pInfo = { requiredAmount: 150000, paidAmount: 150000, status: 'Fully Paid' };
                  if (stage === 'On Office') pInfo = featuredProject.officePayment || pInfo;
                  else if (stage === 'On Production') pInfo = featuredProject.productionPayment || { requiredAmount: 500000, paidAmount: 250000, status: 'Partially Paid' };
                  else pInfo = featuredProject.sitePayment || { requiredAmount: 800000, paidAmount: 0, status: 'Pending' };

                  return (
                    <div className="mt-3 pt-3 border-t border-white/20 flex justify-between items-center text-[10px]">
                      <span className="text-on-surface-variant">Active Term Payment:</span>
                      <span className={`font-headline font-bold uppercase tracking-wider ${
                        pInfo.status === 'Fully Paid' ? 'text-emerald-600 font-bold' :
                        pInfo.status === 'Partially Paid' ? 'text-amber-600 font-bold' : 'text-rose-700 font-bold'
                      }`}>
                        {pInfo.status}
                      </span>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

        </div>
      </section>

    </div>
  );
}
