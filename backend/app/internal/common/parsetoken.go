package common

import (
	"errors"

	"github.com/golang-jwt/jwt/v5"
)

const signingkey = "w0d@#a0wdWDAPWD;aw;@wa@!"

func ParseToken(accessToken string) (jwt.MapClaims, error) {
	token, err := jwt.ParseWithClaims(accessToken, jwt.MapClaims{}, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("invalid signing method")
		}
		return []byte(signingkey), nil
	})
	if err != nil {
		return nil, err
	}

	payload, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, errors.New("token claims are not of type jwt.MapClaims")
	}

	return payload, nil
}
