import React, { useState } from "react";
import "./CreatePost.css";

export function CreatePost({ channelId, currentUser, onNewPost }) {
	const [newPostTopic, setNewPostTopic] = useState("");
	const [newPostContent, setNewPostContent] = useState("");

	const handleNewPostContentChange = (event) => {
		setNewPostContent(event.target.value);
	};

	const handleSubmitNewPost = async (event) => {
		event.preventDefault();
		if (!newPostContent || !newPostTopic) return;

		try {
			const response = await fetch(
				`http://localhost:3000/channels/${channelId}/posts`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						topic: newPostTopic,
						content: newPostContent,
						username: currentUser.username,
					}),
				}
			);

			if (response.ok) {
				const post = await response.json();
				onNewPost(post);

				setNewPostContent(""); // Clear the content input field
				setNewPostTopic(""); // Clear the topic input field
			} else {
				throw new Error("Error submitting new post");
			}
		} catch (error) {
			console.error("Error submitting new post:", error);
		}
	};

	return (
		<div className="new-post-form">
			<h2>Create a new post</h2>
			<form onSubmit={handleSubmitNewPost}>
				<label htmlFor="newPostTopic">Topic:</label>
				<input
					type="text"
					id="newPostTopic"
					value={newPostTopic}
					onChange={(event) => setNewPostTopic(event.target.value)}
				/>
				<br />
				<label htmlFor="newPostContent">Content:</label>
				<textarea
					id="newPostContent"
					value={newPostContent}
					onChange={handleNewPostContentChange}
				/>
				<br />
				<button type="submit">Submit</button>
			</form>
		</div>
	);
}
