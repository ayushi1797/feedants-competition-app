const service = require("../services/competition.service");

async function getCompetition(req, res, next) {
  try {
    const data = await service.getCompetitionDetails(
      req.params.competitionId,
      req.query.userId
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function register(req, res, next) {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required"
      });
    }

    const participation = await service.registerUser(
      req.params.competitionId,
      userId
    );

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: participation
    });
  } catch (error) {
    next(error);
  }
}

async function cancel(req, res, next) {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required"
      });
    }

    const participation = await service.cancelRegistration(
      req.params.competitionId,
      userId
    );

    res.json({
      success: true,
      message: "Registration cancelled",
      data: participation
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getCompetition, register, cancel };
