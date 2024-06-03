package handler

import (
	"encoding/json"
	"net/http"

	"github.com/Kur04ka/hospital/internal/domain/call-request/model"
	"github.com/Kur04ka/hospital/internal/domain/call-request/repository"
	"github.com/Kur04ka/hospital/internal/domain/handlers"
	"github.com/julienschmidt/httprouter"
)

type handler struct {
	repository repository.Repository
}

func NewCallRequestHandler(repository repository.Repository) handlers.Handler {
	return &handler{
		repository: repository,
	}
}

func (h *handler) Register(router *httprouter.Router) {
	router.HandlerFunc(http.MethodPost, "/call-request/leave-call-request", h.createCallRequest)
}

func (h *handler) createCallRequest(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var callRequest model.CallRequest

	err := json.NewDecoder(r.Body).Decode(&callRequest)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = h.repository.CreateCallRequest(callRequest)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	w.WriteHeader(http.StatusAccepted)
}
