const { getDB } = require('../database');

// Get all states
const getAllStates = async (req, res) => {
    try {
        const pool = getDB();
        const result = await pool.request().query('SELECT * FROM [dbo].[ATM_state] ORDER BY stateid');
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

// Get state by ID
const getStateById = async (req, res) => {
    try {
        const pool = getDB();
        const result = await pool.request()
            .input('stateid', req.params.id)
            .query('SELECT * FROM [dbo].[ATM_state] WHERE stateid = @stateid');

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
            .query('SELECT ISNULL(MAX(stateid), 0) AS maxStateId FROM [dbo].[ATM_state]');
        const nextStateId = maxIdResult.recordset[0].maxStateId + 1;

        // Insert new state
        await pool.request()
            .input('stateid', nextStateId)
            .input('conid', conid)
            .input('state', state)
            .input('status', status)
            .input('archive', archive)
            .query(`INSERT INTO [dbo].[ATM_state] (stateid, conid, state, status, archive)
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
            .query(`UPDATE [dbo].[ATM_state]
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
            .query('DELETE FROM [dbo].[ATM_state] WHERE stateid = @stateid');

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
    deleteState
};
