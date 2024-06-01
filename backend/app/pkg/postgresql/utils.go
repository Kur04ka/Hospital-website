package psql

import (
	"fmt"
	"strings"

	"github.com/jackc/pgx/v5/pgconn"
	"github.com/pkg/errors"
)

func ParsePgError(err error) error {
	var pgErr *pgconn.PgError
	if errors.As(err, &pgErr) {
		pgErr = err.(*pgconn.PgError)

		return fmt.Errorf(
			"database error. message:%s, detail:%s, where:%s, sqlstate:%s",
			pgErr.Message,
			pgErr.Detail,
			pgErr.Where,
			pgErr.SQLState(),
		)
	}

	return err
}

func PrettySQL(q string) string {
	return strings.ReplaceAll(strings.ReplaceAll(q, "\t", ""), "\n", " ")
}
