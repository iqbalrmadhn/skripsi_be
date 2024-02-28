import express from "express";
import {
        getLogDevice,
	download
} from "../controllers/control_log.js"
import {
	validationParams
} from "../middleware/mw.js"

const router = express.Router();

router.get("/:db/:col", validationParams ,getLogDevice);
router.get("/:db/download/:col", download);

export default router;
