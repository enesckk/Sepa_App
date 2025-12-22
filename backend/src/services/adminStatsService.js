const {
  User,
  Event,
  EventRegistration,
  Application,
  BillSupport,
  Survey,
  Answer,
  Story,
  News,
  Place,
  EmergencyGathering,
  Reward,
  UserReward,
  GolbucksTransaction,
} = require('../models');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

/**
 * Get dashboard statistics
 * @returns {Promise<Object>} Dashboard stats
 */
const getDashboardStats = async () => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // User stats
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { is_active: true } });
    const newUsersToday = await User.count({
      where: {
        created_at: { [Op.gte]: startOfToday },
      },
    });
    const newUsersThisWeek = await User.count({
      where: {
        created_at: { [Op.gte]: startOfWeek },
      },
    });
    const newUsersThisMonth = await User.count({
      where: {
        created_at: { [Op.gte]: startOfMonth },
      },
    });

    // Event stats
    const totalEvents = await Event.count();
    const activeEvents = await Event.count({ where: { is_active: true } });
    const totalRegistrations = await EventRegistration.count({
      where: { status: 'registered' },
    });
    const eventsToday = await Event.count({
      where: {
        date: new Date().toISOString().split('T')[0],
        is_active: true,
      },
    });

    // Application stats
    const totalApplications = await Application.count();
    const pendingApplications = await Application.count({
      where: { status: 'pending' },
    });
    const resolvedApplications = await Application.count({
      where: { status: 'resolved' },
    });
    const applicationsToday = await Application.count({
      where: {
        created_at: { [Op.gte]: startOfToday },
      },
    });

    // Bill support stats
    const totalBillSupports = await BillSupport.count();
    const pendingBillSupports = await BillSupport.count({
      where: { status: 'pending' },
    });
    const approvedBillSupports = await BillSupport.count({
      where: { status: 'approved' },
    });

    // Survey stats
    const totalSurveys = await Survey.count();
    const activeSurveys = await Survey.count({
      where: { status: 'active', is_active: true },
    });
    const totalAnswers = await Answer.count();
    const completedSurveys = await Survey.count({
      include: [
        {
          model: require('../models').Question,
          as: 'questions',
          required: true,
        },
      ],
    });

    // Story stats
    const totalStories = await Story.count();
    const activeStories = await Story.count({ where: { is_active: true } });
    const totalStoryViews = await Story.sum('view_count') || 0;

    // News stats
    const totalNews = await News.count();
    const activeNews = await News.count({ where: { is_active: true } });
    const totalNewsViews = await News.sum('view_count') || 0;

    // Place stats
    const totalPlaces = await Place.count();
    const activePlaces = await Place.count({ where: { is_active: true } });

    // Emergency gathering stats
    const totalGatheringAreas = await EmergencyGathering.count();
    const activeGatheringAreas = await EmergencyGathering.count({
      where: { is_active: true },
    });

    // Reward stats
    const totalRewards = await Reward.count();
    const activeRewards = await Reward.count({ where: { is_active: true } });
    const totalUserRewards = await UserReward.count();
    const redeemedRewards = await UserReward.count({
      where: { is_used: true },
    });

    // Golbucks stats
    const totalGolbucksTransactions = await GolbucksTransaction.count();
    const totalGolbucksDistributed = await GolbucksTransaction.sum('amount', {
      where: { amount: { [Op.gt]: 0 } },
    }) || 0;
    const totalGolbucksRedeemed = await GolbucksTransaction.sum('amount', {
      where: { amount: { [Op.lt]: 0 } },
    }) || 0;

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        newToday: newUsersToday,
        newThisWeek: newUsersThisWeek,
        newThisMonth: newUsersThisMonth,
      },
      events: {
        total: totalEvents,
        active: activeEvents,
        totalRegistrations,
        eventsToday,
      },
      applications: {
        total: totalApplications,
        pending: pendingApplications,
        resolved: resolvedApplications,
        newToday: applicationsToday,
      },
      billSupports: {
        total: totalBillSupports,
        pending: pendingBillSupports,
        approved: approvedBillSupports,
      },
      surveys: {
        total: totalSurveys,
        active: activeSurveys,
        totalAnswers,
      },
      stories: {
        total: totalStories,
        active: activeStories,
        totalViews: totalStoryViews,
      },
      news: {
        total: totalNews,
        active: activeNews,
        totalViews: totalNewsViews,
      },
      places: {
        total: totalPlaces,
        active: activePlaces,
      },
      emergencyGathering: {
        total: totalGatheringAreas,
        active: activeGatheringAreas,
      },
      rewards: {
        total: totalRewards,
        active: activeRewards,
        totalRedeemed: totalUserRewards,
        used: redeemedRewards,
      },
      golbucks: {
        totalTransactions: totalGolbucksTransactions,
        totalDistributed: totalGolbucksDistributed,
        totalRedeemed: Math.abs(totalGolbucksRedeemed),
      },
    };
  } catch (error) {
    throw error;
  }
};

module.exports = { getDashboardStats };

