package repository

import "github.com/Kur04ka/hospital/internal/domain/appointment/model"

type Repository interface {
	GetAvailableAppointmentsByDoctorName(doctorName string) ([]model.Appointment, error) 
	MakeAppointmentByUUID(appointmentID int, uuid string) error
	GetAllCurrentAppointmentsByUUID(uuid string) ([]model.Appointment, error)
	GetAllArchieveAppointmentsByUUID(uuid string) ([]model.Appointment, error)

	MakeAppointmentFreeByID(id int) error
	GetAppointmentByID(id int) (model.Appointment, error)
	AppointmentStatusChange(id int, status string) error
}