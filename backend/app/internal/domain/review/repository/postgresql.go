package repository

import (
	"context"

	"github.com/Kur04ka/hospital/internal/dal/postgresql"
	reviewModel "github.com/Kur04ka/hospital/internal/domain/review/model"
	psql "github.com/Kur04ka/hospital/pkg/postgresql"
	sq "github.com/Masterminds/squirrel"
	log "github.com/sirupsen/logrus"
)

type reviewRepository struct {
	qb     sq.StatementBuilderType
	client psql.PostgreSQLClient
}

func NewReviewsRepository(client psql.PostgreSQLClient) Repository {
	return &reviewRepository{
		qb:     sq.StatementBuilder.PlaceholderFormat(sq.Dollar), // Позволяет указывать аргументы в виде доллара: $1, $2, $3 и т.д
		client: client,
	}
}

func (repo *reviewRepository) GetAllReviews() ([]reviewModel.Review, error) {
	log.Trace("getting all reviews")

	var reviews []reviewModel.Review

	sql, _, err := repo.qb.
		Select(
			"id",
			"rating",
			"user_name",
			"body",
			"publication_date",
		).
		From(postgresql.ReviewView).
		ToSql()
	if err != nil {
		err = psql.ErrCreateQuery(psql.ParsePgError(err))
		log.WithError(err).Trace("error create query")
		return nil, err
	}
	log.Tracef("sql: %q", sql)

	rows, err := repo.client.Query(context.TODO(), sql)
	if err != nil {
		err = psql.ErrDoQuery(psql.ParsePgError(err))
		log.WithError(err).Trace("error do query")
		return nil, err
	}

	for rows.Next() {
		var review reviewModel.Review

		if err := rows.Scan(
			&review.ID,
			&review.Rating,
			&review.UserName,
			&review.Body,
			&review.PublicationDate,
		); err != nil {
			err = psql.ErrScan(psql.ParsePgError(err))
			log.WithError(err).Trace("error scan row")

			return nil, err
		}

		reviews = append(reviews, review)
	}

	log.Trace("success getting all reviews")

	return reviews, nil
}