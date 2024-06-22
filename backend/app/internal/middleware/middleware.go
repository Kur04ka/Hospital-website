package middleware

import (
	"net/http"
	"strings"
	"time"

	"github.com/Kur04ka/hospital/internal/common"
)

type appHandler func(w http.ResponseWriter, r *http.Request)

func AuthCheck(apph appHandler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		header := r.Header.Get("Authorization")
		if header == "" {
			http.Error(w, "empty auth header", http.StatusUnauthorized)
			return
		}

		headerParts := strings.Split(header, " ")
		if len(headerParts) != 2 {
			http.Error(w, "invalid auth header", http.StatusUnauthorized)
			return
		}

		payload, err := common.ParseToken(headerParts[1])
		if err != nil {
			http.Error(w, err.Error(), http.StatusUnauthorized)
			return
		}

		if time.Now().After(payload["exp"].(time.Time)) {
			http.Error(w, "token is expired", http.StatusUnauthorized)
			return 
		}

		r.Header.Set("user_id", payload["ueid"].(string))
		r.Header.Set("role", payload["role"].(string))
		apph(w, r)
	}
}
