import React, { useEffect } from "react";
import {
	Box,
	FormControl,
	TextField,
	Typography,
	InputLabel,
	Select,
	MenuItem,
} from "@mui/material";
import { useUserStore } from "../../../../data/user/userStore";
import { formatDate } from "../../../../utils/date_parser";
import styles from "./user_info.module.css";

const UserInformation = () => {
	const { user, fetchUser } = useUserStore(); // Получаем пользователя и функцию загрузки из хранилища

	useEffect(() => {
		fetchUser(); // Вызываем функцию загрузки при монтировании компонента
	}, []);

	return (
		<Box
			display={"flex"}
			flexDirection={"column"}
			gap={"1rem"}
			padding={"3rem"}
			border={"3px solid rgba(238, 243, 248, 1)"}
			sx={{ borderRadius: "3rem" }}
		>
			<Typography
				variant="h4"
				sx={{ marginBottom: 4, textAlign: "start" }}
			>
				Личные данные
			</Typography>

			<Box
				display={"flex"}
				textAlign={"center"}
				justifyContent={"center"}
				gap={"3rem"}
				flexDirection={"column"}
			>
				<Box
					display={"flex"}
					gap={"3rem"}
					justifyContent={"space-between"}
				>
					<TextField
						className={styles.item}
						label="Имя"
						value={user.name}
						InputProps={{
							readOnly: true,
							sx: { borderRadius: "3rem" },
						}}
					/>
					<TextField
						className={styles.item}
						label="Фамилия"
						value={user.surname}
						InputProps={{
							readOnly: true,
							sx: { borderRadius: "3rem" },
						}}
					/>
					<FormControl className={styles.item}>
						<InputLabel>Пол</InputLabel>
						<Select
							label="Пол"
							value={user.sex}
							readOnly
							style={{ borderRadius: "3rem", textAlign: "start" }}
						>
							<MenuItem value={"Мужчина"}>Мужчина</MenuItem>
							<MenuItem value={"Женщина"}>Женщина</MenuItem>
						</Select>
					</FormControl>
				</Box>
				<Box
					display={"flex"}
					gap={"3rem"}
					justifyContent={"space-between"}
				>
					<TextField
						className={styles.item}
						label="Дата рождения"
						value={formatDate(user.birth_date)}
						InputProps={{
							readOnly: true,
							sx: { borderRadius: "3rem" },
						}}
					/>
					<TextField
						className={styles.item}
						label="Телефон"
						value={user.phone_number}
						InputProps={{
							readOnly: true,
							sx: { borderRadius: "3rem" },
						}}
					/>
					<TextField
						className={styles.item}
						label="Электронная почта"
						value={user.email}
						InputProps={{
							readOnly: true,
							sx: { borderRadius: "3rem" },
						}}
					/>
				</Box>
			</Box>
		</Box>
	);
};

export default UserInformation;
