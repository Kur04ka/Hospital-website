package repository

import (
	"github.com/Kur04ka/hospital/internal/domain/call-request/model"
)

type Repository interface {
	CreateCallRequest(CallRequst model.CallRequest) error 
}