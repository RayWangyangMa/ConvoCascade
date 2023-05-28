import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { search } from "../../components/searchAPI";
import { useAuth } from "../../components/AuthContext";
import { AllUsersButton } from "../../components/AllUsersButton";
import { Rank } from "../../components/Rank";

import "./index.css";

export function Channels() {
	const [channels, setChannels] = useState([]);
	const [selectedChannel, setSelectedChannel] = useState(null);
	const navigate = useNavigate(); // Get the navigate function from React Router
	const [searchInput, setSearchInput] = useState("");
	const [searchResults, setSearchResults] = useState(null);
	const [searchOption, setSearchOption] = useState("all");
	const { currentUser } = useAuth();

	const handleSearchInputChange = async (event) => {
		setSearchInput(event.target.value);
		if (event.target.value.trim() !== "") {
			const results = await search(event.target.value, searchOption);
			setSearchResults(results);
		} else {
			setSearchResults(null);
		}
	};
	const renderSearchResults = () => {
		if (!searchResults) {
			return null;
		}

		if (searchResults.length === 0) {
			return <p>No results found.</p>;
		}

		const uniqueKeys = new Set();
		const uniqueResults = searchResults.filter((result) => {
			const key = `${result.channel_id}-${result.post_id}`;
			if (uniqueKeys.has(key)) {
				return false;
			} else {
				uniqueKeys.add(key);
				return true;
			}
		});

		return (
			<div className="search-results">
				{uniqueResults.map((result) => (
					<div
						key={`${result.channel_id}-${result.post_id}`}
						className="search-result"
					>
						<p>
							<strong>Channel:</strong>{" "}
							<Link to={`/channels/${result.channel_id}`}>
								{result.channel_name}
							</Link>
						</p>
						{result.post_id && (
							<p>
								<strong>Post:</strong> {result.post_content}
							</p>
						)}
					</div>
				))}
			</div>
		);
	};

	useEffect(() => {
		// Fetch the list of channels from the server
		// and update the 'channels' state.
		fetchChannels();
	}, []);

	const fetchChannels = async () => {
		try {
			const response = await fetch("http://localhost:3000/channels");
			const data = await response.json();
			// Sort the channels by the created_at column in ascending order
			data.sort(
				(a, b) => new Date(a.created_at) - new Date(b.created_at)
			);
			setChannels(data);
		} catch (error) {
			console.error("Error fetching channels:", error);
		}
	};

	const handleChannelSelect = (channelId) => {
		// Set the selected channel by ID and navigate to the corresponding channel page.
		setSelectedChannel(channelId);
		navigate(`/channels/${channelId}`);
	};

	const handleCreateChannel = async () => {
		// Prompt the user to enter a name for the new channel
		const channelName = prompt("Enter a name for the new channel:");

		if (channelName) {
			try {
				const response = await fetch(
					"http://localhost:3000/create-channel",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ name: channelName }),
					}
				);

				if (response.ok) {
					// If the channel is created successfully, fetch the updated list of channels
					fetchChannels();
				} else {
					throw new Error("Error creating channel");
				}
			} catch (error) {
				console.error("Error creating channel:", error);
			}
		}
	};

	const handleDeleteChannel = async (channelId) => {
		try {
			const response = await fetch(
				`http://localhost:3000/channels/${channelId}`,
				{
					method: "DELETE",
				}
			);

			if (response.ok) {
				// If the channel is deleted successfully, fetch the updated list of channels
				fetchChannels();
			} else {
				throw new Error("Error deleting channel");
			}
		} catch (error) {
			console.error("Error deleting channel:", error);
		}
	};

	return (
		<div className="container">
			<div className="search-form">
				<input
					type="text"
					value={searchInput}
					onChange={handleSearchInputChange}
					placeholder="Search..."
				/>
				<select
					value={searchOption}
					onChange={(e) => setSearchOption(e.target.value)}
				>
					<option value="all">All</option>
					<option value="username">Username</option>
					<option value="channel">Channel</option>
					<option value="post">Post</option>
					<option value="reply">Reply/Nested Reply</option>
				</select>
			</div>
			{renderSearchResults()}

			<div className="Channel">
				<AllUsersButton />
				<h1>List of the Channels: </h1>
				{/* Create channel button */}
				<button
					className="create-channel"
					onClick={handleCreateChannel}
				>
					Create Channel
				</button>

				<div className="channels">
					{/* Render channels in reverse order */}
					{channels.map((channel) => (
						<div key={channel.id} className="channel-row">
							<Link
								to={`/channels/${channel.id}`}
								className={`channel-name ${
									selectedChannel === channel.id
										? "selected"
										: ""
								}`}
								onClick={() => handleChannelSelect(channel.id)}
								style={{ display: "block" }}
							>
								{channel.name}
							</Link>
							{currentUser &&
								(currentUser.isAdmin === true ||
									currentUser.isAdmin === "true") && (
									<button
										className="delete-channel"
										onClick={(e) => {
											e.stopPropagation();
											handleDeleteChannel(channel.id);
										}}
									>
										Delete
									</button>
								)}
						</div>
					))}

					{/* Conditionally render the button to create a new channel */}
					{channels.length === 0 && (
						<div className="no-channels">
							<p>
								No channels available. Create one to get
								started.
							</p>
						</div>
					)}
				</div>
				<h1>Ranking</h1>
				<Rank />
			</div>
		</div>
	);
}
