import React, { useState, FormEvent, useEffect, Dispatch, SetStateAction } from 'react';
import { TEAM_MEMBERS as INITIAL_TEAM_MEMBERS } from '../data';
import { 
  Mail, 
  Calendar, 
  MapPin, 
  Award, 
  ShieldCheck, 
  HeartHandshake, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Trash2, 
  Filter, 
  Activity, 
  User, 
  ListTodo, 
  Zap, 
  Sparkles,
  ChevronRight,
  ClipboardList,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { UserSession, Project, Task, TeamMember, ActivityLog } from '../types';
import { triggerHaptic } from '../utils/haptic';

interface TeamViewProps {
  currentUser: UserSession | null;
  projects?: Project[];
  members: TeamMember[];
  setMembers: Dispatch<SetStateAction<TeamMember[]>>;
  globalLogs: ActivityLog[];
  setGlobalLogs: Dispatch<SetStateAction<ActivityLog[]>>;
}

export default function TeamView({ 
  currentUser, 
  projects = [],
  members,
  setMembers,
  globalLogs,
  setGlobalLogs
}: TeamViewProps) {
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

  const [selectedMemberId, setSelectedMemberId] = useState<string>('team-2'); // default to Sneha
  const [activeTab, setActiveTab] = useState<'analytics' | 'logs'>('analytics');

  useEffect(() => {
    if (currentUser && currentUser.role === 'Employee' && currentUser.employeeId) {
      setSelectedMemberId(currentUser.employeeId);
    }
  }, [currentUser]);
  
  // States for adding dynamic tasks
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<string>('Structural');
  const [newTaskDeadline, setNewTaskDeadline] = useState('Today 05:00 PM');
  const [associatedProjectId, setAssociatedProjectId] = useState<string>('General');
  
  // Custom manual options for task assign slots
  const [customProjectName, setCustomProjectName] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [customDeadline, setCustomDeadline] = useState('');

  // States for logging dynamic team works
  const [newLogText, setNewLogText] = useState('');
  const [newLogSeverity, setNewLogSeverity] = useState<ActivityLog['severity']>('info');

  const selectedMember = members.find(m => m.id === selectedMemberId) || members[0];

  const canModify = !currentUser || currentUser.role === 'Admin' || (currentUser.role === 'Employee' && currentUser.employeeId === selectedMemberId);

  // Handler to toggle a task's completion status
  const handleToggleTask = (memberId: string, taskId: string) => {
    setMembers(prev => prev.map(m => {
      if (m.id !== memberId) return m;
      
      const updatedTasks = m.tasks.map(t => {
        if (t.id === taskId) {
          const nextState = !t.completed;
          
          // Log task change in global stream
          const logText = `${nextState ? 'Completed' : 'Re-opened'} task: "${t.title}"`;
          const newLog: ActivityLog = {
            id: `log-${Date.now()}`,
            memberId: m.id,
            memberName: m.name,
            role: m.role,
            time: 'Just now',
            text: logText,
            severity: nextState ? 'success' : 'warning'
          };
          setGlobalLogs(g => [newLog, ...g]);
          
          return { ...t, completed: nextState };
        }
        return t;
      });

      // Recalculate dynamic performance score based on tasks done
      const completedCount = updatedTasks.filter(t => t.completed).length;
      const totalCount = updatedTasks.length;
      const baseScore = totalCount > 0 ? Math.round((completedCount / totalCount) * 40) + 60 : 80;

      return {
        ...m,
        tasks: updatedTasks,
        performance: Math.min(100, Math.max(0, baseScore))
      };
    }));
  };

  // Handler to add a new task for a member
  const handleAddTask = (e: FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const finalProjName = associatedProjectId === 'Custom' ? (customProjectName.trim() || 'Custom Site') : associatedProjectId;
    const finalCategory = newTaskCategory === 'Custom' ? (customCategory.trim() || 'Custom Category') : newTaskCategory;
    const finalDeadline = newTaskDeadline === 'Custom' ? (customDeadline.trim() || 'No Deadline') : newTaskDeadline;

    const finalTaskTitle = finalProjName !== 'General'
      ? `[${finalProjName}] ${newTaskTitle}`
      : newTaskTitle;

    setMembers(prev => prev.map(m => {
      if (m.id !== selectedMemberId) return m;

      const newTask: Task = {
        id: `t-${Date.now()}`,
        title: finalTaskTitle,
        completed: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: finalCategory,
        deadline: finalDeadline
      };

      const updatedTasks = [...m.tasks, newTask];
      const completedCount = updatedTasks.filter(t => t.completed).length;
      const totalCount = updatedTasks.length;
      const baseScore = totalCount > 0 ? Math.round((completedCount / totalCount) * 40) + 60 : 80;

      // Log this in global stream
      const newLog: ActivityLog = {
        id: `log-${Date.now()}`,
        memberId: m.id,
        memberName: m.name,
        role: m.role,
        time: 'Just now',
        text: `Assigned new daily work: "${finalTaskTitle}" [${finalCategory}] - Deadline: ${finalDeadline}`,
        severity: 'info'
      };
      setGlobalLogs(g => [newLog, ...g]);

      return {
        ...m,
        tasks: updatedTasks,
        performance: Math.min(100, Math.max(0, baseScore))
      };
    }));

    setNewTaskTitle('');
    setNewTaskDeadline('Today 05:00 PM');
    setAssociatedProjectId('General');
    setNewTaskCategory('Structural');
    setCustomProjectName('');
    setCustomCategory('');
    setCustomDeadline('');
  };

  // Handler to delete a task
  const handleDeleteTask = (memberId: string, taskId: string) => {
    setMembers(prev => prev.map(m => {
      if (m.id !== memberId) return m;
      const updatedTasks = m.tasks.filter(t => t.id !== taskId);
      
      const completedCount = updatedTasks.filter(t => t.completed).length;
      const totalCount = updatedTasks.length;
      const baseScore = totalCount > 0 ? Math.round((completedCount / totalCount) * 40) + 60 : 80;

      return {
        ...m,
        tasks: updatedTasks,
        performance: totalCount > 0 ? Math.min(100, Math.max(0, baseScore)) : 85
      };
    }));
  };

  // Handler to submit a custom activity log (simulated daily report)
  const handleAddLog = (e: FormEvent) => {
    e.preventDefault();
    if (!newLogText.trim()) return;

    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      memberId: selectedMemberId,
      memberName: selectedMember.name,
      role: selectedMember.role,
      time: 'Just now',
      text: newLogText,
      severity: newLogSeverity
    };

    setGlobalLogs(prev => [newLog, ...prev]);
    setNewLogText('');
  };

  // Calculate overall operational performance across team
  const totalTasksToday = members.reduce((sum, m) => sum + m.tasks.length, 0);
  const completedTasksToday = members.reduce((sum, m) => sum + m.tasks.filter(t => t.completed).length, 0);
  const averagePerformance = Math.round(members.reduce((sum, m) => sum + m.performance, 0) / members.length);
  const activeSites = members.reduce((sum, m) => sum + m.activeSitesCount, 0);

  return (
    <div className="flex flex-col gap-12 md:gap-16">
      
      {/* Header Section */}
      <header className="flex flex-col gap-2 pb-6 border-b border-white/10">
        <h1 className="font-headline text-5xl md:text-6xl font-bold text-white tracking-tight">
          Team Operations & Performance
        </h1>
        <p className="font-sans text-base md:text-lg text-on-surface-variant leading-relaxed max-w-2xl">
          Track individual architectural outputs, daily logged field works, and circular masonry performance ratings of the Studio Ekoh specialist team.
        </p>
      </header>

      {/* Role-based Security Banner */}
      {!currentUser && (
        <div className="bg-amber-950/20 border border-amber-900/30 text-amber-400 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
          <div className="flex gap-2.5 items-center">
            <AlertCircle className="h-5 w-5 shrink-0 text-amber-500 animate-pulse" />
            <span className="text-xs font-sans leading-relaxed">
              <strong>Atelier Guest Sandbox:</strong> Reviewing general workspaces. Sign in as <strong>Admin</strong> (admin@123) or <strong>Employee</strong> (sneha@123) via the <strong>Studio Account</strong> button in the top-right header to unlock role-based credentials, workflow allocation, and checklist controls.
            </span>
          </div>
        </div>
      )}

      {currentUser && currentUser.role === 'Admin' && (
        <div className="bg-primary/10 border border-primary/25 text-primary rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
          <div className="flex gap-2.5 items-center">
            <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
            <span className="text-xs font-sans leading-relaxed text-white">
              <strong>Admin Override Active (Aravind Menon):</strong> Full administrative clearance is established. You have authorized power to assign task rosters, allocate resource schedules, and monitor the entire atelier team's KPIs.
            </span>
          </div>
          <span className="bg-primary text-black font-headline text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shrink-0">
            Principal Control
          </span>
        </div>
      )}

      {currentUser && currentUser.role === 'Employee' && (
        <div className="bg-blue-950/20 border border-blue-900/35 text-blue-400 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
          <div className="flex gap-2.5 items-center">
            <Briefcase className="h-5 w-5 shrink-0 text-blue-400" />
            <span className="text-xs font-sans leading-relaxed text-white">
              <strong>Specialist Active Workspace (Logged in as {currentUser.name}):</strong> You are viewing other teams in read-only. You can fully assign, remove, and check off construction duties on your own profile.
            </span>
          </div>
          <span className="bg-blue-900/40 text-blue-400 border border-blue-800/40 font-headline text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shrink-0">
            Specialist Clearance
          </span>
        </div>
      )}

      {/* Real-time Team Performance Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col justify-between shadow-md">
          <div className="flex justify-between items-start">
            <span className="font-headline text-[10px] font-bold uppercase tracking-widest text-primary">
              Daily Task Progress
            </span>
            <ClipboardList className="h-5 w-5 text-primary opacity-60" />
          </div>
          <div className="mt-4">
            <h3 className="font-headline text-3xl font-bold text-white">
              {completedTasksToday} <span className="text-lg text-on-surface-variant">/ {totalTasksToday}</span>
            </h3>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mt-3">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-500" 
                style={{ width: `${totalTasksToday > 0 ? (completedTasksToday / totalTasksToday) * 100 : 0}%` }}
              />
            </div>
            <p className="font-sans text-xs text-on-surface-variant mt-2">
              Active engineering works monitored today
            </p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col justify-between shadow-md">
          <div className="flex justify-between items-start">
            <span className="font-headline text-[10px] font-bold uppercase tracking-widest text-primary">
              Avg Performance Score
            </span>
            <TrendingUp className="h-5 w-5 text-emerald-400 opacity-80" />
          </div>
          <div className="mt-4">
            <h3 className="font-headline text-3xl font-bold text-white">
              {averagePerformance}%
            </h3>
            <div className="flex items-center gap-1 mt-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-sans text-xs text-emerald-400 font-medium">Optimal operating levels</span>
            </div>
            <p className="font-sans text-xs text-on-surface-variant mt-2">
              Based on task speed & inspection ratings
            </p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col justify-between shadow-md">
          <div className="flex justify-between items-start">
            <span className="font-headline text-[10px] font-bold uppercase tracking-widest text-primary">
              Total Active Sites
            </span>
            <MapPin className="h-5 w-5 text-primary opacity-60" />
          </div>
          <div className="mt-4">
            <h3 className="font-headline text-3xl font-bold text-white">
              {activeSites}
            </h3>
            <div className="h-2 mt-3 flex gap-1">
              <span className="text-xs font-sans text-on-surface-variant font-medium">Kochi, Munnar, Wayanad, Varkala</span>
            </div>
            <p className="font-sans text-xs text-on-surface-variant mt-2">
              Concurrent eco-construction structures
            </p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col justify-between shadow-md">
          <div className="flex justify-between items-start">
            <span className="font-headline text-[10px] font-bold uppercase tracking-widest text-primary">
              Zero-Cement Contribution
            </span>
            <ShieldCheck className="h-5 w-5 text-primary opacity-60" />
          </div>
          <div className="mt-4">
            <h3 className="font-headline text-3xl font-bold text-white">
              95.4%
            </h3>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mt-3">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '95.4%' }} />
            </div>
            <p className="font-sans text-xs text-on-surface-variant mt-2">
              Average local material circularity index
            </p>
          </div>
        </div>

      </section>

      {/* Main Analysis Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Team Roster (lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="font-headline text-xl font-bold text-white flex items-center gap-2">
              <User className="h-5 w-5 text-primary" /> Specialist Roster
            </h2>
            <span className="text-xs font-sans font-medium text-on-surface-variant">
              Select member to inspect
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {members.map((member) => {
              const completedTasks = member.tasks.filter(t => t.completed).length;
              const isSelected = member.id === selectedMemberId;

              return (
                <div
                  key={member.id}
                  onClick={() => {
                    triggerHaptic('light');
                    setSelectedMemberId(member.id);
                  }}
                  className={`p-6 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col justify-between gap-4 ${
                    isSelected 
                      ? 'bg-primary/5 border-primary shadow-[0_0_15px_rgba(197,160,89,0.15)] scale-[1.01]' 
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <img 
                      src={member.avatar} 
                      alt={member.name} 
                      className="w-14 h-14 rounded-full object-cover border border-white/10"
                    />
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h3 className="font-headline text-base font-bold text-white flex flex-wrap items-center gap-1.5">
                          {member.name}
                          {member.onLeave ? (
                            <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[9px] font-bold uppercase rounded tracking-wider shrink-0 scale-90">
                              Leave
                            </span>
                          ) : member.attendanceStatus === 'On-Site' ? (
                            <span className="px-1.5 py-0.5 bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[9px] font-bold uppercase rounded tracking-wider shrink-0 scale-90">
                              On-Site
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold uppercase rounded tracking-wider shrink-0 scale-90">
                              Present
                            </span>
                          )}
                        </h3>
                        <ChevronRight className={`h-4 w-4 text-primary transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                      </div>
                      <p className="font-sans text-xs text-primary font-semibold">
                        {member.role}
                      </p>
                      <p className="font-sans text-[11px] text-on-surface-variant mt-1">
                        Focus: {member.specialty}
                      </p>
                    </div>
                  </div>

                  {/* Performance Indicators Grid */}
                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/5 text-center">
                    <div>
                      <span className="block text-[10px] font-sans text-on-surface-variant uppercase">Performance</span>
                      <span className="font-headline text-sm font-bold text-white">
                        {member.performance}%
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-sans text-on-surface-variant uppercase">Workload</span>
                      <span className={`font-headline text-sm font-bold ${(member.capacity ?? 75) > 80 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {member.capacity ?? 75}%
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-sans text-on-surface-variant uppercase">Circularity</span>
                      <span className="font-headline text-sm font-bold text-primary">
                        {member.sustainabilityScore}%
                      </span>
                    </div>
                  </div>

                  {/* Dynamic Task count tracking indicator */}
                  <div className="flex justify-between items-center text-xs text-on-surface-variant mt-1">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      {completedTasks} of {member.tasks.length} tasks completed
                    </span>
                    <span className="bg-white/10 text-white font-mono text-[10px] px-2 py-0.5 rounded">
                      {member.activeSitesCount} sites
                    </span>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Operational Performance & Daily Works Panel (lg:col-span-7) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Tabs for detailed review */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col gap-6">
            
            {/* Tab header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-headline font-bold uppercase tracking-widest text-primary flex items-center gap-1.5 mb-1">
                  <Sparkles className="h-3 w-3" /> Detailed Analysis
                </span>
                <h3 className="font-headline text-lg font-bold text-white">
                  {selectedMember.name}’s Workspace
                </h3>
                {selectedMember.onLeave ? (
                  <span className="mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold uppercase tracking-wide">
                    ⚠️ Marked On Leave Today
                  </span>
                ) : selectedMember.attendanceStatus === 'On-Site' ? (
                  <span className="mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] bg-sky-500/20 text-sky-400 border border-sky-500/30 font-bold uppercase tracking-wide">
                    📍 On-Site Visit: {selectedMember.siteLocation || 'Wayanad Eco-Resort'}
                  </span>
                ) : (
                  <span className="mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold uppercase tracking-wide">
                    🟢 Present at HQ Studio ({selectedMember.checkInTime || '09:00 AM'})
                  </span>
                )}
              </div>

              {/* Selector tabs */}
              <div className="flex bg-white/5 p-1 rounded-lg border border-white/10 self-stretch sm:self-auto">
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-headline font-bold uppercase tracking-wider rounded-md transition-all ${
                    activeTab === 'analytics' ? 'bg-primary text-black' : 'text-on-surface-variant hover:text-white'
                  }`}
                >
                  Daily Tasks
                </button>
                <button
                  onClick={() => setActiveTab('logs')}
                  className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-headline font-bold uppercase tracking-wider rounded-md transition-all ${
                    activeTab === 'logs' ? 'bg-primary text-black' : 'text-on-surface-variant hover:text-white'
                  }`}
                >
                  Live Field Feed
                </button>
              </div>
            </div>

            {/* TAB 1: INTERACTIVE DAILY TASKS */}
            {activeTab === 'analytics' && (
              <div className="flex flex-col gap-6 animate-fadeIn">
                
                {/* Section explaining how to interact */}
                <div className="flex items-start gap-3 bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <Activity className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="text-xs font-sans text-on-surface-variant leading-relaxed">
                    <span className="text-primary font-bold block mb-1">Real-time Performance Analysis:</span>
                    Check/uncheck tasks to simulate daily progress on site. The team member's operational performance scores, averages, and status bars will immediately update across the entire applet.
                  </div>
                </div>

                {selectedMember.onLeave && (
                  <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                    <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div className="text-xs font-sans text-on-surface-variant leading-relaxed">
                      <span className="text-amber-400 font-bold block mb-1">Absence Alert:</span>
                      This team member has marked themselves as <strong className="text-white">ON LEAVE</strong> for today. 
                      {selectedMember.leaveReason && (
                        <span className="block mt-1 bg-black/30 p-2 rounded border border-white/5 text-white font-serif italic text-[11px]">
                          " {selectedMember.leaveReason} "
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <h4 className="font-headline text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-1.5">
                    <ListTodo className="h-4 w-4" /> Today's Field Agenda
                  </h4>

                  {selectedMember.tasks.length === 0 ? (
                    <div className="text-center py-6 text-xs text-on-surface-variant border border-dashed border-white/10 rounded-lg">
                      No active tasks logged for today. Assign some below!
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2.5 max-h-[260px] overflow-y-auto pr-1">
                      {selectedMember.tasks.map((task) => (
                        <div 
                          key={task.id}
                          className={`p-3.5 rounded-lg border flex justify-between items-center gap-3 transition-colors ${
                            task.completed 
                              ? 'bg-emerald-950/20 border-emerald-900/30' 
                              : 'bg-white/5 border-white/5 hover:border-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-grow min-w-0">
                            <input 
                              type="checkbox"
                              checked={task.completed}
                              disabled={!canModify}
                              onChange={() => handleToggleTask(selectedMember.id, task.id)}
                              className={`h-4.5 w-4.5 rounded border-white/20 bg-white/5 text-primary focus:ring-0 focus:ring-offset-0 shrink-0 ${
                                canModify ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                              }`}
                            />
                            <div className="min-w-0">
                              <p className={`font-sans text-sm font-medium leading-relaxed truncate ${
                                task.completed ? 'line-through text-on-surface-variant/50' : 'text-white'
                              }`}>
                                {task.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <span className="text-[10px] font-mono text-primary bg-white/5 px-1.5 py-0.5 rounded">
                                  {task.category}
                                </span>
                                <span className="text-[10px] text-on-surface-variant font-sans flex items-center gap-1">
                                  <Clock className="h-3 w-3 text-primary" /> {task.time}
                                </span>
                                {task.deadline && (
                                  <span className="text-[10px] text-primary font-bold font-sans">
                                    • Due: {task.deadline}
                                  </span>
                                )}
                              </div>

                              {task.imageProof && (
                                <div className="mt-2 flex items-center gap-2.5 bg-black/50 p-2 rounded-lg border border-white/5 max-w-sm">
                                  <img 
                                    src={task.imageProof} 
                                    alt="Visual proof" 
                                    className="w-12 h-9 object-cover rounded border border-white/10 shrink-0" 
                                  />
                                  <div className="min-w-0">
                                    <span className="text-[9px] font-headline font-bold text-emerald-400 uppercase tracking-wider block">Visual Proof Verified</span>
                                    <span className="text-[9px] text-on-surface-variant font-sans truncate block">
                                      Attached at {task.imageProofTime || 'Just now'}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {canModify && (
                            <button 
                              onClick={() => handleDeleteTask(selectedMember.id, task.id)}
                              className="p-1.5 text-on-surface-variant hover:text-primary transition-colors hover:bg-white/5 rounded-md animate-fadeIn"
                              title="Delete task"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ADD TASK FORM */}
                {canModify ? (
                  <form onSubmit={handleAddTask} className="border-t border-white/10 pt-5 flex flex-col gap-3 animate-fadeIn">
                    <h4 className="font-headline text-xs font-bold uppercase tracking-widest text-primary">
                      Assign New Daily Task
                    </h4>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="e.g. Inspect foundation clay tile insulation..."
                        className="flex-grow bg-white/5 border border-white/10 focus:border-primary rounded-lg px-3.5 py-2 font-sans text-xs focus:outline-none focus:ring-1 focus:ring-primary text-white placeholder-white/30"
                      />
                      
                      {projects && projects.length > 0 && (
                        <select
                          value={associatedProjectId}
                          onChange={(e) => setAssociatedProjectId(e.target.value)}
                          className="bg-[#0c0c0c] border border-white/10 text-white rounded-lg px-3 py-2 font-sans text-xs focus:outline-none focus:ring-1 focus:ring-primary max-w-[160px]"
                          title="Associate with active project site"
                        >
                          <option value="General">General/Unassigned</option>
                          {projects.map((p) => (
                            <option key={p.id} value={p.name}>{p.name}</option>
                          ))}
                          <option value="Custom">Custom / Manual...</option>
                        </select>
                      )}

                      <select
                        value={newTaskCategory}
                        onChange={(e) => setNewTaskCategory(e.target.value)}
                        className="bg-[#0c0c0c] border border-white/10 text-white rounded-lg px-3 py-2 font-sans text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                        title="Work Category"
                      >
                        <option value="Structural">Structural</option>
                        <option value="Material Sourcing">Material Sourcing</option>
                        <option value="Client Review">Client Review</option>
                        <option value="Site Visit">Site Visit</option>
                        <option value="Design Drafting">Design Drafting</option>
                        <option value="Custom">Custom / Manual...</option>
                      </select>

                      <select
                        value={newTaskDeadline}
                        onChange={(e) => setNewTaskDeadline(e.target.value)}
                        className="bg-[#0c0c0c] border border-white/10 text-white rounded-lg px-3 py-2 font-sans text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                        title="Select Deliverable Deadline"
                      >
                        <option value="Today 12:00 PM">Today 12:00 PM</option>
                        <option value="Today 05:00 PM">Today 05:00 PM</option>
                        <option value="Today 08:00 PM">Today 08:00 PM</option>
                        <option value="Tomorrow 12:00 PM">Tomorrow 12:00 PM</option>
                        <option value="Tomorrow 05:00 PM">Tomorrow 05:00 PM</option>
                        <option value="Within 2 Days">Within 2 Days</option>
                        <option value="Within 1 Week">Within 1 Week</option>
                        <option value="Custom">Custom / Manual...</option>
                      </select>

                      <button 
                        type="submit"
                        className="bg-primary hover:bg-white hover:text-black text-black px-4 py-2 rounded-lg font-headline text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer select-none"
                      >
                        <Plus className="h-4.5 w-4.5" /> Assign
                      </button>
                    </div>

                    {/* MANUAL CUSTOM INPUT SLOTS */}
                    {(associatedProjectId === 'Custom' || newTaskCategory === 'Custom' || newTaskDeadline === 'Custom') && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white/[0.02] border border-white/5 p-3 rounded-lg animate-fadeIn mt-1">
                        {associatedProjectId === 'Custom' && (
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-primary">Manual Project Site</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Munnar Eco Resort"
                              value={customProjectName}
                              onChange={(e) => setCustomProjectName(e.target.value)}
                              className="bg-black/40 border border-white/10 focus:border-primary rounded-lg px-3 py-1.5 font-sans text-xs text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          </div>
                        )}
                        {newTaskCategory === 'Custom' && (
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-primary">Manual Work Category</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Landscape Design"
                              value={customCategory}
                              onChange={(e) => setCustomCategory(e.target.value)}
                              className="bg-black/40 border border-white/10 focus:border-primary rounded-lg px-3 py-1.5 font-sans text-xs text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          </div>
                        )}
                        {newTaskDeadline === 'Custom' && (
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-primary">Manual Deliverable Deadline</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Today by 10:00 PM"
                              value={customDeadline}
                              onChange={(e) => setCustomDeadline(e.target.value)}
                              className="bg-black/40 border border-white/10 focus:border-primary rounded-lg px-3 py-1.5 font-sans text-xs text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </form>
                ) : (
                  <div className="border-t border-white/10 pt-5 text-center py-4 bg-white/[0.01] rounded-lg animate-fadeIn">
                    <p className="font-sans text-xs text-on-surface-variant flex items-center justify-center gap-2">
                      <AlertCircle className="h-4 w-4 text-primary" />
                      Workspace locked. Only <span className="text-white font-semibold">{selectedMember.name}</span> or an <span className="text-white font-semibold">Admin</span> can allocate new tasks.
                    </p>
                  </div>
                )}

              </div>
            )}

            {/* TAB 2: LIVE FIELD LOG TIMELINE */}
            {activeTab === 'logs' && (
              <div className="flex flex-col gap-6 animate-fadeIn">
                
                {/* Submit simulated live update */}
                {canModify ? (
                  <form onSubmit={handleAddLog} className="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col gap-3 animate-fadeIn">
                    <div className="flex justify-between items-center">
                      <h4 className="font-headline text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-1">
                        <Zap className="h-4.5 w-4.5" /> Log Daily Field Entry
                      </h4>
                      
                      {/* Severity Tag Selection */}
                      <div className="flex gap-2">
                        {(['info', 'success', 'warning'] as const).map((sev) => (
                          <button
                            key={sev}
                            type="button"
                            onClick={() => setNewLogSeverity(sev)}
                            className={`px-2 py-0.5 text-[10px] font-sans font-bold capitalize rounded border transition-colors ${
                              newLogSeverity === sev 
                                ? sev === 'success' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : sev === 'warning' ? 'bg-amber-950 text-amber-400 border-amber-800' : 'bg-blue-950 text-blue-400 border-blue-800'
                                : 'bg-transparent border-white/10 text-on-surface-variant hover:text-white'
                            }`}
                          >
                            {sev}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newLogText}
                        onChange={(e) => setNewLogText(e.target.value)}
                        placeholder={`Document what ${selectedMember.name} accomplished right now on site...`}
                        className="flex-grow bg-[#0c0c0c] border border-white/10 focus:border-primary rounded-lg px-3.5 py-2 font-sans text-xs focus:outline-none focus:ring-1 focus:ring-primary text-white placeholder-white/30"
                      />
                      <button 
                        type="submit"
                        className="bg-primary hover:bg-white hover:text-black text-black px-4 py-2 rounded-lg font-headline text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0"
                      >
                        Post Log
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center py-4 bg-white/[0.01] animate-fadeIn">
                    <p className="font-sans text-xs text-on-surface-variant flex items-center justify-center gap-2">
                      <AlertCircle className="h-4 w-4 text-primary" />
                      Feed locked. Only <span className="text-white font-semibold">{selectedMember.name}</span> or an <span className="text-white font-semibold">Admin</span> can post field log timeline entries.
                    </p>
                  </div>
                )}

                {/* Live logs timeline */}
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <h4 className="font-headline text-xs font-bold uppercase tracking-widest text-primary">
                      Rolling Workspace Timeline
                    </h4>
                    <span className="text-[10px] font-sans text-on-surface-variant flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> Live Updates Feed
                    </span>
                  </div>

                  <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-1">
                    {globalLogs.map((log) => {
                      const logMember = members.find(m => m.id === log.memberId);
                      const avatar = logMember ? logMember.avatar : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80';
                      
                      return (
                        <div key={log.id} className="flex gap-3 items-start group">
                          <img 
                            src={avatar} 
                            alt={log.memberName} 
                            className="w-8 h-8 rounded-full object-cover border border-white/10 mt-0.5 shrink-0"
                          />
                          <div className="flex-grow min-w-0 bg-[#0c0c0c] border border-white/5 rounded-lg p-3 group-hover:border-white/10 transition-colors">
                            <div className="flex justify-between items-start gap-2">
                              <div className="min-w-0">
                                <span className="font-headline text-xs font-bold text-white block truncate">
                                  {log.memberName}
                                </span>
                                <span className="text-[9px] font-sans text-primary font-medium uppercase tracking-wider block">
                                  {log.role}
                                </span>
                              </div>
                              <span className="text-[10px] text-on-surface-variant font-mono whitespace-nowrap shrink-0">
                                {log.time}
                              </span>
                            </div>
                            <p className="font-sans text-xs text-on-surface-variant leading-relaxed mt-2">
                              {log.text}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* Values Banner */}
      <section className="bg-[#0c0c0c] backdrop-blur-md rounded-xl p-8 border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(to_right,#8B5E3C_1px,transparent_1px),linear-gradient(to_bottom,#8B5E3C_1px,transparent_1px)] bg-[size:30px_30px]" />
        
        <div className="flex flex-col gap-2">
          <div className="p-3 bg-white/5 self-start rounded-xl text-primary border border-white/10 shadow-sm">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h4 className="font-headline text-base font-bold text-white mt-2">Zero-Cement Ideals</h4>
          <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
            Aiming to minimize high-carbon mortar, we formulate dry-stack lime foundations and post-tensioned stone configurations.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="p-3 bg-white/5 self-start rounded-xl text-primary border border-white/10 shadow-sm">
            <HeartHandshake className="h-6 w-6" />
          </div>
          <h4 className="font-headline text-base font-bold text-white mt-2">Local Masonry Cooperatives</h4>
          <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
            Every project employs local stonecarvers and bamboo craftsmen, directly funding sustainable forest harvesting communities.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="p-3 bg-white/5 self-start rounded-xl text-primary border border-white/10 shadow-sm">
            <MapPin className="h-6 w-6" />
          </div>
          <h4 className="font-headline text-base font-bold text-white mt-2">100km Material Sourcing</h4>
          <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
            We limit fossil fuel transportation by sourcing our timber, basalt blocks, and brick clay within 100km of each build site.
          </p>
        </div>
      </section>

    </div>
  );
}
