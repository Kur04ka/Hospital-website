package handler

import (
	"fmt"
	"net/smtp"

	"github.com/jordan-wright/email"
	log "github.com/sirupsen/logrus"
)

const (
	server       = "smtp.gmail.com:587"
	host         = "smtp.gmail.com"
	mailFrom     = "ivan.kurochkin.084@gmail.com"
	mailPassword = "hiqecckzffwewzqc"
	hospitalName = "Клиника Доктора Гольштейна"
	subject      = "Код Подтверждения"
)

func sendVerificationCode(code int, mailTo string) error {
	log.Trace("sending email")

	e := email.Email{
		From:    fmt.Sprintf("%s <%s>", hospitalName, mailFrom),
		To:      []string{mailTo},
		Subject: subject,
		HTML:    []byte(fmt.Sprintf(`<h3>Здравствуйте!</h3><p>Вы указали адрес <b>%s</b> в качестве логина для веб-сайта "Клиника Доктора Гольштейна". Для подтверждения адреса введите вот этот код:<br><br><b>%d</b><br><br>Код действует три часа.<br><br>Если вы не регистрируетесь на веб-сайте "Клиника Доктора Гольштейна", просто не обращайте внимания на это письмо. Скорее всего, кто-то указал ваш адрес по ошибке.</p><p><i>С заботой о безопасности Вашего аккаунта,<br>IT команда "Клиника Доктора Гольштейна"</i></p>`, mailTo, code)),
	}

	err := e.Send(server, smtp.PlainAuth("", mailFrom, mailPassword, host))
	if err != nil {
		return err
	}

	log.Trace("success sending email")

	return nil
}
