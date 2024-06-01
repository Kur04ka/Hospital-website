package handler

import (
	"encoding/json"
	"net/http"

	"github.com/Kur04ka/hospital/internal/domain/handlers"
	"github.com/Kur04ka/hospital/internal/domain/review/repository"
	"github.com/julienschmidt/httprouter"
)

type handler struct {
	repository repository.Repository
}

func NewReviewHandler(repository repository.Repository) handlers.Handler {
	return &handler{
		repository: repository,
	}
}

func (h *handler) Register(router *httprouter.Router) {
	router.HandlerFunc(http.MethodGet, "/review/all-reviews", h.getAllReviews)
}

func (h *handler) getAllReviews(w http.ResponseWriter, r *http.Request) {
	news, err := h.repository.GetAllReviews()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// TODO: get user name

	data, err := json.Marshal(news)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Write(data)
}
