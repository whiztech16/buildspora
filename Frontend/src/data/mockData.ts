import { 
  CheckSquare, FileSearch, Building2, Hammer, Home, Zap, 
  FileText, Network, Landmark, Grid, Brush, Flag,
  ClipboardList, Layers, Paintbrush, Sparkles
} from "lucide-react";

// ── Project type ──────────────────────────────────────────────────────────────

export type ProjectType = "new" | "renovation";

export const PROJECT_STORAGE_KEY = "buildspora_project_type";

export function getProjectType(): ProjectType {
  return (localStorage.getItem(PROJECT_STORAGE_KEY) as ProjectType) ?? "new";
}

// ── Shared types ─────────────────────────────────────────────────────────────

export type MilestoneStatus = "Pending" | "In Review" | "Completed" | "Approved";

export interface OverviewMilestone {
  id: string;
  name: string;
  amount: string;
  status: MilestoneStatus;
  icon: React.ElementType;
}

export interface DetailMilestone {
  name: string;
  amount: string;
  status: MilestoneStatus;
  icon: React.ElementType;
}

export interface DetailStep {
  name: string;
  completed?: boolean;
  current?: boolean;
}

export interface ContractorMilestone {
  id: number;
  title: string;
  amount: string;
  status: "completed" | "in_review" | "pending";
}

// ── Other data ────────────────────────────────────────────────────────────────

export const CATEGORIES = [
  "All Categories", "Electrical", "Plumbing", "Painting", "Tiling", "Roofing", "POP Ceiling", "Carpentry"
];

