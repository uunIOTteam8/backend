require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");

// Middleware
app.use(express.json()); // chomikuje (umoznuje pracovat s) req.body
app.use(cors()); // umoznuje komunikaci mezi frontendem a backendem

app.get("/", (req, res) => {
	res.send("Hello World!");
});

// Routes
const userRoutes = require("./controller/user-controller");
app.use("/user", userRoutes);


const port = process.env.PORT || 3001;

mongoose
	.connect(process.env.MONGO_URI)
	.then(console.log("Database connected."))
	.then(() => {
		app.listen(port, () => {
			console.log(`Server chilluje na portu ${port}. (http://localhost:${port}/)`);
		});
	})
	.catch((err) => console.log(err));
