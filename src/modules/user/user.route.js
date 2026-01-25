import UserController from "./user.controller.js";
import { Router } from "express";

const router = Router();

router.get("/", UserController.getAllUsers);
router.post("/", UserController.createUser);
router.patch("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

export default router;