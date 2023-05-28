const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors"); // Import cors package

const port = 3000;

const app = express();

// Enable CORS for all routes
app.use(cors());

app.use(bodyParser.json());

// Declare a connection variable for the MySQL database
let connection;

// Define an async function to connect to the MySQL database and create the required table
async function connect() {
	// Set up the MySQL connection
	connection = mysql.createConnection({
		host: "localhost",
		user: "root",
		password: "admin",
		port: "3306",
	});
	// Connect to the MySQL server
	connection.connect();
	// Create the database if it does not exist
	connection.query("CREATE DATABASE IF NOT EXISTS PostProject");
	// Use the postdb database
	connection.query("USE PostProject");

	// Create the user_auth table if it does not exist
	connection.query(`
	CREATE TABLE IF NOT EXISTS user_auth (
	id INT AUTO_INCREMENT PRIMARY KEY,
	username VARCHAR(255) UNIQUE NOT NULL,
	password VARCHAR(255) NOT NULL,
	isAdmin BOOLEAN DEFAULT FALSE
)
`);
	// Create the channels table if it does not exist
	connection.query(`
  CREATE TABLE IF NOT EXISTS channels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);
	// Create the posts table if it does not exist
	connection.query(`
  CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    channel_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    likes INT DEFAULT 0,
    dislikes INT DEFAULT 0,
    FOREIGN KEY (channel_id) REFERENCES channels(id) ON DELETE CASCADE
  )
`);

	// Create the replies table if it does not exist
	connection.query(`
  CREATE TABLE IF NOT EXISTS replies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    post_id INT NOT NULL,
    parent_reply_id INT,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    likes INT DEFAULT 0,
    dislikes INT DEFAULT 0,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_reply_id) REFERENCES replies(id) ON DELETE CASCADE
  )
