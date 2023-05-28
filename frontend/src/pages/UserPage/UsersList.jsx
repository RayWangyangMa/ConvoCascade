import React, { useState, useEffect } from "react";
import { useAuth } from "../../components/AuthContext";
import "./UsersList.css";

export function UsersList() {
	const { currentUser } = useAuth();
	const [users, setUsers] = useState([]);

	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		try {
			const response = await fetch("http://localhost:3000/users");
			const data = await response.json();
			setUsers(data);
		} catch (error) {
			console.error("Error fetching users:", error);
		}
	};

	const handleDeleteUser = async (id) => {
		try {
			const response = await fetch(`http://localhost:3000/users/${id}`, {
				method: "DELETE",
			});
			if (response.ok) {
				setUsers(users.filter((user) => user.id !== id));
			} else {
				console.error("Error deleting user");
			}
		} catch (error) {
			console.error("Error deleting user:", error);
		}
	};

	return (
		<>
			<table className="users-table">
				<thead>
					<tr>
						<th>Username</th>
						{currentUser && currentUser.isAdmin && (
							<th className="action-cell">Delete</th>
						)}
					</tr>
				</thead>
				<tbody>
					{users.map((user) => (
						<tr key={user.id}>
							<td>{user.username}</td>
							{currentUser && currentUser.isAdmin && (
								<td className="action-cell">
									<button
										onClick={() =>
											handleDeleteUser(user.id)
										}
									>
										Delete
									</button>
								</td>
							)}
						</tr>
					))}
				</tbody>
			</table>
		</>
	);
}
