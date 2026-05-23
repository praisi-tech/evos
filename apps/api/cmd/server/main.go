package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	
	"github.com/evos/api/internal/handlers"
)

func main() {
	// 1. Load Environment Variables (optional, for local development)
	_ = godotenv.Load("../../../.env") // Try to load root env
	_ = godotenv.Load()                // Try to load local env

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://postgres:postgres@localhost:5432/evos?sslmode=disable"
	}

	// 2. Initialize Database Connection
	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatalf("Error opening database connection: %v", err)
	}
	defer db.Close()

	// Verify database connection is alive
	err = db.Ping()
	if err != nil {
		log.Printf("Warning: Database ping failed: %v. Database operations might fail.", err)
	} else {
		fmt.Println("Successfully connected to database.")
	}

	// 3. Initialize Router
	r := chi.NewRouter()

	// Base middleware
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	
	// Custom CORS middleware
	r.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, Authorization")
			if req.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}
			next.ServeHTTP(w, req)
		})
	})

	// 4. Register API Routes
	h := handlers.NewHandler(db)
	h.Routes(r)

	// Simple root route
	r.Get("/", func(w http.ResponseWriter, req *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"app": "EvOS API", "version": "1.0", "status": "UP"}`))
	})

	// 5. Start Server
	fmt.Printf("EvOS API Monolith starting on port %s...\n", port)
	err = http.ListenAndServe(":"+port, r)
	if err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