`);
}
// Call the connect function to set up the database connection and table
connect();

// Handle POST requests to /register by inserting the user's credentials into the user_auth table
app.post("/register", (req, res) => {
	const { username, password } = req.body;

	connection.query(
		"INSERT INTO user_auth (username, password, isAdmin) VALUES (?, ?, ?)",
		[username, password, false],
		(error, results, fields) => {
			if (error) {
				console.error(error);
				res.status(500).send("Error registering user");
			} else {
				// Get the inserted user's id
				const userId = results.insertId;

				// Create a user object with the necessary data
				const user = {
					id: userId,
					username: username,
					isAdmin: false,
				};

				// Send the user object as the response
				res.status(200).json(user);
			}
		}
	);
});
// Handle POST requests to /login by checking the user's credentials against the user_auth table
app.post("/login", (req, res) => {
	const { username, password } = req.body;

	// Hardcoded admin user
	const adminUser = {
		id: 0,
		username: "admin",
		password: "admin",
		isAdmin: true,
	};

	if (username === adminUser.username && password === adminUser.password) {
		// Send the admin user's ID, username, and isAdmin status as a JSON object
		res.json({
			id: adminUser.id,
			username: adminUser.username,
			isAdmin: adminUser.isAdmin,
		});
	} else {
		connection.query(
			"SELECT * FROM user_auth WHERE username = ? AND password = ?",
			[username, password],
			(error, results, fields) => {
				if (error) {
					console.error(error);
					res.status(500).send("Error checking credentials");
				} else {
					if (results.length > 0) {
						// Send the user's ID, username, and isAdmin status as a JSON object
						res.json({
							id: results[0].id,
							username: results[0].username,
							isAdmin: results[0].isAdmin,
						});
					} else {
						res.status(401).send("Invalid username or password");
					}
				}
			}
		);
	}
});

// Handle get all the user into a page
app.get("/users", (req, res) => {
	// Retrieve all users from the 'user_auth' table
	connection.query("SELECT * FROM user_auth", (error, results, fields) => {
		if (error) {
			res.status(500).send("Error getting user data");
		} else {
			res.json(results);
		}
	});
});

// Handle delete user
app.delete("/users/:userId", (req, res) => {
	const { userId } = req.params;

	connection.query(
		"DELETE FROM user_auth WHERE id = ?",
		[userId],
		(error, results, fields) => {
			if (error) {
				console.error(error);
				res.status(500).send("Error deleting user");
			} else {
				if (results.affectedRows === 0) {
					res.status(404).send("User not found");
				} else {
					res.status(200).send("User deleted");
				}
			}
		}
	);
});

// Handle GET requests to /channels by returning all channels from the channels table
app.get("/channels", (req, res) => {
	// Retrieve all channels from the channels table
	connection.query(
		"SELECT * FROM channels ORDER BY created_at DESC",
		(error, results, fields) => {
			// If there is an error, log it to the console and send a 500 response
			if (error) {
				console.error(error);
				res.status(500).send("Error getting channels");
			} else {
				res.json(results);
			}
		}
	);
});

// Handle POST requests to create a new channel
app.post("/create-channel", (req, res) => {
	const { name } = req.body;

	connection.query(
		"INSERT INTO channels (name) VALUES (?)",
		[name],
		(error, results, fields) => {
			if (error) {
				console.error(error);
				res.status(500).send("Error creating channel");
			} else {
				res.status(201).send("Channel created"); // Return a status of 201 (Created)
			}
		}
	);
});

// Handle DELETE requests to delete a channel
app.delete("/channels/:channelId", (req, res) => {
	const { channelId } = req.params;

	connection.query(
		"DELETE FROM channels WHERE id = ?",
		[channelId],
		(error, results, fields) => {
			if (error) {
				console.error(error);
				res.status(500).send("Error deleting channel");
			} else {
				if (results.affectedRows === 0) {
					res.status(404).send("Channel not found");
				} else {
					res.status(200).send("Channel deleted");
				}
			}
		}
	);
});

// Handle GET requests to retrieve channels
app.get("/channels/:channelId", (req, res) => {
	const channelId = req.params.channelId;
	// Retrieve the channel from the channels table
	connection.query(
		"SELECT * FROM channels WHERE id = ?",
		[channelId],
		(error, channelResults, fields) => {
			if (error) {
				console.error(error);
				res.status(500).send("Error getting channel data");
			} else {
				if (channelResults.length === 0) {
					res.status(404).send("Channel not found");
					return;
				}
				const channelData = channelResults[0];
				// Retrieve all posts from the posts table for the specified channel
				connection.query(
					"SELECT * FROM posts WHERE channel_id = ? ORDER BY created_at DESC",
					[channelId],
					(error, postResults, fields) => {
						if (error) {
							console.error(error);
							res.status(500).send("Error getting posts");
						} else {
							// Attach the posts to the channel data and send as JSON
							channelData.posts = postResults;
							res.json(channelData);
						}
					}
				);
			}
		}
	);
});

// Handle DELETE requests to delete a channel
app.delete("/channels/:channelId", (req, res) => {
	const { channelId } = req.params;

	connection.query(
		"DELETE FROM channels WHERE id = ?",
		[channelId],
		(error, results, fields) => {
			if (error) {
				console.error(error);
				res.status(500).send("Error deleting channel");
			} else {
				if (results.affectedRows === 0) {
					res.status(404).send("Channel not found");
				} else {
					res.status(200).send("Channel deleted");
				}
			}
		}
	);
});

// Handle GET requests to create a post
app.post("/channels/:channelId/posts", async (req, res) => {
	// Log the username received in the request body
	const { channelId } = req.params;
	const { topic, content, username } = req.body;

	connection.query(
		"INSERT INTO posts (topic, content, channel_id, username) VALUES (?, ?, ?, ?)",
		[topic, content, channelId, username],
		(error, results, fields) => {
			if (error) {
				console.error(error);
				res.status(500).send("Error creating post");
			} else {
				const insertId = results.insertId;
				// Retrieve all posts from the posts table for the specified channel
				connection.query(
					"SELECT * FROM posts WHERE channel_id = ? ORDER BY created_at DESC",
					[channelId],
					(error, postResults, fields) => {
						if (error) {
							console.error(error);
							res.status(500).send(
								"Error fetching the created post"
							);
						} else {
							const createdPost = postResults.find(
								(post) => post.id === insertId
							);
							res.status(201).json(createdPost);
						}
					}
				);
			}
		}
	);
});

// Handle DELETE requests to delete a post
app.delete("/posts/:postId", (req, res) => {
	const { postId } = req.params;

	connection.query(
		"DELETE FROM posts WHERE id = ?",
		[postId],
		(error, results, fields) => {
			if (error) {
				console.error(error);
				res.status(500).send("Error deleting post");
			} else {
				if (results.affectedRows === 0) {
					res.status(404).send("Post not found");
				} else {
					res.status(200).send("Post deleted");
				}
			}
		}
	);
});

// Handle GET requests to retrieve replies for a post
app.get("/posts/:postId/replies", (req, res) => {
	const { postId } = req.params;

	connection.query(
		"SELECT * FROM replies WHERE post_id = ? ORDER BY created_at ASC",
		[postId],
		(error, results, fields) => {
			if (error) {
				console.error(error);
				res.status(500).send("Error fetching replies");
			} else {
				res.json(results);
			}
		}
	);
});

// Handle POST requests to create a reply
app.post("/posts/:postId/replies", (req, res) => {
	const { postId } = req.params;
	const { content, username, parentReplyId } = req.body;

	connection.query(
		"INSERT INTO replies (post_id, content, username, parent_reply_id) VALUES (?, ?, ?, ?)",
		[postId, content, username, parentReplyId],
		(error, results, fields) => {
			if (error) {
				console.error(error);
				res.status(500).send("Error adding reply");
			} else {
				const insertId = results.insertId;
				connection.query(
					"SELECT * FROM replies WHERE id = ?",
					[insertId],
					(error, replyResults, fields) => {
						if (error) {
							console.error(error);
							res.status(500).send(
								"Error fetching the created reply"
							);
						} else {
							res.status(201).json(replyResults[0]);
						}
					}
				);
			}
		}
	);
});

// Handle DELETE requests to delete a reply
app.delete("/replies/:replyId", async (req, res) => {
	const { replyId } = req.params;

	try {
		connection.query(
			"SELECT * FROM replies WHERE id = ?",
			[replyId],
			(error, results) => {
				if (error) {
					console.error(error);
					return res.status(500).send("Internal server error");
				}

				if (results.length === 0) {
					return res.status(404).send("Reply not found");
				}

				connection.query(
					"DELETE FROM replies WHERE id = ?",
					[replyId],
					(error, results) => {
						if (error) {
							console.error(error);
							return res
								.status(500)
								.send("Internal server error");
						}

						return res.status(204).send();
					}
				);
			}
		);
	} catch (error) {
		console.error(error);
		return res.status(500).send("Internal server error");
	}
});

function updateLikesOrDislikes(table, column, id, res) {
	connection.query(
		`UPDATE ${table} SET ${column} = ${column} + 1 WHERE id = ?`,
		[id],
		(error, results, fields) => {
			if (error) {
				console.error(error);
				res.status(500).send(`Error incrementing ${column}`);
			} else {
				connection.query(
					`SELECT ${column} FROM ${table} WHERE id = ?`,
					[id],
					(error, results, fields) => {
						if (error) {
							console.error(error);
							res.status(500).send(
								`Error fetching updated ${column}`
							);
						} else {
							res.send({ [column]: results[0][column] });
						}
					}
				);
			}
		}
	);
}

// Handle POST requests to increment likes for a post
app.post("/posts/:postId/likes", (req, res) => {
	updateLikesOrDislikes("posts", "likes", req.params.postId, res);
});

// Handle POST requests to increment dislikes for a post
app.post("/posts/:postId/dislikes", (req, res) => {
	updateLikesOrDislikes("posts", "dislikes", req.params.postId, res);
});

// Handle POST requests to increment likes for a reply
app.post("/replies/:replyId/likes", (req, res) => {
	updateLikesOrDislikes("replies", "likes", req.params.replyId, res);
});

// Handle POST requests to increment dislikes for a reply
app.post("/replies/:replyId/dislikes", (req, res) => {
	updateLikesOrDislikes("replies", "dislikes", req.params.replyId, res);
});

// Handle GET requests to search functionality
app.get("/search", (req, res) => {
	const { query, option } = req.query;

	if (!query || !option) {
		return res.status(400).send("Missing query or option parameter");
	}

	// Modify the searchQuery based on the search option selected
	let searchQuery = "";
	const searchParams = [
		`%${query}%`,
		`%${query}%`,
		`%${query}%`,
		`%${query}%`,
	];

	if (option === "username") {
		searchQuery = `
		SELECT
		  c.id AS channel_id, c.name AS channel_name, p.id AS post_id, p.content AS post_content
		FROM
		  channels c
		  LEFT JOIN posts p ON c.id = p.channel_id
		WHERE p.username LIKE ?;
	  `;
		searchParams.pop(); // Remove the last parameter since we're only searching for username
	} else if (option === "channel") {
		searchQuery = `
		SELECT
		  c.id AS channel_id, c.name AS channel_name
		FROM channels c
		WHERE c.name LIKE ?;
	  `;
		searchParams.splice(1); // Remove all but the first parameter
	} else if (option === "post") {
		searchQuery = `
		SELECT
		  c.id AS channel_id, c.name AS channel_name, p.id AS post_id, p.content AS post_content
		FROM
		  channels c
		  LEFT JOIN posts p ON c.id = p.channel_id
		WHERE p.topic LIKE ? OR p.content LIKE ?;
	  `;
		searchParams.splice(2); // Remove the last two parameters
	} else if (option === "reply") {
		searchQuery = `
		SELECT
		  c.id AS channel_id, c.name AS channel_name, p.id AS post_id, p.content AS post_content
		FROM
		  channels c
		  LEFT JOIN posts p ON c.id = p.channel_id
		  LEFT JOIN replies r ON p.id = r.post_id
		WHERE r.content LIKE ?;
	  `;
		searchParams.splice(0, 3); // Remove the first three parameters
	} else {
		searchQuery = `
		SELECT
		  c.id AS channel_id, c.name AS channel_name, p.id AS post_id, p.content AS post_content
		FROM
		  channels c
		  LEFT JOIN posts p ON c.id = p.channel_id
		  LEFT JOIN replies r ON p.id = r.post_id
		WHERE c.name LIKE ? OR p.topic LIKE ? OR p.content LIKE ? OR r.content LIKE ?;
	  `;
	}

	connection.query(searchQuery, searchParams, (error, results, fields) => {
		if (error) {
			return res.status(500).send("Error executing search query");
		}
		res.send(results);
	});
});

// Handle GET requests to retrieve top users with the most posts
app.get("/users/top", (req, res) => {
	connection.query(
		`SELECT username, COUNT(id) AS post_count
	   FROM posts
	   GROUP BY username
	   ORDER BY post_count DESC
	   LIMIT 5`,
		(error, results, fields) => {
			if (error) {
				console.error(error);
				res.status(500).send("Error fetching top users");
			} else {
				res.json(results);
			}
		}
	);
});

// Handle GET requests to retrieve top posts with the most likes
app.get("/posts/top", (req, res) => {
	connection.query(
		`SELECT id, topic, content, channel_id, username, likes
	   FROM posts
	   ORDER BY likes DESC
	   LIMIT 5`,
		(error, results, fields) => {
			if (error) {
				console.error(error);
				res.status(500).send("Error fetching top posts");
			} else {
				res.json(results);
			}
		}
	);
});

// Handle GET requests to retrieve top replies with the most likes
app.get("/replies/top", (req, res) => {
	connection.query(
		`SELECT id, content, post_id, username, likes
	   FROM replies
	   ORDER BY likes DESC
	   LIMIT 5`,
		(error, results, fields) => {
			if (error) {
				console.error(error);
				res.status(500).send("Error fetching top replies");
			} else {
				res.json(results);
			}
		}
	);
});

// Start the server
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
