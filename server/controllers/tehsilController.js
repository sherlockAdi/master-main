const { getDB } = require('../database');

const getAllTehsils = async (req, res) => {
    try {
        const pool = getDB();
        const result = await pool.request().query('SELECT * FROM [dbo].[tehsil]');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const getTehsilById = async (req, res) => {
    try {
        const pool = getDB();
        const result = await pool.request()
            .input('tehsil_id', req.params.id)
            .query('SELECT * FROM [dbo].[tehsil] WHERE tehsil_id = @tehsil_id');
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const createTehsil = async (req, res) => {
    try {
        const { tehsil_name, district_id, status, archive } = req.body;
        const pool = getDB();
        const result = await pool.request()
            .input('tehsil_name', tehsil_name)
            .input('district_id', district_id)
            .input('status', status)
            .input('archive', archive)
            .query('INSERT INTO [dbo].[tehsil] (tehsil_name, district_id, status, archive) VALUES (@tehsil_name, @district_id, @status, @archive)');
        res.status(201).json(result);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const updateTehsil = async (req, res) => {
    try {
        const { tehsil_name, district_id, status, archive } = req.body;
        const pool = getDB();
        await pool.request()
            .input('tehsil_id', req.params.id)
            .input('tehsil_name', tehsil_name)
            .input('district_id', district_id)
            .input('status', status)
            .input('archive', archive)
            .query('UPDATE [dbo].[tehsil] SET tehsil_name = @tehsil_name, district_id = @district_id, status = @status, archive = @archive WHERE tehsil_id = @tehsil_id');
        res.status(200).send('Tehsil updated successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const deleteTehsil = async (req, res) => {
    try {
        const pool = getDB();
        await pool.request()
            .input('tehsil_id', req.params.id)
            .query('DELETE FROM [dbo].[tehsil] WHERE tehsil_id = @tehsil_id');
        res.status(200).send('Tehsil deleted successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports = {
    getAllTehsils,
    getTehsilById,
    createTehsil,
    updateTehsil,
    deleteTehsil
}; 