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
	
-- SELECT * FROM review_view;
-- SELECT * FROM available_appointment_view;
-- SELECT * FROM appointment ORDER BY id ASC;