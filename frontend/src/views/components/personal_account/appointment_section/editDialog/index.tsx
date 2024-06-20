import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import DialogTitle from "@mui/material/DialogTitle";
import React from "react";
import { useState } from "react";
import styles from "./dialog.module.css";
import DoctorScheduleDatePicker from "../../../make_appointment_form/scheduleDatePicker";
import { instance } from "../../../../../utils/axios";
import { useAppointmentStore } from "../../../../../data/appointment/appointmentStore";

interface ConfirmationDialogProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	old_appointmentId: number;
	doctorName: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
	open,
	setOpen,
	old_appointmentId,
	doctorName,
}) => {
	const { updateCurrentAppointment } = useAppointmentStore();
	const [selectedAppointmentId, setSelectedAppointmentId] = useState<
		number | null
	>(null);

	const handleClose = () => {
		setSelectedAppointmentId(null);
		setOpen(false);
	};

	const handleAppointmentSelect = (appointmentId: number) => {
		setSelectedAppointmentId(appointmentId);
	};

	const handleClick = async () => {
		if (selectedAppointmentId !== null) {
			try {
				updateCurrentAppointment(
					old_appointmentId,
					selectedAppointmentId,
				);
				handleClose();
			} catch (error) {
				console.error("Error creating appointment:", error);
			}
		}
	};

	return (
		<>
			<Dialog
				open={open}
				onClose={handleClose}
				PaperProps={{
					style: { borderRadius: "3rem", padding: "2.5rem" },
				}}
			>
				<DialogTitle className={styles.title}>
					<Typography
						variant="h4"
						gutterBottom
						className={styles.typography}
					>
						Изменить запись
					</Typography>
				</DialogTitle>
				<DialogContent>
					<Box display={"flex"} flexDirection={"column"} gap={"2rem"}>
						<TextField
							label="Доктор"
							defaultValue={doctorName}
							InputProps={{
								readOnly: true,
								sx: {
									color: "rgba(8, 44, 77, 1)",
									borderRadius: "2rem",
								},
							}}
						/>
						<DoctorScheduleDatePicker
							doctorName={doctorName}
							onAppointmentSelect={handleAppointmentSelect}
						/>
						<Button
							className={styles.button}
							fullWidth
							onClick={handleClick}
							disabled={!selectedAppointmentId}
							variant="contained"
						>
							Подтвердить
						</Button>
					</Box>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default ConfirmationDialog;
