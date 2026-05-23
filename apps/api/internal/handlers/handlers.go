package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/evos/api/internal/domain"
	"github.com/evos/api/internal/middleware"
)

type Handler struct {
	DB *sql.DB
}

func NewHandler(db *sql.DB) *Handler {
	return &Handler{DB: db}
}

// Routes sets up the endpoint router for Chi
func (h *Handler) Routes(r chi.Router) {
	r.Route("/api/v1", func(r chi.Router) {
		// Public Auth
		r.Post("/auth/register", h.Register)
		r.Post("/auth/login", h.Login)

		// Authenticated Routes
		r.Group(func(r chi.Router) {
			r.Use(middleware.AuthMiddleware)

			// Organizations
			r.Get("/organizations/me", h.GetMyOrg)
			r.Put("/organizations/me", h.UpdateMyOrg)

			// Events
			r.Get("/events", h.ListEvents)
			r.Post("/events", h.CreateEvent)
			r.Get("/events/{id}", h.GetEventByID)
			r.Get("/events/{id}/health-score", h.GetEventHealthScore)

			// Setup Wizard AI
			r.Post("/events/ai/generate-divisions", h.GenerateAIDivisions)
			r.Post("/events/ai/generate-timeline", h.GenerateAITimeline)

			// Divisions & Tasks
			r.Get("/events/{id}/divisions", h.ListDivisions)
			r.Get("/events/{id}/divisions/{divId}/tasks", h.ListTasks)
			r.Post("/events/{id}/divisions/{divId}/tasks", h.CreateTask)
			r.Put("/events/{id}/divisions/{divId}/tasks/{taskId}/status", h.UpdateTaskStatus)

			// Risks
			r.Get("/events/{id}/risks", h.ListRisks)
			r.Put("/events/{id}/risks/{riskId}/resolve", h.ResolveRisk)

			// Sponsors & Vendors
			r.Get("/events/{id}/sponsors", h.ListSponsors)
			r.Post("/events/{id}/sponsors", h.CreateSponsor)
			r.Get("/events/{id}/vendors", h.ListVendors)

			// Meetings & Chat
			r.Get("/events/{id}/meetings", h.ListMeetings)
			r.Get("/events/{id}/chat-rooms", h.ListChatRooms)
		})
	})
}

// Helper: respondJSON sends standard envelopes
func respondJSON(w http.ResponseWriter, status int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(payload)
}

// Helper: respondError sends error envelopes
func respondError(w http.ResponseWriter, status int, code string, message string) {
	respondJSON(w, status, map[string]interface{}{
		"success": false,
		"error": map[string]string{
			"code":    code,
			"message": message,
		},
	})
}

