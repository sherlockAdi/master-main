const { getDB } = require('../database');

// Get all countries
const getAllCountries = async (req, res) => {
    try {
        const pool = getDB();
        const result = await pool.request().query(`
      SELECT 
        c.conid,
        c.country,
        c.status,
        c.archive,
        (
          SELECT COUNT(DISTINCT id)
          FROM [dbo].[Atm_M_Branch88] b
          WHERE b.countryname = c.conid
        ) AS TotalBranches,
        (
          SELECT COUNT(DISTINCT sg.sid)
          FROM [dbo].[Atm_T_StudentGurdianinfo88] sg
          WHERE sg.fathercountry = c.conid
        ) AS TotalStudents
      FROM [dbo].[ATM_M_Country_U88] c
    `);

        res.status(200).json({
            status: "success",
            data: result.recordset,
            message: "Countries fetched successfully"
        });
    } catch (err) {
        console.error("Country API Error:", err);
        res.status(500).json({
            status: "error",
            data: null,
            message: err.message
        });
    }
};


// Get country by ID
const getCountryById = async (req, res) => {
    try {
        const pool = getDB();
        const result = await pool.request()
            .input('conid', req.params.id)
            .query('SELECT * FROM [dbo].[ATM_M_Country_U88] WHERE conid = @conid');

        const country = result.recordset[0];

        if (country) {
            res.status(200).json({
                status: "success",
                data: country,
                message: "Country fetched successfully"
            });
        } else {
            res.status(404).json({
                status: "error",
                data: null,
                message: "Country not found"
            });
        }
    } catch (err) {
        res.status(500).json({
            status: "error",
            data: null,
            message: err.message
        });
    }
};

// Create a new country
const createCountry = async (req, res) => {
    try {
        const { country, status, archive } = req.body;
        const pool = getDB();
        await pool.request()
            .input('country', country)
            .input('status', status)
            .input('archive', archive)
            .query('INSERT INTO [dbo].[ATM_M_Country_U88] (country, status, archive) VALUES (@country, @status, @archive)');

        res.status(201).json({
            status: "success",
            data: null,
            message: "Country created successfully"
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            data: null,
            message: err.message
        });
    }
};

// Update country by ID
const updateCountry = async (req, res) => {
    try {
        const { country, status, archive } = req.body;
        const pool = getDB();
        await pool.request()
            .input('conid', req.params.id)
            .input('country', country)
            .input('status', status)
            .input('archive', archive)
            .query('UPDATE [dbo].[ATM_M_Country_U88] SET country = @country, status = @status, archive = @archive WHERE conid = @conid');

        res.status(200).json({
            status: "success",
            data: null,
            message: "Country updated successfully"
        });
    } catch (err) {
        console.error("Country API Error:", err);
        res.status(500).json({
            status: "error",
            data: null,
            message: err.message
        });
    }
};

// Delete country by ID
const deleteCountry = async (req, res) => {
    try {
        const pool = getDB();
        await pool.request()
            .input('conid', req.params.id)
            .query('DELETE FROM [dbo].[ATM_M_Country_U88] WHERE conid = @conid');

        res.status(200).json({
            status: "success",
            data: null,
            message: "Country deleted successfully"
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            data: null,
            message: err.message
        });
    }
};

module.exports = {
    getAllCountries,
    getCountryById,
    createCountry,
    updateCountry,
    deleteCountry
};
