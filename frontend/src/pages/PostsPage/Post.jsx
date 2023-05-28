import React, { useState, useEffect } from "react";
import { useAuth } from "../../components/AuthContext";
import { LikeDislikeButtons } from "../../components/LikeDislikeButtons";

import "./Post.css";

export function Post({ post, onDelete }) {
	const [replies, setReplies] = useState(post.replies || []);
	const [newReplyContent, setNewReplyContent] = useState({});
	const [showReplies, setShowReplies] = useState(false);
	const { currentUser } = useAuth();

	const handleToggleReplies = () => {
		setShowReplies(!showReplies);
	};
	useEffect(() => {
		async function fetchReplies() {
			try {
				const response = await fetch(
					`http://localhost:3000/posts/${post.id}/replies`
				);

				if (response.ok) {
					const fetchedReplies = await response.json();
					setReplies(fetchedReplies);
				} else {
					throw new Error("Error fetching replies");
				}
			} catch (error) {
				console.error("Error fetching replies:", error);
			}
		}

		fetchReplies();
	}, [post.id]);

	const handleNewReplyContentChange = (event, replyId) => {
		setNewReplyContent({
			...newReplyContent,
			[replyId]: event.target.value,
		});
	};

	const handleSubmitNewReply = async (
		event,
		newReplyContent,
		parentReplyId = null
	) => {
		event.preventDefault();
		if (!newReplyContent[parentReplyId]) return;

		try {
			const response = await fetch(
				`http://localhost:3000/posts/${post.id}/replies`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						postId: post.id,
						content: newReplyContent[parentReplyId],
						username: currentUser.username,
						parentReplyId,
					}),
				}
			);

			if (response.ok) {
				const reply = await response.json();
				setReplies([...replies, reply]);
				setNewReplyContent((prevState) => {
					const newState = { ...prevState };
					delete newState[parentReplyId];
					return newState;
				});
			} else {
				throw new Error("Error submitting new reply");
			}
		} catch (error) {
			console.error("Error submitting new reply:", error);
		}
	};

	const renderReplies = (repliesList, parentReplyId = null) => {
		return repliesList
			.filter((reply) => reply.parent_reply_id === parentReplyId)
			.map((reply) => (
				<div key={reply.id} className="reply-container">
					<div className="reply-content">
						<p>{reply.content}</p>
					</div>
					<div className="reply-info">
						<div className="reply-username">
							Reply by: {reply.username}
						</div>
						<div className="reply-date">
							{new Date(reply.created_at).toLocaleString()}
						</div>
					</div>
					<div className="reply-actions">
						<LikeDislikeButtons
							key={`${reply.id}-reply-${reply.likes}-${reply.dislikes}`}
							type="reply"
							id={reply.id}
							initialLikes={reply.likes}
							initialDislikes={reply.dislikes}
						/>
						{currentUser &&
							(currentUser.isAdmin === true ||
								currentUser.isAdmin === "true") && (
								<button
									className="delete-reply"
									onClick={() => handleDeleteReply(reply.id)}
								>
									Delete
								</button>
							)}
					</div>
					<div className="nested-reply-form-container">
						<form
							onSubmit={(e) =>
								handleSubmitNewReply(
									e,
									newReplyContent,
									reply.id
								)
							}
							className="nested-reply-form"
						>
							<label htmlFor={`newReplyContent-${reply.id}`}>
								Nested Reply:
							</label>
							<textarea
								id={`newReplyContent-${reply.id}`}
								value={newReplyContent[reply.id] || ""}
								onChange={(e) =>
									handleNewReplyContentChange(e, reply.id)
								}
							/>
							<button type="submit">Submit</button>
						</form>
					</div>
					<div className="nested-replies">
						{renderReplies(repliesList, reply.id)}
					</div>
				</div>
			));
	};

	const handleDeleteReply = async (id) => {
		try {
			const response = await fetch(
				`http://localhost:3000/replies/${id}`,
				{
					method: "DELETE",
				}
			);
			if (response.ok) {
				setReplies(replies.filter((reply) => reply.id !== id));
			} else {
				throw new Error("Error deleting reply");
			}
		} catch (error) {
			console.error("Error deleting reply:", error);
		}
	};

	return (
		<div className="post-container">
			<div className="post">
				<div>
					<div className="post-username">
						Posted by: {post.username}
					</div>
					<div className="post-topic">Topic: {post.topic}</div>
					<div className="post-content">{post.content}</div>
					<div className="post-date">
						{new Date(post.created_at).toLocaleString()}
					</div>
				</div>
				<LikeDislikeButtons
					key={`${post.id}-post-${post.likes}-${post.dislikes}`}
					type="post"
					id={post.id}
					initialLikes={post.likes}
					initialDislikes={post.dislikes}
				/>
				<button
					className="show-hide-replies"
					onClick={handleToggleReplies}
				>
					{showReplies ? "Hide Replies" : "Show Replies"}
				</button>
				{currentUser &&
					(currentUser.isAdmin === true ||
						currentUser.isAdmin === "true") && (
						<button
							className="delete-post"
							onClick={() => {
								if (onDelete) onDelete(post.id);
							}}
						>
							Delete
						</button>
					)}
				{showReplies && (
					<div className="replies-container">
						{/* Render reply form */}
						<form
							onSubmit={(e) =>
								handleSubmitNewReply(e, newReplyContent)
							}
						>
							<label htmlFor={`newReplyContent-${post.id}`}>
								Reply:
							</label>
							<textarea
								id={`newReplyContent-${post.id}`}
								value={newReplyContent[null] || ""}
								onChange={(e) =>
									handleNewReplyContentChange(e, null)
								}
							/>

							<button type="submit">Submit</button>
						</form>

						<div className="replies">
							<h2>Replies</h2>
							{/* Render replies */}
							{renderReplies(replies)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
