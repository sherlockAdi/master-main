const { getDB } = require('../database');

const getAllCities = async (req, res) => {
    try {
        const pool = getDB();
        const result = await pool.request().query('SELECT * FROM [dbo].[ATM_city]');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const getCityById = async (req, res) => {
    try {
        const pool = getDB();
        const result = await pool.request()
            .input('cityid', req.params.id)
            .query('SELECT * FROM [dbo].[ATM_city] WHERE cityid = @cityid');
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const createCity = async (req, res) => {
    try {
        const { stateid, city, status, archive, fyid, target, ATMDCode } = req.body;
        const pool = getDB();
        const result = await pool.request()
            .input('stateid', stateid)
            .input('city', city)
            .input('status', status)
            .input('archive', archive)
            .input('fyid', fyid)
            .input('target', target)
            .input('ATMDCode', ATMDCode)
            .query('INSERT INTO [dbo].[ATM_city] (stateid, city, status, archive, fyid, target, ATMDCode) VALUES (@stateid, @city, @status, @archive, @fyid, @target, @ATMDCode)');
        res.status(201).json(result);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

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
            .query('UPDATE [dbo].[ATM_city] SET stateid = @stateid, city = @city, status = @status, archive = @archive, fyid = @fyid, target = @target, ATMDCode = @ATMDCode WHERE cityid = @cityid');
        res.status(200).send('City updated successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const deleteCity = async (req, res) => {
    try {
        const pool = getDB();
        await pool.request()
            .input('cityid', req.params.id)
            .query('DELETE FROM [dbo].[ATM_city] WHERE cityid = @cityid');
        res.status(200).send('City deleted successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const getTopCities = async (req, res) => {
    try {
        const pool = getDB();
        const result = await pool.request().query(`SELECT TOP (1000) [stateid], [city], [cityid], [status], [archive], [fyid], [target], [ATMDCode] FROM [dbo].[ATM_city]`);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
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