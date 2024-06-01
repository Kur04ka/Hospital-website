package model

import "time"

type News struct {
	ID              int       `json:"id"`
	Title           string    `json:"title"`
	ShortBody       string    `json:"short_body"`
	FullBody        string    `json:"full_body"`
	PublicationDate time.Time `json:"publication_date"`
}
