package model

type Doctor struct {
	ID             int    `json:"id"`
	Fullname       string `json:"fullname"`
	Speciality     string `json:"speciality"`
	Description    string `json:"description"`
	MedicalDegree  string `json:"medical_degree"`
	WorkExperience int    `json:"work_experience"`
	IsHeadDoctor   bool   `json:"is_head_doctor"`
}
