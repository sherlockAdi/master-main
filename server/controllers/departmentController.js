const { getDB } = require('../database');

const getAllDepartments = async (req, res) => {
    try {
        const pool = getDB();
        const result = await pool.request().query('SELECT * FROM [dbo].[Department]');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const getDepartmentById = async (req, res) => {
    try {
        const pool = getDB();
        const result = await pool.request()
            .input('id', req.params.id)
            .query('SELECT * FROM [dbo].[Department] WHERE id = @id');
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const createDepartment = async (req, res) => {
    try {
        const { DeptName, Deptid, shortname, status, archive, showonwebsite, aboutdeptt } = req.body;
        const pool = getDB();
        const result = await pool.request()
            .input('DeptName', DeptName)
            .input('Deptid', Deptid)
            .input('shortname', shortname)
            .input('status', status)
            .input('archive', archive)
            .input('showonwebsite', showonwebsite)
            .input('aboutdeptt', aboutdeptt)
            .query(`INSERT INTO [dbo].[Department] (DeptName, Deptid, shortname, status, archive, showonwebsite, aboutdeptt)
                    VALUES (@DeptName, @Deptid, @shortname, @status, @archive, @showonwebsite, @aboutdeptt)`);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const updateDepartment = async (req, res) => {
    try {
        const { DeptName, Deptid, shortname, status, archive, showonwebsite, aboutdeptt } = req.body;
        const pool = getDB();
        await pool.request()
            .input('id', req.params.id)
            .input('DeptName', DeptName)
            .input('Deptid', Deptid)
            .input('shortname', shortname)
            .input('status', status)
            .input('archive', archive)
            .input('showonwebsite', showonwebsite)
            .input('aboutdeptt', aboutdeptt)
            .query(`UPDATE [dbo].[Department] SET DeptName = @DeptName, Deptid = @Deptid, shortname = @shortname, status = @status, archive = @archive, showonwebsite = @showonwebsite, aboutdeptt = @aboutdeptt WHERE id = @id`);
        res.status(200).send('Department updated successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const deleteDepartment = async (req, res) => {
    try {
        const pool = getDB();
        await pool.request()
            .input('id', req.params.id)
            .query('DELETE FROM [dbo].[Department] WHERE id = @id');
        res.status(200).send('Department deleted successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports = {
    getAllDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment
}; 