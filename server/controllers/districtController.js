const { getDB } = require('../database');

const getAllDistricts = async (req, res) => {
    try {
        const pool = getDB();
        const result = await pool.request().query('SELECT * FROM [dbo].[ATM_district]');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const getDistrictById = async (req, res) => {
    try {
        const pool = getDB();
        const result = await pool.request()
            .input('district_id', req.params.id)
            .query('SELECT * FROM [dbo].[ATM_district] WHERE district_id = @district_id');
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const createDistrict = async (req, res) => {
    try {
        const { district_name, stateid, status, archive } = req.body;
        const pool = getDB();
        const result = await pool.request()
            .input('district_name', district_name)
            .input('stateid', stateid)
            .input('status', status)
            .input('archive', archive)
            .query('INSERT INTO [dbo].[ATM_district] (district_name, stateid, status, archive) VALUES (@district_name, @stateid, @status, @archive)');
        res.status(201).json(result);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const updateDistrict = async (req, res) => {
    try {
        const { district_name, stateid, status, archive } = req.body;
        const pool = getDB();
        await pool.request()
            .input('district_id', req.params.id)
            .input('district_name', district_name)
            .input('stateid', stateid)
            .input('status', status)
            .input('archive', archive)
            .query('UPDATE [dbo].[ATM_district] SET district_name = @district_name, stateid = @stateid, status = @status, archive = @archive WHERE district_id = @district_id');
        res.status(200).send('District updated successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const deleteDistrict = async (req, res) => {
    try {
        const pool = getDB();
        await pool.request()
            .input('district_id', req.params.id)
            .query('DELETE FROM [dbo].[ATM_district] WHERE district_id = @district_id');
        res.status(200).send('District deleted successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports = {
    getAllDistricts,
    getDistrictById,
    createDistrict,
    updateDistrict,
    deleteDistrict
}; 