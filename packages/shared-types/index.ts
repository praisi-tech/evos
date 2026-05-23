// Shared TypeScript types for EvOS

// Enums
export type OrgType = 'KAMPUS' | 'EO_PROFESIONAL' | 'KORPORAT' | 'LAINNYA';
export type SubscriptionTier = 'FREE' | 'PRO' | 'BUSINESS' | 'ENTERPRISE';
export type OrgRole = 'SUPER_ADMIN' | 'MEMBER';
export type EventType = 'CONCERT' | 'CONFERENCE' | 'CAMPUS' | 'CORPORATE' | 'FESTIVAL' | 'SEMINAR' | 'OTHER';
export type AttendeeRange = 'UNDER_100' | '100_500' | '500_1000' | '1000_5000' | 'OVER_5000';
export type VenueType = 'INDOOR' | 'OUTDOOR' | 'HYBRID';
export type TicketFormat = 'FREE' | 'PAID' | 'INVITATION';
export type BudgetSource = 'SPONSORSHIP' | 'TICKET_SALES' | 'INTERNAL_CASH' | 'GRANT' | 'OTHER';
export type EventPhase = 'STRATEGIC' | 'PLANNING' | 'OPERATIONAL' | 'EXECUTION' | 'POST_EVENT';
export type EventStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
export type EventRole = 'EVENT_MANAGER' | 'DIVISION_HEAD' | 'CORE_MEMBER';
export type TaskStatus = 'BACKLOG' | 'BLOCKED' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type VendorCategory = 'SOUND' | 'VENUE' | 'CATERING' | 'DEKOR' | 'TRANSPORT' | 'LAINNYA';
export type SponsorStage = 'PROSPECT' | 'CONTACTED' | 'PROPOSAL_SENT' | 'NEGOTIATION' | 'SIGNED' | 'REJECTED';
export type ChatRoomType = 'ANNOUNCEMENT' | 'GENERAL' | 'DIVISION' | 'CROSS_DIVISION' | 'DIRECT' | 'MEETING' | 'EMERGENCY';
export type Language = 'ID' | 'EN';
export type Theme = 'LIGHT' | 'DARK' | 'SYSTEM';

// Domain Interfaces
export interface Organization {
  id: string;
  name: string;
  slug: string;
  type: OrgType;
  logo_url?: string;
  email: string;
  whatsapp: string;
  city: string;
  website?: string;
  description?: string;
  tier: SubscriptionTier;
  sop_file_url?: string;
  credibility_score: number;
  settings_jsonb: Record<string, any>;
  is_global_benchmark_opted_in: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  whatsapp?: string;
  bio?: string;
  timezone: string;
  language: Language;
  theme: Theme;
  is_email_verified: boolean;
  totp_secret?: string;
  performance_history_jsonb: Record<string, any>;
  last_active_at: string;
  created_at: string;
  updated_at: string;
}

export interface OrgMember {
  org_id: string;
  user_id: string;
  role: OrgRole;
  status: string;
  joined_at: string;
  deleted_at?: string;
}

