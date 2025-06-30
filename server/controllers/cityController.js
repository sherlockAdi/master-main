const { getDB } = require('../database');

// Get all cities
const getAllCities = async (req, res) => {
    try {
        const pool = getDB();
        const result = await pool.request().query('SELECT * FROM [dbo].[ATM_City_U88]');
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

const getAllCitiessum = async (req, res) => {
    try {
        const pool = getDB();
        let { page = 1, limit = 10, search = '', stateid, sortBy = 'cityid', sortOrder = 'ASC' } = req.query;
        page = parseInt(page);
        limit = limit === 'all' ? null : parseInt(limit);
        search = search.trim();

        // Whitelist valid sort columns
        const validSortColumns = ['cityid', 'city', 'stateid', 'TotalBranches', 'TotalStudents', 'status', 'archive'];
        if (!validSortColumns.includes(sortBy)) {
            sortBy = 'cityid';
        }
        if (!['ASC', 'DESC'].includes(sortOrder.toUpperCase())) {
            sortOrder = 'ASC';
        }

        // Build WHERE clause for search and parent filter
        const whereClauses = [];
        if (search) {
            whereClauses.push(`c.city LIKE '%${search.replace(/'/g, "''")}%'`);
        }
        if (stateid) {
            whereClauses.push(`c.stateid = ${parseInt(stateid)}`);
        }
        const whereClause = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

        // Get total count (filtered)
        const countQuery = `SELECT COUNT(*) as total FROM [dbo].[ATM_City_U88] c ${whereClause}`;
        const countResult = await pool.request().query(countQuery);
        const total = countResult.recordset[0].total;

        // Pagination logic
        let query = `
      SELECT 
        c.cityid,
        c.city,
        c.stateid,
        c.status,
        c.archive,
        c.fyid,
        c.target,
        c.ATMDCode,
        (
          SELECT COUNT(DISTINCT b.id)
          FROM [dbo].[Atm_M_Branch88] b
          WHERE b.cityname = c.cityid
        ) AS TotalBranches,
        (
          SELECT COUNT(DISTINCT sg.sid)
          FROM [dbo].[Atm_T_StudentGurdianinfo88] sg
          WHERE sg.fathercity = c.cityid
        ) AS TotalStudents
      FROM [dbo].[ATM_City_U88] c
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
            message: "Cities fetched successfully",
            data: result.recordset,
            total
        });
    } catch (err) {
        console.error("City API Error:", err);
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
            .query('SELECT * FROM [dbo].[ATM_City_U88] WHERE cityid = @cityid');

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
                INSERT INTO [dbo].[ATM_City_U88]
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
                UPDATE [dbo].[ATM_City_U88]
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
            .query('DELETE FROM [dbo].[ATM_City_U88] WHERE cityid = @cityid');

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
            FROM [dbo].[ATM_City_U88]
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
    getTopCities,
    getAllCitiessum
};
