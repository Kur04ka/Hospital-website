-- Active: 1717324317447@@127.0.0.1@5435@hospital
CREATE OR REPLACE VIEW review_view AS
	SELECT review.id, rating, concat_ws(' ', name, surname) AS user_name, body, publication_date
	FROM review
	INNER JOIN users ON review.patient_uuid = users.id;
	
CREATE OR REPLACE VIEW available_appointment_view AS
	SELECT appointment.id, fullname AS doctor_name, begins_at, ends_at, is_available
	FROM doctor 
	INNER JOIN appointment ON doctor.id = appointment.doctor_id
	WHERE is_available = true;
	
CREATE OR REPLACE VIEW appointment_details_view AS
	SELECT appointment.id, patient_uuid, fullname AS doctor_name, begins_at, ends_at, is_available
	FROM doctor 
	INNER JOIN appointment ON doctor.id = appointment.doctor_id
	
CREATE OR REPLACE VIEW doctor_appointments_view AS
	SELECT appointment.id, doctor.user_id AS doctor_uuid, concat(name, ' ', surname) AS patient_name, begins_at, ends_at, status FROM appointment 
	INNER JOIN doctor ON appointment.doctor_id = doctor.id
	INNER JOIN users ON appointment.patient_uuid = users.id