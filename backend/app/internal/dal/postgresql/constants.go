package postgresql

const (
	scheme = "public"

	UsersTable            = scheme + ".users"
	VerificationDataTable = scheme + ".users_verification_data"
	DoctorTable           = scheme + ".doctor"
	AppointmentTable      = scheme + ".appointment"
	NewsTable             = scheme + ".news"
	ReviewTable           = scheme + ".review"
	CallRequestTable      = scheme + ".call_request"

	ReviewView               = scheme + ".review_view"
	AvailableAppointmentView = scheme + ".available_appointment_view"
	AppointmentDetailsView   = scheme + ".appointment_details_view"
)
