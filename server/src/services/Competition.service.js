const mongoose = require("mongoose");
const Competition = require("../models/Competition");
const Participation = require("../models/Participation");

function getLifecycle(competition, registered, activeCount) {
  const now = new Date();

  if (now < competition.startAt) {
    if (now < competition.registrationOpenAt) return "UPCOMING";
    if (now > competition.registrationCloseAt) return "REGISTRATION_CLOSED";
    if (competition.capacity && activeCount >= competition.capacity) return "FULL";
    return registered ? "REGISTERED" : "OPEN";
  }

  if (now >= competition.startAt && now <= competition.endAt) {
    return registered ? "REGISTERED" : "ONGOING";
  }

  return "ENDED";
}

async function getCompetitionDetails(competitionId, userId) {
  if (!mongoose.isValidObjectId(competitionId)) {
    const error = new Error("Invalid competition id");
    error.status = 400;
    throw error;
  }

  const competition = await Competition.findById(competitionId).lean();
  if (!competition) {
    const error = new Error("Competition not found");
    error.status = 404;
    throw error;
  }

  const [activeCount, participation] = await Promise.all([
    Participation.countDocuments({
      competitionId,
      status: "REGISTERED"
    }),
    userId && mongoose.isValidObjectId(userId)
      ? Participation.findOne({ competitionId, userId }).lean()
      : null
  ]);

  return {
    ...competition,
    lifecycle: getLifecycle(
      competition,
      participation?.status === "REGISTERED",
      activeCount
    ),
    spotsRemaining:
      competition.capacity == null
        ? null
        : Math.max(competition.capacity - activeCount, 0),
    participantCount: activeCount,
    userParticipation: participation
      ? {
          status: participation.status,
          registeredAt: participation.registeredAt
        }
      : null
  };
}

async function registerUser(competitionId, userId) {
  if (!mongoose.isValidObjectId(competitionId) || !mongoose.isValidObjectId(userId)) {
    const error = new Error("Invalid id");
    error.status = 400;
    throw error;
  }

  const competition = await Competition.findById(competitionId);
  if (!competition) {
    const error = new Error("Competition not found");
    error.status = 404;
    throw error;
  }

  const now = new Date();

  if (now < competition.registrationOpenAt) {
    const error = new Error("Registration has not opened yet");
    error.status = 409;
    throw error;
  }

  if (now > competition.registrationCloseAt) {
    const error = new Error("Registration is closed");
    error.status = 409;
    throw error;
  }

  if (now > competition.endAt) {
    const error = new Error("Competition has ended");
    error.status = 409;
    throw error;
  }

  const existing = await Participation.findOne({ competitionId, userId });
  if (existing && existing.status === "REGISTERED") {
    const error = new Error("You are already registered");
    error.status = 409;
    throw error;
  }

  const activeCount = await Participation.countDocuments({
    competitionId,
    status: "REGISTERED"
  });

  if (competition.capacity != null && activeCount >= competition.capacity) {
    const error = new Error("No participation spots are available");
    error.status = 409;
    throw error;
  }

  // Re-use a cancelled record when possible.
  if (existing) {
    existing.status = "REGISTERED";
    existing.registeredAt = now;
    existing.cancelledAt = null;
    await existing.save();
    return existing;
  }

  try {
    return await Participation.create({
      competitionId,
      userId,
      status: "REGISTERED",
      registeredAt: now
    });
  } catch (err) {
    // Unique index handles a race where another request registers
    // the same user at nearly the same time.
    if (err.code === 11000) {
      const error = new Error("Registration already exists");
      error.status = 409;
    throw error;
    }
    throw err;
  }
}

async function cancelRegistration(competitionId, userId) {
  const participation = await Participation.findOne({
    competitionId,
    userId,
    status: "REGISTERED"
  });

  if (!participation) {
    const error = new Error("Active registration not found");
    error.status = 404;
    throw error;
  }

  participation.status = "CANCELLED";
  participation.cancelledAt = new Date();
  await participation.save();

  return participation;
}

module.exports = {
  getCompetitionDetails,
  registerUser,
  cancelRegistration
};
