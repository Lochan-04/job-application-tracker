import { Application } from "../models/Application.js";

const buildSummary = (applications) => {
  const today = new Date();
  const todayIso = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const statusCounts = {
    wishlist: 0,
    applied: 0,
    screening: 0,
    interview: 0,
    offer: 0,
    rejected: 0
  };
  const monthlyMap = new Map();
  const sourceMap = new Map();

  applications.forEach((application) => {
    statusCounts[application.status] += 1;
    const monthLabel = application.dateApplied.toLocaleString("en-US", {
      month: "short",
      year: "numeric"
    });
    monthlyMap.set(monthLabel, (monthlyMap.get(monthLabel) || 0) + 1);

    if (application.source) {
      sourceMap.set(application.source, (sourceMap.get(application.source) || 0) + 1);
    }
  });

  const totalCount = applications.length;
  const interviewCount = statusCounts.interview;
  const offerCount = statusCounts.offer;

  return {
    totalCount,
    activeCount: applications.filter((item) => item.status !== "rejected").length,
    interviewCount,
    offerCount,
    responseRate: Math.round(((interviewCount + offerCount) / Math.max(totalCount, 1)) * 100),
    dueFollowUpCount: applications.filter(
      (item) => item.followUpDate && new Date(item.followUpDate) <= todayIso
    ).length,
    highPriorityCount: applications.filter((item) => item.priority === "high").length,
    statusCounts,
    recentApplications: applications.slice(0, 6),
    upcomingFollowUps: applications
      .filter((item) => item.followUpDate && new Date(item.followUpDate) >= todayIso)
      .sort((a, b) => new Date(a.followUpDate) - new Date(b.followUpDate))
      .slice(0, 6),
    interviewPipeline: applications
      .filter((item) => item.status === "interview")
      .slice(0, 6),
    sourceBreakdown: [...sourceMap.entries()]
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5),
    monthlyActivity: [...monthlyMap.entries()].slice(-4)
  };
};

export const getSummary = async (req, res, next) => {
  try {
    const applications = await Application.find({ user: req.user.id }).sort({ updatedAt: -1 });
    res.json(buildSummary(applications));
  } catch (error) {
    next(error);
  }
};

export const listApplications = async (req, res, next) => {
  try {
    const { q = "", status = "", sort = "updated" } = req.query;
    const query = { user: req.user.id };

    if (status) {
      query.status = status;
    }

    if (q) {
      query.$or = [
        { companyName: { $regex: q, $options: "i" } },
        { role: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
        { notes: { $regex: q, $options: "i" } },
        { nextStep: { $regex: q, $options: "i" } },
        { source: { $regex: q, $options: "i" } }
      ];
    }

    const sortMap = {
      updated: { updatedAt: -1 },
      applied: { dateApplied: -1 },
      company: { companyName: 1 },
      followup: { followUpDate: 1 }
    };

    const applications = await Application.find(query).sort(sortMap[sort] || sortMap.updated);
    res.json(applications);
  } catch (error) {
    next(error);
  }
};

export const getApplication = async (req, res, next) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    res.json(application);
  } catch (error) {
    next(error);
  }
};

export const createApplication = async (req, res, next) => {
  try {
    const application = await Application.create({
      ...req.body,
      user: req.user.id
    });

    res.status(201).json(application);
  } catch (error) {
    next(error);
  }
};

export const updateApplication = async (req, res, next) => {
  try {
    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    res.json(application);
  } catch (error) {
    next(error);
  }
};

export const deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    res.json({ message: "Application deleted." });
  } catch (error) {
    next(error);
  }
};
