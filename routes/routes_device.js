import express from "express";
import {
	getAllDevice,
	getOneDevice,
	postDevice,
	updateDevice,
	deleteDevice
} from "../controllers/control_device.js"
import {
	validationCreateDevice
} from "../middleware/mw.js"

const router = express.Router();

router.get("/:db/allDevice", getAllDevice);
router.get("/:db", getOneDevice);
router.post("/:db", validationCreateDevice ,postDevice);
router.put("/:db/:sn", updateDevice);
router.delete("/:db", deleteDevice);

export default router;
