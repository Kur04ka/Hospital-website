package repository

import (
	"context"

	"github.com/Kur04ka/hospital/internal/dal/postgresql"
	"github.com/Kur04ka/hospital/internal/domain/news/model"
	psql "github.com/Kur04ka/hospital/pkg/postgresql"
	sq "github.com/Masterminds/squirrel"
	log "github.com/sirupsen/logrus"
)

type newsRepository struct {
	qb     sq.StatementBuilderType
	client psql.PostgreSQLClient
}

func NewNewsRepository(client psql.PostgreSQLClient) Repository {
	return &newsRepository{
		qb:     sq.StatementBuilder.PlaceholderFormat(sq.Dollar), // Позволяет указывать аргументы в виде доллара: $1, $2, $3 и т.д
		client: client,
	}
}

func (repo *newsRepository) GetAllNews() ([]model.News, error) {
	log.Trace("getting all news")

	var news []model.News

	sql, _, err := repo.qb.
		Select(
			"id",
			"title",
			"short_body",
			"full_body",
			"publication_date",
		).
		From(postgresql.NewsTable).
		ToSql()
	if err != nil {
		err = psql.ErrCreateQuery(psql.ParsePgError(err))
		return nil, err
	}
	log.Tracef("sql: %q", sql)

	rows, err := repo.client.Query(context.TODO(), sql)
	if err != nil {
		err = psql.ErrDoQuery(psql.ParsePgError(err))
		return nil, err
	}

	for rows.Next() {
		var bitOfNews model.News

		if err := rows.Scan(
			&bitOfNews.ID,
			&bitOfNews.Title,
			&bitOfNews.ShortBody,
			&bitOfNews.FullBody,
			&bitOfNews.PublicationDate,
		); err != nil {
			err = psql.ErrScan(psql.ParsePgError(err))
			log.Trace("error scan row")

			return nil, err
		}

		news = append(news, bitOfNews)
	}

	log.Trace("success getting all news")

	return news, nil
}
