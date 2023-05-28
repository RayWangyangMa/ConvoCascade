import React from "react";
import { useNavigate } from "react-router-dom";
import { Login } from "./Login";
import { useAuth } from "../../components/AuthContext";

export function LoginPage() {
	const navigate = useNavigate();
	const { setCurrentUser } = useAuth();

	const handleLogin = (user) => {
		setCurrentUser(user);
		navigate("/channels");
	};
	return (
		<div className="LoginPage">
			<h1>Login</h1>
			<Login onLogin={handleLogin} />
			<p>
				Don't have an account?{" "}
				<button
					className="switchButton"
					onClick={() => {
						navigate("/register");
					}}
				>
					Register
				</button>
			</p>
		</div>
	);
}
