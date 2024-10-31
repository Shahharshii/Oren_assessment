const Metric = require("../model/metricmodel");
require("dotenv").config();

const createMetric = async (req, res) => {
    try {
        const user = req.user.id;
        const metricsData = req.body;

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        if (!Array.isArray(metricsData)) {
            return res.status(400).json({ message: "Invalid data format. Expected an array of metrics" });
        }

        const results = await Promise.all(
            metricsData.map(async (metric) => {
                const { carbonEmissions, energyConsumption, wasteGenerated, waterUsage, year } = metric;

                if (!carbonEmissions || !energyConsumption || !wasteGenerated || !waterUsage || !year) {
                    throw new Error(`Invalid metric data for year ${year}`);
                }

                // Try to find existing metric for the year
                const existingMetric = await Metric.findOne({ user, year });

                if (existingMetric) {
                    // Update existing metric
                    return await Metric.findOneAndUpdate(
                        { user, year },
                        {
                            carbonEmissions,
                            energyConsumption,
                            wasteDistributed: wasteGenerated,
                            waterUsage
                        },
                        { new: true }
                    );
                } else {
                    // Create new metric
                    return await Metric.create({
                        user,
                        carbonEmissions,
                        energyConsumption,
                        wasteDistributed: wasteGenerated,
                        waterUsage,
                        year
                    });
                }
            })
        );

        res.status(201).json({
            message: "Metrics processed successfully",
            metrics: results
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getMetrics = async (req, res) => {
    try {
        const metrics = await Metric.find({ user: req.user.id });
        res.status(200).json({ metrics });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createMetric, getMetrics };

