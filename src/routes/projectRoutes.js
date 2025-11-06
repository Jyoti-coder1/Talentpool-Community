// src/routes/projectRoutes.js
const express = require('express');
const { protect } = require('../middlewares/authMiddleware.js');
const { authorizeRoles } = require('../middlewares/roleMiddleware.js');
const {
    createProject,
    updateProject,
    deleteProject,
    getAllProjects,
    joinProject,
} = require('../controllers/projectController.js');

const router = express.Router();

router.post("/", protect, authorizeRoles("projectOwner"), createProject);
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);
router.get("/", getAllProjects);
router.post("/:id/join", protect, joinProject);

module.exports = router;