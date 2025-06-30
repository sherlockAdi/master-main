const { getDB } = require('../database');

// Get all countries
const getAllCountries = async (req, res) => {
    try {
        const pool = getDB();
        let { page = 1, limit = 10, search = '', sortBy = 'conid', sortOrder = 'ASC' } = req.query;
        page = parseInt(page);
        limit = limit === 'all' ? null : parseInt(limit);
        search = search.trim();

        // Whitelist valid sort columns to prevent SQL injection
        const validSortColumns = ['conid', 'country', 'TotalBranches', 'TotalStudents', 'status', 'archive'];
        if (!validSortColumns.includes(sortBy)) {
            sortBy = 'conid';
        }
        if (!['ASC', 'DESC'].includes(sortOrder.toUpperCase())) {
            sortOrder = 'ASC';
        }

        // Build WHERE clause for search
        let whereClause = '';
        if (search) {
            whereClause = `WHERE c.country LIKE '%${search.replace(/'/g, "''")}%'`;
        }

        // Get total count (filtered)
        const countQuery = `SELECT COUNT(*) as total FROM [dbo].[ATM_M_Country_U88] c ${whereClause}`;
        const countResult = await pool.request().query(countQuery);
        const total = countResult.recordset[0].total;

        // Pagination logic
        let query = `
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
      ${whereClause}
      ORDER BY ${sortBy} ${sortOrder}
    `;
        if (limit) {
            const offset = (page - 1) * limit;
            query += ` OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;
        }

        const result = await pool.request().query(query);

        res.status(200).json({
            status: "success",
            data: result.recordset,
            total,
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
