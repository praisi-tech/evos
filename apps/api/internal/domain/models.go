package domain

import (
	"time"
)

// Organization model
type Organization struct {
	ID                       string     `json:"id" db:"id"`
	Name                     string     `json:"name" db:"name"`
	Slug                     string     `json:"slug" db:"slug"`
	Type                     string     `json:"type" db:"type"` // org_type
	LogoURL                  *string    `json:"logo_url" db:"logo_url"`
	Email                    string     `json:"email" db:"email"`
	Whatsapp                 string     `json:"whatsapp" db:"whatsapp"`
	City                     string     `json:"city" db:"city"`
	Website                  *string    `json:"website" db:"website"`
	Description              *string    `json:"description" db:"description"`
	Tier                     string     `json:"tier" db:"tier"` // subscription_tier
	SOPFileURL               *string    `json:"sop_file_url" db:"sop_file_url"`
	CredibilityScore         int16      `json:"credibility_score" db:"credibility_score"`
	SettingsJSONB            string     `json:"settings_jsonb" db:"settings_jsonb"` // JSON representation
	IsGlobalBenchmarkOptedIn bool       `json:"is_global_benchmark_opted_in" db:"is_global_benchmark_opted_in"`
	CreatedAt                time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt                time.Time  `json:"updated_at" db:"updated_at"`
}

// User model
type User struct {
	ID                      string    `json:"id" db:"id"`
	FullName                string    `json:"full_name" db:"full_name"`
	Email                   string    `json:"email" db:"email"`
	PasswordHash            string    `json:"-" db:"password_hash"`
	AvatarURL               *string   `json:"avatar_url" db:"avatar_url"`
	Whatsapp                *string   `json:"whatsapp" db:"whatsapp"`
	Bio                     *string   `json:"bio" db:"bio"`
	Timezone                string    `json:"timezone" db:"timezone"`
	Language                string    `json:"language" db:"language"` // language_enum
	Theme                   string    `json:"theme" db:"theme"`       // theme_enum
	IsEmailVerified         bool      `json:"is_email_verified" db:"is_email_verified"`
	TOTPSecret              *string   `json:"-" db:"totp_secret"`
	PerformanceHistoryJSONB string    `json:"performance_history_jsonb" db:"performance_history_jsonb"`
	LastActiveAt            time.Time `json:"last_active_at" db:"last_active_at"`
	CreatedAt               time.Time `json:"created_at" db:"created_at"`
	UpdatedAt               time.Time `json:"updated_at" db:"updated_at"`
}

// OrgMember model
type OrgMember struct {
	OrgID    string     `json:"org_id" db:"org_id"`
	UserID   string     `json:"user_id" db:"user_id"`
	Role     string     `json:"role" db:"role"` // org_role
	Status   string     `json:"status" db:"status"`
	JoinedAt time.Time  `json:"joined_at" db:"joined_at"`
	DeletedAt *time.Time `json:"deleted_at,omitempty" db:"deleted_at"`
}

// Event model
type Event struct {
	ID                 string     `json:"id" db:"id"`
	OrgID              string     `json:"org_id" db:"org_id"`
	Name               string     `json:"name" db:"name"`
	Type               string     `json:"type" db:"type"` // event_type
	EventDate          time.Time  `json:"event_date" db:"event_date"`
	EstimatedAttendees string     `json:"estimated_attendees" db:"estimated_attendees"` // attendee_range
	VenueType          string     `json:"venue_type" db:"venue_type"`                   // venue_type
	City               *string    `json:"city" db:"city"`
	VenueName          *string    `json:"venue_name" db:"venue_name"`
	TicketFormat       string     `json:"ticket_format" db:"ticket_format"` // ticket_format
	BudgetEstimate     *float64   `json:"budget_estimate" db:"budget_estimate"`
	BudgetSource       *string    `json:"budget_source" db:"budget_source"` // budget_source
	TargetSponsorship  *float64   `json:"target_sponsorship" db:"target_sponsorship"`
	CurrentPhase       string     `json:"current_phase" db:"current_phase"` // event_phase
	HealthScore        int16      `json:"health_score" db:"health_score"`
	Status             string     `json:"status" db:"status"` // event_status
	WarRoomActive      bool       `json:"war_room_active" db:"war_room_active"`
	CreatedBy          string     `json:"created_by" db:"created_by"`
	CreatedAt          time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt          time.Time  `json:"updated_at" db:"updated_at"`
}

