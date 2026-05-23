-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Create ENUMs
CREATE TYPE org_type AS ENUM ('KAMPUS', 'EO_PROFESIONAL', 'KORPORAT', 'LAINNYA');
CREATE TYPE subscription_tier AS ENUM ('FREE', 'PRO', 'BUSINESS', 'ENTERPRISE');
CREATE TYPE org_role AS ENUM ('SUPER_ADMIN', 'MEMBER');
CREATE TYPE event_type AS ENUM ('CONCERT', 'CONFERENCE', 'CAMPUS', 'CORPORATE', 'FESTIVAL', 'SEMINAR', 'OTHER');
CREATE TYPE attendee_range AS ENUM ('UNDER_100', '100_500', '500_1000', '1000_5000', 'OVER_5000');
CREATE TYPE venue_type AS ENUM ('INDOOR', 'OUTDOOR', 'HYBRID');
CREATE TYPE ticket_format AS ENUM ('FREE', 'PAID', 'INVITATION');
CREATE TYPE budget_source AS ENUM ('SPONSORSHIP', 'TICKET_SALES', 'INTERNAL_CASH', 'GRANT', 'OTHER');
CREATE TYPE event_phase AS ENUM ('STRATEGIC', 'PLANNING', 'OPERATIONAL', 'EXECUTION', 'POST_EVENT');
CREATE TYPE event_status AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'ARCHIVED');
CREATE TYPE event_role AS ENUM ('EVENT_MANAGER', 'DIVISION_HEAD', 'CORE_MEMBER');
CREATE TYPE task_status AS ENUM ('BACKLOG', 'BLOCKED', 'IN_PROGRESS', 'IN_REVIEW', 'DONE');
CREATE TYPE priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
CREATE TYPE risk_level AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
CREATE TYPE vendor_category AS ENUM ('SOUND', 'VENUE', 'CATERING', 'DEKOR', 'TRANSPORT', 'LAINNYA');
CREATE TYPE sponsor_stage AS ENUM ('PROSPECT', 'CONTACTED', 'PROPOSAL_SENT', 'NEGOTIATION', 'SIGNED', 'REJECTED');
CREATE TYPE chat_room_type AS ENUM ('ANNOUNCEMENT', 'GENERAL', 'DIVISION', 'CROSS_DIVISION', 'DIRECT', 'MEETING', 'EMERGENCY');
CREATE TYPE language_enum AS ENUM ('ID', 'EN');
CREATE TYPE theme_enum AS ENUM ('LIGHT', 'DARK', 'SYSTEM');

-- 2. Trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 3. Create Tables
-- Table: organizations
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    type org_type NOT NULL,
    logo_url TEXT,
    email VARCHAR(255) NOT NULL UNIQUE,
    whatsapp VARCHAR(20) NOT NULL,
    city VARCHAR(100) NOT NULL,
    website TEXT,
    description TEXT,
    tier subscription_tier NOT NULL DEFAULT 'FREE',
    sop_file_url TEXT,
    credibility_score SMALLINT NOT NULL DEFAULT 0,
    settings_jsonb JSONB NOT NULL DEFAULT '{}',
    is_global_benchmark_opted_in BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER update_organizations_updated_at
BEFORE UPDATE ON organizations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table: users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    avatar_url TEXT,
    whatsapp VARCHAR(20),
    bio TEXT,
    timezone VARCHAR(50) NOT NULL DEFAULT 'Asia/Jakarta',
    language language_enum NOT NULL DEFAULT 'ID',
    theme theme_enum NOT NULL DEFAULT 'SYSTEM',
    is_email_verified BOOLEAN NOT NULL DEFAULT false,
    totp_secret TEXT,
    performance_history_jsonb JSONB NOT NULL DEFAULT '{}',
    last_active_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table: org_members
CREATE TABLE org_members (
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role org_role NOT NULL DEFAULT 'MEMBER',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ NULL,
    PRIMARY KEY (org_id, user_id)
);

-- Table: events
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(300) NOT NULL,
    type event_type NOT NULL,
    event_date DATE NOT NULL,
    estimated_attendees attendee_range NOT NULL,
    venue_type venue_type NOT NULL,
    city VARCHAR(100),
    venue_name VARCHAR(200),
    ticket_format ticket_format NOT NULL DEFAULT 'FREE',
    budget_estimate NUMERIC(15,2),
    budget_source budget_source,
    target_sponsorship NUMERIC(15,2),
    current_phase event_phase NOT NULL DEFAULT 'STRATEGIC',
    health_score SMALLINT NOT NULL DEFAULT 100,
    status event_status NOT NULL DEFAULT 'DRAFT',
    war_room_active BOOLEAN NOT NULL DEFAULT false,
    created_by UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON events
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table: divisions
CREATE TABLE divisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(200) NOT NULL,
    recommended_member_count SMALLINT NOT NULL DEFAULT 3,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_ai_generated BOOLEAN NOT NULL DEFAULT true,
    dependency_graph_jsonb JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table: event_members
