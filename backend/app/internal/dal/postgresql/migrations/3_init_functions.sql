CREATE OR REPLACE FUNCTION update_expired_appointments() RETURNS TRIGGER AS
$BODY$
BEGIN
	IF NEW.patient_uuid IS NULL AND NEW.begins_at < NOW() THEN 
		NEW.status = 'expired';
	END IF;
	RETURN NEW;
END;
$BODY$
LANGUAGE plpgsql;

CREATE TRIGGER set_expired_appointment
BEFORE INSERT OR UPDATE ON public.appointment
FOR EACH ROW
EXECUTE FUNCTION update_expired_appointments();