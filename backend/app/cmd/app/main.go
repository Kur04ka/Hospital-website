package main

import (
	"context"
	"fmt"
	"os"
	"path"
	"runtime"

	"github.com/Kur04ka/hospital/internal/app"
	"github.com/Kur04ka/hospital/internal/config"
	log "github.com/sirupsen/logrus"
)

func init() {
	log.SetLevel(log.TraceLevel)
	log.SetReportCaller(true)

	log.SetFormatter(&log.TextFormatter{
		ForceColors:     true,
		TimestampFormat: "2006-01-02 15:04:05",
		FullTimestamp:   true,
		CallerPrettyfier: func(f *runtime.Frame) (string, string) {
			filename := path.Base(f.File)
			return fmt.Sprintf("%s()", f.Function), fmt.Sprintf("%s:%d", filename, f.Line)
		},
	})

	log.SetOutput(os.Stdout)
}

func main() {
	log.Info("getting config")
	cfg := config.GetConfig()
	log.Info("success getting config")

	app, err := app.NewApp(cfg)
	if err != nil {
		log.WithError(err).Fatal("app.NewApp")
	}

	err = app.Run(context.Background())
	if err != nil {
		log.WithError(err).Fatal("app.Run")
	}
}
