package handler

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/Kur04ka/hospital/internal/domain/appointment/repository"
	"github.com/Kur04ka/hospital/internal/domain/handlers"
	"github.com/Kur04ka/hospital/internal/middleware"
	"github.com/julienschmidt/httprouter"
)

type handler struct {
	repository repository.Repository
}

func NewAppointmentHandler(repository repository.Repository) handlers.Handler {
	return &handler{
		repository: repository,
	}
}

func (h *handler) Register(router *httprouter.Router) {
	router.HandlerFunc(http.MethodGet, "/doctors/doctor-schedule/:doctor-name", h.getScheduleByDoctorName)
	router.HandlerFunc(http.MethodPost, "/appointments/create-new-appointment/:appointmentID", middleware.AuthCheck(h.makeNewAppointment))
	router.HandlerFunc(http.MethodGet, "/appointments/current-appointments-by-uuid", middleware.AuthCheck(h.getAllCurrentAppointments))
	router.HandlerFunc(http.MethodGet, "/appointments/archieve-appointments-by-uuid", middleware.AuthCheck(h.getAllArchieveAppointments))
	router.HandlerFunc(http.MethodDelete, "/appointments/delete-appointment/:appointmentID", middleware.AuthCheck(h.deleteAppointment))
	router.HandlerFunc(http.MethodPatch, "/appointments/patch-appointment", middleware.AuthCheck(h.patchAppointment))
}

func (h *handler) getScheduleByDoctorName(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := httprouter.ParamsFromContext(r.Context())
	doctorName := params.ByName("doctor-name")

	appointments, err := h.repository.GetAvailableAppointmentsByDoctorName(doctorName)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	data, err := json.Marshal(appointments)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Write(data)
}

func (h *handler) makeNewAppointment(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	uuid := r.Header.Get("user_id")

	params := httprouter.ParamsFromContext(r.Context())
	appointmentID := params.ByName("appointmentID")
	id, err := strconv.Atoi(appointmentID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	err = h.repository.MakeAppointmentByUUID(id, uuid)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	appointment, err := h.repository.GetAppointmentByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	data, err := json.Marshal(appointment)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Write(data)

	w.WriteHeader(http.StatusAccepted)
}

func (h *handler) getAllCurrentAppointments(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	uuid := r.Header.Get("user_id")

	appointments, err := h.repository.GetAllCurrentAppointmentsByUUID(uuid)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	data, err := json.Marshal(appointments)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Write(data)
}

func (h *handler) getAllArchieveAppointments(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	uuid := r.Header.Get("user_id")

	appointments, err := h.repository.GetAllArchieveAppointmentsByUUID(uuid)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	data, err := json.Marshal(appointments)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Write(data)
}

func (h *handler) deleteAppointment(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := httprouter.ParamsFromContext(r.Context())
	appointmentID := params.ByName("appointmentID")

	id, err := strconv.Atoi(appointmentID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = h.repository.MakeAppointmentFreeByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusAccepted)
}

func (h *handler) patchAppointment(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	uuid := r.Header.Get("user_id")

	old_id, err := strconv.Atoi(r.URL.Query().Get("old_id"))
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	new_id, err := strconv.Atoi(r.URL.Query().Get("new_id"))
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = h.repository.MakeAppointmentFreeByID(old_id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	err = h.repository.MakeAppointmentByUUID(new_id, uuid)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	appointment, err := h.repository.GetAppointmentByID(new_id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	data, err := json.Marshal(appointment)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Write(data)

	w.WriteHeader(http.StatusAccepted)
}

