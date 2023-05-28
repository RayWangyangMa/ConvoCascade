import React, { useState } from "react";
import "./LikeDislikeButtons.css";
import {
	likePost,
	dislikePost,
	likeReply,
	dislikeReply,
} from "./LikeDislikeAPI";

export function LikeDislikeButtons({
	type,
	id,
	initialLikes = 0,
	initialDislikes = 0,
}) {
	const [likes, setLikes] = useState(initialLikes);
	const [dislikes, setDislikes] = useState(initialDislikes);

	const handleLike = async () => {
		try {
			if (type === "post") {
				const response = await likePost(id);
				const updatedLikes = response.updatedLikes;
				if (updatedLikes !== null) {
					setLikes(updatedLikes);
				}
			} else if (type === "reply") {
				const response = await likeReply(id);
				const updatedLikes = response.updatedLikes;
				if (updatedLikes !== null) {
					setLikes(updatedLikes);
				}
			}
		} catch (error) {
			console.error("Error liking:", error);
		}
	};

	const handleDislike = async () => {
		try {
			if (type === "post") {
				const response = await dislikePost(id);
				const updatedDislikes = response.updatedDislikes;
				if (updatedDislikes !== null) {
					setDislikes(updatedDislikes);
				}
			} else if (type === "reply") {
				const response = await dislikeReply(id);
				const updatedDislikes = response.updatedDislikes;
				if (updatedDislikes !== null) {
					setDislikes(updatedDislikes);
				}
			}
		} catch (error) {
			console.error("Error disliking:", error);
		}
	};

	return (
		<div className="like-dislike-buttons">
			<div className="like-buttons">
				<button onClick={handleLike}>Like ({likes})</button>
			</div>
			<div className="dislike-buttons">
				<button onClick={handleDislike}>Dislike ({dislikes})</button>
			</div>
		</div>
	);
}
