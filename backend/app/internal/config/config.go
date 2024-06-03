package config

import (
	"sync"
	"time"

	"github.com/ilyakaznacheev/cleanenv"
	log "github.com/sirupsen/logrus"
)

type Config struct {
	IsDebug       bool `yaml:"is_debug"`
	IsDevelopment bool `yaml:"is_dev"`

	HTTP struct {
		IP           string        `yaml:"ip"`
		Port         string        `yaml:"port"`
		ReadTimeout  time.Duration `yaml:"read_timeout"`
		WriteTimeout time.Duration `yaml:"write_timeout"`
		CORS         struct {
			AllowedMethods     []string `yaml:"allowed_methods"`
			AllowedOrigins     []string `yaml:"allowed_origins"`
			AllowCredentials   bool     `yaml:"allow_credentials"`
			AllowedHeaders     []string `yaml:"allowed_headers"`
			OptionsPassthrough bool     `yaml:"options_pass_through"`
			ExposedHeaders     []string `yaml:"exposed_headers"`
			Debug              bool     `yaml:"debug"`
		} `yaml:"cors"`
	} `yaml:"http"`

	AppConfig struct {
		LogLevel  string `yaml:"log_level"`
		AdminUser struct {
			Email    string `yaml:"admin_email"`
			Password string `yaml:"admin_pwd"`
		} `yaml:"admin_user"`
	} `yaml:"app_config"`

	PostgreSQL struct {
		Username string `yaml:"psql_username"`
		Password string `yaml:"psql_password"`
		Host     string `yaml:"psql_host"`
		Port     string `yaml:"psql_port"`
		Database string `yaml:"psql_database"`
	} `yaml:"postgresql"`
}

const (
	pathToConfigWithDocker = "/config.yml"
	pathToConfigLocal = "../../../config/config.yml"
)

var instance *Config
var once sync.Once

func GetConfig() *Config {
	once.Do(func() {
		instance = &Config{}
		if err := cleanenv.ReadConfig(pathToConfigWithDocker, instance); err != nil {
			helpText := "Error occured while reading config"
			help, _ := cleanenv.GetDescription(instance, &helpText)
			log.Info(help)
			log.Fatal(err)
		}
	})

	return instance
}
