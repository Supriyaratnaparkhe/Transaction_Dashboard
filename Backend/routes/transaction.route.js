const express = require('express');
const router = express.Router();
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 5000;
const Transaction = require('../model/transaction');

const getMonthFilterPipeline = (month) => [
    {
        $addFields: {
            month: { $month: '$dateOfSale' }
        }
    },
    {
        $match: {
            month: parseInt(month)
        }
    }
];

router.get('/init', async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const transactions = response.data;

        await Transaction.deleteMany({});

        await Transaction.insertMany(transactions);

        res.status(200).json({ message: 'Database initialized with seed data' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to initialize database' });
    }
});

// List Transactions with Search and Pagination
router.get('/transactions', async (req, res) => {
    const { month, search, page = 1, perPage = 10 } = req.query;
    const monthPipeline = getMonthFilterPipeline(month);

    let matchStage = {};
    if (search) {
        const regex = new RegExp(search, 'i');
        matchStage.$or = [
            { id: regex },
            { title: regex },
            { description: regex },
            { image: regex },
            { price: { $regex: regex } }
        ];
    }

    const transactions = await Transaction.aggregate([
        ...monthPipeline,
        { $match: matchStage },
        { $skip: (page - 1) * perPage },
        { $limit: parseInt(perPage) }
    ]);

    res.status(200).json(transactions);
});

// Statistics API
router.get('/statistics', async (req, res) => {
    const { month } = req.query;
    const monthPipeline = getMonthFilterPipeline(month);

    const totalSaleAmount = await Transaction.aggregate([
        ...monthPipeline,
        { $group: { _id: null, totalAmount: { $sum: '$price' } } }
    ]);

    const totalSoldItems = await Transaction.aggregate([
        ...monthPipeline,
        { $match: { sold: true } },
        { $count: 'totalSoldItems' }
    ]);

    const totalNotSoldItems = await Transaction.aggregate([
        ...monthPipeline,
        { $match: { sold: false } },
        { $count: 'totalNotSoldItems' }
    ]);

    res.status(200).json({
        totalSaleAmount: totalSaleAmount[0]?.totalAmount || 0,
        totalSoldItems: totalSoldItems[0]?.totalSoldItems || 0,
        totalNotSoldItems: totalNotSoldItems[0]?.totalNotSoldItems || 0
    });
});

// Bar Chart API
router.get('/bar-chart', async (req, res) => {
    const { month } = req.query;
    const monthPipeline = getMonthFilterPipeline(month);

    const priceRanges = [
        { range: '0-100', min: 0, max: 100 },
        { range: '101-200', min: 101, max: 200 },
        { range: '201-300', min: 201, max: 300 },
        { range: '301-400', min: 301, max: 400 },
        { range: '401-500', min: 401, max: 500 },
        { range: '501-600', min: 501, max: 600 },
        { range: '601-700', min: 601, max: 700 },
        { range: '701-800', min: 701, max: 800 },
        { range: '801-900', min: 801, max: 900 },
        { range: '901-above', min: 901, max: Infinity }
    ];

    const result = await Promise.all(
        priceRanges.map(async (range) => {
            const count = await Transaction.aggregate([
                ...monthPipeline,
                { $match: { price: { $gte: range.min, $lt: range.max } } },
                { $count: 'count' }
            ]);
            return { range: range.range, count: count[0]?.count || 0 };
        })
    );

    res.status(200).json(result);
});

// Pie Chart API
router.get('/pie-chart', async (req, res) => {
    const { month } = req.query;
    const monthPipeline = getMonthFilterPipeline(month);

    const categories = await Transaction.aggregate([
        ...monthPipeline,
        { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.status(200).json(categories.map(cat => ({ category: cat._id, count: cat.count })));
});

// Combined API
router.get('/combined', async (req, res) => {
    const { month } = req.query;

    const transactions = await axios.get(`http://localhost:${PORT}/api/transactions?month=${month}`);
    const statistics = await axios.get(`http://localhost:${PORT}/api/statistics?month=${month}`);
    const barChart = await axios.get(`http://localhost:${PORT}/api/bar-chart?month=${month}`);
    const pieChart = await axios.get(`http://localhost:${PORT}/api/pie-chart?month=${month}`);

    res.status(200).json({
        transactions: transactions.data,
        statistics: statistics.data,
        barChart: barChart.data,
        pieChart: pieChart.data
    });
});
module.exports = router;
