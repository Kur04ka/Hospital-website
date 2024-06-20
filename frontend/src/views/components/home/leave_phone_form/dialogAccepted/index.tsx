import React from "react";
import { Dialog, DialogContent, DialogContentText } from "@material-ui/core";
import { Typography, Button } from "@mui/material";
import styles from "./dialog.module.css";

interface DialogAcceptedProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DialogAccepted: React.FC<DialogAcceptedProps> = ({ open, setOpen }) => {
	const handleClose = () => {
		setOpen(false);
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			PaperProps={{ style: { borderRadius: "3rem", padding: "2rem" } }}
		>
			<DialogContent>
				<DialogContentText>
					<Typography
						gutterBottom
						variant="h4"
						className={styles.dialog_item}
						sx={{ color: "rgba(19, 84, 147, 1);" }}
					>
						Ваша заявка успешно отправлена!
					</Typography>
					<Typography
						gutterBottom
						variant="h6"
						className={styles.dialog_item}
						sx={{ color: "rgba(137, 155, 181, 1)" }}
					>
						Ожидайте звонка от нашего специалиста в течение
						нескольких минут.
					</Typography>
				</DialogContentText>
			</DialogContent>
			<div className={styles.excellentContainer}>
				<Button
					className={styles.button}
					onClick={handleClose}
					variant="contained"
					style={{ width: "50%" }}
				>
					Отлично
				</Button>
			</div>
		</Dialog>
	);
};

export default DialogAccepted;
