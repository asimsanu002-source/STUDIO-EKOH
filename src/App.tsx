import { useState, useEffect, FormEvent } from 'react';
import { INITIAL_PROJECTS, INITIAL_UPDATES, TEAM_MEMBERS } from './data';
import { Project, StudioUpdate, UserSession, TeamMember, ActivityLog, Task, Complaint } from './types';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import DashboardView from './components/DashboardView';
import ProjectsView from './components/ProjectsView';
import AnalyzerView from './components/AnalyzerView';
import TeamView from './components/TeamView';
import EmployeeView from './components/EmployeeView';
import DiagnosticsModal from './components/DiagnosticsModal';
import LoginModal from './components/LoginModal';
import CultureView from './components/CultureView';

import { 
  Check, 
  Sparkles, 
  AlertCircle, 
  X, 
  Mail, 
  MapPin, 
  Phone, 
  Send,
  MessageSquare,
  AlertTriangle,
  Camera,
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon,
  Search,
  Filter
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // User Session state
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('ekoh_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLogin = (session: UserSession) => {
    setCurrentUser(session);
    localStorage.setItem('ekoh_user', JSON.stringify(session));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ekoh_user');
    localStorage.removeItem('ekoh_members'); // optional, clean session state on logout
  };

  // State for team members with high fidelity seeding
  const [members, setMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('ekoh_members');
    if (saved) return JSON.parse(saved);

    return TEAM_MEMBERS.map(member => {
      let defaultTasks: Task[] = [];
      let initialPerformance = 90;
      let capacity = 75;

      if (member.id === 'team-1') { // Aravind Menon
        initialPerformance = 96;
        capacity = 85;
        defaultTasks = [
          { id: 't1-1', title: 'Carving quality inspection for Kochi Phase 2 Courtyard pillars', completed: true, time: '09:30 AM', category: 'Site Visit', deadline: 'Today 05:00 PM' },
          { id: 't1-2', title: 'Verify basalt load-bearing dry-stack alignment calculations', completed: true, time: '11:00 AM', category: 'Structural', deadline: 'Today 12:00 PM' },
          { id: 't1-3', title: 'Client presentation for Wayanad rammed-earth structural concept', completed: false, time: '03:30 PM', category: 'Client Review', deadline: 'Tomorrow 12:00 PM' },
          { id: 't1-4', title: 'Review local Kerala tile manufacturer certificates', completed: false, time: '05:00 PM', category: 'Material Sourcing', deadline: 'Today 08:00 PM' }
        ];
      } else if (member.id === 'team-2') { // Sneha Joseph
        initialPerformance = 92;
        capacity = 60;
        defaultTasks = [
          { id: 't2-1', title: 'Soil cohesion test analysis on Wayanad site samples', completed: true, time: '10:15 AM', category: 'Structural', deadline: 'Today 12:00 PM' },
          { id: 't2-2', title: 'Formulate low-carbon mud plaster specifications', completed: true, time: '01:30 PM', category: 'Design Drafting', deadline: 'Today 05:00 PM' },
          { id: 't2-3', title: 'Site visit to Varkala Cliffside to assess passive wind lanes', completed: false, time: '04:00 PM', category: 'Site Visit', deadline: 'Tomorrow 05:00 PM' }
        ];
      } else if (member.id === 'team-3') { // Rohan Nair
        initialPerformance = 88;
        capacity = 90;
        defaultTasks = [
          { id: 't3-1', title: 'Review structural bamboo cure bath logs at Munnar Eco-Resort', completed: true, time: '08:45 AM', category: 'Material Sourcing', deadline: 'Today 12:00 PM' },
          { id: 't3-2', title: 'Calculate post-tensioning stress tolerances for Kochi terrace garden', completed: false, time: '02:00 PM', category: 'Structural', deadline: 'Today 05:00 PM' },
          { id: 't3-3', title: 'Approve foundation pour certificate for Villa Nova Phase 2', completed: false, time: '03:45 PM', category: 'Structural', deadline: 'Tomorrow 12:00 PM' },
          { id: 't3-4', title: 'Consult on Alappuzha sweeping roof joint tension models', completed: false, time: '05:30 PM', category: 'Design Drafting', deadline: 'Tomorrow 05:00 PM' }
        ];
      }

      return {
        ...member,
        performance: initialPerformance,
        capacity,
        tasks: defaultTasks,
        sustainabilityScore: member.id === 'team-1' ? 98 : member.id === 'team-2' ? 95 : 92,
        activeSitesCount: member.activeProjectsCount || 2
      };
    });
  });

  // State for global activity logs
  const [globalLogs, setGlobalLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('ekoh_globallogs');
    return saved ? JSON.parse(saved) : [
      { id: 'log-1', memberId: 'team-1', memberName: 'Aravind Menon', role: 'Principal Architect', time: '2 hours ago', text: 'Completed wooden pillar carving precision inspection for Kochi Courtyard site.', severity: 'success' },
      { id: 'log-2', memberId: 'team-2', memberName: 'Sneha Joseph', role: 'Lead Sustainable Planner', time: '4 hours ago', text: 'Delivered finalized rammed-earth soil sample moisture logs for Wayanad review.', severity: 'info' },
      { id: 'log-3', memberId: 'team-3', memberName: 'Rohan Nair', role: 'Structural Engineer', time: '5 hours ago', text: 'Checked Munnar bamboo beetle-proofing curing bath levels and approved next haul.', severity: 'info' }
    ];
  });

  // State for projects with LocalStorage fallback
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('ekoh_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  // State for updates
  const [updates, setUpdates] = useState<StudioUpdate[]>(() => {
    const saved = localStorage.getItem('ekoh_updates');
    return saved ? JSON.parse(saved) : INITIAL_UPDATES;
  });

  // Synchronize active tab based on role
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'Employee') {
        setActiveTab('employee-view');
      } else if (currentUser.role === 'Admin' && activeTab === 'employee-view') {
        setActiveTab('dashboard');
      }
    }
  }, [currentUser]);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('ekoh_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('ekoh_updates', JSON.stringify(updates));
  }, [updates]);

  useEffect(() => {
    localStorage.setItem('ekoh_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('ekoh_globallogs', JSON.stringify(globalLogs));
  }, [globalLogs]);

  // Complaints state with persistence
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem('ekoh_complaints');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'complaint-1',
        name: 'Kalesh R. Pillai',
        email: 'kalesh@greenbuilt.co.in',
        title: 'Rammed Earth Compaction Inconsistencies',
        description: 'We observed slight layer stratification issues on the southern retaining wall at the Wayanad Eco-Resort site. Soil moisture was 14% instead of the specified 11.5%. Please request the site supervisor to recalibrate the pneumatic tamper.',
        category: 'Site Quality',
        urgency: 'Solve within 1 Week',
        status: 'Pending',
        date: '2026-06-26, 02:45 PM',
        image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=400'
      },
      {
        id: 'complaint-2',
        name: 'Archana Varma',
        email: 'archana.v@luxuryvillas.com',
        title: 'Teak Pillar Delivery Delay',
        description: 'The requested seasoned teak pillars for the main reception corridor have not yet reached the Kochi Atelier. This delay threatens to postpone the roof joist framing timeline. We require urgent transit status logs.',
        category: 'Material Delay',
        urgency: 'Urgent Work',
        status: 'Pending',
        date: '2026-06-25, 11:30 AM',
        image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=400'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('ekoh_complaints', JSON.stringify(complaints));
  }, [complaints]);

  const handleUpdateMember = (updatedMember: TeamMember) => {
    setMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
  };

  const handlePostGlobalLog = (text: string, severity: 'success' | 'info' | 'warning') => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      memberId: currentUser?.employeeId || 'admin',
      memberName: currentUser?.name || 'Admin',
      role: currentUser?.role || 'Admin',
      time: 'Just now',
      text,
      severity
    };
    setGlobalLogs(prev => [newLog, ...prev]);
  };

  // Diagnostics modal control states
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [customBlueprintDesc, setCustomBlueprintDesc] = useState<string | null>(null);
  
  // Custom complaint box/account modal control
  const [showContactModal, setShowContactModal] = useState(false);
  const [complaintName, setComplaintName] = useState(currentUser?.name || '');
  const [complaintEmail, setComplaintEmail] = useState(currentUser?.email || '');
  const [complaintCategory, setComplaintCategory] = useState('Site Quality');
  const [complaintUrgency, setComplaintUrgency] = useState<'Urgent Work' | 'Solve within 1 Week' | 'Common Complaint'>('Common Complaint');
  const [complaintTitle, setComplaintTitle] = useState('');
  const [complaintDesc, setComplaintDesc] = useState('');
  const [complaintImage, setComplaintImage] = useState<string>('');
  const [complaintSubmitted, setComplaintSubmitted] = useState(false);
  const [complaintModalTab, setComplaintModalTab] = useState<'submit' | 'view'>('submit');
  const [complaintSearch, setComplaintSearch] = useState('');
  const [complaintFilter, setComplaintFilter] = useState('All');
  const [complaintStatusFilter, setComplaintStatusFilter] = useState<'All' | 'Pending' | 'Completed'>('All');

  useEffect(() => {
    if (currentUser) {
      setComplaintName(currentUser.name);
      setComplaintEmail(currentUser.email || `${currentUser.name.toLowerCase().replace(/\s/g, '')}@studioekoh.com`);
    } else {
      setComplaintName('Anonymous Client');
      setComplaintEmail('client@studioekoh.com');
    }
  }, [currentUser]);

  const handleAddProject = (newProj: Omit<Project, 'id' | 'timeAgo' | 'dateAdded'>) => {
    const projectId = `proj-${Date.now()}`;
    const newProjectRecord: Project = {
      ...newProj,
      id: projectId,
      dateAdded: new Date().toISOString().split('T')[0],
      timeAgo: 'Just now'
    };

    setProjects(prev => [newProjectRecord, ...prev]);

    // Create a matching recent update event automatically!
    const newUpdate: StudioUpdate = {
      id: `upd-${Date.now()}`,
      title: newProj.name,
      subtitle: `New architectural site initiated at ${newProj.location}. Current phase set to: ${newProj.phase}.`,
      timeAgo: 'Just now',
      type: 'architecture'
    };

    setUpdates(prev => [newUpdate, ...prev]);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    // Also delete any updates associated with this project name to keep dashboard neat
    const targetProj = projects.find(p => p.id === id);
    if (targetProj) {
      setUpdates(prev => prev.filter(u => u.title !== targetProj.name));
    }
  };

  const handleUpdateProject = (updatedProj: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProj.id ? updatedProj : p));
    
    // Create an update event for dashboard
    const newUpdate: StudioUpdate = {
      id: `upd-${Date.now()}`,
      title: updatedProj.name,
      subtitle: `Site details revised. Current Phase is ${updatedProj.phase}. Budget updated to ₹${(updatedProj.budget/1000000).toFixed(1)}M.`,
      timeAgo: 'Just now',
      type: 'architecture'
    };
    setUpdates(prev => [newUpdate, ...prev]);
  };

  // Triggered when clicking "Upload File" or "Start Analysis"
  const handleStartAnalysis = () => {
    // Open modal with a generic uploaded state
    setCustomBlueprintDesc("Uploaded file");
    setSelectedProject(null);
  };

  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!complaintTitle.trim() || !complaintDesc.trim()) return;

    const finalName = currentUser?.name || 'Anonymous Client';
    const finalEmail = currentUser?.email || 'client@studioekoh.com';

    const newComplaint: Complaint = {
      id: `complaint-${Date.now()}`,
      name: finalName,
      email: finalEmail,
      title: complaintTitle,
      description: complaintDesc,
      category: complaintCategory,
      urgency: complaintUrgency,
      status: 'Pending',
      image: complaintImage || undefined,
      date: new Date().toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    setComplaints(prev => [newComplaint, ...prev]);
    setComplaintSubmitted(true);
    
    // Log the event globally so workers can see the feedback
    handlePostGlobalLog(`Logged a new public grievance: "${complaintTitle}" [Priority: ${complaintUrgency}]`, 'warning');

    setTimeout(() => {
      setComplaintSubmitted(false);
      setComplaintTitle('');
      setComplaintDesc('');
      setComplaintImage('');
    }, 1200);
  };

  const loggedInMember = members.find(m => m.id === currentUser?.employeeId) || members[0];

  if (!currentUser) {
    return (
      <div className="bg-[#080808] text-white min-h-screen flex items-center justify-center relative bg-[radial-gradient(ellipse_at_top,#2a1f14,#080808_80%)]">
        {/* Aesthetic background design grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        {/* Decorative architectural circle */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full border border-primary/[0.03] pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full border border-primary/[0.02] pointer-events-none" />

        <div className="w-full max-w-md p-6 relative z-10">
          {/* Logo and title */}
          <div className="text-center mb-8 animate-fadeIn">
            <div className="inline-flex items-center justify-center bg-white/5 border border-white/10 p-4 rounded-full mb-4 shadow-lg">
              <img 
                alt="Studio Ekoh Logo" 
                className="h-12 w-12 object-contain invert" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAK6vkYe9SMijBcIl68jlzGGBYE3_n4zLEFX9JGu0t6KQIeW7EYkxzXmHxBZHGp-r1_L3l7odyltfYK4B_PyYtiL1SwAc8I_U5spFxnb6kIrdZupo3tGBkpMO4J164QUij4mzSm1a1xlBu0sreeRCjgdiFNUl2jq3iRvAkslc1Ojakry7S_xpAiFS-s48wVsSFIz9PM4XRkCcclxP44zuw86DlBhZTHAhu1de7pWzsrgrSmvwv6PCUJvZ805kU9VzOPpYJuSBZ1PiA"
              />
            </div>
            <h1 className="font-headline text-3xl font-extrabold tracking-widest text-white uppercase">
              STUDIO <span className="text-primary font-serif italic font-normal">EKOH</span>
            </h1>
            <p className="text-xs font-sans text-on-surface-variant mt-2 max-w-xs mx-auto leading-relaxed uppercase tracking-wider">
              Bio-Climatic Architectural Atelier
            </p>
          </div>
          
          <LoginModal 
            onClose={() => {}} 
            currentUser={null}
            onLogin={handleLogin}
            onLogout={handleLogout}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-warm-cream text-charcoal-text min-h-screen flex flex-col font-sans blueprint-grid relative">
      
      {/* Top sticky glass navbar */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onContactClick={() => setShowContactModal(true)} 
        onAccountClick={() => setShowLoginModal(true)}
        currentUser={currentUser}
      />

      {/* Main Content Area */}
      <main className="flex-grow max-w-[1280px] mx-auto w-full px-6 md:px-16 py-12 md:py-20 relative z-10">
        {activeTab === 'dashboard' && (
          <DashboardView 
            projects={projects}
            updates={updates}
            onUploadClick={handleStartAnalysis}
            onProjectClick={setSelectedProject}
            setActiveTab={setActiveTab}
            currentUser={currentUser}
            onAddProject={handleAddProject}
            onDeleteProject={handleDeleteProject}
            onUpdateProject={handleUpdateProject}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsView 
            projects={projects}
            onAddProject={handleAddProject}
            onDeleteProject={handleDeleteProject}
            onProjectClick={setSelectedProject}
            currentUser={currentUser}
            onUpdateProject={handleUpdateProject}
          />
        )}

        {activeTab === 'analyzer' && (
          <AnalyzerView 
            projects={projects} 
          />
        )}

        {activeTab === 'team' && (
          <TeamView 
            currentUser={currentUser} 
            projects={projects}
            members={members}
            setMembers={setMembers}
            globalLogs={globalLogs}
            setGlobalLogs={setGlobalLogs}
          />
        )}

        {activeTab === 'employee-view' && currentUser?.role === 'Employee' && (
          <EmployeeView 
            currentUser={currentUser}
            memberData={loggedInMember}
            onUpdateMember={handleUpdateMember}
            onLogout={handleLogout}
            onPostGlobalLog={handlePostGlobalLog}
          />
        )}

        {activeTab === 'culture' && (
          <CultureView />
        )}
      </main>

      {/* Footer navigation */}
      <Footer 
        setActiveTab={setActiveTab} 
        onContactClick={() => setShowContactModal(true)} 
      />

      {/* Diagnostics slide-over drawer modal */}
      {(selectedProject || customBlueprintDesc) && (
        <DiagnosticsModal 
          project={selectedProject}
          customBlueprintDescription={customBlueprintDesc}
          onClose={() => {
            setSelectedProject(null);
            setCustomBlueprintDesc(null);
          }}
        />
      )}

      {/* Public Complaint Box & Grievances Ledger Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-[#0c0c0c] border border-white/10 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden relative my-8 flex flex-col max-h-[90vh]">
            
            {/* Header Area */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-white/10 bg-black/40">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-laterite-red/10 border border-laterite-red/20 text-laterite-red rounded-xl">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <span className="px-2 py-0.5 bg-laterite-red/10 text-laterite-red border border-laterite-red/20 text-[9px] font-bold uppercase tracking-widest rounded-md">
                    Live Grievance Hub
                  </span>
                  <h3 className="font-headline text-xl font-bold text-white mt-1">
                    Public Complaint Box & Ledger
                  </h3>
                </div>
              </div>
              <button 
                onClick={() => setShowContactModal(false)}
                className="p-1.5 hover:bg-white/10 rounded-full transition-all text-on-surface-variant"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {/* Unified 2-Column Desktop, 1-Column Mobile Layout */}
            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 bg-black/20">
              
              {/* LEFT COLUMN: Clean Complaint Form */}
              <div className="lg:col-span-5 border-r border-white/10 p-6 flex flex-col justify-between overflow-y-auto bg-black/40">
                <div>
                  <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-laterite-red animate-pulse"></span>
                    <h4 className="font-headline text-base font-bold text-white uppercase tracking-wide">
                      Submit New Complaint
                    </h4>
                  </div>

                  {/* Logged in indicator banner */}
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 mb-4 flex items-center gap-2.5">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 shrink-0"></div>
                    <div className="text-left">
                      <span className="block text-[9px] uppercase font-headline font-bold text-on-surface-variant">Active Submitter Account</span>
                      <span className="block text-xs font-semibold text-white/95">{currentUser?.name || 'Anonymous Client'}</span>
                      <span className="block text-[10px] text-on-surface-variant font-mono truncate max-w-[240px]">{currentUser?.email || 'client@studioekoh.com'}</span>
                    </div>
                  </div>

                  {complaintSubmitted ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center gap-4 bg-white/[0.01] border border-white/5 rounded-xl p-6 my-4 animate-scaleIn">
                      <div className="p-3 bg-emerald-950/40 text-emerald-400 rounded-full border border-emerald-800">
                        <Check className="h-6 w-6" />
                      </div>
                      <h4 className="font-headline text-base font-bold text-white">Grievance Registered Successfully</h4>
                      <p className="font-sans text-xs text-on-surface-variant max-w-xs leading-relaxed">
                        Your complaint has been appended to the public ledger on the right.
                      </p>
                      <button
                        type="button"
                        onClick={() => setComplaintSubmitted(false)}
                        className="mt-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-bold transition-all"
                      >
                        File Another Complaint
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="flex flex-col gap-4">
                      
                      {/* Complaint Category */}
                      <div>
                        <label className="block font-headline text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                          Complaint Type / Category
                        </label>
                        <select
                          value={complaintCategory}
                          onChange={(e) => setComplaintCategory(e.target.value)}
                          className="w-full bg-[#121212] border border-white/10 focus:border-laterite-red rounded-lg px-3 py-2 font-sans text-xs text-white focus:outline-none"
                        >
                          <option value="Site Quality">Site Quality / Compaction</option>
                          <option value="Material Delay">Material Delivery & Delay</option>
                          <option value="Safety & Hazard">Safety & Work Hazard</option>
                          <option value="Structural / Design">Structural / Design Flaws</option>
                          <option value="Other">Other Operational Issues</option>
                        </select>
                      </div>

                      {/* Complaint Urgency / Expected Timeline */}
                      <div>
                        <label className="block font-headline text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                          Urgency & Resolution Priority
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['Urgent Work', 'Solve within 1 Week', 'Common Complaint'] as const).map((opt) => {
                            const getStyle = (type: string) => {
                              if (complaintUrgency === type) {
                                switch (type) {
                                  case 'Urgent Work': return 'border-red-500 bg-red-950/20 text-red-400';
                                  case 'Solve within 1 Week': return 'border-amber-500 bg-amber-950/20 text-amber-400';
                                  default: return 'border-blue-500 bg-blue-950/20 text-blue-400';
                                }
                              }
                              return 'border-white/5 hover:border-white/15 bg-white/[0.02] text-on-surface-variant';
                            };
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setComplaintUrgency(opt)}
                                className={`py-2 px-1 text-center rounded-lg border text-[10px] font-headline font-bold transition-all uppercase tracking-wide leading-tight ${getStyle(opt)}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Subject / Brief Title */}
                      <div>
                        <label className="block font-headline text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                          Brief Subject Line
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Mud stratification cracks on South Wall"
                          value={complaintTitle}
                          onChange={(e) => setComplaintTitle(e.target.value)}
                          className="w-full bg-[#121212] border border-white/10 focus:border-laterite-red rounded-lg px-3 py-2 font-sans text-xs text-white focus:outline-none"
                        />
                      </div>

                      {/* Detailed Description */}
                      <div>
                        <label className="block font-headline text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                          Detailed Description of Grievance
                        </label>
                        <textarea
                          required
                          placeholder="Provide specific details of the issue, site coordinates, or delay particulars..."
                          rows={3}
                          value={complaintDesc}
                          onChange={(e) => setComplaintDesc(e.target.value)}
                          className="w-full bg-[#121212] border border-white/10 focus:border-laterite-red rounded-lg px-3 py-2 font-sans text-xs text-white resize-none focus:outline-none"
                        />
                      </div>

                      {/* Simple Upload & Demo Choice */}
                      <div className="border border-white/5 bg-white/[0.01] rounded-xl p-3">
                        <label className="block font-headline text-[10px] font-bold uppercase tracking-wider text-primary mb-2">
                          Attach Image / Photographic Proof
                        </label>
                        
                        <div className="flex flex-col sm:flex-row gap-3 items-center">
                          {/* Device upload button */}
                          <div className="relative overflow-hidden bg-white/5 hover:bg-white/10 text-white rounded-lg px-3 py-2 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-white/10 w-full sm:w-auto justify-center">
                            <Camera className="h-3.5 w-3.5 text-laterite-red" />
                            <span>Upload Image</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setComplaintImage(reader.result as string);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                          </div>

                          {/* Preview thumbnail */}
                          {complaintImage ? (
                            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-2 py-1 rounded-lg w-full sm:w-auto">
                              <img 
                                src={complaintImage} 
                                alt="Preview" 
                                className="h-8 w-8 object-cover rounded border border-white/10"
                              />
                              <span className="text-[10px] text-emerald-400 font-mono">Attached</span>
                              <button 
                                type="button" 
                                onClick={() => setComplaintImage('')}
                                className="text-red-400 hover:text-red-300 ml-auto"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-on-surface-variant font-sans italic">Optional: upload file proof.</span>
                          )}
                        </div>

                        {/* Quick Presets */}
                        <div className="mt-3 pt-2.5 border-t border-white/5">
                          <span className="block text-[9px] font-headline font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
                            Quick Demo Images:
                          </span>
                          <div className="grid grid-cols-4 gap-1.5">
                            {[
                              { label: 'Fault', url: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=200' },
                              { label: 'Crack', url: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=200' },
                              { label: 'Safety', url: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=200' },
                              { label: 'Wood', url: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=200' }
                            ].map((preset, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setComplaintImage(preset.url)}
                                className={`h-8 overflow-hidden rounded border transition-all ${
                                  complaintImage === preset.url ? 'border-laterite-red scale-105' : 'border-white/10 opacity-60 hover:opacity-100'
                                }`}
                                title={preset.label}
                              >
                                <img src={preset.url} className="w-full h-full object-cover" alt="" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-laterite-red hover:bg-white hover:text-black text-white font-headline text-xs font-bold uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                      >
                        Submit Complaint <Send className="h-4 w-4" />
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: Ledger Feed with 3 Status Sections */}
              <div className="lg:col-span-7 p-6 flex flex-col overflow-hidden bg-black/10">
                
                {/* Search & Status Section Switcher */}
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-4 pb-3 border-b border-white/5">
                  <div className="flex-1 relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-on-surface-variant" />
                    <input
                      type="text"
                      placeholder="Search complaints ledger..."
                      value={complaintSearch}
                      onChange={(e) => setComplaintSearch(e.target.value)}
                      className="bg-[#121212] border border-white/10 rounded-lg pl-8 pr-3 py-1 font-sans text-xs text-white focus:outline-none focus:border-laterite-red w-full"
                    />
                  </div>

                  {/* 3 Section Status filter tabs */}
                  <div className="flex rounded-lg bg-black/40 border border-white/10 p-0.5 shrink-0">
                    {(['All', 'Pending', 'Completed'] as const).map((tab) => {
                      const count = tab === 'All' 
                        ? complaints.length 
                        : complaints.filter(c => c.status === tab).length;

                      const getTabBadge = () => {
                        if (tab === 'Pending') return 'bg-orange-950/40 text-orange-400';
                        if (tab === 'Completed') return 'bg-emerald-950/40 text-emerald-400';
                        return 'bg-zinc-800 text-zinc-300';
                      };

                      return (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setComplaintStatusFilter(tab)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-headline font-bold uppercase tracking-wider transition-all ${
                            complaintStatusFilter === tab 
                              ? 'bg-laterite-red/10 text-laterite-red border border-laterite-red/25' 
                              : 'text-on-surface-variant hover:text-white border border-transparent'
                          }`}
                        >
                          {tab}
                          <span className={`px-1 py-0.1 rounded text-[9px] font-mono ${getTabBadge()}`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Complaint items feed scroll area */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                  {complaints.filter(c => {
                    const term = complaintSearch.toLowerCase();
                    const matchesSearch = c.title.toLowerCase().includes(term) ||
                                          c.description.toLowerCase().includes(term) ||
                                          c.name.toLowerCase().includes(term) ||
                                          c.category.toLowerCase().includes(term);
                    
                    const matchesStatus = complaintStatusFilter === 'All' || c.status === complaintStatusFilter;
                    
                    return matchesSearch && matchesStatus;
                  }).length === 0 ? (
                    <div className="text-center py-16 bg-white/[0.01] rounded-xl border border-white/5 flex flex-col items-center gap-3">
                      <MessageSquare className="h-8 w-8 text-white/15" />
                      <h5 className="font-headline text-xs font-bold text-white">No complaints matches</h5>
                      <p className="font-sans text-[10px] text-on-surface-variant">There are no records in this status division.</p>
                    </div>
                  ) : (
                    complaints
                      .filter(c => {
                        const term = complaintSearch.toLowerCase();
                        const matchesSearch = c.title.toLowerCase().includes(term) ||
                                              c.description.toLowerCase().includes(term) ||
                                              c.name.toLowerCase().includes(term) ||
                                              c.category.toLowerCase().includes(term);
                        
                        const matchesStatus = complaintStatusFilter === 'All' || c.status === complaintStatusFilter;
                        
                        return matchesSearch && matchesStatus;
                      })
                      .map((c) => {
                        const getCategoryBadgeClass = (category: string) => {
                          switch(category) {
                            case 'Site Quality': return 'bg-orange-950/40 text-orange-400 border-orange-800/30';
                            case 'Material Delay': return 'bg-amber-950/40 text-amber-400 border-amber-800/30';
                            case 'Safety & Hazard': return 'bg-red-950/40 text-red-400 border-red-800/30';
                            case 'Structural / Design': return 'bg-blue-950/40 text-blue-400 border-blue-800/30';
                            default: return 'bg-zinc-900 text-zinc-400 border-zinc-800';
                          }
                        };

                        const getUrgencyBadgeClass = (urgency: string) => {
                          switch(urgency) {
                            case 'Urgent Work': return 'border-red-500/30 text-red-400 bg-red-950/20';
                            case 'Solve within 1 Week': return 'border-amber-500/30 text-amber-400 bg-amber-950/20';
                            default: return 'border-blue-500/30 text-blue-400 bg-blue-950/20';
                          }
                        };

                        const isCompleted = c.status === 'Completed';

                        return (
                          <div 
                            key={c.id} 
                            className={`bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-xl p-4 flex gap-4 transition-all ${
                              isCompleted ? 'opacity-70' : ''
                            }`}
                          >
                            {/* Complaint text details */}
                            <div className="flex-1 flex flex-col gap-2">
                              <div className="flex flex-wrap items-center gap-1.5">
                                {/* Category */}
                                <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide rounded border ${getCategoryBadgeClass(c.category)}`}>
                                  {c.category}
                                </span>
                                {/* Urgency level */}
                                <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide rounded border ${getUrgencyBadgeClass(c.urgency || 'Common Complaint')}`}>
                                  {c.urgency || 'Common Complaint'}
                                </span>
                                {/* Status badge */}
                                <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide rounded border ${
                                  isCompleted ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/30' : 'bg-orange-950/40 text-orange-400 border-orange-800/30'
                                }`}>
                                  {c.status || 'Pending'}
                                </span>
                                <span className="text-[10px] font-mono text-on-surface-variant ml-auto">{c.date}</span>
                              </div>

                              <h5 className={`font-headline text-xs font-bold text-white uppercase tracking-wide ${isCompleted ? 'line-through text-white/50' : ''}`}>
                                {c.title}
                              </h5>

                              <p className="font-sans text-[11px] text-on-surface-variant leading-relaxed whitespace-pre-line">
                                {c.description}
                              </p>

                              {/* Interactive controller footer */}
                              <div className="flex items-center justify-between mt-1 pt-2 border-t border-white/5">
                                <span className="text-[10px] font-sans text-primary">
                                  By <span className="font-bold text-white/95">{c.name}</span> ({c.email})
                                </span>

                                <div className="flex items-center gap-1.5">
                                  {/* Toggle Status action button */}
                                  <button
                                    onClick={() => {
                                      setComplaints(prev => prev.map(comp => {
                                        if (comp.id === c.id) {
                                          const nextStatus = comp.status === 'Pending' ? 'Completed' : 'Pending';
                                          return { ...comp, status: nextStatus };
                                        }
                                        return comp;
                                      }));
                                      handlePostGlobalLog(`Grievance "${c.title}" marked as ${!isCompleted ? 'Completed' : 'Pending'}`, 'info');
                                    }}
                                    className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide transition-all border ${
                                      isCompleted 
                                        ? 'border-orange-500/30 text-orange-400 hover:bg-orange-950/20' 
                                        : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-950/20'
                                    }`}
                                  >
                                    {isCompleted ? 'Reopen' : 'Mark Completed'}
                                  </button>

                                  <button
                                    onClick={() => {
                                      setComplaints(prev => prev.filter(comp => comp.id !== c.id));
                                    }}
                                    className="text-on-surface-variant/40 hover:text-red-400 p-1 rounded transition-all"
                                    title="Delete Complaint Permanent"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Attached image preview */}
                            {c.image && (
                              <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 relative rounded-lg overflow-hidden border border-white/10 bg-black/40">
                                <img 
                                  src={c.image} 
                                  alt="Attachment Proof" 
                                  className="w-full h-full object-cover"
                                />
                                <a
                                  href={c.image}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center text-[9px] font-headline font-bold text-white uppercase transition-all"
                                >
                                  Open Proof
                                </a>
                              </div>
                            )}
                          </div>
                        );
                      })
                  )}
                </div>
              </div>

            </div>

            {/* Footer Area */}
            <div className="px-6 py-4 border-t border-white/10 bg-black/35 flex flex-col sm:flex-row justify-between items-center gap-3">
              <span className="text-[10px] font-sans text-on-surface-variant">
                Studio Ekoh grievance portal compliance module 4.01-LIVE
              </span>
              <button
                onClick={() => setShowContactModal(false)}
                className="px-5 py-1.5 bg-white/5 hover:bg-white/10 text-white font-headline text-xs font-bold uppercase tracking-wider rounded-lg transition-all"
              >
                Close Hub
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Studio Account Login Modal */}
      {showLoginModal && (
        <LoginModal 
          onClose={() => setShowLoginModal(false)}
          currentUser={currentUser}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
      )}

    </div>
  );
}
