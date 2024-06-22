package repository

import (
	"context"
	"crypto/sha256"
	"fmt"
	"time"

	"github.com/Kur04ka/hospital/internal/dal"
	"github.com/Kur04ka/hospital/internal/dal/postgresql"
	"github.com/Kur04ka/hospital/internal/domain/auth/model"
	psql "github.com/Kur04ka/hospital/pkg/postgresql"
	sq "github.com/Masterminds/squirrel"
	"github.com/golang-jwt/jwt/v5"
	log "github.com/sirupsen/logrus"
)

type authRepository struct {
	qb     sq.StatementBuilderType
	client psql.PostgreSQLClient
}

const (
	salt       = "dkwf;ljewpop0f9s9pfjio2=[a]ca[fkaw]"
	signingkey = "w0d@#a0wdWDAPWD;aw;@wa@!"
	tokenTTL   = 12 * time.Hour
)

func NewAuthRepository(client psql.PostgreSQLClient) Repository {
	return &authRepository{
		qb:     sq.StatementBuilder.PlaceholderFormat(sq.Dollar), // Позволяет указывать аргументы в виде доллара: $1, $2, $3 и т.д
		client: client,
	}
}

func (repo *authRepository) CreateUser(user *model.User) error {
	log.Trace("creating user")

	user.Password = generatePasswordHash(user.Password)
	sql, args, err := repo.qb.
		Insert(postgresql.UsersTable).
		Columns(
			"email",
			"password",
			"name",
			"surname",
			"sex",
			"birth_date",
			"phone_number",
			"created_at",
		).
		Values(
			user.Email,
			user.Password,
			user.Name,
			user.Surname,
			user.Sex,
			user.Birthdate,
			user.PhoneNumber,
			user.Created_at,
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
	log.Trace("success creating user")

	return nil
}

func (repo *authRepository) GetUser(email, password string) (model.User, error) {
	log.Trace("getting user by email and password")

	var user model.User

	sql, args, err := repo.qb.
		Select(
			"id",
			"email",
			"password",
			"name",
			"surname",
			"sex",
			"birth_date",
			"phone_number",
			"created_at",
			"is_verified",
			"role",
		).
		From(postgresql.UsersTable).
		Where(sq.Eq{"email": email, "password": password}).
		ToSql()
	if err != nil {
		err = psql.ErrCreateQuery(psql.ParsePgError(err))
		return model.User{}, err
	}
	log.Tracef("sql: %q", sql)

	err = repo.client.QueryRow(context.Background(), sql, args...).Scan(
		&user.Id,
		&user.Email,
		&user.Password,
		&user.Name,
		&user.Surname,
		&user.Sex,
		&user.Birthdate,
		&user.PhoneNumber,
		&user.Created_at,
		&user.IsVerified,
		&user.Role,
	)
	if err != nil {
		err = psql.ErrScan(psql.ParsePgError(err))
		return model.User{}, err
	}

	log.Tracef("success getting user by email and password, user: %v", user)

	return user, nil
}

func (repo *authRepository) UserExists(email string) (bool, error) {
	log.Trace("checking if user exists")

	var exists bool

	sql := fmt.Sprintf("SELECT EXISTS(SELECT 1 FROM %s WHERE email='%s')", postgresql.UsersTable, email)
	log.Tracef("sql: %q", sql)

	err := repo.client.QueryRow(context.Background(), sql).Scan(&exists)
	if err != nil {
		err = psql.ErrScan(psql.ParsePgError(err))
		return false, err
	}

	log.Trace("success checking if user exists")

	return exists, nil
}

func (repo *authRepository) DeleteUser(email string) error {
	log.Trace("deleting user")

	sql, args, err := repo.qb.
		Delete(postgresql.UsersTable).
		Where(sq.Eq{"email": email}).
		ToSql()
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
	log.Trace("success deleting user")

	return nil
}

func (repo *authRepository) GetUserDetailsByUUID(uuid string) (model.UserDetails, error) {
	log.Trace("getting user by uuid")

	var user model.UserDetails

	sql, args, err := repo.qb.
		Select(
			"email",
			"name",
			"surname",
			"sex",
			"birth_date",
			"phone_number",
			"created_at",
		).
		From(postgresql.UsersTable).
		Where(sq.Eq{"id": uuid}).
		ToSql()
	if err != nil {
		err = psql.ErrCreateQuery(psql.ParsePgError(err))
		return model.UserDetails{}, err
	}
	log.Tracef("sql: %q", sql)

	err = repo.client.QueryRow(context.Background(), sql, args...).Scan(
		&user.Email,
		&user.Name,
		&user.Surname,
		&user.Sex,
		&user.Birthdate,
		&user.PhoneNumber,
		&user.Created_at,
	)
	if err != nil {
		err = psql.ErrScan(psql.ParsePgError(err))
		return model.UserDetails{}, err
	}

	log.Tracef("success getting user by uuid, user: %v", user)

	return user, nil
}

func (repo *authRepository) UpdateUserVerificationStatus(verificationEmail string, verificationStatus bool) error {
	log.Trace("updating user verification status")

	sql, args, err := repo.qb.
		Update(postgresql.UsersTable).
		Set("is_verified", verificationStatus).
		Where(sq.Eq{"email": verificationEmail}).ToSql()
	if err != nil {
		err = psql.ErrCreateQuery(psql.ParsePgError(err))
		return err
	}

	cmd, execErr := repo.client.Exec(context.TODO(), sql, args...)
	if execErr != nil {
		execErr = psql.ErrDoQuery(psql.ParsePgError(err))
		return execErr
	}
	if cmd.RowsAffected() == 0 {
		return dal.ErrNothingInserted
	}

	log.Trace("success updating user verification status")

	return nil
}

func (repo *authRepository) VerificationDataExists(email string) (bool, error) {
	log.Trace("checking if verification data exists")

	var exists bool

	sql := fmt.Sprintf("SELECT EXISTS(SELECT 1 FROM %s WHERE email='%s')", postgresql.VerificationDataTable, email)
	log.Tracef("sql: %q", sql)

	err := repo.client.QueryRow(context.Background(), sql).Scan(&exists)
	if err != nil {
		err = psql.ErrScan(psql.ParsePgError(err))
		return false, err
	}

	log.Trace("success checking if user exists")

	return exists, nil
}

func (repo *authRepository) StoreVerificationData(verificationData *model.VerificationData) error {
	log.Trace("storing verification data")

	sql, args, err := repo.qb.
		Insert(postgresql.VerificationDataTable).
		Columns(
			"email",
			"code",
			"expires_at",
		).
		Values(
			verificationData.Email,
			verificationData.Code,
			verificationData.ExpiresAt,
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
	log.Trace("success storing verification data")

	return nil
}

func (repo *authRepository) GetVerificationData(email string) (model.VerificationData, error) {
	log.Tracef("getting verification data for email: %s", email)

	var verificationData model.VerificationData

	sql, args, err := repo.qb.Select("*").
		From(postgresql.VerificationDataTable).
		Where(sq.Eq{"email": email}).
		ToSql()
	if err != nil {
		err = psql.ErrCreateQuery(psql.ParsePgError(err))
		return model.VerificationData{}, err
	}
	log.Tracef("sql: %q", sql)

	err = repo.client.QueryRow(context.Background(), sql, args...).Scan(
		&verificationData.Email,
		&verificationData.Code,
		&verificationData.ExpiresAt,
	)
	if err != nil {
		err = psql.ErrScan(psql.ParsePgError(err))
		return model.VerificationData{}, err
	}

	log.Tracef("success getting verificationData, verificationData: %v", verificationData)

	return verificationData, nil
}

func (repo *authRepository) DeleteVerificationData(email string) error {
	log.Trace("deleting verification data")

	sql, args, err := repo.qb.Delete(postgresql.VerificationDataTable).Where(sq.Eq{"email": email}).ToSql()
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

	log.Trace("success deleting verification data")

	return nil
}

func (repo *authRepository) UserVerified(email string) (bool, error) {
	log.Trace("checking if user is verified")

	var isVerified bool

	sql, args, err := repo.qb.
		Select("is_verified").
		From(postgresql.UsersTable).
		Where(sq.Eq{"email": email}).
		ToSql()
	if err != nil {
		err = psql.ErrCreateQuery(psql.ParsePgError(err))
		return false, err
	}
	log.Tracef("sql: %q", sql)

	err = repo.client.QueryRow(context.TODO(), sql, args...).Scan(&isVerified)
	if err != nil {
		err = psql.ErrScan(psql.ParsePgError(err))
		return false, err
	}

	log.Trace("success checking if user is verified")

	return isVerified, nil
}

func (repo *authRepository) GenerateToken(email, password string) (string, error) {
	user, err := repo.GetUser(email, generatePasswordHash(password))
	if err != nil {
		log.WithError(err).Error("error getting user")
		return "", err
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, &jwt.MapClaims{
		"exp":   time.Now().Add(tokenTTL).Unix(),
		"iat":   time.Now().Unix(),
		"role": user.Role,
		"ueid":  user.Id,
	})

	return token.SignedString([]byte(signingkey))
}

func (repo *authRepository) IsUserPasswordCorrect(email, password string) (bool, error) {
	log.Trace("checking if password is correct")

	var user model.User

	sql, args, err := repo.qb.
		Select("password").
		From(postgresql.UsersTable).
		Where(sq.Eq{"email": email}).
		ToSql()
	if err != nil {
		err = psql.ErrCreateQuery(psql.ParsePgError(err))
		return false, err
	}
	log.Tracef("sql: %q", sql)

	err = repo.client.QueryRow(context.Background(), sql, args...).Scan(
		&user.Password,
	)
	if err != nil {
		err = psql.ErrScan(psql.ParsePgError(err))
		return false, err
	}

	if generatePasswordHash(password) != user.Password {
		return false, nil
	}

	log.Tracef("success checking if password is correct")

	return true, nil
}

func generatePasswordHash(password string) string {
	hash := sha256.New()
	hash.Write([]byte(password))

	return fmt.Sprintf("%x", hash.Sum([]byte(salt)))
}
