import { Project, StudioUpdate, TeamMember, DiagnosticResult } from './types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Kochi Villa Phase 2',
    description: 'A premium waterfront residential project in Kochi featuring a dual-courtyard design and local sustainable materials like laterite stone and reclaimed teak.',
    status: 'Active',
    phase: 'Structural Review',
    location: 'Kochi, Kerala',
    materials: ['Laterite Stone', 'Reclaimed Teak', 'Clay Roof Tiles'],
    squareFootage: 4500,
    budget: 12000000,
    revenue: 15000000,
    dateAdded: '2026-06-25',
    timeAgo: '2 hours ago',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoEzCiHcr6T33oXRhg8yVzKOK8Qhit3-xzNVGnp5tm2VA4VRsELyrvFB6F8Ltn_GgudlW2OfOT_dIirGVQo7GGubIINhkDgfhsbfKUoRvwVHltvntzwqPBLCxYfi8xabh8Hyf8X8tT2y5r7CuUXBUEtvXvdAN1xX0Hj2zAkionQCSkK3uTkf_Ln3BbGRO3fLeMe2Dbrraav6ORE3DWUO235dzpe7FiyhbTAI3yUXIkU7H1P9X3KVPDxKDQ7y7gfYwpS3mx_uhMM3s',
    updateStage: 'On Office',
    officeUpdate: '3D Update',
    officePayment: { requiredAmount: 150000, paidAmount: 150000, status: 'Fully Paid' }
  },
  {
    id: 'proj-2',
    name: 'Munnar Eco-Resort',
    description: 'Stilted mountain eco-villas blending into the tea plantation terrain without altering the natural topography. Focuses heavily on passive ventilation.',
    status: 'Active',
    phase: 'Material Procurement',
    location: 'Munnar, Kerala',
    materials: ['Bamboo', 'Laterite Stone', 'Eucalyptus poles'],
    squareFootage: 18000,
    budget: 45000000,
    revenue: 52000000,
    dateAdded: '2026-06-20',
    timeAgo: 'Yesterday',
    updateStage: 'On Production',
    productionUpdate: 'Material selection and confirmation updates',
    productionPayment: { requiredAmount: 500000, paidAmount: 250000, status: 'Partially Paid' }
  },
  {
    id: 'proj-3',
    name: 'Wayanad Retreat Concept',
    description: 'A minimalist forest sanctuary built using sustainable luxury practices. Uses rammed-earth walls and a cantilevered structural design.',
    status: 'Drafting',
    phase: 'Concept Design',
    location: 'Wayanad, Kerala',
    materials: ['Rammed Earth', 'Recycled Cedar', 'Clay Plaster'],
    squareFootage: 3200,
    budget: 8500000,
    revenue: 9800000,
    dateAdded: '2026-06-18',
    timeAgo: '3 days ago',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoEzCiHcr6T33oXRhg8yVzKOK8Qhit3-xzNVGnp5tm2VA4VRsELyrvFB6F8Ltn_GgudlW2OfOT_dIirGVQo7GGubIINhkDgfhsbfKUoRvwVHltvntzwqPBLCxYfi8xabh8Hyf8X8tT2y5r7CuUXBUEtvXvdAN1xX0Hj2zAkionQCSkK3uTkf_Ln3BbGRO3fLeMe2Dbrraav6ORE3DWUO235dzpe7FiyhbTAI3yUXIkU7H1P9X3KVPDxKDQ7y7gfYwpS3mx_uhMM3s',
    updateStage: 'On Site',
    siteUpdate: 'Site works update',
    sitePayment: { requiredAmount: 800000, paidAmount: 0, status: 'Pending' }
  },
  {
    id: 'proj-4',
    name: 'Villa Nova Phase 2',
    description: 'Contemporary multi-family villa incorporating rain-water harvesting and solar roofing.',
    status: 'Completed',
    phase: 'Foundation poured',
    location: 'Trivandrum, Kerala',
    materials: ['Rammed Earth', 'Concrete', 'Teak Wood'],
    squareFootage: 5200,
    budget: 14000000,
    revenue: 16500000,
    dateAdded: '2026-05-10',
    timeAgo: 'Today'
  },
  {
    id: 'proj-5',
    name: 'Echo Highrise',
    description: 'An energy-efficient modern residential tower with integrated vertical forest systems and modular facade structural design.',
    status: 'Active',
    phase: 'Permits Approved',
    location: 'Ernakulam, Kerala',
    materials: ['Low-carbon Concrete', 'Recycled Aluminum', 'Double-glazed Glass'],
    squareFootage: 75000,
    budget: 180000000,
    revenue: 210000000,
    dateAdded: '2026-04-15',
    timeAgo: '2 days ago'
  },
  {
    id: 'proj-6',
    name: 'Lakeside Pavilion',
    description: 'A public event space showcasing traditional Kerala roofing methods with a modern, sweeping bamboo structural design.',
    status: 'Drafting',
    phase: 'Drafting Complete',
    location: 'Alappuzha, Kerala',
    materials: ['Structural Bamboo', 'Thatch', 'Polished Granite'],
    squareFootage: 1500,
    budget: 3500000,
    revenue: 4200000,
    dateAdded: '2026-06-22',
    timeAgo: '5 days ago'
  },
  {
    id: 'proj-7',
    name: 'Studio Revamp',
    description: 'Interior renovation of Studio Ekoh headquarters using circular economy design guidelines, with entirely biodegradable or reusable fittings.',
    status: 'Completed',
    phase: 'Client review',
    location: 'Kochi, Kerala',
    materials: ['Exposed Brick', 'Teak Wood', 'Clay Tiles'],
    squareFootage: 2100,
    budget: 4000000,
    revenue: 4800000,
    dateAdded: '2026-03-01',
    timeAgo: '1 week ago'
  },
  {
    id: 'proj-8',
    name: 'Varkala Cliffside Villas',
    description: 'Luxury residential pods overlooking the sea, utilizing passive solar heating and local red sand brick.',
    status: 'Active',
    phase: 'Schematic Design',
    location: 'Varkala, Kerala',
    materials: ['Cliff Red Brick', 'Reclaimed Teak'],
    squareFootage: 6200,
    budget: 19000000,
    revenue: 23000000,
    dateAdded: '2026-06-05',
    timeAgo: '3 weeks ago'
  },
  {
    id: 'proj-9',
    name: 'Kumarakom Serenity Spa',
    description: 'An elegant spa complex floating on the backwaters, showcasing Kerala carpentry craft and wood joinery.',
    status: 'Active',
    phase: 'Detailed Design',
    location: 'Kumarakom, Kerala',
    materials: ['Anjili Wood', 'Brass Fittings', 'Clay plaster'],
    squareFootage: 8000,
    budget: 25000000,
    revenue: 30000000,
    dateAdded: '2026-05-20',
    timeAgo: '1 month ago'
  },
  {
    id: 'proj-10',
    name: 'Calicut Library Hub',
    description: 'A civic landmark using passive cooling breeze-ways and extensive natural skylights.',
    status: 'Active',
    phase: 'Construction Tender',
    location: 'Calicut, Kerala',
    materials: ['Exposed Concrete', 'Terracotta Louvers', 'Glass'],
    squareFootage: 34000,
    budget: 95000000,
    revenue: 110000000,
    dateAdded: '2026-04-10',
    timeAgo: '2 months ago'
  },
  {
    id: 'proj-11',
    name: 'Palakkad Agricultural Centre',
    description: 'A sustainable greenhouse and research hub using local limestone structure and solar cooling grids.',
    status: 'Active',
    phase: 'Pre-construction',
    location: 'Palakkad, Kerala',
    materials: ['Limestone Blocks', 'Recycled Steel', 'Polycarbonate Panels'],
    squareFootage: 15000,
    budget: 15000000,
    revenue: 18000000,
    dateAdded: '2026-05-02',
    timeAgo: '2 months ago'
  },
  {
    id: 'proj-12',
    name: 'Athirappilly Eco-Lodge',
    description: 'A treetop retreat situated near the forest canopy, maximizing ventilation and panoramic views.',
    status: 'Active',
    phase: 'Concept Design',
    location: 'Athirappilly, Kerala',
    materials: ['Bamboo Boards', 'Locally Sourced Basalt'],
    squareFootage: 3800,
    budget: 11000000,
    revenue: 13500000,
    dateAdded: '2026-06-12',
    timeAgo: '2 weeks ago'
  }
];

