import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  Layers, 
  Lightbulb, 
  Users, 
  Smile, 
  Heart, 
  CheckCircle2, 
  BookOpen, 
  Smartphone, 
  ChevronRight, 
  Play, 
  Info,
  Calendar,
  Compass,
  Zap,
  ArrowRight,
  Target,
  FileText,
  Workflow,
  HelpCircle,
  Clock,
  MapPin,
  Image as ImageIcon
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptic';

export default function CultureView() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'workflows' | 'marketing' | 'activities' | 'culture'>('analytics');
  
  // Interactive Prompt generator state
  const [targetMarket, setTargetMarket] = useState<string>('resort');
  const [pitchResult, setPitchResult] = useState<{
    title: string;
    hook: string;
    story: string;
    cta: string;
    hashtag: string;
  } | null>(null);

  // Workflow comparison state
  const [selectedWorkflowStep, setSelectedWorkflowStep] = useState<number>(0);
  
  // AI Co-pilot Chat/Query State
  const [userInput, setUserInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  // Seeded prompt suggestions
  const suggestedQueries = [
    "Draft a 2-day workshop on sustainable mud plastering.",
    "Show me how to reduce 3D revision cycles for premium clients.",
    "Create a campaign structure for Kerala Vernacular homestays.",
    "Plan a weekend Backwater Sketching & Watercolor itinerary."
  ];

  // Activities detail expansion
  const [selectedActivity, setSelectedActivity] = useState<string>('mud');

  // Trigger pitch generation on mount or target change
  useEffect(() => {
    generateMarketingPitch(targetMarket);
  }, [targetMarket]);

  const generateMarketingPitch = (market: string) => {
    triggerHaptic('light');
    if (market === 'resort') {
      setPitchResult({
        title: "Eco-Luxury Backwater Haven",
        hook: "✨ True luxury doesn't cost the Earth. It breathes with it.",
        story: "Crafted entirely with pneumatically compacted local soil and load-bearing seasoned pillars, this resort design blends seamlessly into the palm-fringed backwaters. By channeling natural wind currents from the lake, the architecture eliminates the need for mechanical cooling by 80%. We tell the story of mud, sweat, and craftsmanship—where the walls are literally sculpted by the local hands of Alappuzha.",
        cta: "🌿 Experience Bio-Climatic Living: Swipe to see the raw mud-tamping process.",
        hashtag: "#SustainableLuxury #EcoArchitecture #StudioEkoh #KeralaBackwaters"
      });
    } else if (market === 'cabin') {
      setPitchResult({
        title: "Wayanad Mud & Stone Forest Retreat",
        hook: "🏔️ A sanctuary grown from the forest floor.",
        story: "Nestled in the mist-laden Western Ghats, this cabin utilizes a high-thermal-mass rammed earth core and a structural bamboo sweeping roof. The stone foundation is dry-stacked using basalt boulders unearthed right on site. It's not just a stay; it's a living, breathing shelter that shields from monsoon torrents while keeping the interior cool under the intense tropical afternoon sun.",
        cta: "🍂 Watch the bamboo beetle-proofing curing bath live on our highlights.",
        hashtag: "#WayanadAtelier #RammedEarth #BioclimaticCabin #VernacularDesign"
      });
    } else {
      setPitchResult({
        title: "Minimalist Modern Vernacular Workspace",
        hook: "🏛️ Ancient wisdom, sharp modern aesthetics.",
        story: "Designed for a forward-thinking design collective, this workspace fuses traditional 'Padippura' entries with large insulated solar-shield glass blocks. Incorporating courtyard pools to cool the ambient office air naturally (the 'Nadumuttom' effect), this structure showcases how local, low-carbon materials can look highly sophisticated, corporate, and contemporary.",
        cta: "🪴 Tour the open bioclimatic courtyard on our IGTV.",
        hashtag: "#ModernVernacular #PassiveSolarOffice #StudioEkoh #BiophilicWork"
      });
    }
  };

  const handleCustomQuery = (query: string) => {
    triggerHaptic('medium');
    setIsGenerating(true);
    setAiResponse(null);
    
    // Simulate real-time server-side Gemini generation with beautiful stream-like timing
    setTimeout(() => {
      let response = '';
      if (query.toLowerCase().includes('workshop') || query.toLowerCase().includes('plastering')) {
        response = `### 🧱 Hands-On Vernacular Mud Plastering Workshop (AI Guide)

**Objective**: Host a community-facing 2-day workshop to build local brand presence and educate premium clients on the beauty of bioclimatic finishes.

#### Day 1: The Alchemy of Soil
- **9:30 AM - Chai & Soil Theory**: Discussing clay-sand proportions, organic binders (such as jaggery water, terminalia chebula, and straw fibres), and the breathing properties of mud.
- **11:00 AM - Live Mixing Session**: Team and participants mix soil with bare feet. This creates an immersive, sensory, and highly shareable moment for social media.
- **2:00 PM - Leveling & Undercoat**: Applying the first thick structural plaster layers on dummy test walls.

#### Day 2: Fine Textures & Finishing Arts
- **10:00 AM - Hand-Polishing Techniques**: Explaining traditional polishing with smooth river pebbles to create waterproof natural sheen surfaces.
- **2:00 PM - Pigment Infusion**: Adding natural ochres, terra-cottas, and charcoal dust for custom natural wall color schemes.
- **4:00 PM - Showcase & Certificates**: Photographing participants alongside their textured walls.

**Marketing Multiplier**: This event creates rich organic video loops for Instagram Reels and builds immediate local trust.`;
      } else if (query.toLowerCase().includes('revision') || query.toLowerCase().includes('3d')) {
        response = `### ⚡ AI-Powered Workflow Optimization (AI Guide)

**Shortcoming identified**: Your client review cycle averages 3 redundant feedback loop iterations due to static CAD sketches not translating the "cozy feeling" of sustainable spaces.

#### The 3-Step Remedy:
1. **ControlNet Blueprint Seeding**: Instead of waiting 5 days for a heavy V-Ray render, feed your basic 2D CAD elevations straight into a local Stable Diffusion engine configured with a ControlNet depth map model.
2. **Instant Material Overlays**: In just 15 seconds, generate multiple high-quality aesthetic mood options (e.g., 'Warm Earthen Plaster', 'Seasoned Teakwood', 'Basalt Stone Accent') under tropical golden-hour lighting.
3. **Immersive Real-Time Twinmotion Walkthroughs**: Present clients with a web-link containing an interactive visual walkthrough where they can click to toggle material textures in real-time. This saves up to 4 days of rendering workload per project and slashes the review cycles from 3 to 1.5!`;
      } else if (query.toLowerCase().includes('homestay') || query.toLowerCase().includes('campaign')) {
        response = `### 📸 Heritage Homes Digital Marketing Blueprint (AI Guide)

**Target**: Urban premium travelers looking for deep vernacular, traditional organic living.

#### 1. Content Pillar: The "Mud to Masterpiece" Journey
- Show a 15-second hyperlapse of raw, hand-pressed adobe bricks baking in the sun, contrasting with the final, warm-lit premium bedroom suite.
- Captivate with sound design: the rhythmic tapping of pneumatic earth tampers, monsoon rain dripping off a traditional clay-tiled roof, and local artisans speaking.

#### 2. Pinterest Focus Boards
- Create high-contrast aesthetic boards: *'Tropical Bioclimatic Living'*, *'Traditional Kerala Joinery Modernized'*, *'Minimalist Earthen Bathrooms'*.
- Link each pin directly to a customized land-page explaining the sustainability savings (carbon footprint reductions) of the building.

#### 3. Social Lead Funnel
- Offer a free premium PDF guide: *"How to build a bioclimatic home in South India: 5 secrets to keep indoor temp 5°C cooler naturally."* Build an organic email list of high-intent custom homeowners.`;
      } else if (query.toLowerCase().includes('backwater') || query.toLowerCase().includes('sketch')) {
        response = `### 🛶 Alappuzha Backwater Sketch Walk Itinerary (AI Guide)

**Objective**: An refreshing creative micro-break to revitalize the drafting and 3D team while exploring historic vernacular construction.

#### Itinerary:
- **02:00 PM - Canoe Embarkation**: The whole team boards a slow country wooden canoe from the Alappuzha jetty. Provide each designer with a custom hardbound brown-paper sketchbook and charcoal pens.
- **03:00 PM - Traditional Island Homestead Stop**: Docking at a 150-year-old traditional 'Nalukettu' family home. Focus sketching on:
  * Mortise-and-tenon teak wooden ceiling joinery.
  * Porous clay-tiled courtyards allowing rainwater percolation.
- **05:00 PM - Golden Hour Sketching Session**: Group watercolor and shading on the lake margins, capturing coconut palm shadows and passive solar overhangs.
- **06:30 PM - Hot Toddy & Spicy Fish Curry**: Dinner at a rustic local tavern, discussing creative ideas without top-down workspace hierarchy.`;
      } else {
        response = `### 🌿 Custom Atelier Solution: "${query}"

Based on Studio Ekoh's bio-climatic architectural ethos, here are concrete actionable recommendations to implement this idea:

1. **Local Material Sourcing**: Anchor the concept in traditional regional craftsmanship of Kerala (e.g., seasoned teakwood from local timber yards, sustainable bamboo culms, and red laterite soil).
2. **AI Iteration Prototype**: Before committing resources, use a generative diffusion model with high contrast lighting prompts to quickly validate the visual mood options.
3. **Team Integration**: Involve both the 2D draftsman and 3D render artists together during the initial conceptual phase. This prevents technical drift and reduces project revision delays.
4. **Interactive Marketing Feed**: Document the creation journey in high-contrast behind-the-scenes vertical videos. Highlight raw materials, human labor, and vernacular wisdom. This forms the ultimate marketing proof.`;
      }
      setAiResponse(response);
      setIsGenerating(false);
    }, 1500);
  };

  const currentActivityData = () => {
    if (selectedActivity === 'mud') {
      return {
        title: "Mud Clay Sculpting Challenge",
        desc: "A hands-on, high-tactility, and competitive challenge using raw, site-sourced laterite clay soil. Perfect for testing material hydration limits and feeling soil textures firsthand.",
        schedule: "Last Friday of the Month, 03:30 PM - 06:00 PM",
        teamSize: "Pairs (2 members per team)",
        materials: "Hydrated soil clay, natural fibers (straw, jute), organic pigments, potter's hand tamps.",
        checklist: [
          "Source 10kg clean laterite mud from the current active building site.",
          "Set up the central courtyard with large natural gunny bags.",
          "Provide snacks: hot Kerala cardamom tea and fresh banana fritters (pazham pori).",
          "Rules: Teams have 60 minutes to sculpt a mini structural model (e.g., arch, miniature column, dome). No adhesive or cement allowed!",
          "Prize: The 'Golden Trowel' award and a paid half-day leave for the winning pair."
        ],
        image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800"
      };
    } else if (selectedActivity === 'bamboo') {
      return {
        title: "Structural Bamboo Miniature Duel",
        desc: "A highly collaborative engineering challenge where designers use miniature bamboo splits and twine to craft high-strength load-bearing model bridges and roofs.",
        schedule: "Third Saturday of the Month, 01:00 PM - 04:00 PM",
        teamSize: "3 Members per group",
        materials: "Split green bamboo strips (15cm lengths), organic hemp twine, small paper shears.",
        checklist: [
          "Harvest thin reed bamboo and split them into 4mm uniform structural strips.",
          "Provide quick-dry eco-wood glue and natural twine rolls.",
          "Challenge: Build a model roofing truss that can span exactly 40cm with no center support.",
          "The Test: Load weights (bricks) on top of each miniature frame at 04:00 PM.",
          "Winning Criteria: The highest strength-to-weight ratio wins."
        ],
        image: "https://images.unsplash.com/photo-1595853035070-59a39fe84de3?auto=format&fit=crop&q=80&w=800"
      };
    } else {
      return {
        title: "Backwater Biophilic Sketch Walk",
        desc: "An outdoors creative retreat designed to break office fatigue, reset the team's visual palette, and study historic architectural carpentry along the tranquil backwaters.",
        schedule: "First Friday Afternoon of the Month, 02:00 PM - 06:30 PM",
        teamSize: "Individual & Group sharing",
        materials: "Studio-provided vintage kraft scrapbooks, ink-washes, watercolor kits, charcoal sticks.",
        checklist: [
          "Book a slow country wooden houseboat or large canoe for the afternoon.",
          "Draft an itinerary stopping at a historic Nalukettu house or localized pottery kiln.",
          "Focus on sketching vernacular Kerala joinery, passive ventilations, and palm shade play.",
          "Perform a 10-minute quiet meditation on the water to ground artistic attention.",
          "Pin up the sketches on the studio's main corridor wall on Monday morning."
        ],
        image: "https://images.unsplash.com/photo-1543731068-7e0f5beff43a?auto=format&fit=crop&q=80&w=800"
      };
    }
  };

  const activity = currentActivityData();

  return (
    <div className="flex flex-col gap-8 animate-fadeIn text-charcoal-text">
      
      {/* Intro Header Section */}
      <section className="bg-gradient-to-br from-charcoal-text to-[#151515] text-white rounded-2xl p-6 md:p-10 relative overflow-hidden shadow-xl border border-white/10">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full mb-3 text-primary text-xs font-headline font-bold uppercase tracking-widest">
              <Sparkles className="h-3 w-3 animate-spin" /> Co-Pilot & Atelier Culture Hub
            </div>
            <h1 className="font-headline text-3xl md:text-4xl font-extrabold tracking-tight">
              STUDIO INTELLIGENCE <span className="font-serif italic font-normal text-primary">& CULTURE</span>
            </h1>
            <p className="font-sans text-sm text-[#b0b0b0] mt-2 leading-relaxed">
              One-Stop Studio Management & Culture Dashboard. Here we analyze our performance shortcomings, detail structural upgrades for 2D/3D deliverables, build interactive marketing campaigns, and review monthly team-building events using AI models.
            </p>
          </div>
          
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl shrink-0 flex items-center gap-3 w-full md:w-auto">
            <div className="h-10 w-10 bg-primary/20 text-primary border border-primary/30 rounded-lg flex items-center justify-center font-bold">AI</div>
            <div>
              <span className="block text-[10px] uppercase font-headline text-[#b0b0b0] tracking-wider">Active Copilot</span>
              <span className="block text-xs font-bold text-white">Gemini 3.5 Core Engine</span>
            </div>
          </div>
        </div>
      </section>

      {/* Internal Navigation Sub-tabs */}
      <div className="flex border-b border-black/10 gap-2 overflow-x-auto pb-px">
        {[
          { id: 'analytics', label: '1. Diagnostics & Shortcomings', icon: TrendingUp },
          { id: 'workflows', label: '2. 2D & 3D Upgrades', icon: Layers },
          { id: 'marketing', label: '3. Strategic Marketing', icon: Target },
          { id: 'culture', label: '4. Biophilic Culture', icon: Heart },
          { id: 'activities', label: '5. Team Fun Calendar', icon: Calendar },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                triggerHaptic('light');
                setActiveTab(tab.id as any);
              }}
              className={`flex items-center gap-2 px-4 py-3 font-headline text-xs font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 select-none ${
                isActive 
                  ? 'border-primary text-primary bg-primary/[0.02]' 
                  : 'border-transparent text-on-surface-variant hover:text-charcoal-text hover:bg-black/[0.01]'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: DIAGNOSTICS & SHORTCOMINGS */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 gap-8 animate-fadeIn">
          
          {/* Diagnostic Stats */}
          <div className="flex flex-col gap-6">
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-lg flex flex-col gap-4">
              <h3 className="font-headline text-lg font-bold text-charcoal-text flex items-center gap-2 border-b border-white/10 pb-2">
                <TrendingUp className="h-5 w-5 text-laterite-red" />
                Atelier Structural Gaps & Shortcomings
              </h3>
              <p className="font-sans text-xs text-on-surface-variant leading-relaxed mb-2">
                Our ongoing audit reveals 5 major operational gaps causing project overheads, client delay cycles, and designer burnout.
              </p>

              {/* Gaps List */}
              <div className="flex flex-col gap-4">
                
                {/* Gap 1 */}
                <div className="bg-white/[0.03] border border-white/5 rounded-lg p-4 flex gap-4">
                  <span className="font-headline text-xs font-bold text-[#b45309] bg-amber-500/10 rounded-full h-6 w-6 flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <h4 className="font-headline text-xs font-bold text-charcoal-text uppercase tracking-wide">
                      Client Review Overhead (3.5 Revision Cycles)
                    </h4>
                    <p className="font-sans text-xs text-on-surface-variant mt-1 leading-relaxed">
                      Classic 2D drawings fail to convey deep biophilic earth warmth. Clients struggle to visualize space, causing an average of 3 redundant feedback loops.
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-[10px] font-headline uppercase font-bold text-laterite-red">
                      <span>Impact: +12 Days delay</span>
                      <span>•</span>
                      <span>Severity: Medium</span>
                    </div>
                  </div>
                </div>

                {/* Gap 2 */}
                <div className="bg-white/[0.03] border border-white/5 rounded-lg p-4 flex gap-4">
                  <span className="font-headline text-xs font-bold text-[#b45309] bg-amber-500/10 rounded-full h-6 w-6 flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <h4 className="font-headline text-xs font-bold text-charcoal-text uppercase tracking-wide">
                      Site-to-Office Sync Lag (18hr Response Loop)
                    </h4>
                    <p className="font-sans text-xs text-on-surface-variant mt-1 leading-relaxed">
                      Supervisors testing soil compaction in Wayanad wait an average of 18 hours for manual structural engineers to approve moisture readings.
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-[10px] font-headline uppercase font-bold text-laterite-red">
                      <span>Impact: Idle workers on-site</span>
                      <span>•</span>
                      <span>Severity: High</span>
                    </div>
                  </div>
                </div>

                {/* Gap 3 */}
                <div className="bg-white/[0.03] border border-white/5 rounded-lg p-4 flex gap-4">
                  <span className="font-headline text-xs font-bold text-[#b45309] bg-amber-500/10 rounded-full h-6 w-6 flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <h4 className="font-headline text-xs font-bold text-charcoal-text uppercase tracking-wide">
                      Zero Behind-the-Scenes Marketing Storytelling
                    </h4>
                    <p className="font-sans text-xs text-on-surface-variant mt-1 leading-relaxed">
                      While our rammed-earth compaction is premium, our website displays only cold static plans. Clients miss the raw earth, local artisans, and natural beauty.
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-[10px] font-headline uppercase font-bold text-laterite-red">
                      <span>Impact: Low Organic Lead Conversion (4.2%)</span>
                      <span>•</span>
                      <span>Severity: High</span>
                    </div>
                  </div>
                </div>

                {/* Gap 4 */}
                <div className="bg-white/[0.03] border border-white/5 rounded-lg p-4 flex gap-4">
                  <span className="font-headline text-xs font-bold text-[#b45309] bg-amber-500/10 rounded-full h-6 w-6 flex items-center justify-center shrink-0 mt-0.5">
                    4
                  </span>
                  <div>
                    <h4 className="font-headline text-xs font-bold text-charcoal-text uppercase tracking-wide">
                      Burnout Gaps in Deadline Work Culture
                    </h4>
                    <p className="font-sans text-xs text-on-surface-variant mt-1 leading-relaxed">
                      Draftsman average 12 hours overtime during pre-submission weeks. This triggers hand fatigue and reduces architectural plan quality by 15%.
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-[10px] font-headline uppercase font-bold text-laterite-red">
                      <span>Impact: High team stress</span>
                      <span>•</span>
                      <span>Severity: Critical</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: WORKFLOW UPGRADES */}
      {activeTab === 'workflows' && (
        <div className="flex flex-col gap-8 animate-fadeIn">
          
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-lg flex flex-col gap-4">
            <h3 className="font-headline text-lg font-bold text-charcoal-text flex items-center gap-2 border-b border-white/10 pb-2">
              <Layers className="h-5 w-5 text-primary" />
              Revolutionizing 2D Drafting & 3D Renderings
            </h3>
            <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
              We upgrade traditional, slow, static drafts by layering cutting-edge generative AI onto structural blueprints. This slashes client approval cycles and visualizes raw mud-construction instantly.
            </p>

            {/* Interactive workflow stepper */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/5 p-2 rounded-xl border border-white/10">
              {[
                { step: 0, label: "Step 1: 2D Parametric Drafting", detail: "Traditional CAD lines elevated with regional parameters" },
                { step: 1, label: "Step 2: AI ControlNet Pass", detail: "Applying lightning-fast structural depth masks" },
                { step: 2, label: "Step 3: Bioclimatic Rendering", detail: "Adding materials, palm shading & golden hour lighting" }
              ].map((s) => (
                <button
                  key={s.step}
                  onClick={() => {
                    triggerHaptic('light');
                    setSelectedWorkflowStep(s.step);
                  }}
                  className={`p-3.5 text-left rounded-lg transition-all ${
                    selectedWorkflowStep === s.step 
                      ? 'bg-white/10 shadow-sm border border-white/10 text-primary font-bold' 
                      : 'hover:bg-white/5 text-on-surface-variant'
                  }`}
                >
                  <span className="block text-[9px] uppercase font-headline font-semibold tracking-wider">
                    {s.label}
                  </span>
                  <span className="block text-xs font-sans mt-1 text-white font-medium leading-tight">
                    {s.detail}
                  </span>
                </button>
              ))}
            </div>

            {/* Side-by-Side Visual Demo */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mt-2">
              
              {/* Image Preview Card */}
              <div className="lg:col-span-7 rounded-xl overflow-hidden border border-black/10 shadow-md relative min-h-[300px] flex flex-col justify-end">
                {selectedWorkflowStep === 0 && (
                  <div className="absolute inset-0 bg-[#fbfaf7] p-8 flex flex-col items-center justify-center border-2 border-dashed border-black/15 animate-fadeIn">
                    <div className="w-full max-w-md h-48 border border-charcoal-text/20 rounded relative p-4 flex flex-col justify-between overflow-hidden">
                      {/* Blueprint grids */}
                      <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:16px_16px]" />
                      <div className="flex justify-between border-b border-charcoal-text/10 pb-2 text-[10px] font-mono text-on-surface-variant uppercase">
                        <span>PLAN VIEW - LEVEL 01</span>
                        <span>SCALE 1:50</span>
                      </div>
                      
                      {/* Geometric wall drawings */}
                      <div className="flex-grow flex items-center justify-center p-4">
                        <div className="w-40 h-24 border-2 border-charcoal-text/60 relative flex flex-col justify-between p-2">
                          <div className="w-full h-1 bg-charcoal-text/40" />
                          <div className="w-1/2 h-full border-r border-charcoal-text/40 absolute left-0" />
                          <div className="text-[8px] font-mono text-center mt-auto text-[#b45309]">MUD WALL - 300mm</div>
                        </div>
                        <div className="w-12 h-24 border-y-2 border-r-2 border-charcoal-text/60 relative" />
                      </div>

                      <div className="flex justify-between text-[9px] font-mono text-on-surface-variant">
                        <span>LATERITE RAMMED EARTH</span>
                        <span>06/27/2026</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedWorkflowStep === 1 && (
                  <div className="absolute inset-0 bg-[#121212] p-8 flex flex-col items-center justify-center animate-fadeIn">
                    <div className="w-full max-w-md h-48 bg-zinc-900 border border-white/10 rounded relative p-4 flex flex-col justify-between overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
                      <div className="flex justify-between border-b border-white/5 pb-2 text-[9px] font-mono text-[#a0a0a0]">
                        <span>AI CONTROLNET DEPTH MAP</span>
                        <span>THRESHOLD: 0.85</span>
                      </div>

                      {/* Depth visualizer */}
                      <div className="flex-grow flex items-center justify-center">
                        <div className="w-40 h-24 border border-primary/40 relative flex flex-col justify-between p-2 bg-black/40">
                          <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(139,94,60,0.4),transparent_60%)] animate-pulse" />
                          <span className="absolute bottom-2 left-2 text-[8px] font-mono text-primary uppercase">Edge Detection Active</span>
                        </div>
                      </div>

                      <div className="flex justify-between text-[9px] font-mono text-primary uppercase">
                        <span>Processing Layer...</span>
                        <span>Ready</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedWorkflowStep === 2 && (
                  <div className="absolute inset-0 animate-fadeIn bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200')` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>
                )}

                {/* Banner overlay bottom */}
                <div className="relative z-10 p-6 bg-gradient-to-t from-black to-black/30 text-white flex justify-between items-center w-full">
                  <div>
                    <span className="text-[10px] uppercase font-headline tracking-widest text-primary font-bold">
                      Interactive Render Feed
                    </span>
                    <h4 className="font-headline text-sm font-bold text-white mt-0.5">
                      {selectedWorkflowStep === 0 && "2D CAD Parametric Wireframe"}
                      {selectedWorkflowStep === 1 && "Stable Diffusion Clay Mask Pass"}
                      {selectedWorkflowStep === 2 && "Finished Bioclimatic Earthen Villa"}
                    </h4>
                  </div>
                  <span className="px-2.5 py-1 bg-white/10 text-white rounded font-mono text-xs uppercase">
                    Step {selectedWorkflowStep + 1}
                  </span>
                </div>
              </div>

              {/* Analytical upgrade explanation */}
              <div className="lg:col-span-5 bg-white/5 p-6 rounded-xl border border-white/10 flex flex-col justify-between gap-4">
                <div>
                  <h4 className="font-headline text-base font-bold text-charcoal-text flex items-center gap-1.5 uppercase tracking-wide border-b border-white/10 pb-2">
                    <Info className="h-4.5 w-4.5 text-primary" />
                    How this improves our works
                  </h4>
                  
                  <div className="mt-4 flex flex-col gap-4">
                    <div className="flex gap-3 items-start">
                      <div className="p-1.5 bg-[#b45309]/10 text-[#b45309] rounded-lg shrink-0">
                        <Zap className="h-4 w-4" />
                      </div>
                      <div>
                        <h5 className="font-headline text-xs font-bold text-white">Slashes client revision loops</h5>
                        <p className="font-sans text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                          Clients can see exactly how sunset golden rays enter the courtyard pool before any building resource is committed. Saves weeks of back-and-forth work.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <div className="p-1.5 bg-[#b45309]/10 text-[#b45309] rounded-lg shrink-0">
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <div>
                        <h5 className="font-headline text-xs font-bold text-white">Material Texturing Accuracy</h5>
                        <p className="font-sans text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                          Accurately visualizes rough laterite compaction, seasoned teak wood grain, and structural bamboo bindings rather than flat generic digital colors.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#b45309]/5 border border-[#b45309]/10 p-4 rounded-xl">
                  <span className="block text-[10px] uppercase font-headline font-bold text-primary tracking-wider">
                    Recommended Tools Deployed
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {['Stable Diffusion', 'Twinmotion', 'Revit BIM', 'ControlNet 1.1', 'Rhino Grasshopper'].map((tool, idx) => (
                      <span key={idx} className="text-[10px] font-sans font-bold bg-white/10 px-2 py-0.5 text-white rounded border border-white/10">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* TAB 3: STRATEGIC ECO-MARKETING */}
      {activeTab === 'marketing' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
          
          {/* Framework Strategy */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-lg flex flex-col gap-4">
              <h3 className="font-headline text-lg font-bold text-charcoal-text flex items-center gap-2 border-b border-white/10 pb-2">
                <Target className="h-5 w-5 text-laterite-red" />
                Strategic Eco-Marketing & Storytelling
              </h3>
              <p className="font-sans text-xs text-on-surface-variant leading-relaxed mb-2">
                Rather than standard ads, we leverage the raw organic beauty of bioclimatic architecture to tell stories that connect emotionally with high-net-worth clients.
              </p>

              <div className="flex flex-col gap-4">
                
                {/* Channel 1 */}
                <div className="flex gap-4">
                  <div className="h-10 w-10 bg-[#b45309]/10 text-primary border border-primary/20 rounded-xl flex items-center justify-center font-headline font-bold shrink-0">
                    A
                  </div>
                  <div>
                    <h4 className="font-headline text-xs font-bold text-charcoal-text uppercase tracking-wide">
                      Bio-climatic behind-the-scenes video loops
                    </h4>
                    <p className="font-sans text-xs text-on-surface-variant mt-1 leading-relaxed">
                      Publishing high-quality 15-second sound-focused loops (ASMR) on Reels and TikTok showing soil compaction, wet mud clay plastering, and bamboo oil curing. Humans love the sensory process of craft.
                    </p>
                  </div>
                </div>

                {/* Channel 2 */}
                <div className="flex gap-4">
                  <div className="h-10 w-10 bg-[#b45309]/10 text-primary border border-primary/20 rounded-xl flex items-center justify-center font-headline font-bold shrink-0">
                    B
                  </div>
                  <div>
                    <h4 className="font-headline text-xs font-bold text-charcoal-text uppercase tracking-wide">
                      Pinterest Organic Moodboards
                    </h4>
                    <p className="font-sans text-xs text-on-surface-variant mt-1 leading-relaxed">
                      Earthy, minimalist custom spaces convert extremely high on Pinterest. We pin rendered tropical courtyards directly linking back to our sustainability carbon-offset estimator.
                    </p>
                  </div>
                </div>

                {/* Channel 3 */}
                <div className="flex gap-4">
                  <div className="h-10 w-10 bg-[#b45309]/10 text-primary border border-primary/20 rounded-xl flex items-center justify-center font-headline font-bold shrink-0">
                    C
                  </div>
                  <div>
                    <h4 className="font-headline text-xs font-bold text-charcoal-text uppercase tracking-wide">
                      Local Mud-Clay Hands-on workshops
                    </h4>
                    <p className="font-sans text-xs text-on-surface-variant mt-1 leading-relaxed">
                      Hosting seasonal weekend mud plastering meetups for home-owners in Kochi and Wayanad. Hands-on material connection turns local prospects into passionate brand advocates.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Interactive Lead & Pitch generator */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-[#121212] text-white p-6 rounded-xl border border-white/10 shadow-lg flex flex-col gap-4">
              <h4 className="font-headline text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/10 pb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                Copilot Lead Pitch Generator
              </h4>
              <p className="font-sans text-xs text-[#a0a0a0] leading-relaxed">
                Select your target local Kerala niche and watch our AI instantly formulate a high-converting marketing social-media story pitch:
              </p>

              {/* Dropdown selector */}
              <div className="flex flex-col gap-1.5">
                <label className="block text-[10px] font-headline font-bold uppercase tracking-wider text-[#b0b0b0]">
                  Select Target Project Niche
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'resort', label: 'Eco-Resort' },
                    { id: 'cabin', label: 'Mud Cabin' },
                    { id: 'office', label: 'Modern Office' }
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => setTargetMarket(btn.id)}
                      className={`py-2 px-1 text-center rounded-lg border text-[10px] font-headline font-bold uppercase transition-all ${
                        targetMarket === btn.id 
                          ? 'border-primary bg-primary/10 text-primary' 
                          : 'border-white/5 hover:border-white/10 bg-white/[0.02] text-[#a0a0a0]'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generated Pitch Result */}
              {pitchResult && (
                <div className="mt-2 bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col gap-3 animate-scaleIn">
                  <div>
                    <span className="text-[9px] font-mono text-primary uppercase font-bold tracking-widest">
                      AI Generated Pitch Title
                    </span>
                    <h5 className="font-headline text-xs font-bold text-white mt-0.5">
                      {pitchResult.title}
                    </h5>
                  </div>

                  <div>
                    <span className="text-[9px] font-mono text-primary uppercase font-bold tracking-widest block mb-0.5">
                      Hook Statement
                    </span>
                    <p className="font-sans text-xs italic text-white/90">
                      {pitchResult.hook}
                    </p>
                  </div>

                  <div>
                    <span className="text-[9px] font-mono text-primary uppercase font-bold tracking-widest block mb-0.5">
                      Organic Story Copy
                    </span>
                    <p className="font-sans text-xs text-[#b0b0b0] leading-relaxed">
                      {pitchResult.story}
                    </p>
                  </div>

                  <div className="border-t border-white/5 pt-2 flex flex-col gap-1">
                    <span className="text-[9px] font-mono text-emerald-400 uppercase font-bold tracking-widest">
                      Call to Action (CTA) & Hashtags
                    </span>
                    <p className="font-sans text-xs text-emerald-400">
                      {pitchResult.cta}
                    </p>
                    <p className="font-mono text-[9px] text-[#808080] mt-1">
                      {pitchResult.hashtag}
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      )}

      {/* TAB 4: BIOPHILIC WORK CULTURE */}
      {activeTab === 'culture' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
          
          {/* Work culture breakdown */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-lg flex flex-col gap-4">
              <h3 className="font-headline text-lg font-bold text-charcoal-text flex items-center gap-2 border-b border-white/10 pb-2">
                <Heart className="h-5 w-5 text-laterite-red" />
                Optimizing Atelier Work Culture
              </h3>
              <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                A highly creative architecture studio cannot operate like a rigid assembly line. We introduce human-centric, sustainable habits to reduce stress and spark creative synergy.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                
                {/* Block 1 */}
                <div className="bg-white/[0.03] border border-white/5 p-4 rounded-xl flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-[#b45309]">
                    <Clock className="h-4 w-4" />
                    <h4 className="font-headline text-xs font-bold uppercase tracking-wide">
                      Strict 6:00 PM Office Exit
                    </h4>
                  </div>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                    Servers automatically shut down and lights dim at 6:00 PM. Preventing over-time culture keeps designers fresh, reduces blue-light burnout, and preserves personal wellness.
                  </p>
                </div>

                {/* Block 2 */}
                <div className="bg-white/[0.03] border border-white/5 p-4 rounded-xl flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-[#b45309]">
                    <Users className="h-4 w-4" />
                    <h4 className="font-headline text-xs font-bold uppercase tracking-wide">
                      Friendly Friday Design Critiques
                    </h4>
                  </div>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                    Peer-led conceptual design reviews on Friday afternoons. Draftsman and 3D render artists trade feedback without manager-induced workspace pressure.
                  </p>
                </div>

                {/* Block 3 */}
                <div className="bg-white/[0.03] border border-white/5 p-4 rounded-xl flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-[#b45309]">
                    <Compass className="h-4 w-4" />
                    <h4 className="font-headline text-xs font-bold uppercase tracking-wide">
                      Biophilic Workspace Redesign
                    </h4>
                  </div>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                    Introducing areca palms, natural terracotta pottery, clay brick wall tiles, and natural ventilation pools to keep the studio cool and visually relaxing.
                  </p>
                </div>

                {/* Block 4 */}
                <div className="bg-white/[0.03] border border-white/5 p-4 rounded-xl flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-[#b45309]">
                    <Smile className="h-4 w-4" />
                    <h4 className="font-headline text-xs font-bold uppercase tracking-wide">
                      50-10 Drafting micro-breaks
                    </h4>
                  </div>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                    Structured Pomodoro rules. Draftsman take a 10-minute break for every 50 minutes of CAD drafting to avoid chronic shoulder strain.
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* Visual Workspace Inspiration Card */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-xl shadow-lg flex flex-col justify-between gap-4">
              <div>
                <h4 className="font-headline text-sm font-bold text-charcoal-text uppercase tracking-wider flex items-center gap-1.5 border-b border-white/10 pb-3">
                  <ImageIcon className="h-4.5 w-4.5 text-primary" />
                  Studio Design Inspiration
                </h4>
                <div className="rounded-lg overflow-hidden border border-black/10 shadow-sm mt-3 h-44 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800" 
                    className="w-full h-full object-cover" 
                    alt="Biophilic Workspace design" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-3 text-white">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-primary font-bold">Biophilic Studio Core</span>
                    <span className="text-xs font-headline font-bold">Maximized daylight & terracotta accents</span>
                  </div>
                </div>
                <p className="font-sans text-xs text-on-surface-variant mt-3 leading-relaxed">
                  Integrating plants and clay elements inside our work environments reduces worker heart rate variability, enhancing focus and drafting accuracy naturally.
                </p>
              </div>

              <div className="bg-[#b45309]/5 border border-[#b45309]/10 p-3 rounded-lg flex items-center gap-2 text-xs">
                <Info className="h-4 w-4 text-[#b45309] shrink-0" />
                <span className="text-on-surface-variant font-sans">Implementing this culture reduces drafting timeline delays by up to 18%.</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 5: TEAM FUN CALENDAR */}
      {activeTab === 'activities' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
          
          {/* Fun Program Selector */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-lg flex flex-col gap-3">
              <h3 className="font-headline text-base font-bold text-charcoal-text flex items-center gap-1.5 border-b border-white/10 pb-2">
                <Calendar className="h-5 w-5 text-primary" />
                Team Bonding Programs
              </h3>
              <p className="font-sans text-xs text-on-surface-variant leading-relaxed mb-1">
                Select a customized studio bonding program from our calendar designed specific to architects:
              </p>

              {/* Activity select list */}
              <div className="flex flex-col gap-2">
                
                {/* Mud */}
                <button
                  onClick={() => {
                    triggerHaptic('light');
                    setSelectedActivity('mud');
                  }}
                  className={`p-3 text-left rounded-xl transition-all border flex justify-between items-center ${
                    selectedActivity === 'mud' 
                      ? 'border-primary bg-primary/10 text-primary font-bold shadow-sm' 
                      : 'border-white/5 bg-white/5 hover:bg-white/10 text-on-surface-variant'
                  }`}
                >
                  <div>
                    <span className="block text-xs font-headline uppercase tracking-wide">1. Mud Clay Sculpting Challenge</span>
                    <span className="block text-[10px] font-sans mt-0.5 font-medium opacity-80 text-on-surface-variant">Rammed-earth hands-on fun</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-primary" />
                </button>

                {/* Bamboo */}
                <button
                  onClick={() => {
                    triggerHaptic('light');
                    setSelectedActivity('bamboo');
                  }}
                  className={`p-3 text-left rounded-xl transition-all border flex justify-between items-center ${
                    selectedActivity === 'bamboo' 
                      ? 'border-primary bg-primary/10 text-primary font-bold shadow-sm' 
                      : 'border-white/5 bg-white/5 hover:bg-white/10 text-on-surface-variant'
                  }`}
                >
                  <div>
                    <span className="block text-xs font-headline uppercase tracking-wide">2. Structural Bamboo mini bridges</span>
                    <span className="block text-[10px] font-sans mt-0.5 font-medium opacity-80 text-on-surface-variant">Twine & craft load test bridges</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-primary" />
                </button>

                {/* Canoe */}
                <button
                  onClick={() => {
                    triggerHaptic('light');
                    setSelectedActivity('canoe');
                  }}
                  className={`p-3 text-left rounded-xl transition-all border flex justify-between items-center ${
                    selectedActivity === 'canoe' 
                      ? 'border-primary bg-primary/10 text-primary font-bold shadow-sm' 
                      : 'border-white/5 bg-white/5 hover:bg-white/10 text-on-surface-variant'
                  }`}
                >
                  <div>
                    <span className="block text-xs font-headline uppercase tracking-wide">3. Alappuzha Sketch Walk</span>
                    <span className="block text-[10px] font-sans mt-0.5 font-medium opacity-80 text-on-surface-variant">Waterhouse sketching & curry</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-primary" />
                </button>

              </div>
            </div>
          </div>

          {/* Activity Detail Card */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-white/5 border border-white/10 rounded-xl shadow-lg overflow-hidden flex flex-col h-full">
              
              <div className="h-48 relative shrink-0">
                <img 
                  src={activity.image} 
                  className="w-full h-full object-cover" 
                  alt={activity.title} 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-[10px] uppercase font-headline font-bold text-primary tracking-widest">
                    Active Monthly Program
                  </span>
                  <h4 className="font-headline text-lg font-bold text-white mt-1">
                    {activity.title}
                  </h4>
                </div>
              </div>

              <div className="p-6 flex flex-col gap-4 flex-grow justify-between">
                <div>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                    {activity.desc}
                  </p>

                  {/* Program stats */}
                  <div className="grid grid-cols-2 gap-4 bg-white/5 border border-white/5 rounded-lg p-3 my-3 text-xs">
                    <div>
                      <span className="block text-[10px] font-headline font-bold uppercase text-on-surface-variant tracking-wider">
                        Preferred Schedule
                      </span>
                      <span className="font-sans font-bold text-charcoal-text mt-0.5 block">{activity.schedule}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-headline font-bold uppercase text-on-surface-variant tracking-wider">
                        Team Setup
                      </span>
                      <span className="font-sans font-bold text-charcoal-text mt-0.5 block">{activity.teamSize}</span>
                    </div>
                  </div>

                  {/* Checklist */}
                  <div className="flex flex-col gap-2 mt-2">
                    <span className="text-[10px] font-headline font-bold uppercase tracking-wider text-primary">
                      Atelier Step-By-Step Checklist (AI Recommended)
                    </span>
                    <ul className="flex flex-col gap-2 mt-1">
                      {activity.checklist.map((item, idx) => (
                        <li key={idx} className="flex gap-2 items-start text-xs font-sans text-on-surface-variant">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="border-t border-black/5 pt-4 flex justify-between items-center text-xs text-on-surface-variant">
                  <span>Materials: <span className="font-bold text-charcoal-text">{activity.materials}</span></span>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
