import { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Layers, 
  Activity, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Briefcase, 
  Workflow,
  Sparkles
} from 'lucide-react';
import { Project } from '../types';
import { PIPELINE_CHARTS_DATA, FINANCIAL_CHARTS_DATA } from '../data';

interface AnalyzerViewProps {
  projects: Project[];
}

export default function AnalyzerView({ projects }: AnalyzerViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'projects' | 'financials'>('projects');
  const [selectedPeriod, setSelectedPeriod] = useState('Q3 2026');

  // Compute metrics from real state
  const totalPipeline = projects.length;
  const activePhases = projects.filter(p => p.status === 'Active').length;
  
  // Calculate total budget (financial sum)
  const totalBudgetSum = projects.reduce((sum, p) => sum + p.budget, 0);
  const formattedYtdRevenue = (totalBudgetSum / 10000000).toFixed(1) + ' Cr'; // 1 Crore = 10,000,000

  // Filter activities dynamically or show reference activities
  const recentActivities = [
    { name: 'Villa Nova Phase 2', note: 'Foundation poured', tag: 'Today', isNew: true },
    { name: 'Echo Highrise', note: 'Permits approved', tag: '2d ago', isNew: false },
    { name: 'Lakeside Pavilion', note: 'Drafting complete', tag: '5d ago', isNew: false },
    { name: 'Studio Revamp', note: 'Client review', tag: '1w ago', isNew: false },
  ];

  return (
    <div className="flex flex-col gap-12 md:gap-16">
      
      {/* Controls Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-6 border-b border-teak-brown/10">
        <div className="max-w-xl">
          <h1 className="font-headline text-5xl md:text-6xl font-bold text-charcoal-text tracking-tight">
            Studio Analytics
          </h1>
          <p className="font-sans text-base md:text-lg text-on-surface-variant leading-relaxed mt-2">
            Macro view of studio performance and architectural pipeline, giving you a clear structural overview of current initiatives.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
          {/* Quarter Selector */}
          <div className="relative w-full sm:w-auto">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full sm:w-48 appearance-none bg-transparent border-b-2 border-primary text-white py-2 px-4 pr-10 rounded-none font-headline text-sm font-semibold focus:outline-none focus:border-primary transition-all cursor-pointer"
            >
              <option className="bg-[#0c0c0c] text-white" value="Q3 2026">Q3 2026 (Current)</option>
              <option className="bg-[#0c0c0c] text-white" value="Q2 2026">Q2 2026</option>
              <option className="bg-[#0c0c0c] text-white" value="Q1 2026">Q1 2026</option>
              <option className="bg-[#0c0c0c] text-white" value="Q4 2025">Q4 2025</option>
            </select>
          </div>

          {/* Analysis Toggle */}
          <div className="flex items-center space-x-6 w-full sm:w-auto border-b border-teak-brown/20 pb-2">
            <button 
              onClick={() => setActiveSubTab('projects')}
              className={`font-headline text-sm font-semibold pb-1.5 transition-all duration-300 relative select-none ${
                activeSubTab === 'projects'
                  ? 'text-primary'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Projects
              {activeSubTab === 'projects' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
            <button 
              onClick={() => setActiveSubTab('financials')}
              className={`font-headline text-sm font-semibold pb-1.5 transition-all duration-300 relative select-none ${
                activeSubTab === 'financials'
                  ? 'text-primary'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Financials
              {activeSubTab === 'financials' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* VIEW: Projects Analytics */}
      {activeSubTab === 'projects' && (
        <div className="flex flex-col gap-8">
          
          {/* Metric Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-panel rounded-xl p-8 flex flex-col justify-between h-40 relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300">
              <div className="flex justify-between items-start relative z-10">
                <p className="font-headline text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  Total Pipeline
                </p>
                <div className="text-teak-brown/50">
                  <Briefcase className="h-5 w-5" />
                </div>
              </div>
              <p className="font-headline text-5xl font-bold text-primary leading-none relative z-10">
                {totalPipeline}
              </p>
            </div>

            <div className="glass-panel rounded-xl p-8 flex flex-col justify-between h-40 relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300">
              <div className="flex justify-between items-start relative z-10">
                <p className="font-headline text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  Active Phases
                </p>
                <div className="text-teak-brown/50">
                  <Workflow className="h-5 w-5" />
                </div>
              </div>
              <p className="font-headline text-5xl font-bold text-terracotta leading-none relative z-10">
                {activePhases}
              </p>
            </div>
          </div>

          {/* Main Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            
            {/* Chart Column (2/3 width) */}
            <div className="lg:col-span-2 glass-panel rounded-xl p-8 flex flex-col min-h-[440px] relative overflow-hidden">
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-teak-brown/10">
                <h2 className="font-headline text-lg font-bold text-charcoal-text flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary animate-pulse" />
                  Pipeline Status
                </h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                    <span className="font-headline text-xs font-bold text-on-surface-variant">Active</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-tertiary" />
                    <span className="font-headline text-xs font-bold text-on-surface-variant">Completed</span>
                  </div>
                </div>
              </div>

              {/* Recharts BarChart */}
              <div className="flex-grow w-full h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={PIPELINE_CHARTS_DATA}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                    <XAxis 
                      dataKey="quarter" 
                      stroke="#C5A059" 
                      tick={{ fontFamily: 'Georgia', fontSize: 12, fontWeight: 600 }}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#C5A059" 
                      tick={{ fontFamily: 'Source Sans 3', fontSize: 12 }}
                      tickLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#121212', 
                        borderColor: '#C5A059', 
                        borderRadius: '8px',
                        fontFamily: 'Source Sans 3',
                        color: '#ffffff'
                      }} 
                    />
                    <Bar dataKey="Active" fill="#C5A059" radius={[4, 4, 0, 0]} barSize={32} />
                    <Bar dataKey="Completed" fill="#444444" radius={[4, 4, 0, 0]} barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activity Column (1/3 width) */}
            <div className="glass-panel rounded-xl p-8 flex flex-col min-h-[440px]">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-teak-brown/10">
                <h2 className="font-headline text-lg font-bold text-charcoal-text">
                  Recent Activity
                </h2>
              </div>

              <div className="flex-grow flex flex-col gap-6">
                {recentActivities.map((act, index) => (
                  <div 
                    key={index} 
                    className="flex justify-between items-start p-2 -mx-2 rounded-lg hover:bg-white/5 transition-all group cursor-pointer"
                  >
                    <div>
                      <p className="font-headline text-sm font-semibold text-charcoal-text group-hover:text-primary transition-all">
                        {act.name}
                      </p>
                      <p className="font-sans text-xs text-on-surface-variant mt-0.5">
                        {act.note}
                      </p>
                    </div>
                    <span className={`font-sans text-[10px] font-bold px-2 py-0.5 rounded ${
                      act.isNew 
                        ? 'text-laterite-red bg-error-container/60 border border-error-container/30' 
                        : 'text-on-surface-variant bg-surface-container'
                    }`}>
                      {act.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* VIEW: Financials Analytics */}
      {activeSubTab === 'financials' && (
        <div className="glass-panel rounded-xl p-8 md:p-10 min-h-[500px] flex flex-col justify-between">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 pb-4 border-b border-teak-brown/10">
            <div>
              <h2 className="font-headline text-xl font-bold text-charcoal-text flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Revenue Flow
              </h2>
              <p className="font-sans text-sm text-on-surface-variant mt-0.5">
                Year-To-Date (YTD) financial synthesis of project commissions.
              </p>
            </div>
            
            <div className="flex flex-col items-start sm:items-end">
              <span className="font-sans text-xs uppercase tracking-widest text-teak-brown font-bold">YTD Pipeline Budget</span>
              <div className="font-headline text-4xl md:text-5xl font-bold text-primary leading-none mt-1">
                ₹{formattedYtdRevenue}
              </div>
            </div>
          </div>

          {/* Monthly Bar Chart */}
          <div className="flex-grow w-full h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={FINANCIAL_CHARTS_DATA}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="#C5A059" 
                  tick={{ fontFamily: 'Georgia', fontSize: 12, fontWeight: 600 }}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#C5A059" 
                  tick={{ fontFamily: 'Source Sans 3', fontSize: 12 }}
                  tickLine={false}
                  tickFormatter={(val) => `₹${(val/100000).toFixed(0)}L`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#121212', 
                    borderColor: '#C5A059', 
                    borderRadius: '8px',
                    fontFamily: 'Source Sans 3',
                    color: '#ffffff'
                  }}
                  formatter={(val) => [`₹${(Number(val)/100000).toFixed(0)} Lakhs`]}
                />
                <Legend 
                  wrapperStyle={{ fontFamily: 'Georgia', fontSize: 12, fontWeight: 600 }}
                />
                <Bar name="Revenue" dataKey="Revenue" fill="#C5A059" radius={[4, 4, 0, 0]} />
                <Bar name="Expense" dataKey="Expense" fill="#444444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      )}

    </div>
  );
}
