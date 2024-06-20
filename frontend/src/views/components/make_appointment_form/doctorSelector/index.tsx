import React, { useState, useEffect } from "react";
import {
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	CircularProgress,
} from "@mui/material";
import { instance } from "../../../../utils/axios";

interface DoctorSelectorProps {
	speciality: string;
	onDoctorChange: (doctor: string) => void;
}

const DoctorSelector: React.FC<DoctorSelectorProps> = ({
	speciality,
	onDoctorChange,
}) => {
	const [doctors, setDoctors] = useState<string[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [selectedDoctor, setSelectedDoctor] = useState<string>("");

	useEffect(() => {
		if (speciality) {
			const fetchDoctors = async () => {
				setLoading(true);
				try {
					const response = await instance.get(
						`/doctors/doctor-by-speciality/${speciality}`,
					);
					setDoctors(response.data);
					setLoading(false);
				} catch (error) {
					console.error("Error fetching doctors:", error);
					setLoading(false);
				}
			};

			fetchDoctors();
		}
	}, [speciality]);

	const handleChange = (event: any) => {
		const doctor = event.target.value as string;
		setSelectedDoctor(doctor);
		onDoctorChange(doctor);
	};

	return (
		<FormControl
			fullWidth
			variant="outlined"
			disabled={!speciality}
			sx={{ color: "rgba(8, 44, 77, 1)" }}
		>
			<InputLabel
				style={{ fontFamily: "Gilroy", color: "rgba(8, 44, 77, 1)" }}
			>
				Доктор
			</InputLabel>
			{loading ? (
				<CircularProgress />
			) : (
				<Select
					value={selectedDoctor}
					onChange={handleChange}
					disabled={!speciality}
					label="Доктор"
					style={{
						borderRadius: "2rem",
						color: "rgba(8, 44, 77, 1)",
						fontFamily: "Gilroy medium",
					}}
				>
					{doctors.map((doctor, index) => (
						<MenuItem
							key={index}
							value={doctor}
							style={{
								color: "rgba(8, 44, 77, 1)",
								fontFamily: "Gilroy medium",
							}}
						>
							{doctor}
						</MenuItem>
					))}
				</Select>
			)}
		</FormControl>
	);
};

export default DoctorSelector;
