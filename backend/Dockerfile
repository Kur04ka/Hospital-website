FROM golang:1.22-alpine AS builder

WORKDIR /usr/local/src

RUN apk --no-cache add bash git make gcc gettext musl-dev

# dependencies
COPY ["app/go.mod", "app/go.mod", "./"]
RUN go mod download

# build
COPY app ./
RUN go build -o ./bin/app cmd/app/main.go

FROM alpine

COPY --from=builder /usr/local/src/bin/app /
COPY config/config.yml /config.yml

CMD [ "/app" ]