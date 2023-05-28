import { useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
	const { currentUser } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!currentUser) {
			alert("You must be logged in to view this page");
			navigate("/login");
		}
	}, [currentUser, navigate]);

	return children;
}
