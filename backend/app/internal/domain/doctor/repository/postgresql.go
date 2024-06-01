package repository

import (
	"context"

	"github.com/Kur04ka/hospital/internal/dal/postgresql"
	"github.com/Kur04ka/hospital/internal/domain/doctor/model"
	psql "github.com/Kur04ka/hospital/pkg/postgresql"
	sq "github.com/Masterminds/squirrel"
	log "github.com/sirupsen/logrus"
)

type doctorRepository struct {
	qb     sq.StatementBuilderType
	client psql.PostgreSQLClient
}

func NewDoctorRepository(client psql.PostgreSQLClient) Repository {
	return &doctorRepository{
		qb:     sq.StatementBuilder.PlaceholderFormat(sq.Dollar), // Позволяет указывать аргументы в виде доллара: $1, $2, $3 и т.д
		client: client,
	}
}

func (repo *doctorRepository) GetAllDoctors() ([]model.Doctor, error) {
	log.Trace("getting all doctors")

	var doctors []model.Doctor

	sql, _, err := repo.qb.
		Select(
			"id",
			"fullname",
			"speciality",
			"description",
			"medical_degree",
			"work_experience",
			"is_head_doctor",
		).
		From(postgresql.DoctorTable).
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
		var doctor model.Doctor

		if err := rows.Scan(
			&doctor.ID,
			&doctor.Fullname,
			&doctor.Speciality,
			&doctor.Description,
			&doctor.MedicalDegree,
			&doctor.WorkExperience,
			&doctor.IsHeadDoctor,
		); err != nil {
			err = psql.ErrScan(psql.ParsePgError(err))
			log.Trace("error scan row")

			return nil, err
		}

		doctors = append(doctors, doctor)
	}

	log.Trace("success getting all doctors")

	return doctors, nil
}

func (repo *doctorRepository) GetAllSpecialities() ([]string, error) {
	log.Trace("getting all specialities")

	var specialities []string

	sql, _, err := repo.qb.
		Select("speciality").Distinct().
		From(postgresql.DoctorTable).
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
		var speciality string

		if err := rows.Scan(
			&speciality,
		); err != nil {
			err = psql.ErrScan(psql.ParsePgError(err))
			log.Trace("error scan row")

			return nil, err
		}

		specialities = append(specialities, speciality)
	}

	log.Trace("success getting all specialities")

	return specialities, nil
}

func (repo *doctorRepository)  GetDoctorsNameBySpeciality(speciality string) ([]string, error) {
	log.Trace("getting doctors by speciality")

	var specialities []string

	sql, args, err := repo.qb.
		Select("fullname").
		From(postgresql.DoctorTable).
		Where(sq.Eq{"speciality": speciality}).
		ToSql()
	if err != nil {
		err = psql.ErrCreateQuery(psql.ParsePgError(err))
		return nil, err
	}
	log.Tracef("sql: %q", sql)

	rows, err := repo.client.Query(context.TODO(), sql, args...)
	if err != nil {
		err = psql.ErrDoQuery(psql.ParsePgError(err))
		return nil, err
	}

	for rows.Next() {
		var speciality string

		if err := rows.Scan(
			&speciality,
		); err != nil {
			err = psql.ErrScan(psql.ParsePgError(err))
			log.Trace("error scan row")

			return nil, err
		}

		specialities = append(specialities, speciality)
	}

	log.Trace("success getting doctors by speciality")

	return specialities, nil
}