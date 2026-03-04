const express = require("express")
const app = express()
const port = 4009;
const cors = require("cors")
app.use(cors())
require("dotenv").config()
const config = require("./Config/db")

const seeder = require("./Config/seeder")
seeder.adminseeder()

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
const route = require("./Routes/apiRoutes")
app.use("/api",route)

app.listen(port,()=>{
    console.log("my project is running on port" + " " + port)
})