// AllUsersButton.js
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

export function AllUsersButton() {
	const { currentUser } = useAuth();

	// Render the button only if the current user is an admin
	if (currentUser && currentUser.isAdmin) {
		return (
			<div className="all-users-button-wrapper">
				<Link to="/users" className="all-users-button-link">
					Manage Users
				</Link>
			</div>
		);
	}

	// If the current user is not an admin, don't render the button
	return null;
}
