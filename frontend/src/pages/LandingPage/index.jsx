import React from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

export function LandingPage() {
	const navigate = useNavigate();

	const handleGetStarted = () => {
		navigate("/login");
	};

	return (
		<div className="LandingPage">
			<h1>Welcome to my project of CMPT 353</h1>
			<p>
				This is the place that you can find the channel you like or
				create one if you want, and make posts with the people has the
				same interest as you.
			</p>
			<button className="getStartedButton" onClick={handleGetStarted}>
				Get Started
			</button>
		</div>
	);
}
