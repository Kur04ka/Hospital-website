import { Box, Typography, IconButton } from "@mui/material";
import { NavLink } from "react-router-dom";
import styles from "./footer.module.css";
import { YouTube, Instagram, Pinterest, Telegram } from "@mui/icons-material";

const Footer = () => {
	return (
		<footer className={styles.main}>
			<Box
				display={"flex"}
				justifyContent={"space-between"}
				textAlign={"start"}
				padding={"1rem"}
			>
				<Box
					display={"flex"}
					alignItems={"start"}
					flexDirection={"column"}
					gap={"2rem"}
				>
					<Box
						display={"flex"}
						textAlign={"start"}
						justifyContent={"center"}
						gap={"2rem"}
					>
						<img src="/images/logo.png" alt="logo" height="80" />
						<Typography
							variant="h4"
							className={styles.company_name}
							component="div"
						>
							КЛИНИКА
							<br />
							ДОКТОРА ГОЛЬШТЕЙНА
						</Typography>
					</Box>
					<Typography
						variant="h6"
						style={{
							color: "rgba(209, 216, 223, 1)",
							fontFamily: "Gilroy medium",
						}}
						gutterBottom
					>
						Клиника с высококвалифицированными врачами, которым
						можно <br />
						доверить свое здоровье. Ваша жизнь в наших руках!
					</Typography>
				</Box>
				<Box
					display={"flex"}
					justifyContent={"space-between"}
					flexDirection={"column"}
					gap={"3rem"}
				>
					<Box
						display={"flex"}
						gap={"4rem"}
						justifyContent={"space-between"}
					>
						<Box display={"flex"} flexDirection={"column"}>
							<Typography
								variant="h5"
								gutterBottom
								fontFamily={"Gilroy"}
							>
								КЛИЕНТАМ
							</Typography>
							<NavLink to="/page-not-found">
								<Typography
									variant="body1"
									className={styles.typography}
									gutterBottom
								>
									Запись на прием
								</Typography>
							</NavLink>
							<NavLink to="/page-not-found">
								<Typography
									variant="body1"
									className={styles.typography}
									gutterBottom
								>
									Врачи
								</Typography>
							</NavLink>
							<NavLink to="/page-not-found">
								<Typography
									variant="body1"
									className={styles.typography}
									gutterBottom
								>
									Отзывы
								</Typography>
							</NavLink>
						</Box>
						<Box display={"flex"} flexDirection={"column"}>
							<Typography
								variant="h5"
								gutterBottom
								fontFamily={"Gilroy"}
							>
								О КОМПАНИИ
							</Typography>
							<NavLink to="/page-not-found">
								<Typography
									variant="body1"
									className={styles.typography}
									gutterBottom
								>
									О нас
								</Typography>
							</NavLink>
							<NavLink to="/page-not-found">
								<Typography
									variant="body1"
									className={styles.typography}
									gutterBottom
								>
									Контакты
								</Typography>
							</NavLink>
						</Box>
					</Box>
					<Box display={"flex"}>
						<Box
							sx={{
								display: "flex",
								gap: "2rem",
								textAlign: "center",
							}}
						>
							<Typography
								variant="h5"
								textAlign={"center"}
								fontFamily={"Gilroy"}
							>
								СОЦ. СЕТИ
							</Typography>
							<IconButton
								sx={{ color: "rgba(246, 237, 235, 1)" }}
							>
								<YouTube />
							</IconButton>
							<IconButton
								sx={{ color: "rgba(246, 237, 235, 1)" }}
							>
								<Instagram />
							</IconButton>
							<IconButton
								sx={{ color: "rgba(246, 237, 235, 1)" }}
							>
								<Pinterest />
							</IconButton>
							<IconButton
								sx={{ color: "rgba(246, 237, 235, 1)" }}
							>
								<Telegram />
							</IconButton>
						</Box>
					</Box>
				</Box>
			</Box>

			<Box
				display={"flex"}
				justifyContent={"space-between"}
				sx={{
					borderTop: "1px solid rgba(246, 237, 235, 1)",
					marginTop: "1rem",
					paddingTop: "1rem",
				}}
			>
				<NavLink to="/page-not-found">
					<Typography
						variant="subtitle1"
						className={styles.typography}
					>
						©2024. Все права защищены
					</Typography>
				</NavLink>

				<NavLink to="/page-not-found">
					<Typography
						variant="subtitle1"
						className={styles.typography}
					>
						Политика конфиденциальности
					</Typography>
				</NavLink>
			</Box>
		</footer>
	);
};

export default Footer;
