import { Route, Routes } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage/index";
import { Channels } from "./pages/Channels/index";
import { ChannelPage } from "./pages/Channels/ChannelPage";
import { Users } from "./pages/UserPage/Users";
import { LoginPage } from "./pages/LoginRegisterPage/LoginPage";
import { RegisterPage } from "./pages/LoginRegisterPage/RegisterPage";
import { AuthProvider } from "./components/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

function App() {
	return (
		<AuthProvider>
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/register" element={<RegisterPage />} />
				<Route
					path="/channels"
					element={
						<PrivateRoute>
							<Channels />
						</PrivateRoute>
					}
				/>
				<Route
					path="/channels/:channelId"
					element={
						<PrivateRoute>
							<ChannelPage />
						</PrivateRoute>
					}
				/>
				<Route
					path="/users"
					element={
						<PrivateRoute>
							<Users />
						</PrivateRoute>
					}
				/>
			</Routes>
		</AuthProvider>
	);
}

export default App;
