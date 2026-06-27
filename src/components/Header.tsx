import { Compass, Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import { UserSession } from '../types';
import { triggerHaptic } from '../utils/haptic';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onContactClick: () => void;
  onAccountClick: () => void;
  currentUser: UserSession | null;
}

export default function Header({ 
  activeTab, 
  setActiveTab, 
  onContactClick,
  onAccountClick,
  currentUser
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = currentUser?.role === 'Employee'
    ? [
        { id: 'employee-view', label: 'My Daily Work' },
        { id: 'culture', label: 'Culture & AI Insights' }
      ]
    : [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'projects', label: 'Projects' },
        { id: 'team', label: 'Team' },
        { id: 'culture', label: 'Culture & AI Insights' }
      ];

  return (
    <header className="w-full h-20 sticky top-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10 shadow-sm transition-all duration-300">
      <div className="max-w-[1280px] mx-auto px-6 md:px-16 flex justify-between items-center h-full relative z-10">
        
        {/* Brand/Logo */}
        <div 
          onClick={() => {
            triggerHaptic('light');
            setActiveTab(currentUser?.role === 'Employee' ? 'employee-view' : 'dashboard');
          }} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <img 
            alt="Studio Ekoh Logo" 
            className="h-10 w-10 object-contain transition-transform group-hover:rotate-12 duration-300 invert" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAK6vkYe9SMijBcIl68jlzGGBYE3_n4zLEFX9JGu0t6KQIeW7EYkxzXmHxBZHGp-r1_L3l7odyltfYK4B_PyYtiL1SwAc8I_U5spFxnb6kIrdZupo3tGBkpMO4J164QUij4mzSm1a1xlBu0sreeRCjgdiFNUl2jq3iRvAkslc1Ojakry7S_xpAiFS-s48wVsSFIz9PM4XRkCcclxP44zuw86DlBhZTHAhu1de7pWzsrgrSmvwv6PCUJvZ805kU9VzOPpYJuSBZ1PiA"
          />
          <span className="font-headline text-xl md:text-2xl font-light text-primary tracking-widest uppercase">
            Studio Ekoh
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-2 h-full">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  triggerHaptic('light');
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`h-full px-4 relative flex items-center font-headline text-sm font-semibold tracking-wide transition-all duration-300 select-none ${
                  isActive 
                    ? 'text-primary' 
                    : 'text-on-surface-variant hover:text-primary hover:bg-white/5'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Trailing Actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              triggerHaptic('medium');
              onContactClick();
            }}
            className="hidden md:block px-6 py-2.5 bg-laterite-red text-white hover:bg-white hover:text-black font-headline text-sm font-semibold rounded-lg shadow-sm transition-all active:scale-[0.98]"
          >
            Complaint Box
          </button>
          
          <button 
            onClick={() => {
              triggerHaptic('light');
              onAccountClick();
            }}
            className="text-on-surface-variant hover:text-primary hover:bg-white/10 p-1.5 md:p-2 rounded-full transition-all flex items-center gap-2 border border-transparent hover:border-white/10"
            title="Studio Account"
          >
            {currentUser ? (
              <>
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="h-6 w-6 rounded-full object-cover border border-primary/50"
                />
                <span className="hidden md:inline text-xs font-headline font-bold text-primary">
                  {currentUser.name.split(' ')[0]}
                </span>
              </>
            ) : (
              <User className="h-5 w-5" />
            )}
          </button>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => {
              triggerHaptic('light');
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="md:hidden text-on-surface-variant hover:text-primary p-2 transition-colors"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-black/95 backdrop-blur-lg border-b border-white/10 shadow-lg flex flex-col p-6 gap-4 z-40 transition-all duration-300">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    triggerHaptic('light');
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left py-3 px-4 font-headline text-base font-semibold rounded-lg transition-all ${
                    isActive 
                      ? 'bg-white/5 text-primary border-l-4 border-primary' 
                      : 'text-on-surface-variant hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
          
          <button 
            onClick={() => {
              triggerHaptic('medium');
              setMobileMenuOpen(false);
              onContactClick();
            }}
            className="w-full py-3 bg-laterite-red text-white text-center font-headline font-semibold rounded-lg shadow-sm hover:bg-white hover:text-black transition-all"
          >
            Complaint Box
          </button>
        </div>
      )}
    </header>
  );
}
