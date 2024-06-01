package handler

import (
	"encoding/json"
	"net/http"

	"github.com/Kur04ka/hospital/internal/domain/doctor/repository"
	"github.com/Kur04ka/hospital/internal/domain/handlers"
	"github.com/julienschmidt/httprouter"
)

type handler struct {
	repository repository.Repository
}

func NewDoctorHandler(repository repository.Repository) handlers.Handler {
	return &handler{
		repository: repository,
	}
}

func (h *handler) Register(router *httprouter.Router) {
	router.HandlerFunc(http.MethodGet, "/doctors/all-doctors", h.getAllDoctors)
	router.HandlerFunc(http.MethodGet, "/doctors/all-specialities", h.getAllSpecialities)
	router.HandlerFunc(http.MethodGet, "/doctors/doctor-by-speciality/:speciality", h.getDoctorBySpeciality)
}

func (h *handler) getAllDoctors(w http.ResponseWriter, r *http.Request) {
	doctors, err := h.repository.GetAllDoctors()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	data, err := json.Marshal(doctors)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Write(data)
}

func (h *handler) getAllSpecialities(w http.ResponseWriter, r *http.Request) {
	specialities, err := h.repository.GetAllSpecialities()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	data, err := json.Marshal(specialities)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Write(data)
}

func (h *handler) getDoctorBySpeciality(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())

	speciality := params.ByName("speciality")
	doctors, err := h.repository.GetDoctorsNameBySpeciality(speciality)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	data, err := json.Marshal(doctors)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Write(data)
}