export const TALENTS = [
  { id: 1, name: "Emeka Okafor", role: "Master Electrician", location: "Lagos, Nigeria", projects: 15, initials: "EO", bgColor: "bg-[#047857]", textColor: "text-white" },
  { id: 2, name: "Adebayo Yusuf", role: "Professional Plumber", location: "Abuja, Nigeria", projects: 12, initials: "AY", img: "https://images.unsplash.com/photo-1506803682981-6e718a9dd3ee?w=150&h=150&fit=crop" },
  { id: 3, name: "Ibrahim Bello", role: "Roofing Specialist", location: "Kano, Nigeria", projects: 9, initials: "IB", img: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=150&h=150&fit=crop" },
  { id: 4, name: "Chinedu Martin", role: "Painter", location: "Port Harcourt, Nigeria", projects: 11, initials: "CM", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop" },
  { id: 5, name: "Tunde Oladimeji", role: "Tiling Expert", location: "Lagos, Nigeria", projects: 14, initials: "TO", img: "https://images.unsplash.com/photo-1530268729831-4b0b9e170218?w=150&h=150&fit=crop" },
  { id: 6, name: "Friday Johnson", role: "POP Ceiling Expert", location: "Lagos, Nigeria", projects: 10, initials: "FJ", img: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=150&h=150&fit=crop" },
  { id: 7, name: "Samuel Udo", role: "Carpenter", location: "Abuja, Nigeria", projects: 8, initials: "SU", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" },
  { id: 8, name: "Bashir Lawal", role: "Welder / Fabricator", location: "Kaduna, Nigeria", projects: 13, initials: "BL", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop" }
];

export const PROJECT_DATA = {
  location: "Victoria Island",
  type: "Duplex",
  progress: 0
};

// ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──
//  NEW BUILD  — milestone data
// ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──

export const OVERVIEW_EMPTY_MILESTONES: OverviewMilestone[] = [
  { id: "land-secured",  name: "Land Secured",    amount: "₦ —", status: "Pending", icon: CheckSquare },
  { id: "site-prep",     name: "Site Preparation", amount: "₦ —", status: "Pending", icon: FileSearch },
  { id: "foundation",    name: "Foundation",       amount: "₦ —", status: "Pending", icon: Building2 },
  { id: "block-work",    name: "Block Work",       amount: "₦ —", status: "Pending", icon: Hammer },
  { id: "roofing",       name: "Roofing",          amount: "₦ —", status: "Pending", icon: Home },
  { id: "electrical",    name: "Electrical",       amount: "₦ —", status: "Pending", icon: Zap },
];

export const OVERVIEW_POPULATED_MILESTONES: OverviewMilestone[] = [
  { id: "land-secured",  name: "Land Secured",    amount: "₦1,000,000", status: "Approved",   icon: CheckSquare },
  { id: "site-prep",     name: "Site Preparation", amount: "₦500,000",  status: "Approved",   icon: FileSearch },
  { id: "foundation",    name: "Foundation",       amount: "₦1,500,000", status: "Approved",  icon: Building2 },
  { id: "block-work",    name: "Block Work",       amount: "₦2,000,000", status: "In Review", icon: Hammer },
  { id: "roofing",       name: "Roofing",          amount: "₦1,800,000", status: "Pending",   icon: Home },
  { id: "electrical",    name: "Electrical",       amount: "₦800,000",  status: "Pending",    icon: Zap },
];

export const DETAIL_EMPTY_MILESTONES: DetailMilestone[] = [
  { name: "Land Secured",    amount: "₦ —", status: "Pending", icon: FileText },
  { name: "Site Preparation", amount: "₦ —", status: "Pending", icon: Network },
  { name: "Foundation",      amount: "₦ —", status: "Pending", icon: Landmark },
  { name: "Block Work",      amount: "₦ —", status: "Pending", icon: Grid },
  { name: "Roofing",         amount: "₦ —", status: "Pending", icon: Home },
  { name: "Electrical",      amount: "₦ —", status: "Pending", icon: Zap },
  { name: "Finishing",       amount: "₦ —", status: "Pending", icon: Brush },
  { name: "Completed",       amount: "₦ —", status: "Pending", icon: Flag },
];

export const DETAIL_POPULATED_MILESTONES: DetailMilestone[] = [
  { name: "Land Secured",    amount: "₦500,000",   status: "Completed", icon: FileText },
  { name: "Site Preparation", amount: "₦800,000",  status: "Completed", icon: Network },
  { name: "Foundation",      amount: "₦1,500,000", status: "In Review", icon: Landmark },
  { name: "Block Work",      amount: "₦2,000,000", status: "Pending",   icon: Grid },
  { name: "Roofing",         amount: "₦1,800,000", status: "Pending",   icon: Home },
  { name: "Electrical",      amount: "₦900,000",   status: "Pending",   icon: Zap },
  { name: "Finishing",       amount: "₦2,200,000", status: "Pending",   icon: Brush },
  { name: "Completed",       amount: "₦300,000",   status: "Pending",   icon: Flag },
];

export const DETAIL_STEPS: DetailStep[] = [
  { name: "Land Secured",    completed: true },
  { name: "Site Preparation", completed: true },
  { name: "Foundation",      current: true },
  { name: "Block Work",      completed: false },
  { name: "Roofing",         completed: false },
  { name: "Electrical",      completed: false },
  { name: "Finishing",       completed: false },
  { name: "Completed",       completed: false },
];

// ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──
//  RENOVATION  — milestone data
// ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──

export const RENOVATION_OVERVIEW_EMPTY_MILESTONES: OverviewMilestone[] = [
  { id: "assessment",        name: "Assessment",        amount: "₦ —", status: "Pending", icon: ClipboardList },
  { id: "demolition",        name: "Demolition",        amount: "₦ —", status: "Pending", icon: Hammer },
  { id: "structural-work",   name: "Structural Work",   amount: "₦ —", status: "Pending", icon: Building2 },
  { id: "plumbing-electrical",name:"Plumbing/Electrical",amount: "₦ —", status: "Pending", icon: Zap },
  { id: "plastering-tiling", name: "Plastering/Tiling", amount: "₦ —", status: "Pending", icon: Layers },
  { id: "painting",          name: "Painting",          amount: "₦ —", status: "Pending", icon: Paintbrush },
];

export const RENOVATION_OVERVIEW_POPULATED_MILESTONES: OverviewMilestone[] = [
  { id: "assessment",        name: "Assessment",        amount: "₦400,000",   status: "Approved",   icon: ClipboardList },
  { id: "demolition",        name: "Demolition",        amount: "₦600,000",   status: "Approved",   icon: Hammer },
  { id: "structural-work",   name: "Structural Work",   amount: "₦1,200,000", status: "Approved",   icon: Building2 },
  { id: "plumbing-electrical",name:"Plumbing/Electrical",amount: "₦900,000",  status: "In Review",  icon: Zap },
  { id: "plastering-tiling", name: "Plastering/Tiling", amount: "₦800,000",   status: "Pending",    icon: Layers },
  { id: "painting",          name: "Painting",          amount: "₦500,000",   status: "Pending",    icon: Paintbrush },
];

export const RENOVATION_DETAIL_EMPTY_MILESTONES: DetailMilestone[] = [
  { name: "Assessment",        amount: "₦ —", status: "Pending", icon: ClipboardList },
  { name: "Demolition",        amount: "₦ —", status: "Pending", icon: Hammer },
  { name: "Structural Work",   amount: "₦ —", status: "Pending", icon: Building2 },
  { name: "Plumbing/Electrical", amount: "₦ —", status: "Pending", icon: Zap },
  { name: "Plastering/Tiling", amount: "₦ —", status: "Pending", icon: Layers },
  { name: "Painting",          amount: "₦ —", status: "Pending", icon: Paintbrush },
  { name: "Finishing",         amount: "₦ —", status: "Pending", icon: Sparkles },
  { name: "Completed",         amount: "₦ —", status: "Pending", icon: Flag },
];

export const RENOVATION_DETAIL_POPULATED_MILESTONES: DetailMilestone[] = [
  { name: "Assessment",        amount: "₦400,000",   status: "Completed", icon: ClipboardList },
  { name: "Demolition",        amount: "₦600,000",   status: "Completed", icon: Hammer },
  { name: "Structural Work",   amount: "₦1,200,000", status: "In Review", icon: Building2 },
  { name: "Plumbing/Electrical", amount: "₦900,000", status: "Pending",   icon: Zap },
  { name: "Plastering/Tiling", amount: "₦800,000",   status: "Pending",   icon: Layers },
  { name: "Painting",          amount: "₦500,000",   status: "Pending",   icon: Paintbrush },
  { name: "Finishing",         amount: "₦350,000",   status: "Pending",   icon: Sparkles },
  { name: "Completed",         amount: "₦200,000",   status: "Pending",   icon: Flag },
];

export const RENOVATION_DETAIL_STEPS: DetailStep[] = [
  { name: "Assessment",        completed: true },
  { name: "Demolition",        completed: true },
  { name: "Structural Work",   current: true },
  { name: "Plumbing/Electrical", completed: false },
  { name: "Plastering/Tiling", completed: false },
  { name: "Painting",          completed: false },
  { name: "Finishing",         completed: false },
  { name: "Completed",         completed: false },
];

// ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──
//  Helper functions — pick the right data based on project type
//  Both client AND contractor call these so they always see the same records.
// ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──

export function getOverviewMilestones(
  projectType: ProjectType,
  hasContractor: boolean
): OverviewMilestone[] {
  if (projectType === "renovation") {
    return hasContractor
      ? RENOVATION_OVERVIEW_POPULATED_MILESTONES
      : RENOVATION_OVERVIEW_EMPTY_MILESTONES;
  }
  return hasContractor ? OVERVIEW_POPULATED_MILESTONES : OVERVIEW_EMPTY_MILESTONES;
}

export function getDetailMilestones(
  projectType: ProjectType,
  hasContractor: boolean
): DetailMilestone[] {
  if (projectType === "renovation") {
    return hasContractor
      ? RENOVATION_DETAIL_POPULATED_MILESTONES
      : RENOVATION_DETAIL_EMPTY_MILESTONES;
  }
  return hasContractor ? DETAIL_POPULATED_MILESTONES : DETAIL_EMPTY_MILESTONES;
}

export function getDetailSteps(projectType: ProjectType): DetailStep[] {
  return projectType === "renovation" ? RENOVATION_DETAIL_STEPS : DETAIL_STEPS;
}

/** Returns milestones shaped for ContractorMilestones — same data the client sees. */
export function getContractorMilestones(projectType: ProjectType): ContractorMilestone[] {
  const source =
    projectType === "renovation"
      ? RENOVATION_DETAIL_POPULATED_MILESTONES
      : DETAIL_POPULATED_MILESTONES;

  return source.map((m, idx) => ({
    id: idx + 1,
    title: m.name,
    amount: m.amount,
    status:
      m.status === "Completed"
        ? "completed"
        : m.status === "In Review"
        ? "in_review"
        : "pending",
  }));
}
