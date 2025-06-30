const { getDB } = require('../database');

// Get all states
const getAllStates = async (req, res) => {
    try {
        const pool = getDB();
        const result = await pool.request().query('SELECT * FROM [dbo].[Atm_M_State88] ORDER BY stateid');
        res.status(200).json({
            status: "success",
            message: "States fetched successfully",
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

const getstatesummary = async (req, res) => {
    try {
        const pool = getDB();
        let { page = 1, limit = 10, search = '', conid, sortBy = 'stateid', sortOrder = 'ASC' } = req.query;
        page = parseInt(page);
        limit = limit === 'all' ? null : parseInt(limit);
        search = search.trim();

        // Whitelist valid sort columns
        const validSortColumns = ['stateid', 'state', 'conid', 'TotalBranches', 'TotalStudents', 'status', 'archive'];
        if (!validSortColumns.includes(sortBy)) {
            sortBy = 'stateid';
        }
        if (!['ASC', 'DESC'].includes(sortOrder.toUpperCase())) {
            sortOrder = 'ASC';
        }

        // Build WHERE clause for search and parent filter
        const whereClauses = [];
        if (search) {
            whereClauses.push(`s.state LIKE '%${search.replace(/'/g, "''")}%'`);
        }
        if (conid) {
            whereClauses.push(`s.conid = ${parseInt(conid)}`);
        }
        const whereClause = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

        // Get total count (filtered)
        const countQuery = `SELECT COUNT(*) as total FROM [dbo].[Atm_M_State88] s ${whereClause}`;
        const countResult = await pool.request().query(countQuery);
        const total = countResult.recordset[0].total;

        // Pagination logic
        let query = `
            SELECT 
                s.stateid, s.state, s.conid, s.status, s.archive,
                (SELECT COUNT(DISTINCT id) FROM [dbo].[Atm_M_Branch88] b WHERE b.statename = s.stateid) AS TotalBranches,
                (SELECT COUNT(DISTINCT sg.sid) FROM [dbo].[Atm_T_StudentGurdianinfo88] sg WHERE sg.fatherstate = s.stateid) AS TotalStudents
            FROM [dbo].[Atm_M_State88] s
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
            message: "States fetched successfully",
            data: result.recordset,
            total
        });
    } catch (err) {
        console.error("State API Error:", err);
        res.status(500).json({
            status: "error",
            message: err.message,
            data: null
        });
    }
};




// Get state by ID
const getStateById = async (req, res) => {
    try {
        const pool = getDB();
        const result = await pool.request()
            .input('stateid', req.params.id)
            .query('SELECT * FROM [dbo].[Atm_M_State88] WHERE stateid = @stateid');

        const state = result.recordset[0];

        if (state) {
            res.status(200).json({
                status: "success",
                message: "State fetched successfully",
                data: state
            });
        } else {
            res.status(404).json({
                status: "error",
                message: "State not found",
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

// Create a new state
const createState = async (req, res) => {
    try {
        const { conid, state, status, archive } = req.body;
        const pool = getDB();

        // Get max stateid
        const maxIdResult = await pool.request()
            .query('SELECT ISNULL(MAX(stateid), 0) AS maxStateId FROM [dbo].[Atm_M_State88]');
        const nextStateId = maxIdResult.recordset[0].maxStateId + 1;

        // Insert new state
        await pool.request()
            .input('stateid', nextStateId)
            .input('conid', conid)
            .input('state', state)
            .input('status', status)
            .input('archive', archive)
            .query(`INSERT INTO [dbo].[Atm_M_State88] (stateid, conid, state, status, archive)
                    VALUES (@stateid, @conid, @state, @status, @archive)`);

        res.status(201).json({
            status: "success",
            message: "State inserted successfully",
            data: { stateid: nextStateId }
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message,
            data: null
        });
    }
};

// Update state
const updateState = async (req, res) => {
    try {
        const { conid, state, status, archive } = req.body;
        const pool = getDB();

        await pool.request()
            .input('stateid', req.params.id)
            .input('conid', conid)
            .input('state', state)
            .input('status', status)
            .input('archive', archive)
            .query(`UPDATE [dbo].[Atm_M_State88]
                    SET conid = @conid, state = @state, status = @status, archive = @archive
                    WHERE stateid = @stateid`);

        res.status(200).json({
            status: "success",
            message: "State updated successfully",
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

// Delete state
const deleteState = async (req, res) => {
    try {
        const pool = getDB();
        await pool.request()
            .input('stateid', req.params.id)
            .query('DELETE FROM [dbo].[Atm_M_State88] WHERE stateid = @stateid');

        res.status(200).json({
            status: "success",
            message: "State deleted successfully",
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

module.exports = {
    getAllStates,
    getStateById,
    createState,
    updateState,
    deleteState,
    getstatesummary
};
