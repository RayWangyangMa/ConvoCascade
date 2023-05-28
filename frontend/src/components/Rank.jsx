import React, { useState, useEffect } from "react";
import "./Rank.css";

export function Rank() {
	const [topUsers, setTopUsers] = useState([]);
	const [topPosts, setTopPosts] = useState([]);
	const [topReplies, setTopReplies] = useState([]);

	// Fetch data from the API
	const fetchData = async (endpoint, setData) => {
		try {
			const baseUrl = "http://localhost:3000";
			const response = await fetch(`${baseUrl}${endpoint}`);
			const data = await response.json();
			setData(data);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	// Fetch top users and top posts on component mount
	useEffect(() => {
		fetchData("/users/top", setTopUsers);
		fetchData("/posts/top", setTopPosts);
		fetchData("/replies/top", setTopReplies);
	}, []);

	return (
		<div className="rank">
			<div className="rank-container">
				<h2>Top Users</h2>
				<ol>
					{topUsers.map((user, index) => (
						<li key={index}>
							{user.username} - {user.post_count} posts
						</li>
					))}
				</ol>
			</div>

			<div className="rank-container">
				<h2>Top Posts</h2>
				<ol>
					{topPosts.map((post, index) => (
						<li key={index}>
							{post.topic} - {post.likes} likes
						</li>
					))}
				</ol>
			</div>

			<div className="rank-container">
				<h2>Top Replies</h2>
				<ol>
					{topReplies.map((reply, index) => (
						<li key={index}>
							{reply.content} - {reply.likes} likes
						</li>
					))}
				</ol>
			</div>
		</div>
	);
}
