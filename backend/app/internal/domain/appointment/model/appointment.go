package model

import "time"

type Appointment struct {
	Id          int       `json:"appointment_id"`
	PatientUuid string    `json:"-"`
	DoctorId    int       `json:"-"`
	DoctorName  string    `json:"doctor_name"`
	BeginsAt    time.Time `json:"begins_at"`
	EndsAt      time.Time `json:"ends_at"`
	IsAvailable bool      `json:"-"`
	Status      string    `json:"status"`
}
