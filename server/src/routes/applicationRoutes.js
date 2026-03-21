import { Router } from "express";

import {
  createApplication,
  deleteApplication,
  getApplication,
  getSummary,
  listApplications,
  updateApplication
} from "../controllers/applicationController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.get("/summary", getSummary);
router.get("/", listApplications);
router.post("/", createApplication);
router.get("/:id", getApplication);
router.put("/:id", updateApplication);
router.delete("/:id", deleteApplication);

export default router;
