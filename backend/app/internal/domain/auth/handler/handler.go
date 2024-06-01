package handler

import (
	"encoding/json"
	"errors"
	"math/rand"
	"net/http"
	"strconv"
	"time"

	"github.com/Kur04ka/hospital/internal/domain/auth/model"
	"github.com/Kur04ka/hospital/internal/domain/auth/repository"
	"github.com/Kur04ka/hospital/internal/domain/handlers"
	"github.com/Kur04ka/hospital/internal/middleware"
	"github.com/julienschmidt/httprouter"
	log "github.com/sirupsen/logrus"
)

type handler struct {
	repository repository.Repository
}

type tokenStruct struct {
	Token string `json:"token"`
}

func NewAuthHandler(repository repository.Repository) handlers.Handler {
	return &handler{
		repository: repository,
	}
}

func (h *handler) Register(router *httprouter.Router) {
	router.HandlerFunc(http.MethodPost, "/auth/sign-up", h.signUp)
	router.HandlerFunc(http.MethodPost, "/auth/sign-in", h.signIn)
	router.HandlerFunc(http.MethodPost, "/auth/sign-up/verifyemail", h.verifyEmail)
	router.HandlerFunc(http.MethodGet, "/user/user-details", middleware.AuthCheck(h.userDetails))
}

func (h *handler) userDetails(w http.ResponseWriter, r *http.Request) {
	uuid := r.Header.Get("user_id")

	user, err := h.repository.GetUserDetailsByUUID(uuid)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	data, err := json.Marshal(user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Write(data)
}

func (h *handler) verifyEmail(w http.ResponseWriter, r *http.Request) {
	var verificationData model.VerificationData

	err := json.NewDecoder(r.Body).Decode(&verificationData)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	actualVerificationData, err := h.repository.GetVerificationData(verificationData.Email)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	valid, err := h.compareVerificationData(actualVerificationData, verificationData)
	if !valid {
		http.Error(w, err.Error(), http.StatusNotAcceptable)
		return
	}

	err = h.repository.UpdateUserVerificationStatus(verificationData.Email, true)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	err = h.repository.DeleteVerificationData(actualVerificationData.Email)
	if err != nil {
		log.WithError(err).Trace("error deleting verification data")
	}

	w.WriteHeader(http.StatusAccepted)
}

func (h *handler) compareVerificationData(actualVerificationData, verificationData model.VerificationData) (bool, error) {
	// check for expiration
	if actualVerificationData.ExpiresAt.Before(time.Now()) {
		log.Trace("verification data provided is expired")
		err := h.repository.DeleteVerificationData(actualVerificationData.Email)
		if err != nil {
			log.WithError(err).Trace("unable to delete verification data from db")
		}
		return false, errors.New("confirmation code has expired. please try generating a new code")
	}

	if actualVerificationData.Code != verificationData.Code {
		log.Trace(actualVerificationData.Code, " ", verificationData.Code)
		log.Trace("verification of mail failed. Invalid verification code provided")
		return false, errors.New("verification code provided is invalid. please look in your mail for the code")
	}

	return true, nil
}

func (h *handler) signUp(w http.ResponseWriter, r *http.Request) {
	if r.Body == nil {
		http.Error(w, "Body is empty", http.StatusBadRequest)
		return
	}

	var user model.User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	exists, err := h.repository.UserExists(user.Email) 
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if exists {
		isVerified, err := h.repository.UserVerified(user.Email)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if isVerified {
			http.Error(w, "user with this email already exists and verified", http.StatusBadRequest)
			return
		} else {
			err := h.repository.DeleteUser(user.Email)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}
	}

	err = h.repository.CreateUser(&user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	code := rand.Intn(8999) + 1000
	err = sendVerificationCode(code, user.Email)
	if err != nil {
		log.WithError(err).Trace("failed to send verification code")
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	exists, err = h.repository.VerificationDataExists(user.Email)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if exists {
		err = h.repository.DeleteUser(user.Email)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	verificationData := model.NewVerificationData(user.Email, strconv.Itoa(code), time.Now().Add(3*time.Hour))

	err = h.repository.StoreVerificationData(verificationData)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusAccepted)
}

func (h *handler) signIn(w http.ResponseWriter, r *http.Request) {
	var user model.User

	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Проверка на существование в БД
	exists, err := h.repository.UserExists(user.Email)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if !exists {
		http.Error(w, "user doesn't exist, check input data", http.StatusBadRequest)
		return
	}

	// Проверка на наличие верификации
	isVerified, err := h.repository.UserVerified(user.Email)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if !isVerified {
		http.Error(w, "user is not verified", http.StatusUnauthorized)
		return
	}

	isPasswordCorrect, err := h.repository.IsUserPasswordCorrect(user.Email, user.Password)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if !isPasswordCorrect {
		http.Error(w, "invalid password, check input data", http.StatusUnauthorized)
		return
	}

	// Создание токена
	token, err := h.repository.GenerateToken(user.Email, user.Password)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	tokenStruct := tokenStruct{
		Token: token,
	}
	data, err := json.Marshal(tokenStruct)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Write(data)

	w.WriteHeader(http.StatusAccepted)
}
