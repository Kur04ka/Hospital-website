package model

import "time"

type Review struct {
	ID              int       `json:"id"`
	Rating          int       `json:"rating"`
	UserName        string    `json:"user_name"`
	Body            string    `json:"body"`
	PublicationDate time.Time `json:"publication_date"`
}
