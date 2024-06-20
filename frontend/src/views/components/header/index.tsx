import React from "react";
import { Box, Button, Typography, Toolbar, AppBar } from "@mui/material";
import { NavLink } from "react-router-dom";
import styles from "./header.module.css";

const Header: React.FC = (): JSX.Element => {
	return (
		<AppBar
			component={"header"}
			position="static"
			sx={{ backgroundColor: "inherit" }}
		>
			<Toolbar className={styles.header}>
				<Box display="flex" sx={{ alignItems: "center" }}>
					<NavLink to="/" color="inherit">
						<img src="/images/logo.png" alt="logo" height="60" />
					</NavLink>
					<NavLink to="/" color="inherit">
						<Typography
							variant="h6"
							className={styles.company_name}
							component="div"
						>
							КЛИНИКА
							<br />
							ДОКТОРА ГОЛЬШТЕЙНА
						</Typography>
					</NavLink>
				</Box>
				<nav className={styles.nav}>
					<NavLink to="/" color="inherit">
						<Typography
							variant="body1"
							className={styles.gilroy_bold}
						>
							Главная
						</Typography>
					</NavLink>
					<NavLink to="/page-not-found" color="inherit">
						<Typography
							variant="body1"
							className={styles.gilroy_bold}
						>
							О нас
						</Typography>
					</NavLink>
					<NavLink to="/page-not-found" color="inherit">
						<Typography
							variant="body1"
							className={styles.gilroy_bold}
						>
							Врачи
						</Typography>
					</NavLink>
					<NavLink to="/page-not-found" color="inherit">
						<Typography
							variant="body1"
							className={styles.gilroy_bold}
						>
							Отзывы
						</Typography>
					</NavLink>
					<NavLink to="/page-not-found" color="inherit">
						<Typography
							variant="body1"
							className={styles.gilroy_bold}
						>
							Контакты
						</Typography>
					</NavLink>
				</nav>
				<Box display="flex" alignItems="center">
					<NavLink to="/personal-account" color="inherit">
						<Button variant="contained" className={styles.button}>
							{" "}
							Личный кабинет
						</Button>
					</NavLink>
				</Box>
			</Toolbar>
		</AppBar>
	);
};

export default Header;
