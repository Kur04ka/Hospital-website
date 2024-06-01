package common

import (
	"errors"

	"github.com/golang-jwt/jwt/v5"
)

const signingkey = "w0d@#a0wdWDAPWD;aw;@wa@!"

func ParseToken(accessToken string) (string, error) {
	token, err := jwt.ParseWithClaims(accessToken, &tokenClaims{}, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("invalid signing method")
		}

		return []byte(signingkey), nil
	})

	if err != nil {
		return "", err
	}

	claims, ok := token.Claims.(*tokenClaims)
	if !ok {
		return "", errors.New("token claims are not of type *tokenClaims")
	}

	if claims.UserId == "" {
		return "", errors.New("invalid token")
	}

	return claims.UserId, nil
}

type tokenClaims struct {
	jwt.MapClaims
	UserId string `json:"user_id"`
}
