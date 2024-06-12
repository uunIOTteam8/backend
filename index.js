require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Middleware
app.use(express.json()); // chomikuje (umoznuje pracovat s) req.body
app.use(cors({
	origin: "https://pills4u.netlify.app",
	credentials: true
})); // umoznuje komunikaci mezi frontendem a backendem
app.use(cookieParser()); // umoznuje pracovat s cookies

app.get("/", (req, res) => {
	res.send("Hello World!");
});

// Routes
const userRoutes = require("./controller/user-controller");
const deviceRoutes = require("./controller/device-controller");
const medicineRoutes = require("./controller/medicine-controller");
const medsTakerRoutes = require("./controller/medsTaker-controller");
const unitRoutes = require("./controller/unit-controller");
app.use("/user", userRoutes);
app.use("/device", deviceRoutes);
app.use("/medicine", medicineRoutes);
app.use("/medsTaker", medsTakerRoutes);
app.use("/unit", unitRoutes);

const port = process.env.PORT || 3001;

mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		app.listen(port, () => {
			console.log(`Server chilluje na portu ${port}. (http://localhost:${port}/)`);
		});
	})
	.catch((err) => console.log(err));
