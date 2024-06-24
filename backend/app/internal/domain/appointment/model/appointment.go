package model

import "time"

// TODO: исправить историю с несоответсвующими с бд по структуре appointment 

type Appointment struct {
	Id          int       `json:"appointment_id"`
	PatientUuid string    `json:"-"`
	DoctorId    int       `json:"-"`
	DoctorName  string    `json:"doctor_name"`
	BeginsAt    time.Time `json:"begins_at"`
	EndsAt      time.Time `json:"ends_at"`
	Status      string    `json:"status"`
}

type AppointmentDoctorView struct {
	Id          int       `json:"appointment_id"`
	DoctorUuid  string    `json:"-"`
	PatientName string    `json:"patient_name"`
	BeginsAt    time.Time `json:"begins_at"`
	EndsAt      time.Time `json:"ends_at"`
	Status      string    `json:"status"`
}
