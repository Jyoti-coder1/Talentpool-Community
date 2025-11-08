// src/routes/projectRoutes.js
const express = require('express');
const auth = require('../middleware/authMiddleware.js');
const { authorizeRoles } = require('../middleware/roleMiddleware.js');
const {
    createProject,
    updateProject,
    deleteProject,
    getAllProjects,
    joinProject,
} = require('../controllers/projectController.js');

const router = express.Router();

router.post("/", auth, authorizeRoles("projectOwner"), createProject);
router.put("/:id", auth, updateProject);
router.delete("/:id", auth, deleteProject);
router.get("/", getAllProjects);
router.post("/:id/join", auth, joinProject);

module.exports = router;