// Auth Handlers
func (h *Handler) Register(w http.ResponseWriter, r *http.Request) {
	var req struct {
		FullName string `json:"full_name"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "INVALID_INPUT", "Invalid request body")
		return
	}

	// Simple mock user insert - in real case uses password hashing and DB execution
	query := `INSERT INTO users (full_name, email, password_hash, timezone, language, theme) 
	          VALUES ($1, $2, $3, 'Asia/Jakarta', 'ID', 'SYSTEM') RETURNING id`
	var id string
	err := h.DB.QueryRow(query, req.FullName, req.Email, req.Password).Scan(&id)
	if err != nil {
		respondError(w, http.StatusConflict, "ALREADY_EXISTS", "User already exists or database error: "+err.Error())
		return
	}

	respondJSON(w, http.StatusCreated, map[string]interface{}{
		"success": true,
		"data": map[string]string{
			"id": id,
		},
	})
}

func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "INVALID_INPUT", "Invalid request body")
		return
	}

	var user domain.User
	query := `SELECT id, full_name, email, password_hash FROM users WHERE email = $1`
	err := h.DB.QueryRow(query, req.Email).Scan(&user.ID, &user.FullName, &user.Email, &user.PasswordHash)
	if err != nil {
		respondError(w, http.StatusUnauthorized, "UNAUTHENTICATED", "Invalid email or password")
		return
	}

	if user.PasswordHash != req.Password { // Simple comparison for V1
		respondError(w, http.StatusUnauthorized, "UNAUTHENTICATED", "Invalid email or password")
		return
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"data": map[string]interface{}{
			"token": "mock-jwt-token-for-dev",
			"user":  user,
		},
	})
}

// Organization Handlers
func (h *Handler) GetMyOrg(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r.Context())
	
	var org domain.Organization
	query := `SELECT o.id, o.name, o.slug, o.type, o.logo_url, o.email, o.whatsapp, o.city, o.website, o.description, o.tier, o.created_at, o.updated_at 
	          FROM organizations o 
	          JOIN org_members m ON o.id = m.org_id 
	          WHERE m.user_id = $1 AND m.deleted_at IS NULL LIMIT 1`
	
	err := h.DB.QueryRow(query, userID).Scan(
		&org.ID, &org.Name, &org.Slug, &org.Type, &org.LogoURL, &org.Email, &org.Whatsapp, &org.City, &org.Website, &org.Description, &org.Tier, &org.CreatedAt, &org.UpdatedAt,
	)
	if err != nil {
		respondError(w, http.StatusNotFound, "RESOURCE_NOT_FOUND", "No organization found for this user")
		return
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"data":    org,
	})
}

func (h *Handler) UpdateMyOrg(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r.Context())
	var req struct {
		Name     string `json:"name"`
		Whatsapp string `json:"whatsapp"`
		City     string `json:"city"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "INVALID_INPUT", "Invalid request body")
		return
	}

	query := `UPDATE organizations o SET name = $1, whatsapp = $2, city = $3, updated_at = now()
	          WHERE id = (SELECT org_id FROM org_members WHERE user_id = $4 AND deleted_at IS NULL LIMIT 1)`
	_, err := h.DB.Exec(query, req.Name, req.Whatsapp, req.City, userID)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", "Could not update organization")
		return
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"success": true,
	})
}

// Events Handlers
func (h *Handler) ListEvents(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r.Context())

	query := `SELECT e.id, e.org_id, e.name, e.type, e.event_date, e.estimated_attendees, e.venue_type, e.city, e.venue_name, e.ticket_format, e.budget_estimate, e.budget_source, e.target_sponsorship, e.current_phase, e.health_score, e.status, e.war_room_active, e.created_by, e.created_at, e.updated_at 
	          FROM events e
	          JOIN org_members m ON e.org_id = m.org_id
	          WHERE m.user_id = $1 AND m.deleted_at IS NULL`
	
	rows, err := h.DB.Query(query, userID)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", err.Error())
		return
	}
	defer rows.Close()

	events := []domain.Event{}
	for rows.Next() {
		var e domain.Event
		err := rows.Scan(
			&e.ID, &e.OrgID, &e.Name, &e.Type, &e.EventDate, &e.EstimatedAttendees, &e.VenueType, &e.City, &e.VenueName, &e.TicketFormat, &e.BudgetEstimate, &e.BudgetSource, &e.TargetSponsorship, &e.CurrentPhase, &e.HealthScore, &e.Status, &e.WarRoomActive, &e.CreatedBy, &e.CreatedAt, &e.UpdatedAt,
		)
		if err != nil {
			respondError(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", err.Error())
			return
		}
		events = append(events, e)
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"data":    events,
	})
}

