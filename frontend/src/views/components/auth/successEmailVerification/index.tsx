import { NavLink } from "react-router-dom";
import { Typography, Button } from "@mui/material";
import Header from "../../header";
import styles from "./successVerification.module.css";

const SuccessVerificationForm = () => {
	return (
		<div className={styles.container}>
			<Header />
			<main className={styles.main}>
				<img
					src="/images/ok.png"
					alt="ok hand"
					height={400}
					className={styles.imageOk}
				/>

				<Typography
					variant="h5"
					component={"span"}
					sx={{ marginBottom: "1rem", color: "rgba(8, 44, 77, 1)" }}
				>
					Вы успешно зарегистрировались!
				</Typography>

				<NavLink to="/login" color="inherit">
					<Button className={styles.button} variant="contained">
						Войти
					</Button>
				</NavLink>
			</main>
		</div>
	);
};

export default SuccessVerificationForm;
