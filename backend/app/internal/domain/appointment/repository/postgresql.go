package repository

import (
	"context"
	"time"

	"github.com/Kur04ka/hospital/internal/dal"
	"github.com/Kur04ka/hospital/internal/dal/postgresql"
	"github.com/Kur04ka/hospital/internal/domain/appointment/model"
	psql "github.com/Kur04ka/hospital/pkg/postgresql"
	sq "github.com/Masterminds/squirrel"
	log "github.com/sirupsen/logrus"
)

type appointmentRepository struct {
	qb     sq.StatementBuilderType
	client psql.PostgreSQLClient
}

func NewAppointmentRepository(client psql.PostgreSQLClient) Repository {
	return &appointmentRepository{
		qb:     sq.StatementBuilder.PlaceholderFormat(sq.Dollar), // Позволяет указывать аргументы в виде доллара: $1, $2, $3 и т.д
		client: client,
	}
}

func (repo *appointmentRepository) GetAvailableAppointmentsByDoctorName(doctorName string) ([]model.Appointment, error) {
	log.Trace("getting appointments by doctor name")

	timeNow := time.Now().Local()

	var appointments []model.Appointment
	sql, args, err := repo.qb.
		Select(
			"id",
			"doctor_name",
			"begins_at",
			"ends_at",
		).
		From(postgresql.AvailableAppointmentView).
		Where(sq.Eq{"doctor_name": doctorName}).
		Where(sq.GtOrEq{"begins_at": timeNow}).
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
		var appointment model.Appointment

		if err := rows.Scan(
			&appointment.Id,
			&appointment.DoctorName,
			&appointment.BeginsAt,
			&appointment.EndsAt,
		); err != nil {
			err = psql.ErrScan(psql.ParsePgError(err))
			log.Trace("error scan row")

			return nil, err
		}

		appointments = append(appointments, appointment)
	}

	log.Trace("success getting appointments by doctor name")

	return appointments, nil
}

// Update Appointment, set patient_uuid = ? and is_available = false
func (repo *appointmentRepository) MakeAppointmentByUUID(appointmentID int, uuid string) error {
	log.Tracef("making an appointment for uuid %v", uuid)

	sql, args, err := repo.qb.
		Update(postgresql.AppointmentTable).
		Set("patient_uuid", uuid).
		Set("is_available", false).
		Where(sq.Eq{"id": appointmentID}).
		ToSql()
	if err != nil {
		err = psql.ErrCreateQuery(psql.ParsePgError(err))
		return err
	}
	log.Tracef("sql: %q", sql)

	cmd, err := repo.client.Exec(context.TODO(), sql, args...)
	if err != nil {
		err = psql.ErrDoQuery(psql.ParsePgError(err))
		return err
	}
	if cmd.RowsAffected() == 0 {
		return dal.ErrNothingInserted
	}

	log.Tracef("rows affected: %d", cmd.RowsAffected())
	log.Tracef("success making an appointment for uuid %v", uuid)

	return nil
}

func (repo *appointmentRepository) GetAllCurrentAppointmentsByUUID(uuid string) ([]model.Appointment, error) {
	log.Tracef("getting current appointments by user UUID %v", uuid)

	var appointments []model.Appointment
	time := time.Now().Local()

	sql, args, err := repo.qb.
		Select(
			"id",
			"doctor_name",
			"begins_at",
			"ends_at",
		).
		From(postgresql.AppointmentDetailsView).
		Where(sq.Eq{"patient_uuid": uuid}).
		Where(sq.GtOrEq{"begins_at": time}).
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
		var appointment model.Appointment

		if err := rows.Scan(
			&appointment.Id,
			&appointment.DoctorName,
			&appointment.BeginsAt,
			&appointment.EndsAt,
		); err != nil {
			err = psql.ErrScan(psql.ParsePgError(err))
			log.Trace("error scan row")

			return nil, err
		}

		appointments = append(appointments, appointment)
	}

	log.Tracef("success getting current appointments by user UUID %v", uuid)

	return appointments, nil
}

func (repo *appointmentRepository) GetAllArchieveAppointmentsByUUID(uuid string) ([]model.Appointment, error) {
	log.Tracef("getting archieve appointments by user UUID %v", uuid)

	var appointments []model.Appointment
	time := time.Now().Local()

	sql, args, err := repo.qb.
		Select(
			"id",
			"doctor_name",
			"begins_at",
			"ends_at",
		).
		From(postgresql.AppointmentDetailsView).
		Where(sq.Eq{"patient_uuid": uuid}).
		Where(sq.Lt{"begins_at": time}).
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
		var appointment model.Appointment

		if err := rows.Scan(
			&appointment.Id,
			&appointment.DoctorName,
			&appointment.BeginsAt,
			&appointment.EndsAt,
		); err != nil {
			err = psql.ErrScan(psql.ParsePgError(err))
			log.Trace("error scan row")

			return nil, err
		}

		appointments = append(appointments, appointment)
	}

	log.Tracef("success getting archieve appointments by user UUID %v", uuid)

	return appointments, nil
}

func (repo *appointmentRepository) MakeAppointmentFreeByID(id int) error {
	log.Tracef("making appointment free with id %d", id)

	sql, args, err := repo.qb.
		Update(postgresql.AppointmentTable).
		Set("patient_uuid", nil).
		Set("is_available", true).
		Where(sq.Eq{"id": id}).
		ToSql()
	if err != nil {
		err = psql.ErrCreateQuery(psql.ParsePgError(err))
		return err
	}
	log.Tracef("sql: %q", sql)

	cmd, err := repo.client.Exec(context.TODO(), sql, args...)
	if err != nil {
		err = psql.ErrDoQuery(psql.ParsePgError(err))
		return err
	}
	if cmd.RowsAffected() == 0 {
		return dal.ErrNothingInserted
	}

	log.Tracef("rows affected: %d", cmd.RowsAffected())
	log.Tracef("success making appointment free with id %d", id)

	return nil
}
