package repository

import (
	"context"
	"time"

	"github.com/Kur04ka/hospital/internal/dal"
	"github.com/Kur04ka/hospital/internal/dal/postgresql"
	"github.com/Kur04ka/hospital/internal/domain/call-request/model"
	psql "github.com/Kur04ka/hospital/pkg/postgresql"
	sq "github.com/Masterminds/squirrel"
	log "github.com/sirupsen/logrus"
)

type callRequestRepository struct {
	qb     sq.StatementBuilderType
	client psql.PostgreSQLClient
}

func NewCallRequestRepository(client psql.PostgreSQLClient) Repository {
	return &callRequestRepository{
		qb:     sq.StatementBuilder.PlaceholderFormat(sq.Dollar), // Позволяет указывать аргументы в виде доллара: $1, $2, $3 и т.д
		client: client,
	}
}

func (repo *callRequestRepository) CreateCallRequest(callRequest model.CallRequest) error{
	log.Trace("creating call request")

	callRequest.RequestTime = time.Now().Local()
	sql, args, err := repo.qb.
		Insert(postgresql.CallRequestTable).
		Columns(
			"name",
			"phone",
			"request_time",
		).
		Values(
			&callRequest.Name,
			&callRequest.Phone,
			&callRequest.RequestTime,
		).ToSql()
	if err != nil {
		err = psql.ErrCreateQuery(psql.ParsePgError(err))
		return err
	}
	log.Tracef("sql: %q", sql)

	cmd, execErr := repo.client.Exec(context.TODO(), sql, args...)
	if execErr != nil {
		execErr = psql.ErrDoQuery(psql.ParsePgError(err))
		return execErr
	}
	if cmd.RowsAffected() == 0 {
		return dal.ErrNothingInserted
	}

	log.Tracef("rows affected: %d", cmd.RowsAffected())
	log.Trace("success creating call request")

	return nil
}
