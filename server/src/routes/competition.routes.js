const express = require("express");
const controller = require("../controllers/competition.controller");

const router = express.Router();

router.get("/:competitionId", controller.getCompetition);
router.post("/:competitionId/register", controller.register);
router.delete("/:competitionId/register", controller.cancel);

module.exports = router;
