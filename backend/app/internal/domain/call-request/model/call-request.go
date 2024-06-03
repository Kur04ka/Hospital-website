package model

import "time"

type CallRequest struct {
	Id          string    `json:"id"`
	Name        string    `json:"name"`
	Phone       string    `json:"phone"`
	RequestTime time.Time `json:"request_time"`
	Status      string    `json:"status"`
}
