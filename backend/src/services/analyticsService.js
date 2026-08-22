const logger = require('../utils/logger');
const WaterUsage = require('../models/WaterUsage');
const CropRecommendation = require('../models/CropRecommendation');
const IrrigationSchedule = require('../models/IrrigationSchedule');
const YieldPrediction = require('../models/YieldPrediction');

/**
 * Analytics Service - Generate insights and statistics
 */
class AnalyticsService {
  /**
   * Get water usage analytics for a user
   */
  async getWaterUsageAnalytics(userId, startDate, endDate) {
    try {
      const waterUsageData = await WaterUsage.find({
        userId,
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      }).sort({ date: 1 });

      if (waterUsageData.length === 0) {
        return {
          success: true,
          data: {
            totalUsage: 0,
            averageDaily: 0,
            trend: 'no_data',
            dailyData: [],
          },
        };
      }

      const totalUsage = waterUsageData.reduce((sum, record) => sum + record.usage, 0);
      const averageDaily = totalUsage / waterUsageData.length;

      // Calculate trend
      const firstHalf = waterUsageData.slice(0, Math.floor(waterUsageData.length / 2));
      const secondHalf = waterUsageData.slice(Math.floor(waterUsageData.length / 2));

      const firstHalfAvg = firstHalf.reduce((sum, r) => sum + r.usage, 0) / firstHalf.length;
      const secondHalfAvg = secondHalf.reduce((sum, r) => sum + r.usage, 0) / secondHalf.length;

      let trend = 'stable';
      if (secondHalfAvg > firstHalfAvg * 1.1) trend = 'increasing';
      else if (secondHalfAvg < firstHalfAvg * 0.9) trend = 'decreasing';

      // Daily breakdown
      const dailyData = waterUsageData.map((record) => ({
        date: record.date,
        usage: record.usage,
        crop: record.cropType,
        source: record.source,
      }));

      // Calculate efficiency score
      const efficiencyScore = this.calculateWaterEfficiency(waterUsageData);

      return {
        success: true,
        data: {
          totalUsage,
          averageDaily,
          trend,
          dailyData,
          efficiencyScore,
          recommendations: this.getWaterRecommendations(trend, efficiencyScore),
          period: {
            start: startDate,
            end: endDate,
            days: waterUsageData.length,
          },
        },
      };
    } catch (error) {
      logger.error('Error getting water usage analytics:', error.message);
      throw new Error('Failed to fetch water usage analytics');
    }
  }

  /**
   * Get crop performance analytics
   */
  async getCropPerformanceAnalytics(userId) {
    try {
      const recommendations = await CropRecommendation.find({ userId })
        .sort({ createdAt: -1 })
        .limit(50);

      const yieldPredictions = await YieldPrediction.find({ userId })
        .sort({ createdAt: -1 })
        .limit(50);

      // Analyze most recommended crops
      const cropFrequency = {};
      recommendations.forEach((rec) => {
        const crop = rec.topRecommendation;
        cropFrequency[crop] = (cropFrequency[crop] || 0) + 1;
      });

      const topCrops = Object.entries(cropFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([crop, count]) => ({ crop, count }));

      // Average accuracy
      const avgAccuracy = recommendations.reduce((sum, rec) => sum + (rec.accuracy || 0), 0) / recommendations.length;

      // Yield trends
      const yieldTrends = yieldPredictions.map((pred) => ({
        crop: pred.crop,
        predictedYield: pred.predictedYield,
        date: pred.createdAt,
      }));

      return {
        success: true,
        data: {
          totalRecommendations: recommendations.length,
          topCrops,
          averageAccuracy: avgAccuracy.toFixed(2),
          yieldTrends,
          recentActivity: recommendations.slice(0, 10).map((rec) => ({
            crop: rec.topRecommendation,
            date: rec.createdAt,
            accuracy: rec.accuracy,
          })),
        },
      };
    } catch (error) {
      logger.error('Error getting crop performance analytics:', error.message);
      throw new Error('Failed to fetch crop performance analytics');
    }
  }