func (h *Handler) CreateEvent(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r.Context())
	var req struct {
		OrgID              string  `json:"org_id"`
		Name               string  `json:"name"`
		Type               string  `json:"type"`
		EventDate          string  `json:"event_date"`
		EstimatedAttendees string  `json:"estimated_attendees"`
		VenueType          string  `json:"venue_type"`
		City               string  `json:"city"`
		VenueName          string  `json:"venue_name"`
		TicketFormat       string  `json:"ticket_format"`
		BudgetEstimate     float64 `json:"budget_estimate"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "INVALID_INPUT", "Invalid request body")
		return
	}

	parsedDate, err := time.Parse("2006-01-02", req.EventDate)
	if err != nil {
		parsedDate = time.Now().AddDate(0, 1, 0)
	}

	query := `INSERT INTO events (org_id, name, type, event_date, estimated_attendees, venue_type, city, venue_name, ticket_format, budget_estimate, created_by)
	          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`
	var id string
	err = h.DB.QueryRow(query, req.OrgID, req.Name, req.Type, parsedDate, req.EstimatedAttendees, req.VenueType, req.City, req.VenueName, req.TicketFormat, req.BudgetEstimate, userID).Scan(&id)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", err.Error())
		return
	}

	respondJSON(w, http.StatusCreated, map[string]interface{}{
		"success": true,
		"data": map[string]string{
			"id": id,
		},
	})
}

func (h *Handler) GetEventByID(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	var e domain.Event
	query := `SELECT id, org_id, name, type, event_date, estimated_attendees, venue_type, city, venue_name, ticket_format, budget_estimate, budget_source, target_sponsorship, current_phase, health_score, status, war_room_active, created_by, created_at, updated_at FROM events WHERE id = $1`
	err := h.DB.QueryRow(query, id).Scan(
		&e.ID, &e.OrgID, &e.Name, &e.Type, &e.EventDate, &e.EstimatedAttendees, &e.VenueType, &e.City, &e.VenueName, &e.TicketFormat, &e.BudgetEstimate, &e.BudgetSource, &e.TargetSponsorship, &e.CurrentPhase, &e.HealthScore, &e.Status, &e.WarRoomActive, &e.CreatedBy, &e.CreatedAt, &e.UpdatedAt,
	)
	if err != nil {
		respondError(w, http.StatusNotFound, "RESOURCE_NOT_FOUND", "Event not found")
		return
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"data":    e,
	})
}

func (h *Handler) GetEventHealthScore(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	var healthScore int16
	err := h.DB.QueryRow("SELECT health_score FROM events WHERE id = $1", id).Scan(&healthScore)
	if err != nil {
		respondError(w, http.StatusNotFound, "RESOURCE_NOT_FOUND", "Event not found")
		return
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"data": map[string]interface{}{
			"health_score": healthScore,
			"status":       "HEALTHY",
		},
	})
}

// Setup Wizard Handlers
func (h *Handler) GenerateAIDivisions(w http.ResponseWriter, r *http.Request) {
	respondJSON(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"data": []map[string]interface{}{
			{"name": "Logistic & Venue", "recommended_member_count": 4},
			{"name": "Sponsorship & CRM", "recommended_member_count": 3},
			{"name": "Marketing & Creative", "recommended_member_count": 5},
			{"name": "Event Coordinator", "recommended_member_count": 2},
		},
	})
}

func (h *Handler) GenerateAITimeline(w http.ResponseWriter, r *http.Request) {
	respondJSON(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"data": []map[string]interface{}{
			{"title": "Vendor Venue Lock-in", "phase": "PLANNING", "days_before": 30},
			{"title": "Sponsorship Pitch", "phase": "PLANNING", "days_before": 45},
			{"title": "Social Campaign Launch", "phase": "OPERATIONAL", "days_before": 14},
			{"title": "Run-through", "phase": "EXECUTION", "days_before": 1},
		},
	})
}

// Divisions & Tasks Handlers
func (h *Handler) ListDivisions(w http.ResponseWriter, r *http.Request) {
	eventID := chi.URLParam(r, "id")
	rows, err := h.DB.Query("SELECT id, event_id, name, recommended_member_count, is_active, is_ai_generated, dependency_graph_jsonb, created_at FROM divisions WHERE event_id = $1", eventID)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", err.Error())
		return
	}
	defer rows.Close()

	divisions := []domain.Division{}
	for rows.Next() {
		var d domain.Division
		err := rows.Scan(&d.ID, &d.EventID, &d.Name, &d.RecommendedMemberCount, &d.IsActive, &d.IsAIGenerated, &d.DependencyGraphJSONB, &d.CreatedAt)
		if err != nil {
			respondError(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", err.Error())
			return
		}
		divisions = append(divisions, d)
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"data":    divisions,
	})
}

func (h *Handler) ListTasks(w http.ResponseWriter, r *http.Request) {
	divID := chi.URLParam(r, "divId")
	rows, err := h.DB.Query("SELECT id, division_id, event_id, title, description, status, priority, assignee_id, deadline, progress, is_ai_generated, ai_insight, smart_reminder_sent_at, created_by, created_at, updated_at FROM tasks WHERE division_id = $1", divID)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", err.Error())
		return
	}
	defer rows.Close()

	tasks := []domain.Task{}
	for rows.Next() {
		var t domain.Task
		err := rows.Scan(
			&t.ID, &t.DivisionID, &t.EventID, &t.Title, &t.Description, &t.Status, &t.Priority, &t.AssigneeID, &t.Deadline, &t.Progress, &t.IsAIGenerated, &t.AIInsight, &t.SmartReminderSentAt, &t.CreatedBy, &t.CreatedAt, &t.UpdatedAt,
		)
		if err != nil {
			respondError(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", err.Error())
			return
		}
		tasks = append(tasks, t)
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"data":    tasks,
	})
}

func (h *Handler) CreateTask(w http.ResponseWriter, r *http.Request) {
	divID := chi.URLParam(r, "divId")
	eventID := chi.URLParam(r, "id")
	userID := middleware.GetUserID(r.Context())

	var req struct {
		Title       string `json:"title"`
		Description string `json:"description"`
		Priority    string `json:"priority"`
		AssigneeID  string `json:"assignee_id"`
		Deadline    string `json:"deadline"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "INVALID_INPUT", "Invalid request body")
		return
	}

	var parsedDeadline *time.Time
	if req.Deadline != "" {
		if t, err := time.Parse("2006-01-02", req.Deadline); err == nil {
			parsedDeadline = &t
		}
	}

	var assignee *string
	if req.AssigneeID != "" {
		assignee = &req.AssigneeID
	}

	query := `INSERT INTO tasks (division_id, event_id, title, description, priority, assignee_id, deadline, created_by)
	          VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`
	var id string
	err := h.DB.QueryRow(query, divID, eventID, req.Title, req.Description, req.Priority, assignee, parsedDeadline, userID).Scan(&id)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", err.Error())
		return
	}

	respondJSON(w, http.StatusCreated, map[string]interface{}{
		"success": true,
		"data": map[string]string{
			"id": id,
		},
	})
}

