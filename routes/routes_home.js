import express from "express";
import {
        getWidget
} from "../controllers/control_home.js"

const router = express.Router();

router.get("/:db", getWidget);

export default router;

