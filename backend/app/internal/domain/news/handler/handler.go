package handler

import (
	"encoding/json"
	"net/http"

	"github.com/Kur04ka/hospital/internal/domain/handlers"
	"github.com/Kur04ka/hospital/internal/domain/news/repository"
	"github.com/julienschmidt/httprouter"
)

type handler struct {
	repository repository.Repository
}

func NewNewsHandler(repository repository.Repository) handlers.Handler {
	return &handler{
		repository: repository,
	}
}

func (h *handler) Register(router *httprouter.Router) {
	router.HandlerFunc(http.MethodGet, "/news/all-news", h.getAllNews)
}

func (h *handler) getAllNews(w http.ResponseWriter, r *http.Request) {
	news, err := h.repository.GetAllNews()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	data, err := json.Marshal(news)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Write(data)
}
