import React from "react";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./utils/route/privateRoute";
import Home from "./views/components/home";
import Login from "./views/components/auth/login";
import EmailVerification from "./views/components/auth/emailVerification";
import Register from "./views/components/auth/register";
import SuccessEmailVerification from "./views/components/auth/successEmailVerification";
import PageNotFound from "./views/components/page_not_found";
import PersonalAccount from "./views/components/personal_account";

function App() {
	return (
		<>
			<Routes>
				<Route element={<PrivateRoute />}>
					<Route
						path="/personal-account"
						element={<PersonalAccount />}
					/>
				</Route>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/verify-email" element={<EmailVerification />} />
				<Route
					path="/verify-email-success"
					element={<SuccessEmailVerification />}
				/>
				<Route path="/page-not-found" element={<PageNotFound />} />
			</Routes>
		</>
	);
}

export default App;
