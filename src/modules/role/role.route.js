import roleController from "./role.controller.js";
import { Router } from "express";

const router = Router();

router.get("/", roleController.getAllRoles);
router.post("/", roleController.createRole);
router.patch("/:id", roleController.updateRole);
router.delete("/:id", roleController.deleteRole);

export default router;
