const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

require("dotenv").config();

const config = require("./Config/db");

const seeder = require("./Config/seeder");
seeder.adminseeder();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

const route = require("./Routes/apiRoutes");
app.use("/api", route);

const port = process.env.PORT || 4009;

app.listen(port, () => {
    console.log("My project is running on port " + port);
});