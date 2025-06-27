const { getDB } = require('../database');

// Get all departments
const getAllDepartments = async (req, res) => {
    try {
        const pool = getDB();
        const result = await pool.request().query('SELECT * FROM [dbo].[Department]');
        res.status(200).json({
            status: "success",
            message: "Departments fetched successfully",
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

// Get department by ID
const getDepartmentById = async (req, res) => {
    try {
        const pool = getDB();
        const result = await pool.request()
            .input('id', req.params.id)
            .query('SELECT * FROM [dbo].[Department] WHERE id = @id');

        const department = result.recordset[0];

        if (department) {
            res.status(200).json({
                status: "success",
                message: "Department fetched successfully",
                data: department
            });
        } else {
            res.status(404).json({
                status: "error",
                message: "Department not found",
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

// Create department
const createDepartment = async (req, res) => {
    try {
        const { DeptName, Deptid, shortname, status, archive, showonwebsite, aboutdeptt } = req.body;
        const pool = getDB();
        await pool.request()
            .input('DeptName', DeptName)
            .input('Deptid', Deptid)
            .input('shortname', shortname)
            .input('status', status)
            .input('archive', archive)
            .input('showonwebsite', showonwebsite)
            .input('aboutdeptt', aboutdeptt)
            .query(`INSERT INTO [dbo].[Department] 
                    (DeptName, Deptid, shortname, status, archive, showonwebsite, aboutdeptt)
                    VALUES 
                    (@DeptName, @Deptid, @shortname, @status, @archive, @showonwebsite, @aboutdeptt)`);

        res.status(201).json({
            status: "success",
            message: "Department created successfully",
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

// Update department
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
            .query(`UPDATE [dbo].[Department] 
                    SET DeptName = @DeptName, Deptid = @Deptid, shortname = @shortname, 
                        status = @status, archive = @archive, showonwebsite = @showonwebsite, 
                        aboutdeptt = @aboutdeptt 
                    WHERE id = @id`);

        res.status(200).json({
            status: "success",
            message: "Department updated successfully",
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

// Delete department
const deleteDepartment = async (req, res) => {
    try {
        const pool = getDB();
        await pool.request()
            .input('id', req.params.id)
            .query('DELETE FROM [dbo].[Department] WHERE id = @id');

        res.status(200).json({
            status: "success",
            message: "Department deleted successfully",
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
    getAllDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment
};
