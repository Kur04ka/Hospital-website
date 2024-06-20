import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./verification.module.css";
import Header from "../../header";
import WomanWithHeart from "../../shared/womanWithHeart";
import { Button, Typography } from "@mui/material";
import ReactCodeInput from "react-verification-code-input";
import { instance } from "../../../../utils/axios";

const VerificationForm = () => {
	const [code, setCode] = useState("");
	const [error, setError] = useState("");
	const email = localStorage.getItem("email");
	const navigate = useNavigate();

	const handleChange = (code: string) => setCode(code);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(""); // Очистка предыдущей ошибки

		const verificationData = {
			email,
			code,
		};

		try {
			const response = await instance.post(
				"/auth/sign-up/verifyemail",
				verificationData,
			);
			if (response.status === 202) {
				localStorage.removeItem("email");
				navigate("/verify-email-success"); // Перенаправление на другую страницу при статусе 202
			}
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				if (error.response.status === 401) {
					setError("Пользователь не авторизован");
				} else {
					setError("Произошла ошибка. Попробуйте еще раз.");
				}
			} else {
				setError("Произошла ошибка. Попробуйте еще раз.");
			}
		}
	};

	return (
		<div className={styles.container_main}>
			<Header />
			<main className={styles.main}>
				<WomanWithHeart />
				<form
					className={styles.verification_container}
					onSubmit={handleSubmit}
				>
					<Typography
						variant="h3"
						component={"span"}
						sx={{ marginBottom: "1rem" }}
					>
						Подтверждение
					</Typography>
					<Typography
						variant="body1"
						component={"span"}
						sx={{ marginBottom: "1rem" }}
					>
						На вашу почту <b>{email}</b> был выслан 4-х значный код
						подтверждения
					</Typography>

					{error && (
						<Typography
							variant="body2"
							color="error"
							sx={{ marginBottom: "1rem" }}
						>
							{error}
						</Typography>
					)}
					<div className={styles.code_input}>
						<ReactCodeInput
							onChange={handleChange}
							fields={4}
							autoFocus
						/>
					</div>

					<Button
						type="submit"
						className={styles.button}
						fullWidth
						variant="contained"
					>
						Подтвердить
					</Button>
				</form>
			</main>
		</div>
	);
};

export default VerificationForm;
