import express from "express";
import {
        getAllPlant,
        getOnePlant,
        postPlant,
        updatePlant,
        deletePlant
} from "../controllers/control_plant.js"
import {
        validationCreatePlant
} from "../middleware/mw.js"

const router = express.Router();

router.get("/tenant/allPlant", getAllPlant);
router.get("/tenant", getOnePlant);
router.post("/tenant", validationCreatePlant ,postPlant);
router.put("/tenant/:plant", updatePlant);
router.delete("/tenant", deletePlant);

export default router;