// Division model
type Division struct {
	ID                     string  `json:"id" db:"id"`
	EventID                string  `json:"event_id" db:"event_id"`
	Name                   string  `json:"name" db:"name"`
	RecommendedMemberCount int16   `json:"recommended_member_count" db:"recommended_member_count"`
	IsActive               bool    `json:"is_active" db:"is_active"`
	IsAIGenerated          bool    `json:"is_ai_generated" db:"is_ai_generated"`
	DependencyGraphJSONB   *string `json:"dependency_graph_jsonb" db:"dependency_graph_jsonb"`
	CreatedAt              time.Time `json:"created_at" db:"created_at"`
}

// EventMember model
type EventMember struct {
	EventID         string  `json:"event_id" db:"event_id"`
	UserID          string  `json:"user_id" db:"user_id"`
	Role            string  `json:"role" db:"role"` // event_role
	DivisionID      *string `json:"division_id" db:"division_id"`
	IsActive        bool    `json:"is_active" db:"is_active"`
	WarRoomStatus   *string `json:"war_room_status" db:"war_room_status"`
	JoinedAt        time.Time `json:"joined_at" db:"joined_at"`
}

// Task model
type Task struct {
	ID                  string     `json:"id" db:"id"`
	DivisionID          string     `json:"division_id" db:"division_id"`
	EventID             string     `json:"event_id" db:"event_id"`
	Title               string     `json:"title" db:"title"`
	Description         *string    `json:"description" db:"description"`
	Status              string     `json:"status" db:"status"` // task_status
	Priority            string     `json:"priority" db:"priority"`
	AssigneeID          *string    `json:"assignee_id" db:"assignee_id"`
	Deadline            *time.Time `json:"deadline" db:"deadline"`
	Progress            int16      `json:"progress" db:"progress"`
	IsAIGenerated       bool       `json:"is_ai_generated" db:"is_ai_generated"`
	AIInsight           *string    `json:"ai_insight" db:"ai_insight"`
	SmartReminderSentAt string     `json:"smart_reminder_sent_at" db:"smart_reminder_sent_at"`
	CreatedBy           *string    `json:"created_by" db:"created_by"`
	CreatedAt           time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt           time.Time  `json:"updated_at" db:"updated_at"`
}

// TaskDependency model
type TaskDependency struct {
	TaskID          string    `json:"task_id" db:"task_id"`
	DependsOnTaskID string    `json:"depends_on_task_id" db:"depends_on_task_id"`
	CreatedBy       *string   `json:"created_by" db:"created_by"`
	CreatedAt       time.Time `json:"created_at" db:"created_at"`
}

