package repository

import (
	"github.com/Kur04ka/hospital/internal/domain/review/model"
)

type Repository interface {
	GetAllReviews() ([]model.Review, error)
}
