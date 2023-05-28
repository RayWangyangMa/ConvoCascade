import React from "react";
import { useNavigate } from "react-router-dom";
import { Register } from "./Register";
import { useAuth } from "../../components/AuthContext";

export function RegisterPage() {
	const navigate = useNavigate();
	const { setCurrentUser } = useAuth();
	const handleRegister = (user) => {
		setCurrentUser(user);
		navigate("/channels");
	};

	return (
		<div className="RegisterPage">
			<h1>Register</h1>
			<Register onRegister={handleRegister} />
			<p>
				Already have an account?{" "}
				<button
					className="switchButton"
					onClick={() => {
						navigate("/login");
					}}
				>
					Login
				</button>
			</p>
		</div>
	);
}