CREATE TABLE event_members (
    event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    role event_role NOT NULL DEFAULT 'CORE_MEMBER',
    division_id UUID REFERENCES divisions(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    war_room_status VARCHAR(20) DEFAULT 'ON_POST',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (event_id, user_id)
);

-- Table: tasks
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    division_id UUID REFERENCES divisions(id) ON DELETE CASCADE NOT NULL,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(300) NOT NULL,
    description TEXT,
    status task_status NOT NULL DEFAULT 'BACKLOG',
    priority priority NOT NULL DEFAULT 'MEDIUM',
    assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
    deadline DATE,
    progress SMALLINT NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    is_ai_generated BOOLEAN NOT NULL DEFAULT false,
    ai_insight TEXT,
    smart_reminder_sent_at JSONB NOT NULL DEFAULT '{}',
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON tasks
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_tasks_division ON tasks(division_id);
CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_deadline ON tasks(deadline);

-- Table: task_dependencies
CREATE TABLE task_dependencies (
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
    depends_on_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (task_id, depends_on_task_id),
    CONSTRAINT chk_no_self_dependency CHECK (task_id != depends_on_task_id)
);

-- Table: subtasks
CREATE TABLE subtasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(300) NOT NULL,
    is_done BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table: kpis
CREATE TABLE kpis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    division_id UUID REFERENCES divisions(id) ON DELETE CASCADE NOT NULL,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(200) NOT NULL,
    target_value NUMERIC(15,2) NOT NULL,
    current_value NUMERIC(15,2) NOT NULL DEFAULT 0,
    unit VARCHAR(50) NOT NULL,
    deadline DATE,
    is_ai_generated BOOLEAN NOT NULL DEFAULT true,
    phase_weight_jsonb JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER update_kpis_updated_at
BEFORE UPDATE ON kpis
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table: milestones
CREATE TABLE milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(300) NOT NULL,
    phase event_phase NOT NULL,
    due_date DATE NOT NULL,
    actual_date DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'UPCOMING',
    is_ai_generated BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table: risks
CREATE TABLE risks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    division_id UUID REFERENCES divisions(id) ON DELETE SET NULL,
    level risk_level NOT NULL DEFAULT 'LOW',
    title VARCHAR(300) NOT NULL,
    description TEXT,
    source VARCHAR(20) NOT NULL DEFAULT 'MANUAL',
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    recovery_plan JSONB,
    chosen_plan_index SMALLINT,
    detected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    resolved_at TIMESTAMPTZ
);

-- Table: escalation_logs
CREATE TABLE escalation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    risk_id UUID REFERENCES risks(id) ON DELETE CASCADE NOT NULL,
    level risk_level NOT NULL,
    notified_user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    channel VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    acknowledged_at TIMESTAMPTZ
);

-- Table: vendors
CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(200) NOT NULL,
    category vendor_category NOT NULL,
    pic_name VARCHAR(200),
    pic_contact VARCHAR(100),
    reliability_score NUMERIC(3,2) NOT NULL DEFAULT 0,
    sla_tracking_jsonb JSONB,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER update_vendors_updated_at
BEFORE UPDATE ON vendors
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table: event_vendors
CREATE TABLE event_vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'BRIEF',
    contract_value NUMERIC(15,2),
    sla_deadline DATE,
    payment_status VARCHAR(20) NOT NULL DEFAULT 'UNPAID',
    dp_paid_at TIMESTAMPTZ,
    final_paid_at TIMESTAMPTZ,
    post_event_rating SMALLINT CHECK (post_event_rating >= 1 AND post_event_rating <= 5),
    sla_fulfilled_pct SMALLINT CHECK (sla_fulfilled_pct >= 0 AND sla_fulfilled_pct <= 100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table: sponsors
CREATE TABLE sponsors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    brand_name VARCHAR(200) NOT NULL,
    pic_name VARCHAR(200),
    pic_contact VARCHAR(100),
    category VARCHAR(100),
    estimated_value NUMERIC(15,2),
    agreed_value NUMERIC(15,2),
    stage sponsor_stage NOT NULL DEFAULT 'PROSPECT',
    history_jsonb JSONB,
    contract_url TEXT,
    last_contact_at TIMESTAMPTZ,
    renewal_priority SMALLINT CHECK (renewal_priority >= 1 AND renewal_priority <= 5),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER update_sponsors_updated_at
BEFORE UPDATE ON sponsors
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table: sponsor_interactions
CREATE TABLE sponsor_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sponsor_id UUID REFERENCES sponsors(id) ON DELETE CASCADE NOT NULL,
    type VARCHAR(50) NOT NULL,
    note TEXT,
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    interacted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table: meetings
CREATE TABLE meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    division_id UUID REFERENCES divisions(id) ON DELETE SET NULL,
    title VARCHAR(300) NOT NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes SMALLINT,
    external_link TEXT,
    host_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED',
    transcript_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table: meeting_summaries
CREATE TABLE meeting_summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE UNIQUE NOT NULL,
    summary_points JSONB NOT NULL DEFAULT '[]',
    decisions JSONB NOT NULL DEFAULT '[]',
    unanswered_questions JSONB,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    is_edited BOOLEAN NOT NULL DEFAULT false
);

