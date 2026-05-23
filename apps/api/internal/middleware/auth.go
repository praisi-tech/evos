package middleware

import (
	"context"
	"errors"
	"net/http"
	"os"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

type contextKey string

const UserIDKey contextKey = "user_id"

// AuthMiddleware validates the JWT from Supabase and extracts the user ID (sub)
func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, `{"success":false,"error":{"code":"UNAUTHENTICATED","message":"Missing authorization header"}}`, http.StatusUnauthorized)
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			http.Error(w, `{"success":false,"error":{"code":"UNAUTHENTICATED","message":"Invalid authorization header format"}}`, http.StatusUnauthorized)
			return
		}

		tokenString := parts[1]
		jwtSecret := os.Getenv("SUPABASE_JWT_SECRET")
		if jwtSecret == "" {
			jwtSecret = "super-secret-jwt-key-change-me-in-production" // Dev fallback
		}

		token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, errors.New("unexpected signing method")
			}
			return []byte(jwtSecret), nil
		})

		if err != nil || !token.Valid {
			http.Error(w, `{"success":false,"error":{"code":"UNAUTHENTICATED","message":"Invalid or expired token"}}`, http.StatusUnauthorized)
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			http.Error(w, `{"success":false,"error":{"code":"UNAUTHENTICATED","message":"Invalid token claims"}}`, http.StatusUnauthorized)
			return
		}

		sub, _ := claims["sub"].(string)
		if sub == "" {
			http.Error(w, `{"success":false,"error":{"code":"UNAUTHENTICATED","message":"Missing subject claim in token"}}`, http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), UserIDKey, sub)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// GetUserID retrieves the authenticated user ID from context
func GetUserID(ctx context.Context) string {
	if val := ctx.Value(UserIDKey); val != nil {
		if id, ok := val.(string); ok {
			return id
		}
	}
	return ""
}
