import express from 'express';
import { registerSuperAdmin, login, registerGateAdmin } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { getAllGateAdmins } from "../controllers/authController.js";


const router = express.Router();


router.post("/register", registerSuperAdmin);
router.post("/login", login);
router.post('/register-gateadmin', authMiddleware, roleMiddleware(['superadmin']), registerGateAdmin);
router.get("/gateadminsd", getAllGateAdmins);

export default router;
