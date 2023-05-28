import React from "react";
import { useAuth } from "../../components/AuthContext";
import { UsersList } from "./UsersList";

export function Users() {
	const { currentUser } = useAuth();

	// Only render the component if the current user is an admin
	if (currentUser && currentUser.isAdmin) {
		return (
			<div className="container">
				<h1>All Users</h1>
				<UsersList />
			</div>
		);
	}

	// If the current user is not an admin, render an error message
	return <p>You do not have permission to view this page.</p>;
}
