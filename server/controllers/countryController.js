const { getDB } = require('../database');

const getAllCountries = async (req, res) => {
    try {
        const pool = getDB();
        const result = await pool.request().query('SELECT * FROM [dbo].[ATM_Country]');
        res.json(result.recordset);
    } catch (err) {
        console.error("Country API Error:", err);
        res.status(500).send(err.message);
    }
};

const getCountryById = async (req, res) => {
    try {
        const pool = getDB();
        const result = await pool.request()
            .input('conid', req.params.id)
            .query('SELECT * FROM [dbo].[ATM_Country] WHERE conid = @conid');
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const createCountry = async (req, res) => {
    try {
        const { country, status, archive } = req.body;
        const pool = getDB();
        const result = await pool.request()
            .input('country', country)
            .input('status', status)
            .input('archive', archive)
            .query('INSERT INTO [dbo].[ATM_Country] (country, status, archive) VALUES (@country, @status, @archive)');
        res.status(201).json(result);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const updateCountry = async (req, res) => {
    try {
        const { country, status, archive } = req.body;
        const pool = getDB();
        await pool.request()
            .input('conid', req.params.id)
            .input('country', country)
            .input('status', status)
            .input('archive', archive)
            .query('UPDATE [dbo].[ATM_Country] SET country = @country, status = @status, archive = @archive WHERE conid = @conid');
        res.status(200).send('Country updated successfully');
    } catch (err) {
        console.error("Country API Error:", err);
        res.status(500).send(err.message);
    }
};

const deleteCountry = async (req, res) => {
    try {
        const pool = getDB();
        await pool.request()
            .input('conid', req.params.id)
            .query('DELETE FROM [dbo].[ATM_Country] WHERE conid = @conid');
        res.status(200).send('Country deleted successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
};


module.exports = {
    getAllCountries,
    getCountryById,
    createCountry,
    updateCountry,
    deleteCountry
}; 