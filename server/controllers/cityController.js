const { getDB } = require('../database');

// Get all cities
const getAllCities = async (req, res) => {
    try {
        const pool = getDB();
        const result = await pool.request().query('SELECT * FROM [dbo].[ATM_city]');
        res.status(200).json({
            status: "success",
            message: "Cities fetched successfully",
            data: result.recordset
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message,
            data: null
        });
    }
};

// Get city by ID
const getCityById = async (req, res) => {
    try {
        const pool = getDB();
        const result = await pool.request()
            .input('cityid', req.params.id)
            .query('SELECT * FROM [dbo].[ATM_city] WHERE cityid = @cityid');

        const city = result.recordset[0];

        if (city) {
            res.status(200).json({
                status: "success",
                message: "City fetched successfully",
                data: city
            });
        } else {
            res.status(404).json({
                status: "error",
                message: "City not found",
                data: null
            });
        }
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message,
            data: null
        });
    }
};

// Create a new city
const createCity = async (req, res) => {
    try {
        const { stateid, city, status, archive, fyid, target, ATMDCode } = req.body;
        const pool = getDB();
        await pool.request()
            .input('stateid', stateid)
            .input('city', city)
            .input('status', status)
            .input('archive', archive)
            .input('fyid', fyid)
            .input('target', target)
            .input('ATMDCode', ATMDCode)
            .query(`
                INSERT INTO [dbo].[ATM_city]
                (stateid, city, status, archive, fyid, target, ATMDCode)
                VALUES (@stateid, @city, @status, @archive, @fyid, @target, @ATMDCode)
            `);

        res.status(201).json({
            status: "success",
            message: "City created successfully",
            data: null
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message,
            data: null
        });
    }
};

// Update city by ID
const updateCity = async (req, res) => {
    try {
        const { stateid, city, status, archive, fyid, target, ATMDCode } = req.body;
        const pool = getDB();
        await pool.request()
            .input('cityid', req.params.id)
            .input('stateid', stateid)
            .input('city', city)
            .input('status', status)
            .input('archive', archive)
            .input('fyid', fyid)
            .input('target', target)
            .input('ATMDCode', ATMDCode)
            .query(`
                UPDATE [dbo].[ATM_city]
                SET stateid = @stateid, city = @city, status = @status, archive = @archive,
                    fyid = @fyid, target = @target, ATMDCode = @ATMDCode
                WHERE cityid = @cityid
            `);

        res.status(200).json({
            status: "success",
            message: "City updated successfully",
            data: null
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message,
            data: null
        });
    }
};

// Delete city by ID
const deleteCity = async (req, res) => {
    try {
        const pool = getDB();
        await pool.request()
            .input('cityid', req.params.id)
            .query('DELETE FROM [dbo].[ATM_city] WHERE cityid = @cityid');

        res.status(200).json({
            status: "success",
            message: "City deleted successfully",
            data: null
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message,
            data: null
        });
    }
};

// Get top cities
const getTopCities = async (req, res) => {
    try {
        const pool = getDB();
        const result = await pool.request().query(`
            SELECT TOP (1000)
                [stateid], [city], [cityid], [status], [archive],
                [fyid], [target], [ATMDCode]
            FROM [dbo].[ATM_city]
        `);

        res.status(200).json({
            status: "success",
            message: "Top cities fetched successfully",
            data: result.recordset
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message,
            data: null
        });
    }
};

module.exports = {
    getAllCities,
    getCityById,
    createCity,
    updateCity,
    deleteCity,
    getTopCities
};