// Subtask model
type Subtask struct {
	ID        string    `json:"id" db:"id"`
	TaskID    string    `json:"task_id" db:"task_id"`
	Title     string    `json:"title" db:"title"`
	IsDone    bool      `json:"is_done" db:"is_done"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

// KPI model
type KPI struct {
	ID               string     `json:"id" db:"id"`
	DivisionID       string     `json:"division_id" db:"division_id"`
	EventID          string     `json:"event_id" db:"event_id"`
	Name             string     `json:"name" db:"name"`
	TargetValue      float64    `json:"target_value" db:"target_value"`
	CurrentValue     float64    `json:"current_value" db:"current_value"`
	Unit             string     `json:"unit" db:"unit"`
	Deadline         *time.Time `json:"deadline" db:"deadline"`
	IsAIGenerated    bool       `json:"is_ai_generated" db:"is_ai_generated"`
	PhaseWeightJSONB string     `json:"phase_weight_jsonb" db:"phase_weight_jsonb"`
	CreatedAt        time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt        time.Time  `json:"updated_at" db:"updated_at"`
}

// Milestone model
type Milestone struct {
	ID            string     `json:"id" db:"id"`
	EventID       string     `json:"event_id" db:"event_id"`
	Title         string     `json:"title" db:"title"`
	Phase         string     `json:"phase" db:"phase"` // event_phase
	DueDate       time.Time  `json:"due_date" db:"due_date"`
	ActualDate    *time.Time `json:"actual_date" db:"actual_date"`
	Status        string     `json:"status" db:"status"`
	IsAIGenerated bool       `json:"is_ai_generated" db:"is_ai_generated"`
	CreatedAt     time.Time  `json:"created_at" db:"created_at"`
}

// Risk model
type Risk struct {
	ID               string     `json:"id" db:"id"`
	EventID          string     `json:"event_id" db:"event_id"`
	DivisionID       *string    `json:"division_id" db:"division_id"`
	Level            string     `json:"level" db:"level"` // risk_level
	Title            string     `json:"title" db:"title"`
	Description      *string    `json:"description" db:"description"`
	Source           string     `json:"source" db:"source"`
	Status           string     `json:"status" db:"status"`
	RecoveryPlan     *string    `json:"recovery_plan" db:"recovery_plan"`
	ChosenPlanIndex  *int16     `json:"chosen_plan_index" db:"chosen_plan_index"`
	DetectedAt       time.Time  `json:"detected_at" db:"detected_at"`
	ResolvedAt       *time.Time `json:"resolved_at" db:"resolved_at"`
}

// Vendor model
type Vendor struct {
	ID               string    `json:"id" db:"id"`
	OrgID            string    `json:"org_id" db:"org_id"`
	Name             string    `json:"name" db:"name"`
	Category         string    `json:"category" db:"category"` // vendor_category
	PICName          *string   `json:"pic_name" db:"pic_name"`
	PICContact       *string   `json:"pic_contact" db:"pic_contact"`
	ReliabilityScore float64   `json:"reliability_score" db:"reliability_score"`
	SLATrackingJSONB *string   `json:"sla_tracking_jsonb" db:"sla_tracking_jsonb"`
	Notes            *string   `json:"notes" db:"notes"`
	CreatedAt        time.Time `json:"created_at" db:"created_at"`
	UpdatedAt        time.Time `json:"updated_at" db:"updated_at"`
}

// Sponsor model
type Sponsor struct {
	ID              string     `json:"id" db:"id"`
	OrgID           string     `json:"org_id" db:"org_id"`
	EventID         *string    `json:"event_id" db:"event_id"`
	BrandName       string     `json:"brand_name" db:"brand_name"`
	PICName         *string    `json:"pic_name" db:"pic_name"`
	PICContact      *string    `json:"pic_contact" db:"pic_contact"`
	Category        *string    `json:"category" db:"category"`
	EstimatedValue  *float64   `json:"estimated_value" db:"estimated_value"`
	AgreedValue     *float64   `json:"agreed_value" db:"agreed_value"`
	Stage           string     `json:"stage" db:"stage"` // sponsor_stage
	HistoryJSONB    *string    `json:"history_jsonb" db:"history_jsonb"`
	ContractURL     *string    `json:"contract_url" db:"contract_url"`
	LastContactAt   *time.Time `json:"last_contact_at" db:"last_contact_at"`
	RenewalPriority *int16     `json:"renewal_priority" db:"renewal_priority"`
	CreatedAt       time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt       time.Time  `json:"updated_at" db:"updated_at"`
}

// ChatRoom model
type ChatRoom struct {
	ID         string    `json:"id" db:"id"`
	EventID    string    `json:"event_id" db:"event_id"`
	DivisionID *string   `json:"division_id" db:"division_id"`
	Type       string    `json:"type" db:"type"` // chat_room_type
	Name       string    `json:"name" db:"name"`
	CreatedBy  *string   `json:"created_by" db:"created_by"`
	CreatedAt  time.Time `json:"created_at" db:"created_at"`
}

// Message model
type Message struct {
	ID       string    `json:"id" db:"id"`
	RoomID   string    `json:"room_id" db:"room_id"`
	SenderID *string   `json:"sender_id" db:"sender_id"`
	Content  string    `json:"content" db:"content"`
	Type     string    `json:"type" db:"type"`
	FileURL  *string   `json:"file_url" db:"file_url"`
	IsPinned bool      `json:"is_pinned" db:"is_pinned"`
	SentAt   time.Time `json:"sent_at" db:"sent_at"`
}

// Incident model (War Room)
type Incident struct {
	ID           string     `json:"id" db:"id"`
	EventID      string     `json:"event_id" db:"event_id"`
	Type         string     `json:"type" db:"type"`
	Severity     string     `json:"severity" db:"severity"` // risk_level
	Description  string     `json:"description" db:"description"`
	Location     *string    `json:"location" db:"location"`
	ReporterID   *string    `json:"reporter_id" db:"reporter_id"`
	AssignedToID *string    `json:"assigned_to_id" db:"assigned_to_id"`
	Status       string     `json:"status" db:"status"`
	LogJSONB     string     `json:"log_jsonb" db:"log_jsonb"`
	ReportedAt   time.Time  `json:"reported_at" db:"reported_at"`
	ResolvedAt   *time.Time `json:"resolved_at" db:"resolved_at"`
}

// PostEventReport model
type PostEventReport struct {
	ID                       string     `json:"id" db:"id"`
	EventID                  string     `json:"event_id" db:"event_id"`
	FinalHealthScore         int16      `json:"final_health_score" db:"final_health_score"`
	ExecutiveSummary         *string    `json:"executive_summary" db:"executive_summary"`
	DivisionPerformance      string     `json:"division_performance" db:"division_performance"`
	IncidentTimeline         *string    `json:"incident_timeline" db:"incident_timeline"`
	SponsorDebrief           *string    `json:"sponsor_debrief" db:"sponsor_debrief"`
	VendorDebrief            *string    `json:"vendor_debrief" db:"vendor_debrief"`
	AILearningInsights       *string    `json:"ai_learning_insights" db:"ai_learning_insights"`
	NextEventRecommendations *string    `json:"next_event_recommendations" db:"next_event_recommendations"`
	GeneratedAt              time.Time  `json:"generated_at" db:"generated_at"`
	ApprovedBy               *string    `json:"approved_by" db:"approved_by"`
	ApprovedAt               *time.Time `json:"approved_at" db:"approved_at"`
}

// NotificationLog model
type NotificationLog struct {
	ID        string     `json:"id" db:"id"`
	UserID    string     `json:"user_id" db:"user_id"`
	Type      string     `json:"type" db:"type"`
	Channel   string     `json:"channel" db:"channel"`
	Title     string     `json:"title" db:"title"`
	Body      string     `json:"body" db:"body"`
	Metadata  *string    `json:"metadata" db:"metadata"`
	IsRead    bool       `json:"is_read" db:"is_read"`
	SentAt    time.Time  `json:"sent_at" db:"sent_at"`
	ReadAt    *time.Time `json:"read_at" db:"read_at"`
}

// Meeting model
type Meeting struct {
	ID              string     `json:"id" db:"id"`
	EventID         string     `json:"event_id" db:"event_id"`
	DivisionID      *string    `json:"division_id" db:"division_id"`
	Title           string     `json:"title" db:"title"`
	ScheduledAt     time.Time  `json:"scheduled_at" db:"scheduled_at"`
	DurationMinutes *int16     `json:"duration_minutes" db:"duration_minutes"`
	ExternalLink    *string    `json:"external_link" db:"external_link"`
	HostID          *string    `json:"host_id" db:"host_id"`
	Status          string     `json:"status" db:"status"`
	TranscriptURL   *string    `json:"transcript_url" db:"transcript_url"`
	CreatedAt       time.Time  `json:"created_at" db:"created_at"`
}

