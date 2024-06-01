package model

import "time"

type VerificationData struct {
	Email     string    `json:"email"`
	Code      string    `json:"code"`
	ExpiresAt time.Time `json:"expires_at"`
}

func NewVerificationData(Email, Code string, ExpiresAt time.Time) *VerificationData {
	return &VerificationData{
		Email:     Email,
		Code:      Code,
		ExpiresAt: ExpiresAt,
	}
}
