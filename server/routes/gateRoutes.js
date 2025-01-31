import express from 'express';
import { registerGates, updateGateStatus } from '../controllers/gateController.js';
import { assignGateAdmin,getAssignedGate } from '../controllers/gateController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { deleteAllGates } from '../controllers/gateController.js';
import Gate from '../models/Gate.js';
import { getAllGates } from "../controllers/gateController.js";


const router = express.Router();

// Middleware to check if the user is authenticated
router.use(authMiddleware);

// Route to register multiple gates - Only superadmin can access this route
router.post('/register', roleMiddleware(['superadmin']), registerGates);

// Route to update status and score - Gate admin can access this route
router.put('/update-status', roleMiddleware(['superadmin', 'gateadmin']), updateGateStatus);

router.post('/assign-admin', authMiddleware, assignGateAdmin);

router.get('/assigned-gate', authMiddleware, getAssignedGate);

router.get('/gates-details', roleMiddleware(['superadmin']), async (req, res) => {
    try {
      const gates = await Gate.find().populate('gateAdmin', 'username'); // Populate gate admin details if necessary
      res.status(200).json(gates);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching gate data', error: error.message });
    }
  });
  
router.delete('/deletegates', authMiddleware, deleteAllGates);


router.get("/gatenames", getAllGates);



export default router;
