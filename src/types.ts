export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  phase: string;
  location: string;
  materials: string[];
  squareFootage: number;
  budget: number;
  revenue: number;
  dateAdded: string;
  image?: string;
  timeAgo?: string;
  
  // Custom Studio stages & payments updates (Only one active at a time)
  updateStage?: 'On Office' | 'On Production' | 'On Site';
  officeUpdate?: '3D Update' | '2D Update' | 'None';
  productionUpdate?: 'Furniture and art production' | 'Material selection and confirmation updates' | 'None';
  siteUpdate?: 'Site works update' | 'None';
  
  officePayment?: { requiredAmount: number; paidAmount: number; status: 'Pending' | 'Partially Paid' | 'Fully Paid' };
  productionPayment?: { requiredAmount: number; paidAmount: number; status: 'Pending' | 'Partially Paid' | 'Fully Paid' };
  sitePayment?: { requiredAmount: number; paidAmount: number; status: 'Pending' | 'Partially Paid' | 'Fully Paid' };
}

export interface StudioUpdate {
  id: string;
  title: string;
  subtitle: string;
  timeAgo: string;
  type: 'architecture' | 'inventory_2' | 'payments' | 'foundation';
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  time: string; // Time created or modified
  category: string;
  deadline?: string; // Due date/time
  imageProof?: string; // Simulated file update image URL
  imageProofTime?: string; // Timestamp when image was uploaded
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  specialty: string;
  avatar: string;
  activeProjectsCount: number;
  team: '3D Team' | '2D Team' | 'Management';
  tasks: Task[];
  performance: number;
  sustainabilityScore: number;
  activeSitesCount: number;
  capacity?: number;
  onLeave?: boolean;
  leaveReason?: string;
  attendanceStatus?: 'Present' | 'On-Site' | 'On Leave';
  checkInTime?: string;
  siteLocation?: string;
}

export interface UserSession {
  email: string;
  name: string;
  role: 'Admin' | 'Employee';
  employeeId?: string;
  avatar?: string;
  team?: '3D Team' | '2D Team' | 'Management';
}

export interface DiagnosticResult {
  id: string;
  projectName: string;
  ecoScore: number; // 0-100
  structuralRisk: 'Low' | 'Medium' | 'High';
  carbonFootprint: string; // e.g. "Low (2.4 tonnes/sqm)"
  recommendations: string[];
  materialsAnalysis: {
    material: string;
    sustainability: 'Excellent' | 'Good' | 'Moderate' | 'Poor';
    score: number;
  }[];
}

export interface ActivityLog {
  id: string;
  memberId: string;
  memberName: string;
  role: string;
  time: string;
  text: string;
  severity: 'info' | 'success' | 'warning';
}

export interface Complaint {
  id: string;
  name: string;
  email: string;
  title: string;
  description: string;
  category: string;
  urgency: 'Urgent Work' | 'Solve within 1 Week' | 'Common Complaint';
  status: 'Pending' | 'Completed';
  image?: string; // Base64 data URL
  date: string; // Formatting or ISO
}
