package repository

import (
	"github.com/Kur04ka/hospital/internal/domain/auth/model"
)

type Repository interface {
	CreateUser(User *model.User) error
	GetUser(email, password string) (model.User, error)
	GetUserDetailsByUUID(uuid string) (model.UserDetails, error)
	UserExists(email string) (bool, error)
	DeleteUser(email string) error
	
	StoreVerificationData(verificationData *model.VerificationData) error
	GetVerificationData(email string) (model.VerificationData, error)
	DeleteVerificationData(email string) error
	UserVerified(email string) (bool, error)
	UpdateUserVerificationStatus(verificationEmail string, verificationStatus bool) error
	VerificationDataExists(email string) (bool, error)

	GenerateToken(email, password string) (signedToken string, role string, err error)
	IsUserPasswordCorrect(email, password string) (bool, error)
}