export const INITIAL_UPDATES: StudioUpdate[] = [
  {
    id: 'upd-1',
    title: 'Kochi Villa Phase 2',
    subtitle: 'Structural blueprints approved by lead architect. Awaiting final client sign-off.',
    timeAgo: '2 hours ago',
    type: 'architecture'
  },
  {
    id: 'upd-2',
    title: 'Material Procurement',
    subtitle: 'Laterite stone delivery confirmed for Munnar Eco-Resort site.',
    timeAgo: 'Yesterday',
    type: 'inventory_2'
  },
  {
    id: 'upd-3',
    title: 'Invoice Sent',
    subtitle: 'Milestone 3 invoice generated for Trivandrum Commercial Complex.',
    timeAgo: 'Oct 24',
    type: 'payments'
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Aravind Menon',
    role: 'Principal Architect',
    specialty: 'Vernacular Ecologies & Kerala Wood Craft',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    activeProjectsCount: 5,
    team: 'Management',
    performance: 96,
    sustainabilityScore: 98,
    activeSitesCount: 5,
    onLeave: false,
    tasks: [
      { id: 't1-1', title: 'Carving quality inspection for Kochi Phase 2 Courtyard pillars', completed: true, time: '09:30 AM', category: 'Site Visit', deadline: 'Today 12:00 PM' },
      { id: 't1-2', title: 'Verify basalt load-bearing dry-stack alignment calculations', completed: true, time: '11:00 AM', category: 'Structural', deadline: 'Today 04:00 PM' },
      { id: 't1-3', title: 'Client presentation for Wayanad rammed-earth structural concept', completed: false, time: '03:30 PM', category: 'Client Review', deadline: 'Tomorrow 10:00 AM' },
      { id: 't1-4', title: 'Review local Kerala tile manufacturer certificates', completed: false, time: '05:00 PM', category: 'Material Sourcing', deadline: 'Tomorrow 03:00 PM' }
    ]
  },
  {
    id: 'team-2',
    name: 'Sneha Joseph',
    role: 'Lead Sustainable Planner',
    specialty: 'Passive Ventilation & Rammed-Earth Geometries',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
    activeProjectsCount: 4,
    team: '3D Team',
    performance: 92,
    sustainabilityScore: 95,
    activeSitesCount: 4,
    onLeave: false,
    tasks: [
      { id: 't2-1', title: 'Soil cohesion test analysis on Wayanad site samples', completed: true, time: '10:15 AM', category: 'Structural', deadline: 'Today 01:00 PM' },
      { id: 't2-2', title: 'Formulate low-carbon mud plaster specifications', completed: true, time: '01:30 PM', category: 'Design Drafting', deadline: 'Today 06:00 PM' },
      { id: 't2-3', title: 'Site visit to Varkala Cliffside to assess passive wind lanes', completed: false, time: '04:00 PM', category: 'Site Visit', deadline: 'Tomorrow 12:00 PM' }
    ]
  },
  {
    id: 'team-3',
    name: 'Rohan Nair',
    role: 'Structural Engineer',
    specialty: 'Low-Carbon Formwork & Sustainable Foundations',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
    activeProjectsCount: 6,
    team: '2D Team',
    performance: 88,
    sustainabilityScore: 92,
    activeSitesCount: 6,
    onLeave: false,
    tasks: [
      { id: 't3-1', title: 'Review structural bamboo cure bath logs at Munnar Eco-Resort', completed: true, time: '08:45 AM', category: 'Material Sourcing', deadline: 'Today 11:30 AM' },
      { id: 't3-2', title: 'Calculate post-tensioning stress tolerances for Kochi terrace garden', completed: false, time: '02:00 PM', category: 'Structural', deadline: 'Today 05:00 PM' },
      { id: 't3-3', title: 'Approve foundation pour certificate for Villa Nova Phase 2', completed: false, time: '03:45 PM', category: 'Structural', deadline: 'Tomorrow 02:00 PM' },
      { id: 't3-4', title: 'Consult on Alappuzha sweeping roof joint tension models', completed: false, time: '05:30 PM', category: 'Design Drafting', deadline: 'Tomorrow 06:00 PM' }
    ]
  }
];