func (h *Handler) UpdateTaskStatus(w http.ResponseWriter, r *http.Request) {
	taskId := chi.URLParam(r, "taskId")
	var req struct {
		Status string `json:"status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "INVALID_INPUT", "Invalid request body")
		return
	}

	query := `UPDATE tasks SET status = $1, updated_at = now() WHERE id = $2`
	_, err := h.DB.Exec(query, req.Status, taskId)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", err.Error())
		return
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"success": true,
	})
}

// Risks Handlers
func (h *Handler) ListRisks(w http.ResponseWriter, r *http.Request) {
	eventID := chi.URLParam(r, "id")
	rows, err := h.DB.Query("SELECT id, event_id, division_id, level, title, description, source, status, recovery_plan, chosen_plan_index, detected_at, resolved_at FROM risks WHERE event_id = $1", eventID)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", err.Error())
		return
	}
	defer rows.Close()

	risks := []domain.Risk{}
	for rows.Next() {
		var r domain.Risk
		err := rows.Scan(
			&r.ID, &r.EventID, &r.DivisionID, &r.Level, &r.Title, &r.Description, &r.Source, &r.Status, &r.RecoveryPlan, &r.ChosenPlanIndex, &r.DetectedAt, &r.ResolvedAt,
		)
		if err != nil {
			respondError(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", err.Error())
			return
		}
		risks = append(risks, r)
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"data":    risks,
	})
}

func (h *Handler) ResolveRisk(w http.ResponseWriter, r *http.Request) {
	riskId := chi.URLParam(r, "riskId")
	query := `UPDATE risks SET status = 'RESOLVED', resolved_at = now() WHERE id = $1`
	_, err := h.DB.Exec(query, riskId)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", err.Error())
		return
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"success": true,
	})
}

// Sponsors Handlers
func (h *Handler) ListSponsors(w http.ResponseWriter, r *http.Request) {
	eventID := chi.URLParam(r, "id")
	rows, err := h.DB.Query("SELECT id, org_id, event_id, brand_name, pic_name, pic_contact, category, estimated_value, agreed_value, stage, history_jsonb, contract_url, last_contact_at, renewal_priority, created_at, updated_at FROM sponsors WHERE event_id = $1", eventID)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", err.Error())
		return
	}
	defer rows.Close()

	sponsors := []domain.Sponsor{}
	for rows.Next() {
		var s domain.Sponsor
		err := rows.Scan(
			&s.ID, &s.OrgID, &s.EventID, &s.BrandName, &s.PICName, &s.PICContact, &s.Category, &s.EstimatedValue, &s.AgreedValue, &s.Stage, &s.HistoryJSONB, &s.ContractURL, &s.LastContactAt, &s.RenewalPriority, &s.CreatedAt, &s.UpdatedAt,
		)
		if err != nil {
			respondError(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", err.Error())
			return
		}
		sponsors = append(sponsors, s)
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"data":    sponsors,
	})
}

func (h *Handler) CreateSponsor(w http.ResponseWriter, r *http.Request) {
	eventID := chi.URLParam(r, "id")
	var req struct {
		OrgID          string  `json:"org_id"`
		BrandName      string  `json:"brand_name"`
		PICName        string  `json:"pic_name"`
		PICContact     string  `json:"pic_contact"`
		Category       string  `json:"category"`
		EstimatedValue float64 `json:"estimated_value"`
		Stage          string  `json:"stage"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "INVALID_INPUT", "Invalid request body")
		return
	}

	query := `INSERT INTO sponsors (org_id, event_id, brand_name, pic_name, pic_contact, category, estimated_value, stage)
	          VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`
	var id string
	err := h.DB.QueryRow(query, req.OrgID, eventID, req.BrandName, req.PICName, req.PICContact, req.Category, req.EstimatedValue, req.Stage).Scan(&id)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", err.Error())
		return
	}

	respondJSON(w, http.StatusCreated, map[string]interface{}{
		"success": true,
		"data": map[string]string{
			"id": id,
		},
	})
}