-- Table: action_items
CREATE TABLE action_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(300) NOT NULL,
    assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
    deadline DATE,
    is_pushed_to_task BOOLEAN NOT NULL DEFAULT false,
    task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table: chat_rooms
CREATE TABLE chat_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    division_id UUID REFERENCES divisions(id) ON DELETE SET NULL,
    type chat_room_type NOT NULL DEFAULT 'GENERAL',
    name VARCHAR(200) NOT NULL,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table: messages
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'TEXT',
    file_url TEXT,
    is_pinned BOOLEAN NOT NULL DEFAULT false,
    sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_room_id ON messages(room_id);
CREATE INDEX idx_messages_sent_at ON messages(sent_at);

-- Table: incidents
CREATE TABLE incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    type VARCHAR(30) NOT NULL,
    severity risk_level NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(200),
    reporter_id UUID REFERENCES users(id) ON DELETE SET NULL,
    assigned_to_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    log_jsonb JSONB NOT NULL DEFAULT '[]',
    reported_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    resolved_at TIMESTAMPTZ
);

-- Table: org_memories
CREATE TABLE org_memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE UNIQUE NOT NULL,
    pm_preferences_jsonb JSONB,
    division_patterns_jsonb JSONB,
    event_memories_jsonb JSONB,
    vendor_patterns JSONB,
    sponsor_patterns JSONB,
    timeline_calibration JSONB,
    kpi_benchmarks JSONB,
    global_benchmark_cache JSONB,
    ai_recommendation_accuracy NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    last_updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table: files
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    division_id UUID REFERENCES divisions(id) ON DELETE SET NULL,
    task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
    uploader_id UUID REFERENCES users(id) ON DELETE SET NULL,
    file_name VARCHAR(500) NOT NULL,
    file_url TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    version SMALLINT NOT NULL DEFAULT 1,
    parent_file_id UUID REFERENCES files(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table: post_event_reports
CREATE TABLE post_event_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE UNIQUE NOT NULL,
    final_health_score SMALLINT NOT NULL,
    executive_summary TEXT,
    division_performance JSONB NOT NULL DEFAULT '{}',
    incident_timeline JSONB DEFAULT '[]',
    sponsor_debrief JSONB DEFAULT '[]',
    vendor_debrief JSONB DEFAULT '[]',
    ai_learning_insights JSONB DEFAULT '[]',
    next_event_recommendations JSONB DEFAULT '[]',
    generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ
);

-- Table: notification_logs
CREATE TABLE notification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    type VARCHAR(50) NOT NULL,
    channel VARCHAR(20) NOT NULL,
    title VARCHAR(300) NOT NULL,
    body TEXT NOT NULL,
    metadata JSONB,
    is_read BOOLEAN NOT NULL DEFAULT false,
    sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    read_at TIMESTAMPTZ
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE divisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE escalation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsor_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_event_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

-- Helper functions for RLS
CREATE OR REPLACE FUNCTION is_org_member(org_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM org_members 
        WHERE org_members.org_id = $1 
          AND org_members.user_id = $2 
          AND org_members.status = 'ACTIVE' 
          AND org_members.deleted_at IS NULL
    );
END;
$$ language plpgsql security definer;

CREATE OR REPLACE FUNCTION is_event_member(event_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM event_members 
        WHERE event_members.event_id = $1 
          AND event_members.user_id = $2 
          AND event_members.is_active = true
    );
END;
$$ language plpgsql security definer;

-- Example RLS policies (super admin can do all; members filter by membership checks)
CREATE POLICY org_read_policy ON organizations FOR SELECT 
USING (is_org_member(id, auth.uid()));

CREATE POLICY user_self_policy ON users FOR ALL
USING (id = auth.uid());

CREATE POLICY event_read_policy ON events FOR SELECT
USING (is_org_member(org_id, auth.uid()));

CREATE POLICY event_member_read ON event_members FOR SELECT
USING (is_event_member(event_id, auth.uid()));

CREATE POLICY task_read_policy ON tasks FOR SELECT
USING (is_event_member(event_id, auth.uid()));

CREATE POLICY chat_room_read ON chat_rooms FOR SELECT
USING (is_event_member(event_id, auth.uid()));

CREATE POLICY message_read_policy ON messages FOR SELECT
USING (EXISTS (SELECT 1 FROM chat_rooms WHERE chat_rooms.id = room_id AND is_event_member(chat_rooms.event_id, auth.uid())));

CREATE POLICY notification_self_policy ON notification_logs FOR SELECT
USING (user_id = auth.uid());
