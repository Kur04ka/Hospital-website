package middleware

import (
	"net/http"
	"strings"

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

		userId, err := common.ParseToken(headerParts[1])
		if err != nil {
			http.Error(w, err.Error(), http.StatusUnauthorized)
			return
		}

		r.Header.Set("user_id", userId)
		apph(w, r)
	}
}
