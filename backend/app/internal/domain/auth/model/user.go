package model

import "time"

type User struct {
	Id          string    `json:"id"`
	Email       string    `json:"email"`
	Password    string    `json:"password"`
	Name        string    `json:"name"`
	Surname     string    `json:"surname"`
	Sex         string    `json:"sex"`
	Birthdate   time.Time `json:"birth_date"`
	PhoneNumber string    `json:"phone_number"`
	Created_at  time.Time `json:"created_at"`
	IsVerified  bool      `json:"is_verified"`
}

type UserDetails struct {
	Email       string    `json:"email"`
	Name        string    `json:"name"`
	Surname     string    `json:"surname"`
	Sex         string    `json:"sex"`
	Birthdate   time.Time `json:"birth_date"`
	PhoneNumber string    `json:"phone_number"`
	Created_at  time.Time `json:"created_at"`
}

