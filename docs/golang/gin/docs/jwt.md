# JWT

```go
func generateToken(username string, secret string, period time.Duration) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, &UserClaim{
		username: username,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(period).Unix(),
		},
	})
	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		log.Println(err)
		return "", fmt.Errorf("cannot generate token")
	}
	return tokenString, nil
}

func VerifyToken(tokenString string) error {
	token, _ := jwt.ParseWithClaims(tokenString, &UserClaim{}, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("invalid token sign method")
		}
		return []byte(secret), nil
	})
	if _, ok := token.Claims.(*UserClaim); ok && token.Valid {
		return  nil
	}
	return fmt.Errorf("invalid token")
}
```