export const PIPELINE_CHARTS_DATA = [
  { quarter: 'Q1', Active: 8, Completed: 3 },
  { quarter: 'Q2', Active: 10, Completed: 4 },
  { quarter: 'Q3', Active: 12, Completed: 2 },
  { quarter: 'Q4', Active: 9, Completed: 5 }
];

export const FINANCIAL_CHARTS_DATA = [
  { month: 'Jan', Revenue: 400000, Expense: 280000 },
  { month: 'Feb', Revenue: 650000, Expense: 420000 },
  { month: 'Mar', Revenue: 1200000, Expense: 750000 },
  { month: 'Apr', Revenue: 550000, Expense: 380000 },
  { month: 'May', Revenue: 950000, Expense: 580000 },
  { month: 'Jun', Revenue: 1400000, Expense: 890000 }
];

export const MOCK_DIAGNOSTIC_REPORTS: Record<string, DiagnosticResult> = {
  'kochi-villa': {
    id: 'diag-1',
    projectName: 'Kochi Villa Phase 2 Blueprint Analysis',
    ecoScore: 92,
    structuralRisk: 'Low',
    carbonFootprint: '0.86 tonnes CO2/sqm',
    recommendations: [
      'Increase native courtyard plantation to optimize passive air purification.',
      'Optimize the thickness of the laterite stone load-bearing wall to 300mm to reduce mortar dependency.',
      'Incorporate a smart rainwater harvesting reservoir utilizing the sloping terracotta tile gutters.'
    ],
    materialsAnalysis: [
      { material: 'Laterite Stone', sustainability: 'Excellent', score: 98 },
      { material: 'Reclaimed Teak Wood', sustainability: 'Excellent', score: 95 },
      { material: 'Traditional Lime Plaster', sustainability: 'Good', score: 88 },
      { material: 'Portland Cement (Core)', sustainability: 'Moderate', score: 55 }
    ]
  },
  'generic-villa': {
    id: 'diag-gen',
    projectName: 'Uploaded Blueprint Assessment',
    ecoScore: 84,
    structuralRisk: 'Medium',
    carbonFootprint: '1.24 tonnes CO2/sqm',
    recommendations: [
      'Substitute standard cement blockwork with rammed-earth blocks or locally-quarried laterite stone.',
      'Add deep horizontal overhangs (chajjas) on South-Facing elevations to minimize solar heat gain.',
      'Incorporate fly-ash or slag replacements in the concrete foundation to reduce embedded carbon.'
    ],
    materialsAnalysis: [
      { material: 'Standard Concrete Blocks', sustainability: 'Poor', score: 35 },
      { material: 'Local Timber', sustainability: 'Excellent', score: 90 },
      { material: 'Terracotta Tiles', sustainability: 'Excellent', score: 95 },
      { material: 'Steel Rebar', sustainability: 'Moderate', score: 60 }
    ]
  }
};