export interface Event {
  id: string;
  org_id: string;
  name: string;
  type: EventType;
  event_date: string;
  estimated_attendees: AttendeeRange;
  venue_type: VenueType;
  city?: string;
  venue_name?: string;
  ticket_format: TicketFormat;
  budget_estimate?: number;
  budget_source?: BudgetSource;
  target_sponsorship?: number;
  current_phase: EventPhase;
  health_score: number;
  status: EventStatus;
  war_room_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Division {
  id: string;
  event_id: string;
  name: string;
  recommended_member_count: number;
  is_active: boolean;
  is_ai_generated: boolean;
  dependency_graph_jsonb?: Record<string, any>;
  created_at: string;
}

export interface EventMember {
  event_id: string;
  user_id: string;
  role: EventRole;
  division_id?: string;
  is_active: boolean;
  war_room_status?: string;
  joined_at: string;
}

export interface Task {
  id: string;
  division_id: string;
  event_id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  assignee_id?: string;
  deadline?: string;
  progress: number;
  is_ai_generated: boolean;
  ai_insight?: string;
  smart_reminder_sent_at: Record<string, any>;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface TaskDependency {
  task_id: string;
  depends_on_task_id: string;
  created_by?: string;
  created_at: string;
}

export interface Subtask {
  id: string;
  task_id: string;
  title: string;
  is_done: boolean;
  created_at: string;
}

export interface KPI {
  id: string;
  division_id: string;
  event_id: string;
  name: string;
  target_value: number;
  current_value: number;
  unit: string;
  deadline?: string;
  is_ai_generated: boolean;
  phase_weight_jsonb: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Milestone {
  id: string;
  event_id: string;
  title: string;
  phase: EventPhase;
  due_date: string;
  actual_date?: string;
  status: string;
  is_ai_generated: boolean;
  created_at: string;
}

export interface Risk {
  id: string;
  event_id: string;
  division_id?: string;
  level: RiskLevel;
  title: string;
  description?: string;
  source: string;
  status: string;
  recovery_plan?: Record<string, any>;
  chosen_plan_index?: number;
  detected_at: string;
  resolved_at?: string;
}

export interface EscalationLog {
  id: string;
  risk_id: string;
  level: RiskLevel;
  notified_user_id: string;
  channel: string;
  message: string;
  sent_at: string;
  acknowledged_at?: string;
}

export interface Vendor {
  id: string;
  org_id: string;
  name: string;
  category: VendorCategory;
  pic_name?: string;
  pic_contact?: string;
  reliability_score: number;
  sla_tracking_jsonb?: Record<string, any>;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface EventVendor {
  id: string;
  event_id: string;
  vendor_id: string;
  status: string;
  contract_value?: number;
  sla_deadline?: string;
  payment_status: string;
  dp_paid_at?: string;
  final_paid_at?: string;
  post_event_rating?: number;
  sla_fulfilled_pct?: number;
  created_at: string;
}

export interface Sponsor {
  id: string;
  org_id: string;
  event_id?: string;
  brand_name: string;
  pic_name?: string;
  pic_contact?: string;
  category?: string;
  estimated_value?: number;
  agreed_value?: number;
  stage: SponsorStage;
  history_jsonb?: Record<string, any>;
  contract_url?: string;
  last_contact_at?: string;
  renewal_priority?: number;
  created_at: string;
  updated_at: string;
}

export interface SponsorInteraction {
  id: string;
  sponsor_id: string;
  type: string;
  note?: string;
  actor_id?: string;
  interacted_at: string;
}

export interface Meeting {
  id: string;
  event_id: string;
  division_id?: string;
  title: string;
  scheduled_at: string;
  duration_minutes?: number;
  external_link?: string;
  host_id?: string;
  status: string;
  transcript_url?: string;
  created_at: string;
}

export interface MeetingSummary {
  id: string;
  meeting_id: string;
  summary_points: Array<{ point: string }>;
  decisions: Array<{ decision: string }>;
  unanswered_questions?: any;
  generated_at: string;
  is_edited: boolean;
}

export interface ActionItem {
  id: string;
  meeting_id: string;
  title: string;
  assignee_id?: string;
  deadline?: string;
  is_pushed_to_task: boolean;
  task_id?: string;
  created_at: string;
}

export interface ChatRoom {
  id: string;
  event_id: string;
  division_id?: string;
  type: ChatRoomType;
  name: string;
  created_by?: string;
  created_at: string;
}

export interface Message {
  id: string;
  room_id: string;
  sender_id?: string;
  content: string;
  type: string;
  file_url?: string;
  is_pinned: boolean;
  sent_at: string;
}

export interface Incident {
  id: string;
  event_id: string;
  type: string;
  severity: RiskLevel;
  description: string;
  location?: string;
  reporter_id?: string;
  assigned_to_id?: string;
  status: string;
  log_jsonb: Array<any>;
  reported_at: string;
  resolved_at?: string;
}

export interface OrgMemory {
  id: string;
  org_id: string;
  pm_preferences_jsonb?: Record<string, any>;
  division_patterns_jsonb?: Record<string, any>;
  event_memories_jsonb?: Record<string, any>;
  vendor_patterns?: Record<string, any>;
  sponsor_patterns?: Record<string, any>;
  timeline_calibration?: Record<string, any>;
  kpi_benchmarks?: Record<string, any>;
  global_benchmark_cache?: Record<string, any>;
  ai_recommendation_accuracy: number;
  last_updated_at: string;
}

export interface FileEntry {
  id: string;
  org_id?: string;
  event_id?: string;
  division_id?: string;
  task_id?: string;
  uploader_id?: string;
  file_name: string;
  file_url: string;
  file_size_bytes: number;
  mime_type: string;
  version: number;
  parent_file_id?: string;
  created_at: string;
}

export interface PostEventReport {
  id: string;
  event_id: string;
  final_health_score: number;
  executive_summary?: string;
  division_performance: Record<string, any>;
  incident_timeline?: any;
  sponsor_debrief?: any;
  vendor_debrief?: any;
  ai_learning_insights?: any;
  next_event_recommendations?: any;
  generated_at: string;
  approved_by?: string;
  approved_at?: string;
}

export interface NotificationLog {
  id: string;
  user_id: string;
  type: string;
  channel: string;
  title: string;
  body: string;
  metadata?: Record<string, any>;
  is_read: boolean;
  sent_at: string;
  read_at?: string;
}
