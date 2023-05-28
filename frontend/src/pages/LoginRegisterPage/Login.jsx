// Login.js
import React, { useState } from "react";
import "./Auth.css";

export function Login({ onLogin }) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		const response = await fetch("http://localhost:3000/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, password }),
		});

		if (response.status === 200) {
			const data = await response.json();
			onLogin(data);
		} else {
			alert("Invalid username or password");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="authForm">
			<input
				type="text"
				placeholder="Display/Username"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
			/>
			<input
				type="password"
				placeholder="Password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
			<button type="submit">Login</button>
		</form>
	);
}
