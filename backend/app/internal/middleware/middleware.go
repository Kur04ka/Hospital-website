package middleware

import (
	"net/http"
	"strings"
	"time"

	"github.com/Kur04ka/hospital/internal/common"
)

type appHandler func(w http.ResponseWriter, r *http.Request)

// role can be either 'doctor' or 'user'
func AuthCheck(apph appHandler, role string) http.HandlerFunc {
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

		expTime := time.Unix(int64(payload["exp"].(float64)), 0)
		if time.Now().After(expTime) {
			http.Error(w, "token is expired", http.StatusUnauthorized)
			return
		}

		if role != "" {
			if !(payload["role"] == role) {
				http.Error(w, "the user does not have rights to perform this action", http.StatusForbidden)
				return
			}
		}

		r.Header.Set("user_id", payload["ueid"].(string))
		apph(w, r)
	}
}
