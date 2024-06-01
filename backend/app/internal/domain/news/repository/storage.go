package repository

import "github.com/Kur04ka/hospital/internal/domain/news/model"

type Repository interface {
	GetAllNews() ([]model.News, error)
}
