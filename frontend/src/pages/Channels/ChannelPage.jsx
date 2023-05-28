// ChannelPage.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Post } from "../PostsPage/Post";
import { useAuth } from "../../components/AuthContext";
import { CreatePost } from "../PostsPage/CreatePost";
import "./ChannelPage.css";

export function ChannelPage() {
	const [channelData, setChannelData] = useState(null);
	const [posts, setPosts] = useState([]);
	const { currentUser } = useAuth();

	const channelId = useParams().channelId;

	useEffect(() => {
		fetchChannelData();
	}, [channelId]);

	const fetchChannelData = async () => {
		try {
			const response = await fetch(
				`http://localhost:3000/channels/${channelId}`
			);
			if (
				!response.headers
					.get("Content-Type")
					.startsWith("application/json")
			) {
				throw new Error("Received non-JSON response from the server");
			}

			const data = await response.json();
			setChannelData(data);
			setPosts(data.posts || []);
		} catch (error) {
			console.error("Error fetching channel data:", error);
		}
	};

	const handleDeletePost = async (postId) => {
		try {
			const response = await fetch(
				`http://localhost:3000/posts/${postId}`,
				{
					method: "DELETE",
				}
			);

			if (response.ok) {
				// If the post is deleted successfully, fetch the updated list of posts
				fetchChannelData();
			} else {
				throw new Error("Error deleting post");
			}
		} catch (error) {
			console.error("Error deleting post:", error);
		}
	};

	const handleNewReply = (postId, newReply) => {
		const updatedPosts = posts.map((post) => {
			if (post.id === postId) {
				return { ...post, replies: [...post.replies, newReply] };
			}
			return post;
		});
		setPosts(updatedPosts);
	};

	if (!channelData) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<h1>{channelData.name}</h1>
			<div className="channel-container">
				<CreatePost
					channelId={channelId}
					currentUser={currentUser}
					onNewPost={(post) => setPosts([...posts, post])}
				/>
				<br />
				<br />
				<h2>Post Lists</h2>
				<div className="posts">
					{/* Render posts */}
					{posts.map((post) => (
						<Post
							key={post.id}
							post={post}
							onDelete={handleDeletePost}
							onNewReply={handleNewReply}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
