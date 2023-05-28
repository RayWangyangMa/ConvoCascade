export async function search(query, option = "all") {
	try {
		const response = await fetch(
			`http://localhost:3000/search?query=${encodeURIComponent(
				query
			)}&option=${option}`
		);
		if (!response.ok) {
			throw new Error("Error searching channels and post contents");
		}
		const results = await response.json();
		return results;
	} catch (error) {
		console.error(error);
		return null;
	}
}
