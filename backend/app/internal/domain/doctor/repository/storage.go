package repository

import "github.com/Kur04ka/hospital/internal/domain/doctor/model"

type Repository interface {
	GetAllDoctors() ([]model.Doctor, error)
	GetAllSpecialities() ([]string, error)
	GetDoctorsNameBySpeciality(speciality string) ([]string, error)
}
