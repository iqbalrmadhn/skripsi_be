import express from "express";
import cors from "cors";
import routes_device from "./routes/routes_device.js"
import routes_log from "./routes/routes_log.js"
import routes_home from "./routes/routes_home.js"
import routes_plant from "./routes/routes_plant.js"

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api",routes_plant);
app.use("/api/home",routes_home);
app.use("/api/device",routes_device);
app.use("/api/log",routes_log);

app.get("/", (req,res) => {
 res.json({
   message: "testing node.js",
 });
});

app.listen(5000, ()=> console.log("server up and running..."));
