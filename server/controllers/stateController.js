const { getDB } = require('../database');

const getAllStates = async (req, res) => {
    try {
        const pool = getDB();
        const result = await pool.request().query('SELECT * FROM [dbo].[ATM_state] ORDER BY stateid');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const getStateById = async (req, res) => {
    try {
        const pool = getDB();
        const result = await pool.request()
            .input('stateid', req.params.id)
            .query('SELECT * FROM [dbo].[ATM_state] WHERE stateid = @stateid');
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const createState = async (req, res) => {
    try {
        const { conid, state, status, archive } = req.body;
        const pool = getDB();

        // Step 1: Get max stateid
        const maxIdResult = await pool.request()
            .query('SELECT ISNULL(MAX(stateid), 0) AS maxStateId FROM [dbo].[ATM_state]');
        const nextStateId = maxIdResult.recordset[0].maxStateId + 1;
        console.log(nextStateId,'nextfghjkl')
        // Step 2: Insert new state with next stateid
        const result = await pool.request()
            .input('stateid', nextStateId)
            .input('conid', conid)
            .input('state', state)
            .input('status', status)
            .input('archive', archive)
            .query(`
                INSERT INTO [dbo].[ATM_state] (stateid, conid, state, status, archive)
                VALUES (@stateid, @conid, @state, @status, @archive)
            `);

        res.status(201).json({ message: 'State inserted successfully', stateid: nextStateId });
    } catch (err) {
        res.status(500).send(err.message);
    }
};



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
            .query('UPDATE [dbo].[ATM_state] SET conid = @conid, state = @state, status = @status, archive = @archive WHERE stateid = @stateid');
        res.status(200).send('State updated successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const deleteState = async (req, res) => {
    try {
        const pool = getDB();
        await pool.request()
            .input('stateid', req.params.id)
            .query('DELETE FROM [dbo].[ATM_state] WHERE stateid = @stateid');
        res.status(200).send('State deleted successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports = {
    getAllStates,
    getStateById,
    createState,
    updateState,
    deleteState
}; 