// Vendors Handlers
func (h *Handler) ListVendors(w http.ResponseWriter, r *http.Request) {
	eventID := chi.URLParam(r, "id")
	// Join event_vendors and vendors
	rows, err := h.DB.Query(`SELECT v.id, v.org_id, v.name, v.category, v.pic_name, v.pic_contact, v.reliability_score, v.sla_tracking_jsonb, v.notes, v.created_at, v.updated_at 
	                         FROM vendors v 
	                         JOIN event_vendors ev ON v.id = ev.vendor_id 
	                         WHERE ev.event_id = $1`, eventID)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", err.Error())
		return
	}
	defer rows.Close()

	vendors := []domain.Vendor{}
	for rows.Next() {
		var v domain.Vendor
		err := rows.Scan(
			&v.ID, &v.OrgID, &v.Name, &v.Category, &v.PICName, &v.PICContact, &v.ReliabilityScore, &v.SLATrackingJSONB, &v.Notes, &v.CreatedAt, &v.UpdatedAt,
		)
		if err != nil {
			respondError(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", err.Error())
			return
		}
		vendors = append(vendors, v)
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"data":    vendors,
	})
}

// Meetings & Chat Handlers
func (h *Handler) ListMeetings(w http.ResponseWriter, r *http.Request) {
	eventID := chi.URLParam(r, "id")
	rows, err := h.DB.Query("SELECT id, event_id, division_id, title, scheduled_at, duration_minutes, external_link, host_id, status, transcript_url, created_at FROM meetings WHERE event_id = $1", eventID)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", err.Error())
		return
	}
	defer rows.Close()

	meetings := []domain.Meeting{}
	for rows.Next() {
		var m domain.Meeting
		err := rows.Scan(
			&m.ID, &m.EventID, &m.DivisionID, &m.Title, &m.ScheduledAt, &m.DurationMinutes, &m.ExternalLink, &m.HostID, &m.Status, &m.TranscriptURL, &m.CreatedAt,
		)
		if err != nil {
			respondError(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", err.Error())
			return
		}
		meetings = append(meetings, m)
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"data":    meetings,
	})
}

func (h *Handler) ListChatRooms(w http.ResponseWriter, r *http.Request) {
	eventID := chi.URLParam(r, "id")
	rows, err := h.DB.Query("SELECT id, event_id, division_id, type, name, created_by, created_at FROM chat_rooms WHERE event_id = $1", eventID)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", err.Error())
		return
	}
	defer rows.Close()

	chatRooms := []domain.ChatRoom{}
	for rows.Next() {
		var cr domain.ChatRoom
		err := rows.Scan(
			&cr.ID, &cr.EventID, &cr.DivisionID, &cr.Type, &cr.Name, &cr.CreatedBy, &cr.CreatedAt,
		)
		if err != nil {
			respondError(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", err.Error())
			return
		}
		chatRooms = append(chatRooms, cr)
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"data":    chatRooms,
	})
}
