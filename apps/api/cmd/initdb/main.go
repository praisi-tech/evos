package main

import (
	"context"
	"database/sql"
	"fmt"
	"io/ioutil"
	"log"
	"path/filepath"
	"time"

	_ "github.com/lib/pq"
)

func main() {
	// 1. Connect to default postgres DB
	postgresURL := "postgres://postgres:123456@localhost:5432/postgres?sslmode=disable"
	fmt.Println("Connecting to default PostgreSQL database to check/create 'evos' database...")
	db, err := sql.Open("postgres", postgresURL)
	if err != nil {
		log.Fatalf("Failed to open connection to postgres database: %v", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	err = db.PingContext(ctx)
	cancel()
	if err != nil {
		db.Close()
		log.Fatalf("Failed to ping postgres database: %v", err)
	}

	// Check if evos database exists
	var exists bool
	query := "SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname = 'evos')"
	err = db.QueryRow(query).Scan(&exists)
	if err != nil {
		db.Close()
		log.Fatalf("Failed to check if 'evos' database exists: %v", err)
	}

	if !exists {
		fmt.Println("Database 'evos' does not exist. Creating database...")
		_, err = db.Exec("CREATE DATABASE evos")
		if err != nil {
			db.Close()
			log.Fatalf("Failed to create database 'evos': %v", err)
		}
		fmt.Println("Database 'evos' created successfully.")
	} else {
		fmt.Println("Database 'evos' already exists.")
	}
	db.Close()

	// 2. Connect to the evos DB
	evosURL := "postgres://postgres:123456@localhost:5432/evos?sslmode=disable"
	fmt.Println("Connecting to 'evos' database to run migrations...")
	dbEvos, err := sql.Open("postgres", evosURL)
	if err != nil {
		log.Fatalf("Failed to open connection to 'evos' database: %v", err)
	}
	defer dbEvos.Close()

	ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	err = dbEvos.PingContext(ctx)
	cancel()
	if err != nil {
		log.Fatalf("Failed to ping 'evos' database: %v", err)
	}

	// Read the migrations file
	migrationPath := filepath.Join("..", "..", "supabase", "migrations", "20260523000000_init.sql")
	fmt.Printf("Reading migration file from %s...\n", migrationPath)
	migrationBytes, err := ioutil.ReadFile(migrationPath)
	if err != nil {
		log.Fatalf("Failed to read migration file: %v", err)
	}
	migrationSQL := string(migrationBytes)

	// Create auth schema and auth.uid stub
	fmt.Println("Setting up 'auth' schema and 'auth.uid()' stub for RLS policies...")
	setupSQL := `
	CREATE SCHEMA IF NOT EXISTS auth;
	CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid AS $$
	BEGIN
		RETURN '00000000-0000-0000-0000-000000000000'::uuid;
	END;
	$$ LANGUAGE plpgsql;
	`
	_, err = dbEvos.Exec(setupSQL)
	if err != nil {
		log.Fatalf("Failed to setup 'auth' schema and stub: %v", err)
	}

	// Execute migration
	fmt.Println("Running migration SQL...")
	_, err = dbEvos.Exec(migrationSQL)
	if err != nil {
		log.Fatalf("Failed to run migration SQL: %v", err)
	}

	fmt.Println("Migrations completed successfully! 'evos' database is ready.")
}
