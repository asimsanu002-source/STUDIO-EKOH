import { useState, FormEvent, useEffect } from 'react';
import { 
  Plus, 
  MapPin, 
  Layers, 
  Search, 
  Trash2, 
  Sparkles,
  Building,
  RotateCcw,
  X,
  FileCheck,
  Pencil,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Project, UserSession } from '../types';
import { triggerHaptic } from '../utils/haptic';

interface ProjectsViewProps {
  projects: Project[];
  onAddProject: (newProj: Omit<Project, 'id' | 'timeAgo' | 'dateAdded'>) => void;
  onDeleteProject: (id: string) => void;
  onProjectClick: (project: Project) => void;
  currentUser: UserSession | null;
  onUpdateProject: (updatedProj: Project) => void;
}

export default function ProjectsView({ 
  projects, 
  onAddProject, 
  onDeleteProject,
  onProjectClick,
  currentUser,
  onUpdateProject
}: ProjectsViewProps) {
  
  const [filter, setFilter] = useState<'All' | 'Active' | 'Completed' | 'Drafting' | 'EmptySim'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states (Add)
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [phase, setPhase] = useState('');
  const [status, setStatus] = useState<'Active' | 'Completed' | 'Drafting'>('Active');
  const [squareFootage, setSquareFootage] = useState(2500);
  const [budget, setBudget] = useState(6000000);
  const [materialsInput, setMaterialsInput] = useState('Laterite Stone, Teak Wood, Clay Roof Tiles');

  // Custom stage and payment states (Add)
  const [updateStage, setUpdateStage] = useState<'On Office' | 'On Production' | 'On Site'>('On Office');
  const [officeUpdate, setOfficeUpdate] = useState<'3D Update' | '2D Update'>('3D Update');
  const [productionUpdate, setProductionUpdate] = useState<'Furniture and art production' | 'Material selection and confirmation updates'>('Furniture and art production');
  const [siteUpdate, setSiteUpdate] = useState<'Site works update'>('Site works update');
  const [paymentAmount, setPaymentAmount] = useState<number>(150000);
  const [paymentPaid, setPaymentPaid] = useState<number>(150000);
  const [paymentStatus, setPaymentStatus] = useState<'Pending' | 'Partially Paid' | 'Fully Paid'>('Fully Paid');

  // Edit project states
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editPhase, setEditPhase] = useState('');
  const [editStatus, setEditStatus] = useState<'Active' | 'Completed' | 'Drafting'>('Active');
  const [editSquareFootage, setEditSquareFootage] = useState(2500);
  const [editBudget, setEditBudget] = useState(6000000);
  const [editMaterialsInput, setEditMaterialsInput] = useState('');

  // Custom stage and payment states (Edit)
  const [editUpdateStage, setEditUpdateStage] = useState<'On Office' | 'On Production' | 'On Site'>('On Office');
  const [editOfficeUpdate, setEditOfficeUpdate] = useState<'3D Update' | '2D Update'>('3D Update');
  const [editProductionUpdate, setEditProductionUpdate] = useState<'Furniture and art production' | 'Material selection and confirmation updates'>('Furniture and art production');
  const [editSiteUpdate, setEditSiteUpdate] = useState<'Site works update'>('Site works update');
  const [editPaymentAmount, setEditPaymentAmount] = useState<number>(0);
  const [editPaymentPaid, setEditPaymentPaid] = useState<number>(0);
  const [editPaymentStatus, setEditPaymentStatus] = useState<'Pending' | 'Partially Paid' | 'Fully Paid'>('Pending');

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

  // Update payment form defaults when Add stage changes
  useEffect(() => {
    if (updateStage === 'On Office') {
      setPaymentAmount(150000);
      setPaymentPaid(150000);
      setPaymentStatus('Fully Paid');
    } else if (updateStage === 'On Production') {
      setPaymentAmount(500000);
      setPaymentPaid(250000);
      setPaymentStatus('Partially Paid');
    } else if (updateStage === 'On Site') {
      setPaymentAmount(800000);
      setPaymentPaid(0);
      setPaymentStatus('Pending');
    }
  }, [updateStage]);

  useEffect(() => {
    if (editingProject) {
      setEditName(editingProject.name);
      setEditDescription(editingProject.description);
      setEditLocation(editingProject.location);
      setEditPhase(editingProject.phase);
      setEditStatus(editingProject.status);
      setEditSquareFootage(editingProject.squareFootage);
      setEditBudget(editingProject.budget);
      setEditMaterialsInput(editingProject.materials.join(', '));

      // Stage & options
      const activeStage = editingProject.updateStage || 'On Office';
      setEditUpdateStage(activeStage);
      setEditOfficeUpdate(editingProject.officeUpdate || '3D Update');
      setEditProductionUpdate(editingProject.productionUpdate || 'Furniture and art production');
      setEditSiteUpdate(editingProject.siteUpdate || 'Site works update');

      // Sync payments based on active stage
      if (activeStage === 'On Office') {
        setEditPaymentAmount(editingProject.officePayment?.requiredAmount || 150000);
        setEditPaymentPaid(editingProject.officePayment?.paidAmount || 150000);
        setEditPaymentStatus(editingProject.officePayment?.status || 'Fully Paid');
      } else if (activeStage === 'On Production') {
        setEditPaymentAmount(editingProject.productionPayment?.requiredAmount || 500000);
        setEditPaymentPaid(editingProject.productionPayment?.paidAmount || 250000);
        setEditPaymentStatus(editingProject.productionPayment?.status || 'Partially Paid');
      } else if (activeStage === 'On Site') {
        setEditPaymentAmount(editingProject.sitePayment?.requiredAmount || 800000);
        setEditPaymentPaid(editingProject.sitePayment?.paidAmount || 0);
        setEditPaymentStatus(editingProject.sitePayment?.status || 'Pending');
      }
    }
  }, [editingProject]);

  // Sync payments when Edit stage changes in the edit modal
  const handleEditStageChange = (newStage: 'On Office' | 'On Production' | 'On Site') => {
    setEditUpdateStage(newStage);
    if (editingProject) {
      if (newStage === 'On Office') {
        setEditPaymentAmount(editingProject.officePayment?.requiredAmount || 150000);
        setEditPaymentPaid(editingProject.officePayment?.paidAmount || 150000);
        setEditPaymentStatus(editingProject.officePayment?.status || 'Fully Paid');
      } else if (newStage === 'On Production') {
        setEditPaymentAmount(editingProject.productionPayment?.requiredAmount || 500000);
        setEditPaymentPaid(editingProject.productionPayment?.paidAmount || 250000);
        setEditPaymentStatus(editingProject.productionPayment?.status || 'Partially Paid');
      } else if (newStage === 'On Site') {
        setEditPaymentAmount(editingProject.sitePayment?.requiredAmount || 800000);
        setEditPaymentPaid(editingProject.sitePayment?.paidAmount || 0);
        setEditPaymentStatus(editingProject.sitePayment?.status || 'Pending');
      }
    } else {
      if (newStage === 'On Office') {
        setEditPaymentAmount(150000);
        setEditPaymentPaid(150000);
        setEditPaymentStatus('Fully Paid');
      } else if (newStage === 'On Production') {
        setEditPaymentAmount(500000);
        setEditPaymentPaid(250000);
        setEditPaymentStatus('Partially Paid');
      } else if (newStage === 'On Site') {
        setEditPaymentAmount(800000);
        setEditPaymentPaid(0);
        setEditPaymentStatus('Pending');
      }
    }
  };

  const handleEditFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editName || !editLocation) return;

    triggerHaptic('success');

    const materialsArray = editMaterialsInput
      .split(',')
      .map(m => m.trim())
      .filter(m => m.length > 0);

    const updatedProject: Project = {
      ...editingProject,
      name: editName,
      description: editDescription || 'Revised premium sustainable architectural site designed with vernacular materials.',
      location: editLocation,
      phase: editPhase || 'Concept Planning',
      status: editStatus,
      squareFootage: Number(editSquareFootage) || 2500,
      budget: Number(editBudget) || 5000000,
      revenue: Math.round((Number(editBudget) || 5000000) * 1.2),
      materials: materialsArray,
      updateStage: editUpdateStage,
      officeUpdate: editOfficeUpdate,
      productionUpdate: editProductionUpdate,
      siteUpdate: editSiteUpdate,
    };

    // Save active stage payment
    if (editUpdateStage === 'On Office') {
      updatedProject.officePayment = {
        requiredAmount: Number(editPaymentAmount),
        paidAmount: Number(editPaymentPaid),
        status: editPaymentStatus
      };
    } else if (editUpdateStage === 'On Production') {
      updatedProject.productionPayment = {
        requiredAmount: Number(editPaymentAmount),
        paidAmount: Number(editPaymentPaid),
        status: editPaymentStatus
      };
    } else if (editUpdateStage === 'On Site') {
      updatedProject.sitePayment = {
        requiredAmount: Number(editPaymentAmount),
        paidAmount: Number(editPaymentPaid),
        status: editPaymentStatus
      };
    }

    onUpdateProject(updatedProject);
    setEditingProject(null);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !location) return;

    triggerHaptic('success');

    const materialsArray = materialsInput
      .split(',')
      .map(m => m.trim())
      .filter(m => m.length > 0);

    const newProjData: Omit<Project, 'id' | 'timeAgo' | 'dateAdded'> = {
      name,
      description: description || 'A new premium sustainable architectural site designed with vernacular materials.',
      location,
      phase: phase || 'Concept Planning',
      status,
      squareFootage: Number(squareFootage) || 2500,
      budget: Number(budget) || 5000000,
      revenue: Math.round((Number(budget) || 5000000) * 1.2),
      materials: materialsArray,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoEzCiHcr6T33oXRhg8yVzKOK8Qhit3-xzNVGnp5tm2VA4VRsELyrvFB6F8Ltn_GgudlW2OfOT_dIirGVQo7GGubIINhkDgfhsbfKUoRvwVHltvntzwqPBLCxYfi8xabh8Hyf8X8tT2y5r7CuUXBUEtvXvdAN1xX0Hj2zAkionQCSkK3uTkf_Ln3BbGRO3fLeMe2Dbrraav6ORE3DWUO235dzpe7FiyhbTAI3yUXIkU7H1P9X3KVPDxKDQ7y7gfYwpS3mx_uhMM3s',
      updateStage,
      officeUpdate,
      productionUpdate,
      siteUpdate,
    };

    // Save active stage payment
    if (updateStage === 'On Office') {
      newProjData.officePayment = {
        requiredAmount: Number(paymentAmount),
        paidAmount: Number(paymentPaid),
        status: paymentStatus
      };
    } else if (updateStage === 'On Production') {
      newProjData.productionPayment = {
        requiredAmount: Number(paymentAmount),
        paidAmount: Number(paymentPaid),
        status: paymentStatus
      };
    } else if (updateStage === 'On Site') {
      newProjData.sitePayment = {
        requiredAmount: Number(paymentAmount),
        paidAmount: Number(paymentPaid),
        status: paymentStatus
      };
    }

    onAddProject(newProjData);

    // Reset Form
    setName('');
    setDescription('');
    setLocation('');
    setPhase('');
    setStatus('Active');
    setSquareFootage(2500);
    setBudget(6000000);
    setMaterialsInput('Laterite Stone, Teak Wood, Clay Roof Tiles');
    setUpdateStage('On Office');
    setOfficeUpdate('3D Update');
    setProductionUpdate('Furniture and art production');
    setSiteUpdate('Site works update');
    setIsAddModalOpen(false);
  };

  // Filter projects
  const filteredProjects = projects.filter(p => {
    if (filter === 'EmptySim') return false; // Show 0 results for empty state simulation
    
    const matchesFilter = filter === 'All' || p.status === filter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.materials.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (projStatus: string) => {
    switch (projStatus) {
      case 'Active':
        return 'bg-laterite-red/10 text-laterite-red border border-laterite-red/20';
      case 'Completed':
        return 'bg-terracotta/10 text-[#8B5E3C] border border-terracotta/20';
      case 'Drafting':
        return 'bg-teak-brown/10 text-teak-brown border border-teak-brown/20';
      default:
        return 'bg-neutral-100 text-neutral-600 border border-neutral-200';
    }
  };

  return (
    <div className="flex flex-col gap-12 md:gap-16">
      
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="font-headline text-5xl md:text-6xl font-bold text-charcoal-text tracking-tight">
            Projects
          </h1>
          <p className="font-sans text-base md:text-lg text-on-surface-variant leading-relaxed max-w-2xl mt-2">
            Active Project Sites & Construction Coordination. Track project phases, structural risks, carbon footprint diagnostics, and local Kerala masonry operations.
          </p>
        </div>

        {filter !== 'EmptySim' && (
          <button
            onClick={() => {
              triggerHaptic('light');
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-6 py-3.5 bg-laterite-red hover:bg-primary-container text-white font-headline text-sm font-semibold rounded-lg shadow-md transition-all active:scale-[0.98] select-none"
          >
            <Plus className="h-5 w-5" />
            Add Project
          </button>
        )}
      </header>

      {/* Admin Override Alert Banner */}
      {currentUser?.role === 'Admin' ? (
        <div className="flex items-center justify-between gap-3 bg-emerald-950/20 border border-emerald-900/30 p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-950/40 text-emerald-400 rounded-lg">
              <ShieldCheck className="h-5.5 w-5.5" />
            </div>
            <div>
              <p className="font-headline text-xs font-bold text-white uppercase tracking-wider">Atelier Principal Admin Override Mode</p>
              <p className="font-sans text-xs text-emerald-400 font-medium">Logged in as Aravind Menon. Full architectural override permissions: Add, Delete, and Edit/Update projects active.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3 bg-amber-950/20 border border-amber-900/30 p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-950/40 text-amber-500 rounded-lg">
              <AlertCircle className="h-5.5 w-5.5" />
            </div>
            <div>
              <p className="font-headline text-xs font-bold text-white uppercase tracking-wider">Atelier Guest Registry Sandbox</p>
              <p className="font-sans text-xs text-amber-400 font-medium">You are in Sandbox Review. Log in as Admin (`admin@123` / `12345`) via the Account button to unlock production persistence.</p>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 w-full border-b border-teak-brown/10 pb-4">
        {/* Toggle Pills */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {(['All', 'Active', 'Completed', 'Drafting'] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => {
                triggerHaptic('light');
                setFilter(opt);
              }}
              className={`px-4 py-2 font-headline text-xs font-bold uppercase tracking-wider rounded-lg transition-all select-none ${
                filter === opt 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'bg-white/5 text-on-surface-variant hover:bg-white/10'
              }`}
            >
              {opt}
            </button>
          ))}
          
          {/* Empty State Simulation toggle button */}
          <button
            onClick={() => {
              triggerHaptic('medium');
              setFilter(filter === 'EmptySim' ? 'All' : 'EmptySim');
            }}
            className={`px-3.5 py-2 font-headline text-xs font-bold uppercase tracking-wider rounded-lg border transition-all flex items-center gap-1.5 select-none ${
              filter === 'EmptySim'
                ? 'bg-primary border-primary text-white shadow-sm'
                : 'border-dashed border-white/20 text-primary hover:bg-white/5'
            }`}
            title="Toggle empty state mockup"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {filter === 'EmptySim' ? 'Exit Empty Sim' : 'Simulate Empty State'}
          </button>
        </div>

        {/* Search input field */}
        {filter !== 'EmptySim' && (
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search by name, stone, timber..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-primary rounded-lg py-2.5 pl-10 pr-4 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all text-white placeholder-white/30"
            />
            <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-on-surface-variant/60" />
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {filter === 'EmptySim' || filteredProjects.length === 0 ? (
        
        /* Empty State Layout (Exact Replica of Uploaded Image) */
        <div className="flex flex-col items-center justify-center py-12 w-full">
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 md:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/10 w-full max-w-3xl text-center flex flex-col items-center gap-8 relative overflow-hidden group hover:border-primary/20 transition-all duration-300 transform hover:scale-[1.01]">
            
            {/* Liquid gloss highlight */}
            <div className="absolute -top-[100px] -left-[100px] w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-50 pointer-events-none" />
            
            {/* Architectural grid overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px]" />
            
            <div className="w-56 h-56 md:w-64 md:h-64 relative bg-white/5 rounded-lg p-2 border border-white/10 shadow-inner flex items-center justify-center">
              <img 
                alt="Architectural sketch" 
                className="w-full h-full object-contain opacity-90 transition-transform duration-500 group-hover:scale-105 invert" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmSLsYOAvildpJZu2jjwEHea8x8DDaDinMhz8hp7j_mge5wE0Y_6rMyCs1KurPzo7H4ThhfiCsMqk-hPzawgHSDgb6c805elC2Z0eSyVqlU3E3jQehylVUimcj3YBJQuzum5xARclt0xpOwYev9VlUGXo4QdzSpbXdMwqJ8_KSk6dQUxKrDcdWHqM4jmrheRid3fknGpdKbK3CjqoyT3HwZFPgV3_Zbrf1fachXHYIQdKttQylBaqS9iigWp9WDXeR8mX2lMlKVNo"
              />
            </div>

            <div className="flex flex-col gap-3 max-w-md relative z-10">
              <h2 className="font-headline text-3xl font-bold text-primary tracking-tight">
                No Active Sites Found
              </h2>
              <p className="font-sans text-base text-on-surface-variant font-medium leading-relaxed">
                No active project sites are currently initialized. Add a new construction site or design scheme to begin managing team workflows and spatial diagnostics.
              </p>
            </div>

            <button 
              onClick={() => {
                triggerHaptic('medium');
                setFilter('All');
                setIsAddModalOpen(true);
              }}
              className="relative z-10 bg-laterite-red hover:bg-primary-container text-white font-headline text-sm font-semibold px-8 py-4 rounded-lg flex items-center gap-2 shadow-sm transition-all active:scale-[0.98]"
            >
              <Plus className="h-5 w-5" />
              Add Project
            </button>
          </div>
        </div>

      ) : (
        
        /* Active Project Sites Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white/5 backdrop-blur-md rounded-xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.4)] border border-white/10 hover:border-primary/40 hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between cursor-pointer group"
              onClick={() => {
                triggerHaptic('light');
                onProjectClick(project);
              }}
            >
              <div>
                {/* Header info */}
                <div className="flex justify-between items-start gap-4 mb-4">
                  <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerHaptic('light');
                        setEditingProject(project);
                      }}
                      className="p-1.5 text-on-surface-variant/50 hover:text-primary hover:bg-white/10 rounded-md transition-all"
                      title="Edit project parameters"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerHaptic('medium');
                        if(confirm(`Remove ${project.name}?`)) {
                          onDeleteProject(project.id);
                        }
                      }}
                      className="p-1.5 text-on-surface-variant/50 hover:text-error hover:bg-white/10 rounded-md transition-all"
                      title="Delete project"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Cover Image or placeholder blueprint icon */}
                {project.image ? (
                  <div className="w-full h-40 rounded-lg overflow-hidden mb-4 relative bg-[#0c0c0c] border border-white/10">
                    <img 
                      src={project.image} 
                      alt={project.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="w-full h-40 rounded-lg bg-white/5 border border-dashed border-white/10 mb-4 flex flex-col items-center justify-center gap-2 text-primary/40 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:20px_20px]" />
                    <Building className="h-10 w-10 stroke-[1.5]" />
                    <span className="font-headline text-xs font-bold uppercase tracking-widest">Architectural Site</span>
                  </div>
                )}

                {/* Project Details */}
                <h3 className="font-headline text-xl font-bold text-charcoal-text group-hover:text-primary transition-colors line-clamp-1 mb-1">
                  {project.name}
                </h3>
                
                <p className="font-sans text-xs text-on-surface-variant flex items-center gap-1 mb-3">
                  <MapPin className="h-3 w-3 text-teak-brown" />
                  {project.location}
                </p>

                {/* Custom Workflow & Payments Mini Widget */}
                {(() => {
                  const stage = project.updateStage || 'On Office';
                  let updateType = '';
                  let payStatus = 'Fully Paid';
                  
                  if (stage === 'On Office') {
                    updateType = project.officeUpdate || '3D Update';
                    payStatus = project.officePayment?.status || 'Fully Paid';
                  } else if (stage === 'On Production') {
                    updateType = project.productionUpdate || 'Furniture and art production';
                    payStatus = project.productionPayment?.status || 'Partially Paid';
                  } else {
                    updateType = project.siteUpdate || 'Site works update';
                    payStatus = project.sitePayment?.status || 'Pending';
                  }

                  return (
                    <div className="bg-white/5 border border-white/10 rounded-lg p-2.5 mb-3 flex justify-between items-center text-[10px]">
                      <div>
                        <span className="block font-headline font-bold uppercase tracking-widest text-primary/80">{stage}</span>
                        <span className="text-on-surface-variant font-sans">{updateType}</span>
                      </div>
                      <span className={`px-1.5 py-0.5 rounded font-headline font-bold uppercase tracking-wider ${
                        payStatus === 'Fully Paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        payStatus === 'Partially Paid' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                        'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}>
                        {payStatus}
                      </span>
                    </div>
                  );
                })()}

                <p className="font-sans text-sm text-on-surface-variant line-clamp-2 leading-relaxed mb-4">
                  {project.description}
                </p>
              </div>

              {/* Bottom Metadata & Chips */}
              <div className="border-t border-white/10 pt-4 mt-2">
                <p className="font-headline text-[10px] font-bold uppercase tracking-widest text-primary/60 mb-2">
                  Vernacular Materiality
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.materials.map((m) => (
                    <span 
                      key={m} 
                      className="px-2 py-0.5 bg-white/5 text-on-surface-variant font-sans text-xs rounded border border-white/10"
                    >
                      {m}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center text-xs font-headline font-bold uppercase tracking-wider text-primary">
                  <span>Phase: {project.phase}</span>
                  <span className="text-primary hover:underline flex items-center gap-0.5">
                    Analyze <Sparkles className="h-3 w-3 ml-0.5 text-primary" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slide-over or Modal Add Project Form */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0c0c0c] border border-white/10 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden relative">
            
            {/* Header */}
            <div className="px-6 py-5 bg-white/5 border-b border-white/10 flex justify-between items-center">
              <h2 className="font-headline text-lg font-bold text-white flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-primary" />
                Add New Architectural Site
              </h2>
              <button 
                onClick={() => {
                  triggerHaptic('light');
                  setIsAddModalOpen(false);
                }}
                className="p-1.5 hover:bg-white/10 rounded-full transition-all text-on-surface-variant"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[75vh]">
              
              <div>
                <label className="block font-headline text-xs font-bold uppercase tracking-wider text-primary mb-1.5">Project Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Munnar Tea Estate Cabins"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-primary rounded-lg px-4 py-2.5 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-primary text-white placeholder-white/20 shadow-sm"
                />
              </div>

              <div>
                <label className="block font-headline text-xs font-bold uppercase tracking-wider text-primary mb-1.5">Description</label>
                <textarea
                  placeholder="Outline environmental aims, structural layout, or client expectations..."
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-primary rounded-lg px-4 py-2.5 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-primary text-white resize-none placeholder-white/20 shadow-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-headline text-xs font-bold uppercase tracking-wider text-primary mb-1.5">Location *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alappuzha, Kerala"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-primary rounded-lg px-4 py-2.5 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-primary text-white placeholder-white/20 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block font-headline text-xs font-bold uppercase tracking-wider text-primary mb-1.5">Current Phase</label>
                  <input
                    type="text"
                    placeholder="e.g. Foundations, Framing"
                    value={phase}
                    onChange={(e) => setPhase(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-primary rounded-lg px-4 py-2.5 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-primary text-white placeholder-white/20 shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-headline text-xs font-bold uppercase tracking-wider text-primary mb-1.5">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-white/5 border border-white/10 focus:border-primary rounded-lg px-3 py-2.5 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-primary text-white shadow-sm"
                  >
                    <option className="bg-[#0c0c0c]" value="Active">Active</option>
                    <option className="bg-[#0c0c0c]" value="Drafting">Drafting</option>
                    <option className="bg-[#0c0c0c]" value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block font-headline text-xs font-bold uppercase tracking-wider text-primary mb-1.5">Area (sqft)</label>
                  <input
                    type="number"
                    value={squareFootage}
                    onChange={(e) => setSquareFootage(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 focus:border-primary rounded-lg px-4 py-2.5 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-primary text-white placeholder-white/20 shadow-sm"
                  />
                </div>
              </div>

              {/* Custom Studio Stage & Payment Section */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-3">
                <span className="font-headline text-[10px] font-bold uppercase tracking-wider text-primary">Atelier Workflow & Phase</span>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-white/70 mb-1">Active Stage</label>
                    <select
                      value={updateStage}
                      onChange={(e) => setUpdateStage(e.target.value as any)}
                      className="w-full bg-[#0c0c0c] border border-white/10 focus:border-primary rounded-md px-2.5 py-2 font-sans text-xs focus:outline-none focus:ring-1 focus:ring-primary text-white"
                    >
                      <option value="On Office">On Office</option>
                      <option value="On Production">On Production / Material</option>
                      <option value="On Site">On Site</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-white/70 mb-1">Specific Update Type</label>
                    {updateStage === 'On Office' && (
                      <select
                        value={officeUpdate}
                        onChange={(e) => setOfficeUpdate(e.target.value as any)}
                        className="w-full bg-[#0c0c0c] border border-white/10 focus:border-primary rounded-md px-2.5 py-2 font-sans text-xs focus:outline-none focus:ring-1 focus:ring-primary text-white"
                      >
                        <option value="3D Update">3D Update</option>
                        <option value="2D Update">2D Update</option>
                      </select>
                    )}
                    {updateStage === 'On Production' && (
                      <select
                        value={productionUpdate}
                        onChange={(e) => setProductionUpdate(e.target.value as any)}
                        className="w-full bg-[#0c0c0c] border border-white/10 focus:border-primary rounded-md px-2.5 py-2 font-sans text-xs focus:outline-none focus:ring-1 focus:ring-primary text-white"
                      >
                        <option value="Furniture and art production">Furniture & Art Production</option>
                        <option value="Material selection and confirmation updates">Material Selection & Confirmation</option>
                      </select>
                    )}
                    {updateStage === 'On Site' && (
                      <select
                        value={siteUpdate}
                        disabled
                        className="w-full bg-white/5 border border-white/10 rounded-md px-2.5 py-2 font-sans text-xs text-white/50 cursor-not-allowed"
                      >
                        <option value="Site works update">Site works update</option>
                      </select>
                    )}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-3 mt-1">
                  <span className="block font-headline text-[10px] font-bold uppercase tracking-wider text-primary mb-2">Stage Payment Details (Term-Based)</span>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[9px] font-semibold text-white/60 mb-1">Required (₹)</label>
                      <input
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(Number(e.target.value))}
                        className="w-full bg-[#0c0c0c] border border-white/10 focus:border-primary rounded-md px-2.5 py-1.5 font-sans text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-semibold text-white/60 mb-1">Paid (₹)</label>
                      <input
                        type="number"
                        value={paymentPaid}
                        onChange={(e) => setPaymentPaid(Number(e.target.value))}
                        className="w-full bg-[#0c0c0c] border border-white/10 focus:border-primary rounded-md px-2.5 py-1.5 font-sans text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-semibold text-white/60 mb-1">Status</label>
                      <select
                        value={paymentStatus}
                        onChange={(e) => setPaymentStatus(e.target.value as any)}
                        className="w-full bg-[#0c0c0c] border border-white/10 focus:border-primary rounded-md px-2 py-1.5 font-sans text-xs text-white"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Partially Paid">Partially Paid</option>
                        <option value="Fully Paid">Fully Paid</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-headline text-xs font-bold uppercase tracking-wider text-primary mb-1.5">
                  Materials (comma-separated chips)
                </label>
                <input
                  type="text"
                  placeholder="Laterite Stone, Teak Wood, Bamboo, Thatch..."
                  value={materialsInput}
                  onChange={(e) => setMaterialsInput(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-primary rounded-lg px-4 py-2.5 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-primary text-white placeholder-white/20 shadow-sm"
                />
              </div>

              {/* Submit Actions */}
              <div className="flex gap-4 mt-4 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setIsAddModalOpen(false);
                  }}
                  className="flex-1 py-3 px-4 border border-white/10 text-primary hover:bg-white/5 font-headline text-sm font-semibold rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-primary hover:bg-white hover:text-black text-white font-headline text-sm font-semibold rounded-lg shadow-md transition-all active:scale-[0.98]"
                >
                  Create Project
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Slide-over or Modal Edit Project Form */}
      {editingProject && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0c0c0c] border border-white/10 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden relative">
            
            {/* Header */}
            <div className="px-6 py-5 bg-white/5 border-b border-white/10 flex justify-between items-center">
              <h2 className="font-headline text-lg font-bold text-white flex items-center gap-2">
                <Pencil className="h-5 w-5 text-primary" />
                Edit Architectural Site Details
              </h2>
              <button 
                onClick={() => {
                  triggerHaptic('light');
                  setEditingProject(null);
                }}
                className="p-1.5 hover:bg-white/10 rounded-full transition-all text-on-surface-variant"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleEditFormSubmit} className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[75vh]">
              
              <div>
                <label className="block font-headline text-xs font-bold uppercase tracking-wider text-primary mb-1.5">Project Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Munnar Tea Estate Cabins"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-primary rounded-lg px-4 py-2.5 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-primary text-white placeholder-white/20 shadow-sm"
                />
              </div>

              <div>
                <label className="block font-headline text-xs font-bold uppercase tracking-wider text-primary mb-1.5">Description</label>
                <textarea
                  placeholder="Outline environmental aims, structural layout, or client expectations..."
                  rows={2}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-primary rounded-lg px-4 py-2.5 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-primary text-white resize-none placeholder-white/20 shadow-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-headline text-xs font-bold uppercase tracking-wider text-primary mb-1.5">Location *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alappuzha, Kerala"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-primary rounded-lg px-4 py-2.5 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-primary text-white placeholder-white/20 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block font-headline text-xs font-bold uppercase tracking-wider text-primary mb-1.5">Current Phase</label>
                  <input
                    type="text"
                    placeholder="e.g. Foundations, Framing"
                    value={editPhase}
                    onChange={(e) => setEditPhase(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-primary rounded-lg px-4 py-2.5 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-primary text-white placeholder-white/20 shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-headline text-xs font-bold uppercase tracking-wider text-primary mb-1.5">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full bg-white/5 border border-white/10 focus:border-primary rounded-lg px-3 py-2.5 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-primary text-white shadow-sm"
                  >
                    <option className="bg-[#0c0c0c]" value="Active">Active</option>
                    <option className="bg-[#0c0c0c]" value="Drafting">Drafting</option>
                    <option className="bg-[#0c0c0c]" value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block font-headline text-xs font-bold uppercase tracking-wider text-primary mb-1.5">Area (sqft)</label>
                  <input
                    type="number"
                    value={editSquareFootage}
                    onChange={(e) => setEditSquareFootage(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 focus:border-primary rounded-lg px-4 py-2.5 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-primary text-white placeholder-white/20 shadow-sm"
                  />
                </div>
              </div>

              {/* Custom Studio Stage & Payment Section */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-3">
                <span className="font-headline text-[10px] font-bold uppercase tracking-wider text-primary">Atelier Workflow & Phase</span>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-white/70 mb-1">Active Stage</label>
                    <select
                      value={editUpdateStage}
                      onChange={(e) => handleEditStageChange(e.target.value as any)}
                      className="w-full bg-[#0c0c0c] border border-white/10 focus:border-primary rounded-md px-2.5 py-2 font-sans text-xs focus:outline-none focus:ring-1 focus:ring-primary text-white"
                    >
                      <option value="On Office">On Office</option>
                      <option value="On Production">On Production / Material</option>
                      <option value="On Site">On Site</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-white/70 mb-1">Specific Update Type</label>
                    {editUpdateStage === 'On Office' && (
                      <select
                        value={editOfficeUpdate}
                        onChange={(e) => setEditOfficeUpdate(e.target.value as any)}
                        className="w-full bg-[#0c0c0c] border border-white/10 focus:border-primary rounded-md px-2.5 py-2 font-sans text-xs focus:outline-none focus:ring-1 focus:ring-primary text-white"
                      >
                        <option value="3D Update">3D Update</option>
                        <option value="2D Update">2D Update</option>
                      </select>
                    )}
                    {editUpdateStage === 'On Production' && (
                      <select
                        value={editProductionUpdate}
                        onChange={(e) => setEditProductionUpdate(e.target.value as any)}
                        className="w-full bg-[#0c0c0c] border border-white/10 focus:border-primary rounded-md px-2.5 py-2 font-sans text-xs focus:outline-none focus:ring-1 focus:ring-primary text-white"
                      >
                        <option value="Furniture and art production">Furniture & Art Production</option>
                        <option value="Material selection and confirmation updates">Material Selection & Confirmation</option>
                      </select>
                    )}
                    {editUpdateStage === 'On Site' && (
                      <select
                        value={editSiteUpdate}
                        disabled
                        className="w-full bg-white/5 border border-white/10 rounded-md px-2.5 py-2 font-sans text-xs text-white/50 cursor-not-allowed"
                      >
                        <option value="Site works update">Site works update</option>
                      </select>
                    )}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-3 mt-1">
                  <span className="block font-headline text-[10px] font-bold uppercase tracking-wider text-primary mb-2">Stage Payment Details (Term-Based)</span>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[9px] font-semibold text-white/60 mb-1">Required (₹)</label>
                      <input
                        type="number"
                        value={editPaymentAmount}
                        onChange={(e) => setEditPaymentAmount(Number(e.target.value))}
                        className="w-full bg-[#0c0c0c] border border-white/10 focus:border-primary rounded-md px-2.5 py-1.5 font-sans text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-semibold text-white/60 mb-1">Paid (₹)</label>
                      <input
                        type="number"
                        value={editPaymentPaid}
                        onChange={(e) => setEditPaymentPaid(Number(e.target.value))}
                        className="w-full bg-[#0c0c0c] border border-white/10 focus:border-primary rounded-md px-2.5 py-1.5 font-sans text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-semibold text-white/60 mb-1">Status</label>
                      <select
                        value={editPaymentStatus}
                        onChange={(e) => setEditPaymentStatus(e.target.value as any)}
                        className="w-full bg-[#0c0c0c] border border-white/10 focus:border-primary rounded-md px-2 py-1.5 font-sans text-xs text-white"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Partially Paid">Partially Paid</option>
                        <option value="Fully Paid">Fully Paid</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-headline text-xs font-bold uppercase tracking-wider text-primary mb-1.5">
                  Materials (comma-separated chips)
                </label>
                <input
                  type="text"
                  placeholder="Laterite Stone, Teak Wood, Bamboo, Thatch..."
                  value={editMaterialsInput}
                  onChange={(e) => setEditMaterialsInput(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-primary rounded-lg px-4 py-2.5 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-primary text-white placeholder-white/20 shadow-sm"
                />
              </div>

              {/* Submit Actions */}
              <div className="flex gap-4 mt-4 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setEditingProject(null);
                  }}
                  className="flex-1 py-3 px-4 border border-white/10 text-primary hover:bg-white/5 font-headline text-sm font-semibold rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-primary hover:bg-white hover:text-black text-white font-headline text-sm font-semibold rounded-lg shadow-md transition-all active:scale-[0.98]"
                >
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
