package app

import (
	"context"
	"errors"
	"fmt"
	"net"
	"net/http"

	"github.com/Kur04ka/hospital/internal/config"
	appointmentHandler "github.com/Kur04ka/hospital/internal/domain/appointment/handler"
	appointmentRepository "github.com/Kur04ka/hospital/internal/domain/appointment/repository"
	authHandler "github.com/Kur04ka/hospital/internal/domain/auth/handler"
	authRepository "github.com/Kur04ka/hospital/internal/domain/auth/repository"
	callRequestHandler "github.com/Kur04ka/hospital/internal/domain/call-request/handler"
	callRequestRepository "github.com/Kur04ka/hospital/internal/domain/call-request/repository"
	doctorHandler "github.com/Kur04ka/hospital/internal/domain/doctor/handler"
	doctorRepository "github.com/Kur04ka/hospital/internal/domain/doctor/repository"
	newsHandler "github.com/Kur04ka/hospital/internal/domain/news/handler"
	newsRepository "github.com/Kur04ka/hospital/internal/domain/news/repository"
	reviewHandler "github.com/Kur04ka/hospital/internal/domain/review/handler"
	reviewRepository "github.com/Kur04ka/hospital/internal/domain/review/repository"
	psql "github.com/Kur04ka/hospital/pkg/postgresql"
	"github.com/julienschmidt/httprouter"
	"github.com/rs/cors"
	log "github.com/sirupsen/logrus"
	"golang.org/x/sync/errgroup"
)

type App struct {
	cfg        *config.Config
	router     *httprouter.Router
	httpServer *http.Server
}

func NewApp(cfg *config.Config) (*App, error) {
	log.Info("router initializing")
	router := httprouter.New()
	log.Info("success router initializing")

	log.Info("postgreSQL initializing")
	log.WithFields(log.Fields{
		"username": cfg.PostgreSQL.Username,
		"password": cfg.PostgreSQL.Password,
		"host":     cfg.PostgreSQL.Host,
		"port":     cfg.PostgreSQL.Port,
		"database": cfg.PostgreSQL.Database,
	}).Debug("postgresql credentials")

	pgCfg := psql.NewPgConfig(cfg.PostgreSQL.Username, cfg.PostgreSQL.Password, cfg.PostgreSQL.Host, cfg.PostgreSQL.Port, cfg.PostgreSQL.Database)
	client, err := psql.NewClient(context.Background(), 5, pgCfg)
	if err != nil {
		return nil, fmt.Errorf("failed to conect to postgresql database due to error: %q", err)
	}
	log.Info("success postgreSQL initializing")

	// Регистрация handler users
	authStorage := authRepository.NewAuthRepository(client)
	authHandler := authHandler.NewAuthHandler(authStorage)
	authHandler.Register(router)

	// Регистрация handler news
	newsStorage := newsRepository.NewNewsRepository(client)
	newsHandler := newsHandler.NewNewsHandler(newsStorage)
	newsHandler.Register(router)

	// Регистрация handler review
	reviewStorage := reviewRepository.NewReviewsRepository(client)
	reviewHandler := reviewHandler.NewReviewHandler(reviewStorage)
	reviewHandler.Register(router)

	// Регистрация handler doctor
	doctorStorage := doctorRepository.NewDoctorRepository(client)
	doctorHandler := doctorHandler.NewDoctorHandler(doctorStorage)
	doctorHandler.Register(router)

	// Регистрация handler appointment
	appointmentStorage := appointmentRepository.NewAppointmentRepository(client)
	appointmentHandler := appointmentHandler.NewAppointmentHandler(appointmentStorage)
	appointmentHandler.Register(router)

	// Регистрация handler call-request
	callRequestStorage := callRequestRepository.NewCallRequestRepository(client)
	callRequestHandler := callRequestHandler.NewCallRequestHandler(callRequestStorage)
	callRequestHandler.Register(router)

	// TODO: REGISTER HANDLERS

	return &App{
		cfg:    cfg,
		router: router,
	}, nil
}

func (a *App) Run(ctx context.Context) error {
	// Все жизненно необходимые сервисы необходимо запускать в errgroup
	grp, _ := errgroup.WithContext(ctx)
	grp.Go(func() error {
		return a.startHTTP()
	})
	log.Info("application is initialized and stated")

	return grp.Wait()
}

func (a *App) startHTTP() error {
	log.Info("creating listener")
	log.WithFields(log.Fields{
		"IP":   a.cfg.HTTP.IP,
		"Port": a.cfg.HTTP.Port,
	}).Debug("http listener credentials")
	listener, err := net.Listen("tcp", fmt.Sprintf("%s:%s", a.cfg.HTTP.IP, a.cfg.HTTP.Port))
	if err != nil {
		log.WithError(err).Fatal("failed to create listener")
	}

	log.WithFields(map[string]interface{}{
		"AllowedMethods":     a.cfg.HTTP.CORS.AllowedMethods,
		"AllowedOrigins":     a.cfg.HTTP.CORS.AllowedOrigins,
		"AllowCredentials":   a.cfg.HTTP.CORS.AllowCredentials,
		"AllowedHeaders":     a.cfg.HTTP.CORS.AllowedHeaders,
		"OptionsPassthrough": a.cfg.HTTP.CORS.OptionsPassthrough,
		"ExposedHeaders":     a.cfg.HTTP.CORS.ExposedHeaders,
		"Debug":              a.cfg.HTTP.CORS.Debug,
	})
	c := cors.New(cors.Options{
		AllowedMethods:     a.cfg.HTTP.CORS.AllowedMethods,
		AllowedOrigins:     a.cfg.HTTP.CORS.AllowedOrigins,
		AllowCredentials:   a.cfg.HTTP.CORS.AllowCredentials,
		AllowedHeaders:     a.cfg.HTTP.CORS.AllowedHeaders,
		OptionsPassthrough: a.cfg.HTTP.CORS.OptionsPassthrough,
		ExposedHeaders:     a.cfg.HTTP.CORS.ExposedHeaders,
		Debug:              a.cfg.HTTP.CORS.Debug,
	})

	handler := c.Handler(a.router)

	a.httpServer = &http.Server{
		Handler:      handler,
		WriteTimeout: a.cfg.HTTP.WriteTimeout,
		ReadTimeout:  a.cfg.HTTP.ReadTimeout,
	}

	log.Info("application completely initialized and started")

	if err = a.httpServer.Serve(listener); err != nil {
		switch {
		case errors.Is(err, http.ErrServerClosed):
			log.Warn("server shutdown")
		default:
			log.Fatal(err)
		}
	}

	err = a.httpServer.Shutdown(context.Background())
	if err != nil {
		log.Fatal(err)
	}

	return err
}
