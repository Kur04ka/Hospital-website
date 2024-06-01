package psql

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
	log "github.com/sirupsen/logrus"
)

type PostgreSQLClient interface {
	Begin(context.Context) (pgx.Tx, error)
	Query(ctx context.Context, sql string, args ...interface{}) (pgx.Rows, error)
	QueryRow(ctx context.Context, sql string, args ...interface{}) pgx.Row
	Exec(context.Context, string, ...any) (pgconn.CommandTag, error)
}

func NewClient(ctx context.Context, maxAttempts int, pgCfg *PgConfig) (pool *pgxpool.Pool, err error) {
	connString := fmt.Sprintf("postgresql://%s:%s@%s:%s/%s", pgCfg.username, pgCfg.password, pgCfg.host, pgCfg.port, pgCfg.database)

	pgxCfg, parseConfigErr := pgxpool.ParseConfig(connString)
	if parseConfigErr != nil {
		log.Infof("Unable to parse config: %v\n", parseConfigErr)
		return nil, parseConfigErr
	}

	pool, parseConfigErr = pgxpool.NewWithConfig(ctx, pgxCfg)
	if parseConfigErr != nil {
		log.Infof("Failed to parse PostgreSQL configuration due to error: %v\n", parseConfigErr)
		return nil, parseConfigErr
	}

	err = doWithAttempts(func() error {
		pingErr := pool.Ping(ctx)
		if pingErr != nil {
			log.Printf("Failed to connect to postgres due to error %v... Going to do the next attempt\n", pingErr)
			return pingErr
		}

		return nil
	}, maxAttempts, 5*time.Second)
	if err != nil {
		log.Fatal("All attempts are exceeded. Unable to connect to PostgreSQL")
	}

	return pool, nil
}

func doWithAttempts(fn func() error, attempts int, delay time.Duration) (err error) {
	for attempts > 0 {
		if err = fn(); err != nil {
			time.Sleep(delay)
			attempts--
			
			continue
		}
		
		return nil
	}
	
	return
}

type PgConfig struct {
	username string
	password string
	host     string
	port     string
	database string
}

func NewPgConfig(username, password, host, port, database string) *PgConfig {
	return &PgConfig{
		username,
		password,
		host,
		port,
		database,
	}
}