const { getDB } = require('../database');

const getAllDesignations = async (req, res) => {
    try {
        const pool = getDB();
        const result = await pool.request().query('SELECT * FROM [dbo].[Designation]');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const getDesignationById = async (req, res) => {
    try {
        const pool = getDB();
        const result = await pool.request()
            .input('id', req.params.id)
            .query('SELECT * FROM [dbo].[Designation] WHERE id = @id');
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const createDesignation = async (req, res) => {
    try {
        const { Desgid, Desgname, shortname, departmentid, status, archive, gradeid } = req.body;
        const pool = getDB();
        const result = await pool.request()
            .input('Desgid', Desgid)
            .input('Desgname', Desgname)
            .input('shortname', shortname)
            .input('departmentid', departmentid)
            .input('status', status)
            .input('archive', archive)
            .input('gradeid', gradeid)
            .query(`INSERT INTO [dbo].[Designation] (Desgid, Desgname, shortname, departmentid, status, archive, gradeid)
                    VALUES (@Desgid, @Desgname, @shortname, @departmentid, @status, @archive, @gradeid)`);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const updateDesignation = async (req, res) => {
    try {
        const { Desgid, Desgname, shortname, departmentid, status, archive, gradeid } = req.body;
        const pool = getDB();
        await pool.request()
            .input('id', req.params.id)
            .input('Desgid', Desgid)
            .input('Desgname', Desgname)
            .input('shortname', shortname)
            .input('departmentid', departmentid)
            .input('status', status)
            .input('archive', archive)
            .input('gradeid', gradeid)
            .query(`UPDATE [dbo].[Designation] SET Desgid = @Desgid, Desgname = @Desgname, shortname = @shortname, departmentid = @departmentid, status = @status, archive = @archive, gradeid = @gradeid WHERE id = @id`);
        res.status(200).send('Designation updated successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const deleteDesignation = async (req, res) => {
    try {
        const pool = getDB();
        await pool.request()
            .input('id', req.params.id)
            .query('DELETE FROM [dbo].[Designation] WHERE id = @id');
        res.status(200).send('Designation deleted successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports = {
    getAllDesignations,
    getDesignationById,
    createDesignation,
    updateDesignation,
    deleteDesignation
}; 