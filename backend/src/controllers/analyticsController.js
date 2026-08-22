/**
 * Analytics Controller
 * Handles water usage and irrigation analytics
 */

const getWaterUsageAnalytics = async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const userId = req.user.id;
  
      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Start date and end date are required'
        });
      }
  
      // Calculate days between dates
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  
      // Generate sample daily data
      const dailyData = Array.from({ length: days }, (_, i) => {
        const date = new Date(start);
        date.setDate(date.getDate() + i);
        return {
          date: date.toISOString().split('T')[0],
          usage: Math.floor(Math.random() * 400) + 300, // 300-700L
          crop: ['Rice', 'Wheat', 'Maize', 'Cotton'][Math.floor(Math.random() * 4)],
          duration: `${Math.floor(Math.random() * 3) + 1} hours`
        };
      });
  
      const totalUsage = dailyData.reduce((sum, d) => sum + d.usage, 0);
      const averageDaily = totalUsage / days;
      const efficiencyScore = Math.min(100, Math.floor(85 + Math.random() * 15));
  
      // Determine trend
      const firstHalf = dailyData.slice(0, Math.floor(days / 2));
      const secondHalf = dailyData.slice(Math.floor(days / 2));
      const firstAvg = firstHalf.reduce((s, d) => s + d.usage, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((s, d) => s + d.usage, 0) / secondHalf.length;
      const trend = secondAvg > firstAvg ? 'increasing' : 'decreasing';
  
      // Generate recommendations
      const recommendations = [];
      if (efficiencyScore >= 85) {
        recommendations.push({
          type: 'success',
          message: 'Excellent water usage efficiency! Keep up the good work.'
        });
      } else if (efficiencyScore >= 70) {
        recommendations.push({
          type: 'info',
          message: 'Good water usage. Consider optimizing irrigation schedules for better efficiency.'
        });
      } else {
        recommendations.push({
          type: 'warning',
          message: 'Water usage could be optimized. Consider implementing drip irrigation.'
        });
      }
  
      if (trend === 'increasing') {
        recommendations.push({
          type: 'warning',
          message: 'Water usage is trending upward. Monitor crop water requirements closely.'
        });
      }
  
      res.json({
        success: true,
        data: {
          totalUsage: parseFloat(totalUsage.toFixed(2)),
          averageDaily: parseFloat(averageDaily.toFixed(2)),
          efficiencyScore,
          trend,
          period: {
            startDate,
            endDate,
            days
          },
          dailyData,
          recommendations
        }
      });
    } catch (error) {
      console.error('Water analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching water usage analytics'
      });
    }
  };
  
  const getIrrigationHistory = async (req, res) => {
    try {
      const { period = 'week' } = req.query;
      const userId = req.user.id;
  
      const days = period === 'day' ? 1 : 
                   period === 'week' ? 7 : 
                   period === 'month' ? 30 : 365;
  
      const history = Array.from({ length: Math.min(days, 30) }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return {
          date: date.toISOString(),
          usage: Math.floor(Math.random() * 400) + 300,
          crop: ['Rice', 'Wheat', 'Maize'][Math.floor(Math.random() * 3)],
          duration: `${Math.floor(Math.random() * 3) + 1} hours`,
          method: ['Drip', 'Sprinkler', 'Flood'][Math.floor(Math.random() * 3)]
        };
      }).reverse();
  
      res.json({
        success: true,
        data: history
      });
    } catch (error) {
      console.error('Irrigation history error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching irrigation history'
      });
    }
  };
  
  const getSoilMoisture = async (req, res) => {
    try {
      const userId = req.user.id;
  
      const current = Math.floor(Math.random() * 30) + 40; // 40-70%
      
      res.json({
        success: true,
        data: {
          current,
          average: Math.floor(Math.random() * 10) + 50, // 50-60%
          optimal: {
            min: 40,
            max: 60
          },
          status: current >= 40 && current <= 60 ? 'optimal' : 'attention',
          lastUpdated: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Soil moisture error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching soil moisture data'
      });
    }
  };
  
  module.exports = {
    getWaterUsageAnalytics,
    getIrrigationHistory,
    getSoilMoisture
  };