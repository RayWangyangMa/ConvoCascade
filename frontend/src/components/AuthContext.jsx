import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
	return useContext(AuthContext);
}

export function AuthProvider({ children }) {
	const [currentUser, setCurrentUser] = useState(() => {
		const savedUser = localStorage.getItem("currentUser");
		const savedIsAdmin = localStorage.getItem("isAdmin") === "true";
		return savedUser
			? { username: savedUser, isAdmin: savedIsAdmin }
			: null;
	});

	useEffect(() => {
		if (currentUser) {
			localStorage.setItem("currentUser", currentUser.username);
			localStorage.setItem("isAdmin", currentUser.isAdmin);
		} else {
			localStorage.removeItem("currentUser");
			localStorage.removeItem("isAdmin");
		}
	}, [currentUser]);

	const value = {
		currentUser,
		setCurrentUser,
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
}
