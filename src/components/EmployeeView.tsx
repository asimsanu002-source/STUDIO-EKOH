import { useState, useEffect, FormEvent } from 'react';
import { 
  CheckCircle, 
  Clock, 
  Image as ImageIcon, 
  Calendar, 
  XCircle, 
  Plus, 
  LogOut, 
  AlertCircle, 
  Camera, 
  UploadCloud, 
  ShieldCheck, 
  Check, 
  Activity,
  Briefcase,
  Layers,
  MapPin,
  TrendingUp
} from 'lucide-react';
import { TeamMember, Task, UserSession } from '../types';
import { triggerHaptic } from '../utils/haptic';

interface EmployeeViewProps {
  currentUser: UserSession;
  memberData: TeamMember;
  onUpdateMember: (updatedMember: TeamMember) => void;
  onLogout: () => void;
  onPostGlobalLog: (text: string, severity: 'success' | 'info' | 'warning') => void;
}

const MOCK_PROOF_IMAGES = [
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&h=250&q=80', // Sketch / draft
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=400&h=250&q=80', // Construction concrete
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&h=250&q=80', // Modern render
  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=400&h=250&q=80', // Masonry / bricks
  'https://images.unsplash.com/photo-1581094288338-2314dddb7eed?auto=format&fit=crop&w=400&h=250&q=80'  // Technical structural model
];