  /**
   * Get irrigation efficiency analytics
   */
  async getIrrigationAnalytics(userId, days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const schedules = await IrrigationSchedule.find({
        userId,
        createdAt: { $gte: startDate },
      });

      if (schedules.length === 0) {
        return {
          success: true,
          data: {
            totalSchedules: 0,
            averageWaterPerSession: 0,
            frequencyAnalysis: {},
          },
        };
      }

      // Calculate average water per irrigation
      const totalWater = schedules.reduce((sum, schedule) => {
        return sum + schedule.schedule.reduce((s, session) => s + session.waterAmount, 0);
      }, 0);

      const totalSessions = schedules.reduce((sum, schedule) => sum + schedule.schedule.length, 0);
      const averageWaterPerSession = totalWater / totalSessions;

      // Analyze frequency by crop
      const frequencyByCrop = {};
      schedules.forEach((schedule) => {
        const crop = schedule.cropType;
        if (!frequencyByCrop[crop]) {
          frequencyByCrop[crop] = { count: 0, totalWater: 0 };
        }
        frequencyByCrop[crop].count += schedule.schedule.length;
        frequencyByCrop[crop].totalWater += schedule.schedule.reduce((s, sess) => s + sess.waterAmount, 0);
      });

      return {
        success: true,
        data: {
          totalSchedules: schedules.length,
          totalSessions,
          averageWaterPerSession: averageWaterPerSession.toFixed(2),
          frequencyAnalysis: frequencyByCrop,
          period: `${days} days`,
        },
      };
    } catch (error) {
      logger.error('Error getting irrigation analytics:', error.message);
      throw new Error('Failed to fetch irrigation analytics');
    }
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(userId) {
    try {
      const [recommendations, waterRecords, schedules, yields] = await Promise.all([
        CropRecommendation.countDocuments({ userId }),
        WaterUsage.countDocuments({ userId }),
        IrrigationSchedule.countDocuments({ userId }),
        YieldPrediction.countDocuments({ userId }),
      ]);

      // Get recent water usage (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recentWaterUsage = await WaterUsage.find({
        userId,
        date: { $gte: sevenDaysAgo },
      });

      const totalRecentWater = recentWaterUsage.reduce((sum, record) => sum + record.usage, 0);

      // Get latest recommendation
      const latestRecommendation = await CropRecommendation.findOne({ userId })
        .sort({ createdAt: -1 })
        .select('topRecommendation createdAt');

      return {
        success: true,
        data: {
          totalRecommendations: recommendations,
          totalWaterRecords: waterRecords,
          totalIrrigationSchedules: schedules,
          totalYieldPredictions: yields,
          recentWaterUsage: {
            total: totalRecentWater,
            period: '7 days',
            average: (totalRecentWater / 7).toFixed(2),
          },
          latestRecommendation: latestRecommendation
            ? {
                crop: latestRecommendation.topRecommendation,
                date: latestRecommendation.createdAt,
              }
            : null,
        },
      };
    } catch (error) {
      logger.error('Error getting dashboard stats:', error.message);
      throw new Error('Failed to fetch dashboard statistics');
    }
  }

  /**
   * Generate monthly report
   */
  async generateMonthlyReport(userId, month, year) {
    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      const [waterAnalytics, cropAnalytics, irrigationAnalytics] = await Promise.all([
        this.getWaterUsageAnalytics(userId, startDate, endDate),
        this.getCropPerformanceAnalytics(userId),
        this.getIrrigationAnalytics(userId, 30),
      ]);

      return {
        success: true,
        data: {
          period: {
            month,
            year,
            startDate,
            endDate,
          },
          waterUsage: waterAnalytics.data,
          cropPerformance: cropAnalytics.data,
          irrigation: irrigationAnalytics.data,
          generatedAt: new Date(),
        },
      };
    } catch (error) {
      logger.error('Error generating monthly report:', error.message);
      throw new Error('Failed to generate monthly report');
    }
  }

  // Helper methods
  calculateWaterEfficiency(waterUsageData) {
    // Simple efficiency calculation based on consistency and optimization
    const avgUsage = waterUsageData.reduce((sum, r) => sum + r.usage, 0) / waterUsageData.length;
    const variance = waterUsageData.reduce((sum, r) => sum + Math.pow(r.usage - avgUsage, 2), 0) / waterUsageData.length;
    const stdDev = Math.sqrt(variance);

    // Lower standard deviation means more consistent usage (better efficiency)
    const consistencyScore = Math.max(0, 100 - (stdDev / avgUsage) * 100);

    return Math.min(100, consistencyScore).toFixed(2);
  }

  getWaterRecommendations(trend, efficiencyScore) {
    const recommendations = [];

    if (trend === 'increasing') {
      recommendations.push({
        type: 'warning',
        message: 'Water usage is increasing. Review irrigation schedules and check for leaks.',
      });
    }

    if (efficiencyScore < 60) {
      recommendations.push({
        type: 'info',
        message: 'Consider implementing drip irrigation or mulching to improve water efficiency.',
      });
    }

    if (efficiencyScore >= 80) {
      recommendations.push({
        type: 'success',
        message: 'Excellent water management! Keep up the good practices.',
      });
    }

    return recommendations;
  }
}

module.exports = new AnalyticsService();