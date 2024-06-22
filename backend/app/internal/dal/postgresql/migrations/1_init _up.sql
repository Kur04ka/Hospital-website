-- Active: 1717324317447@@127.0.0.1@5435@hospital
--------------------------- Migrate UP ---------------------------
SET TIMEZONE = 'Asia/Krasnoyarsk';
CREATE TABLE IF NOT EXISTS public.users (
	id UUID DEFAULT gen_random_uuid(),
	email TEXT NOT NULL UNIQUE,
	password TEXT NOT NULL,
	name TEXT NOT NULL,
	surname TEXT NOT NULL,
	sex TEXT NOT NULL,
	birth_date DATE NOT NULL,
	phone_number TEXT NOT NULL,
	created_at DATE NOT NULL,
	is_verified BOOL NOT NULL DEFAULT false,
	role TEXT NOT NULL DEFAULT 'user',
	PRIMARY KEY (id),
	CONSTRAINT sex_check CHECK (sex IN ('Мужчина', 'Женщина')),
	CONSTRAINT role_check CHECK (role IN ('patient', 'doctor'))
);

CREATE TABLE IF NOT EXISTS public.doctor (
	id SERIAL NOT NULL,
	user_id UUID NOT NULL,
	fullname TEXT NOT NULL,
	speciality TEXT NOT NULL,
	description TEXT NOT NULL,
	medical_degree TEXT NOT NULL,
	work_experience INT NOT NULL,
	PRIMARY KEY (id),
	CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id)
		ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS public.users_verification_data (
	email 		TEXT NOT NULL,
	code  		INT NOT NULL,
	expires_at 	TIMESTAMPTZ NOT NULL,
	PRIMARY KEY(email),
	CONSTRAINT fk_user_email FOREIGN KEY (email) REFERENCES users(email)
		ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS public.appointment (
	id SERIAL NOT NULL,
	patient_uuid UUID,
	doctor_id INT NOT NULL,
	begins_at TIMESTAMPTZ NOT NULL,
	ends_at TIMESTAMPTZ NOT NULL,
	is_available BOOL NOT NULL DEFAULT true,
	status TEXT NOT NULL DEFAULT 'pending',
	PRIMARY KEY (id),
	CONSTRAINT fk_user_uuid FOREIGN KEY (patient_uuid) REFERENCES users(id)
		ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_doctor_id FOREIGN KEY (doctor_id) REFERENCES doctor(id)
		ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT status_check CHECK (status IN ('pending', 'completed', 'no show', 'expired'))
);

CREATE TABLE IF NOT EXISTS public.news (
	id SERIAL NOT NULL,
	title TEXT NOT NULL,
	short_body TEXT NOT NULL,
	full_body TEXT NOT NULL,
	publication_date DATE NOT NULL,
	doctor_id INT NOT NULL,
	PRIMARY KEY (id),
	CONSTRAINT fk_doctor_id FOREIGN KEY (doctor_id) REFERENCES doctor(id)
		ON DELETE CASCADE ON UPDATE CASCADE 
);

CREATE TABLE IF NOT EXISTS public.review (
	id SERIAL NOT NULL,
	rating INT NOT NULL,
	patient_uuid UUID NOT NULL,
	doctor_id INT NOT NULL,
	body TEXT NOT NULL,
	publication_date DATE NOT NULL,
	PRIMARY KEY (id),
	CONSTRAINT valid_rating CHECK (rating > 0 AND rating <= 5),
	CONSTRAINT fk_user_uuid FOREIGN KEY (patient_uuid) REFERENCES users(id)
		ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_doctor_id FOREIGN KEY (doctor_id) REFERENCES doctor(id)
		ON DELETE CASCADE ON UPDATE CASCADE
);

 
CREATE TABLE IF NOT EXISTS public.call_request (
    id SERIAL PRIMARY KEY,
    name text NOT NULL,
    phone text NOT NULL,
    request_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'pending',
	CONSTRAINT status_check CHECK (status IN ('pending', 'completed', 'canceled'))
);

--------------------------- SELECT DATA ---------------------------

SELECT * FROM users;
SELECT * FROM doctor;
SELECT * FROM users_verification_data;
SELECT * FROM appointment;
SELECT * FROM news;
SELECT * FROM review;