export default function EmployeeView({ 
  currentUser, 
  memberData, 
  onUpdateMember, 
  onLogout,
  onPostGlobalLog
}: EmployeeViewProps) {
  
  const [newLogText, setNewLogText] = useState('');
  const [selectedTaskIdForImage, setSelectedTaskIdForImage] = useState<string | null>(null);
  const [leaveReasonInput, setLeaveReasonInput] = useState(memberData.leaveReason || '');
  const [showImageDropdown, setShowImageDropdown] = useState(false);
  const [isUploading, setIsUploading] = useState<string | null>(null); // taskId being updated

  // Organized Daily Attendance states
  const [selectedStatus, setSelectedStatus] = useState<'Present' | 'On-Site' | 'On Leave'>(
    memberData.onLeave ? 'On Leave' : (memberData.attendanceStatus || 'Present')
  );
  const [siteLocationInput, setSiteLocationInput] = useState(memberData.siteLocation || 'Wayanad Eco-Resort');
  const [checkInTimeInput, setCheckInTimeInput] = useState(memberData.checkInTime || '09:00 AM');
  const [attendanceFeedback, setAttendanceFeedback] = useState<string | null>(null);

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

  const handleToggleTaskCompleted = (taskId: string) => {
    const updatedTasks = memberData.tasks.map(t => {
      if (t.id === taskId) {
        const nextState = !t.completed;
        
        // Tactile switch haptic feedback
        if (nextState) {
          triggerHaptic('success');
        } else {
          triggerHaptic('medium');
        }

        // Log to central studio feed
        onPostGlobalLog(
          `${memberData.name} ${nextState ? 'completed' : 're-opened'} task: "${t.title}"`,
          nextState ? 'success' : 'info'
        );
        
        return {
          ...t,
          completed: nextState,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
      return t;
    });

    const completedCount = updatedTasks.filter(t => t.completed).length;
    const totalCount = updatedTasks.length;
    const performanceScore = totalCount > 0 ? Math.round((completedCount / totalCount) * 40) + 60 : 85;

    onUpdateMember({
      ...memberData,
      tasks: updatedTasks,
      performance: Math.min(100, Math.max(0, performanceScore))
    });
  };

  const handleUpdateAttendance = (e?: FormEvent) => {
    if (e) e.preventDefault();

    triggerHaptic('success');

    const isLeave = selectedStatus === 'On Leave';
    const isSite = selectedStatus === 'On-Site';

    const updatedMember: TeamMember = {
      ...memberData,
      onLeave: isLeave,
      leaveReason: isLeave ? leaveReasonInput || 'Excused leave' : '',
      attendanceStatus: selectedStatus,
      checkInTime: isLeave ? undefined : checkInTimeInput,
      siteLocation: isSite ? siteLocationInput : undefined,
    };

    onUpdateMember(updatedMember);

    let logMessage = '';
    let severity: 'success' | 'info' | 'warning' = 'info';

    if (selectedStatus === 'Present') {
      logMessage = `${memberData.name} checked in Present at HQ Studio at ${checkInTimeInput}.`;
      severity = 'success';
    } else if (selectedStatus === 'On-Site') {
      logMessage = `${memberData.name} checked in On-Site at "${siteLocationInput}" at ${checkInTimeInput}.`;
      severity = 'success';
    } else {
      logMessage = `${memberData.name} requested Excused Leave. Reason: "${leaveReasonInput || 'Excused leave'}".`;
      severity = 'warning';
    }

    onPostGlobalLog(logMessage, severity);
    
    setAttendanceFeedback('Attendance status recorded successfully!');
    setTimeout(() => setAttendanceFeedback(null), 3000);
  };

  const handlePostTimelineLog = (e: FormEvent) => {
    e.preventDefault();
    if (!newLogText.trim()) return;

    triggerHaptic('medium');

    onPostGlobalLog(
      `Field update: ${newLogText.trim()}`,
      'info'
    );
    setNewLogText('');
  };

  const handleSelectMockProofImage = (taskId: string, imageUrl: string) => {
    triggerHaptic('light');
    setIsUploading(taskId);
    
    setTimeout(() => {
      triggerHaptic('success');
      const updatedTasks = memberData.tasks.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            imageProof: imageUrl,
            imageProofTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        }
        return t;
      });

      const taskObj = memberData.tasks.find(t => t.id === taskId);
      onPostGlobalLog(
        `Visual proof uploaded by ${memberData.name} for "${taskObj?.title}": Site photo added.`,
        'success'
      );

      onUpdateMember({
        ...memberData,
        tasks: updatedTasks
      });
      setIsUploading(null);
      setSelectedTaskIdForImage(null);
    }, 1200);
  };

  // Stats calculation
  const totalTasks = memberData.tasks.length;
  const completedTasks = memberData.tasks.filter(t => t.completed).length;

  return (
    <div className="max-w-[1280px] mx-auto px-6 md:px-16 py-8 flex flex-col gap-8 animate-fadeIn">
      
      {/* Top Welcome Banner */}
      <div className="bg-[#0c0c0c] border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-bl-full pointer-events-none" />
        
        <div className="flex items-center gap-4 z-10">
          <img 
            src={memberData.avatar} 
            alt={memberData.name} 
            className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-primary"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-headline text-2xl md:text-3xl font-bold text-white leading-tight">
                Welcome back, {memberData.name.split(' ')[0]}!
              </h1>
              <span className="px-2.5 py-0.5 bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold uppercase tracking-widest rounded-md inline-flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Specialist Account
              </span>
            </div>
            
            <p className="font-sans text-xs text-on-surface-variant mt-1.5 flex items-center gap-1.5 flex-wrap">
              <span className="text-white font-medium">{memberData.role}</span>
              <span className="text-white/20">•</span>
              <span className="text-primary font-bold uppercase tracking-wider">{memberData.team}</span>
              <span className="text-white/20">•</span>
              <span className="text-on-surface-variant">Specialty: {memberData.specialty}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto z-10 shrink-0">
          <button
            onClick={onLogout}
            className="flex-1 md:flex-none px-4 py-2.5 bg-white/5 hover:bg-red-950/40 border border-white/10 hover:border-red-900/30 text-white hover:text-red-400 font-headline text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer select-none"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </div>

      {/* Organized Daily Work Attendance System */}
      <div className="bg-[#0c0c0c] border border-white/10 rounded-2xl p-6 transition-all duration-300">
        
        {/* Active Status Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-xl border border-primary/20 shrink-0">
              <Calendar className="h-5.5 w-5.5" />
            </div>
            <div>
              <h3 className="font-headline text-base font-bold text-white">
                Daily Work Attendance & Workspace Setup
              </h3>
              <p className="font-sans text-xs text-on-surface-variant mt-0.5">
                Keep your team coordinates updated so principal architects can route project deliverables correctly.
              </p>
            </div>
          </div>
          
          {/* Current Live Pulse Indicator */}
          <div className="flex items-center gap-2.5 px-4 py-2 bg-white/[0.02] border border-white/10 rounded-xl">
            <span className="text-[10px] font-headline font-bold text-on-surface-variant uppercase tracking-wider">
              Current Status:
            </span>
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full animate-pulse ${
                memberData.onLeave 
                  ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' 
                  : (memberData.attendanceStatus === 'On-Site' 
                      ? 'bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]' 
                      : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]')
              }`} />
              <span className="text-xs font-bold text-white">
                {memberData.onLeave 
                  ? 'On Leave' 
                  : (memberData.attendanceStatus === 'On-Site' 
                      ? `On-Site Visit (${memberData.siteLocation || 'Wayanad'})` 
                      : `Present at Studio (${memberData.checkInTime || '09:00 AM'})`)}
              </span>
            </div>
          </div>
        </div>

        {/* 3 Columns Option Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Option 1: Present at Studio */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setSelectedStatus('Present');
            }}
            className={`text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between h-32 relative overflow-hidden group ${
              selectedStatus === 'Present'
                ? 'bg-emerald-950/20 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.1)]'
                : 'bg-white/[0.02] border-white/5 hover:border-white/15'
            }`}
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/[0.02] rounded-bl-full group-hover:scale-110 transition-transform" />
            <div className="flex items-center justify-between w-full">
              <span className={`p-1.5 rounded-lg text-xs font-bold ${
                selectedStatus === 'Present' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-on-surface-variant'
              }`}>
                <CheckCircle className="h-4 w-4" />
              </span>
              <span className={`text-[9px] font-headline font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                selectedStatus === 'Present' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-transparent text-transparent'
              }`}>
                Selected
              </span>
            </div>
            <div>
              <h4 className="font-headline text-xs font-bold text-white uppercase tracking-wider">
                Present in HQ
              </h4>
              <p className="font-sans text-[10px] text-on-surface-variant mt-1 leading-normal">
                Working live at the main Kochi Atelier draft rooms.
              </p>
            </div>
          </button>

          {/* Option 2: On-Site / Field Visit */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setSelectedStatus('On-Site');
            }}
            className={`text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between h-32 relative overflow-hidden group ${
              selectedStatus === 'On-Site'
                ? 'bg-sky-950/20 border-sky-500/40 shadow-[0_0_12px_rgba(14,165,233,0.1)]'
                : 'bg-white/[0.02] border-white/5 hover:border-white/15'
            }`}
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-sky-500/[0.02] rounded-bl-full group-hover:scale-110 transition-transform" />
            <div className="flex items-center justify-between w-full">
              <span className={`p-1.5 rounded-lg text-xs font-bold ${
                selectedStatus === 'On-Site' ? 'bg-sky-500/10 text-sky-400' : 'bg-white/5 text-on-surface-variant'
              }`}>
                <MapPin className="h-4 w-4" />
              </span>
              <span className={`text-[9px] font-headline font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                selectedStatus === 'On-Site' ? 'bg-sky-500/20 text-sky-400' : 'bg-transparent text-transparent'
              }`}>
                Selected
              </span>
            </div>
            <div>
              <h4 className="font-headline text-xs font-bold text-white uppercase tracking-wider">
                On-Site Field Visit
              </h4>
              <p className="font-sans text-[10px] text-on-surface-variant mt-1 leading-normal">
                Inspecting project terrain, soil testing, or sourcing.
              </p>
            </div>
          </button>

          {/* Option 3: On Leave */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setSelectedStatus('On Leave');
            }}
            className={`text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between h-32 relative overflow-hidden group ${
              selectedStatus === 'On Leave'
                ? 'bg-amber-950/20 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.1)]'
                : 'bg-white/[0.02] border-white/5 hover:border-white/15'
            }`}
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/[0.02] rounded-bl-full group-hover:scale-110 transition-transform" />
            <div className="flex items-center justify-between w-full">
              <span className={`p-1.5 rounded-lg text-xs font-bold ${
                selectedStatus === 'On Leave' ? 'bg-amber-500/10 text-amber-400' : 'bg-white/5 text-on-surface-variant'
              }`}>
                <XCircle className="h-4 w-4" />
              </span>
              <span className={`text-[9px] font-headline font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                selectedStatus === 'On Leave' ? 'bg-amber-500/20 text-amber-400' : 'bg-transparent text-transparent'
              }`}>
                Selected
              </span>
            </div>
            <div>
              <h4 className="font-headline text-xs font-bold text-white uppercase tracking-wider">
                On Leave Today
              </h4>
              <p className="font-sans text-[10px] text-on-surface-variant mt-1 leading-normal">
                Excused from live daily tasks for personal/sick rest.
              </p>
            </div>
          </button>

        </div>

        {/* Dynamic Context Forms */}
        <form onSubmit={handleUpdateAttendance} className="mt-5 pt-5 border-t border-white/5 flex flex-col gap-4 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Input 1: Check-in time (shown for both active options) */}
            {selectedStatus !== 'On Leave' && (
              <div>
                <label className="block text-[10px] font-headline font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                  Check-In Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-on-surface-variant" />
                  <input
                    type="text"
                    required
                    value={checkInTimeInput}
                    onChange={(e) => setCheckInTimeInput(e.target.value)}
                    placeholder="e.g. 09:00 AM"
                    className="w-full bg-[#121212] border border-white/10 focus:border-primary rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-white/20 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Input 2: Site Location (shown only for On-Site status) */}
            {selectedStatus === 'On-Site' && (
              <div>
                <label className="block text-[10px] font-headline font-bold uppercase tracking-wider text-sky-400 mb-1.5">
                  Physical Site Coordinates / Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-sky-400" />
                  <select
                    value={siteLocationInput}
                    onChange={(e) => setSiteLocationInput(e.target.value)}
                    className="w-full bg-[#121212] border border-white/10 focus:border-sky-500 rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Wayanad Eco-Resort">Wayanad Eco-Resort (Clay/Cohesion Lab)</option>
                    <option value="Varkala Cliffside Spa">Varkala Cliffside Spa (Wind Corridor)</option>
                    <option value="Kochi Atelier Phase 2">Kochi Atelier Phase 2 (Teak Joinery)</option>
                    <option value="Munnar Ridge Retreat">Munnar Ridge Retreat (Bamboo Curing)</option>
                    <option value="Kumarakom Floating Spa">Kumarakom Floating Spa (Carpenter Wharf)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Input 3: Absence Reason (shown only for On Leave status) */}
            {selectedStatus === 'On Leave' && (
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-headline font-bold uppercase tracking-wider text-amber-400 mb-1.5">
                  Excused Absence Reason / Remarks
                </label>
                <div className="relative">
                  <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-amber-400" />
                  <input
                    type="text"
                    required
                    value={leaveReasonInput}
                    onChange={(e) => setLeaveReasonInput(e.target.value)}
                    placeholder="e.g. Back pain consultation, Family urgent travel, Sickness rest..."
                    className="w-full bg-[#121212] border border-amber-900/30 focus:border-amber-500 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-white/20 focus:outline-none"
                  />
                </div>
              </div>
            )}

          </div>

          {/* Action button bar */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-2">
            <div>
              {attendanceFeedback ? (
                <span className="text-[11px] font-sans text-emerald-400 font-bold flex items-center gap-1.5">
                  <Check className="h-4 w-4 stroke-[3]" /> {attendanceFeedback}
                </span>
              ) : (
                <span className="text-[10px] font-sans text-on-surface-variant">
                  * All daily reports are visible to the Principal Architect and recorded on the global log.
                </span>
              )}
            </div>

            <button
              type="submit"
              className={`px-6 py-2.5 rounded-lg text-xs font-headline font-bold uppercase tracking-wider transition-all select-none cursor-pointer flex items-center justify-center gap-2 ${
                selectedStatus === 'On Leave'
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : (selectedStatus === 'On-Site'
                      ? 'bg-sky-600 hover:bg-sky-500 text-white'
                      : 'bg-primary hover:bg-white hover:text-black text-white')
              }`}
            >
              Confirm Daily Attendance Status
            </button>
          </div>
        </form>

      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (Duties Table/List - col-span-8) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          <div className="bg-[#0c0c0c] border border-white/10 rounded-xl p-6 flex flex-col gap-5">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h2 className="font-headline text-lg font-bold text-white flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Your Daily Duties & Site Deliverables
                </h2>
                <p className="font-sans text-xs text-on-surface-variant mt-1">
                  Complete these assigned site tasks to keep client blueprints moving forward.
                </p>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs text-on-surface-variant block">
                  Progress Today: <span className="text-white font-bold">{completedTasks}/{totalTasks}</span>
                </span>
                <span className="text-[10px] font-sans text-primary font-bold">
                  Performance: {memberData.performance}%
                </span>
              </div>
            </div>

            {/* Task list container */}
            {memberData.tasks.length === 0 ? (
              <div className="py-12 text-center text-on-surface-variant">
                <Check className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                <p className="font-headline text-sm font-bold text-white">All Clear!</p>
                <p className="font-sans text-xs mt-1">No pending site deliverables assigned by the principal architect.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {memberData.tasks.map((task) => (
                  <div 
                    key={task.id} 
                    className={`border rounded-xl p-4 md:p-5 transition-all flex flex-col gap-4 ${
                      task.completed 
                        ? 'bg-emerald-950/10 border-emerald-900/20' 
                        : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="flex gap-4 items-start justify-between">
                      <div className="flex gap-3 items-start">
                        <button
                          onClick={() => handleToggleTaskCompleted(task.id)}
                          className={`mt-1 h-5 w-5 rounded border flex items-center justify-center transition-all shrink-0 ${
                            task.completed 
                              ? 'bg-primary border-primary text-black' 
                              : 'border-white/20 hover:border-primary text-transparent'
                          }`}
                        >
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </button>
                        
                        <div>
                          <p className={`font-headline text-sm font-bold leading-snug ${
                            task.completed ? 'text-white/60 line-through' : 'text-white'
                          }`}>
                            {task.title}
                          </p>
                          <div className="flex items-center gap-3 mt-2 flex-wrap text-[11px] font-sans">
                            <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-on-surface-variant font-medium">
                              {task.category}
                            </span>
                            {task.deadline && (
                              <span className="text-primary font-bold flex items-center gap-1">
                                <Clock className="h-3 w-3" /> Due: {task.deadline}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        task.completed 
                          ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' 
                          : 'bg-amber-950/40 text-amber-500 border border-amber-900/30'
                      }`}>
                        {task.completed ? 'Completed' : 'Pending'}
                      </span>
                    </div>

                    {/* Image proof section */}
                    <div className="mt-2 border-t border-white/5 pt-4 flex flex-col gap-3">
                      <h4 className="text-[11px] font-headline font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
                        <Camera className="h-3.5 w-3.5 text-primary" /> Visual Progress Upload (Site Render/Photo)
                      </h4>

                      {task.imageProof ? (
                        <div className="flex flex-col sm:flex-row gap-4 items-start bg-black/30 border border-white/10 p-3 rounded-lg relative overflow-hidden">
                          <img 
                            src={task.imageProof} 
                            alt="Visual work update" 
                            className="w-full sm:w-32 h-20 object-cover rounded-md border border-white/10"
                          />
                          <div className="flex-grow">
                            <p className="font-headline text-xs font-bold text-white uppercase tracking-wider">Visual Proof Uploaded</p>
                            <p className="font-sans text-[11px] text-on-surface-variant mt-1 leading-normal">
                              Site photo verified. Uploaded at <span className="text-white font-semibold font-mono">{task.imageProofTime || 'Just now'}</span>.
                            </p>
                            <button
                              onClick={() => setSelectedTaskIdForImage(task.id)}
                              className="text-[11px] text-primary hover:text-white font-bold uppercase mt-2.5 flex items-center gap-1 transition-all"
                            >
                              Replace Image update
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl p-5 hover:border-primary/40 transition-all bg-white/[0.01]">
                          {isUploading === task.id ? (
                            <div className="flex flex-col items-center gap-2 py-2">
                              <div className="w-6 h-6 border-2 border-t-transparent border-primary rounded-full animate-spin" />
                              <span className="font-headline text-xs font-bold text-primary uppercase tracking-wider">Synthesizing file upload...</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => setSelectedTaskIdForImage(task.id)}
                              className="flex flex-col items-center gap-2 text-center text-xs text-on-surface-variant hover:text-primary transition-all group"
                            >
                              <UploadCloud className="h-8 w-8 text-on-surface-variant group-hover:text-primary transition-colors" />
                              <div>
                                <span className="text-white font-bold group-hover:underline block">Upload Image Proof</span>
                                <span className="text-[10px] mt-0.5 block opacity-80">Drag and drop or click to simulate upload</span>
                              </div>
                            </button>
                          )}
                        </div>
                      )}

                      {/* simulated drop down choice for mockup proof upload */}
                      {selectedTaskIdForImage === task.id && (
                        <div className="p-4 bg-white/5 border border-white/10 rounded-lg mt-1 animate-scaleIn">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-[11px] font-headline font-bold text-primary uppercase tracking-wider">
                              Choose a camera photo or blueprint draft to upload:
                            </span>
                            <button 
                              onClick={() => setSelectedTaskIdForImage(null)}
                              className="text-[10px] text-on-surface-variant hover:text-white uppercase font-bold"
                            >
                              Cancel
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-5 gap-2.5">
                            {MOCK_PROOF_IMAGES.map((imgUrl, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSelectMockProofImage(task.id, imgUrl)}
                                className="aspect-[4/3] rounded overflow-hidden border border-white/10 hover:border-primary transition-all relative group"
                              >
                                <img src={imgUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all text-white font-mono text-[10px]">
                                  Pic #{idx+1}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Logs timeline submit + Stats summary - col-span-4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Daily KPI Dashboard */}
          <div className="bg-[#0c0c0c] border border-white/10 rounded-xl p-5 flex flex-col gap-4">
            <h3 className="font-headline text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4" /> Personal Metrics Log
            </h3>
            
            <div className="grid grid-cols-2 gap-3.5">
              <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                <span className="text-[10px] font-sans text-on-surface-variant uppercase font-medium">Completed Duties</span>
                <p className="font-headline text-xl font-bold text-white mt-1">{completedTasks} / {totalTasks}</p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                <span className="text-[10px] font-sans text-on-surface-variant uppercase font-medium">Sust. Score</span>
                <p className="font-headline text-xl font-bold text-emerald-400 mt-1">{memberData.sustainabilityScore}%</p>
              </div>
            </div>

            <div className="bg-white/5 p-4 rounded-lg border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-sans text-on-surface-variant uppercase font-medium">Performance Grade</span>
                <p className="font-headline text-lg font-bold text-white mt-0.5">Grade A (High Efficiency)</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-xl font-bold text-primary">{memberData.performance}%</span>
              </div>
            </div>
          </div>

          {/* Timeline Feed Submission */}
          <div className="bg-[#0c0c0c] border border-white/10 rounded-xl p-5 flex flex-col gap-4">
            <h3 className="font-headline text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
              <Activity className="h-4 w-4" /> Live Field Log Update
            </h3>
            <p className="font-sans text-[11px] text-on-surface-variant leading-relaxed">
              Submit a rolling timeline entry to inform the central studio office of your immediate technical or physical discoveries on-site.
            </p>

            <form onSubmit={handlePostTimelineLog} className="flex flex-col gap-3">
              <textarea
                value={newLogText}
                onChange={(e) => setNewLogText(e.target.value)}
                placeholder="e.g., Just concluded wind velocity test on Varkala ridge, results show strong passive cooling potential..."
                rows={3}
                required
                className="w-full bg-white/5 border border-white/10 focus:border-primary rounded-lg px-3 py-2.5 font-sans text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary placeholder-white/20 resize-none shadow-inner"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-primary hover:bg-white hover:text-black text-white font-headline text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none"
              >
                <Plus className="h-4 w-4" /> Post Site Entry
              </button>
            </form>
          </div>

          {/* Quick Informational Guide */}
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex gap-3">
            <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="text-[11px] font-sans text-on-surface-variant leading-relaxed">
              <span className="text-white font-bold block mb-1">Authorization Guidelines:</span>
              As a technical specialist, your view is scoped entirely to site tasks and image uploads. For central operations coordination or general inquiries, coordinate with Aravind Menon.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
