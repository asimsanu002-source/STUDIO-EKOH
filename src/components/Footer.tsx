interface FooterProps {
  setActiveTab: (tab: string) => void;
  onContactClick: () => void;
}

export default function Footer({ setActiveTab, onContactClick }: FooterProps) {
  return (
    <footer className="bg-black/80 backdrop-blur-md w-full py-16 px-6 md:px-16 mt-auto border-t border-white/10 relative overflow-hidden">
      {/* Gloss effect */}
      <div className="absolute -top-[100px] -left-[100px] w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        
        {/* Brand Column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <img 
              alt="Studio Ekoh Logo" 
              className="h-8 w-8 object-contain invert" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAK6vkYe9SMijBcIl68jlzGGBYE3_n4zLEFX9JGu0t6KQIeW7EYkxzXmHxBZHGp-r1_L3l7odyltfYK4B_PyYtiL1SwAc8I_U5spFxnb6kIrdZupo3tGBkpMO4J164QUij4mzSm1a1xlBu0sreeRCjgdiFNUl2jq3iRvAkslc1Ojakry7S_xpAiFS-s48wVsSFIz9PM4XRkCcclxP44zuw86DlBhZTHAhu1de7pWzsrgrSmvwv6PCUJvZ805kU9VzOPpYJuSBZ1PiA"
            />
            <span className="font-headline text-lg font-light tracking-widest uppercase text-primary">
              Studio Ekoh
            </span>
          </div>
          <p className="font-sans text-xs text-on-surface-variant max-w-xs leading-relaxed">
            Bridging organic vernacular materials with technical geometric precision. Built with sustainable luxury.
          </p>
          <p className="font-sans text-xs text-secondary/70 font-medium">
            © 2026 Studio Ekoh Architecture. All rights reserved.
          </p>
        </div>

        {/* Navigation Link Columns */}
        <div className="flex flex-col gap-3">
          <h4 className="font-headline text-xs font-bold uppercase tracking-widest text-primary">Philosophy</h4>
          <nav className="flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('team')} 
              className="font-sans text-sm text-left text-on-surface-variant hover:text-primary transition-all opacity-80 hover:opacity-100 font-medium"
            >
              Sustainability Pledge
            </button>
            <button 
              onClick={() => setActiveTab('projects')} 
              className="font-sans text-sm text-left text-on-surface-variant hover:text-primary transition-all opacity-80 hover:opacity-100 font-medium"
            >
              Vernacular Materiality
            </button>
            <button 
              onClick={onContactClick} 
              className="font-sans text-sm text-left text-on-surface-variant hover:text-primary transition-all opacity-80 hover:opacity-100 font-medium"
            >
              Public Complaint Box
            </button>
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="font-headline text-xs font-bold uppercase tracking-widest text-primary">Office</h4>
          <nav className="flex flex-col gap-2">
            <a href="#" className="font-sans text-sm text-on-surface-variant hover:text-primary transition-all opacity-80 hover:opacity-100 font-medium">Press Kit</a>
            <a href="#" className="font-sans text-sm text-on-surface-variant hover:text-primary transition-all opacity-80 hover:opacity-100 font-medium">Careers</a>
            <a href="#" className="font-sans text-sm text-on-surface-variant hover:text-primary transition-all opacity-80 hover:opacity-100 font-medium">Legal & Patents</a>
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="font-headline text-xs font-bold uppercase tracking-widest text-primary">Contact Info</h4>
          <address className="not-italic flex flex-col gap-2 font-sans text-sm text-on-surface-variant opacity-80">
            <p>Panampilly Nagar, Kochi,</p>
            <p>Kerala, 682036, India</p>
            <p className="mt-1 font-semibold text-primary">atelier@studioekoh.com</p>
          </address>
        </div>

      </div>
    </footer>
  );
}
