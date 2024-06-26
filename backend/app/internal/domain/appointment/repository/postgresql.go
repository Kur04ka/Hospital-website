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
		OrderBy("begins_at").
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
		OrderBy("begins_at").
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
			"status",
		).
		From(postgresql.AppointmentDetailsView).
		Where(sq.Eq{"patient_uuid": uuid}).
		Where(sq.Lt{"begins_at": time}).
		OrderBy("begins_at").
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
			&appointment.Status,
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

func (repo *appointmentRepository) GetAppointmentByID(id int) (model.Appointment, error) {
	log.Tracef("getting appointment by id: %d", id)

	var appointment model.Appointment
	sql, args, err := repo.qb.
		Select(
			"id",
			"doctor_name",
			"begins_at",
			"ends_at",
		).
		From(postgresql.AppointmentDetailsView).
		Where(sq.Eq{"id": id}).
		ToSql()
	if err != nil {
		err = psql.ErrCreateQuery(psql.ParsePgError(err))
		return model.Appointment{}, err
	}

	err = repo.client.QueryRow(context.TODO(), sql, args...).Scan(
		&appointment.Id,
		&appointment.DoctorName,
		&appointment.BeginsAt,
		&appointment.EndsAt,
	)
	if err != nil {
		err = psql.ErrDoQuery(psql.ParsePgError(err))
		return model.Appointment{}, err
	}

	log.Tracef("success getting appointment by id: %d", id)
	return appointment, nil
}

func (repo *appointmentRepository) AppointmentStatusChange(id int, status string) error {
	log.Trace("changing appointment status")

	sql, args, err := repo.qb.
		Update(postgresql.AppointmentTable).
		Set("status", status).
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
	log.Tracef("success changing appointment status with id %d", id)

	return nil
}

func (repo *appointmentRepository) GetUnmarkedDoctorAppointments(doctor_uuid string) ([]model.AppointmentDoctorView, error) {
	log.Tracef("getting unmarked appointments by doctor UUID %v", doctor_uuid)

	var appointments []model.AppointmentDoctorView

	sql, args, err := repo.qb.
		Select(
			"id",
			"doctor_uuid",
			"patient_name",
			"begins_at",
			"ends_at",
		).
		From(postgresql.DoctorAppointmentsView).
		Where(sq.Eq{"doctor_uuid": doctor_uuid}).
		Where(sq.Eq{"status": "pending"}).
		OrderBy("begins_at").
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
		var appointment model.AppointmentDoctorView

		if err := rows.Scan(
			&appointment.Id,
			&appointment.DoctorUuid,
			&appointment.PatientName,
			&appointment.BeginsAt,
			&appointment.EndsAt,
		); err != nil {
			err = psql.ErrScan(psql.ParsePgError(err))
			log.Trace("error scan row")

			return nil, err
		}

		appointments = append(appointments, appointment)
	}

	log.Tracef("success getting unmarked appointments by doctor UUID %v", doctor_uuid)

	return appointments, nil
}

// TODO: проверить что будет, если status = expired
func (repo *appointmentRepository) GetMarkedDoctorAppointments(doctor_uuid string) ([]model.AppointmentDoctorView, error) {
	log.Tracef("getting marked appointments by doctor UUID %v", doctor_uuid)

	var appointments []model.AppointmentDoctorView

	sql, args, err := repo.qb.
		Select(
			"id",
			"doctor_uuid",
			"patient_name",
			"begins_at",
			"ends_at",
			"status",
		).
		From(postgresql.DoctorAppointmentsView).
		Where(sq.Eq{"doctor_uuid": doctor_uuid}).
		Where(sq.NotEq{"status": "pending"}).
		OrderBy("begins_at").
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
		var appointment model.AppointmentDoctorView

		if err := rows.Scan(
			&appointment.Id,
			&appointment.DoctorUuid,
			&appointment.PatientName,
			&appointment.BeginsAt,
			&appointment.EndsAt,
			&appointment.Status,
		); err != nil {
			err = psql.ErrScan(psql.ParsePgError(err))
			log.Trace("error scan row")

			return nil, err
		}

		appointments = append(appointments, appointment)
	}

	log.Tracef("success getting marked appointments by doctor UUID %v", doctor_uuid)

	return appointments, nil
}
