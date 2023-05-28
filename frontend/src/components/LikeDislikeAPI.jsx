// likedislikeAPI.jsx

export async function likePost(postId) {
	try {
		const response = await fetch(
			`http://localhost:3000/posts/${postId}/likes`,
			{
				method: "POST",
			}
		);

		if (!response.ok) {
			throw new Error("Error liking post");
		}

		const responseBody = await response.json();
		const updatedLikes = responseBody.likes;
		return { updatedLikes };
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function dislikePost(postId) {
	try {
		const response = await fetch(
			`http://localhost:3000/posts/${postId}/dislikes`,
			{
				method: "POST",
			}
		);

		if (!response.ok) {
			throw new Error("Error disliking post");
		}

		const responseBody = await response.json();
		const updatedDislikes = responseBody.dislikes;
		return { updatedDislikes };
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function likeReply(replyId) {
	try {
		const response = await fetch(
			`http://localhost:3000/replies/${replyId}/likes`,
			{
				method: "POST",
			}
		);

		if (!response.ok) {
			throw new Error("Error liking reply");
		}

		const responseBody = await response.json();
		const updatedLikes = responseBody.likes;
		return { updatedLikes };
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function dislikeReply(replyId) {
	try {
		const response = await fetch(
			`http://localhost:3000/replies/${replyId}/dislikes`,
			{
				method: "POST",
			}
		);

		if (!response.ok) {
			throw new Error("Error disliking reply");
		}

		const responseBody = await response.json();
		const updatedDislikes = responseBody.dislikes;
		return { updatedDislikes };
	} catch (error) {
		console.error(error);
		return null;
	}
}
