const { getDB } = require('../database');

// Get all designations
const getAllDesignations = async (req, res) => {
    try {
        const pool = getDB();
        const { departmentid } = req.query;
        let query = 'SELECT * FROM [dbo].[ATM_Designation_U88]';
        if (departmentid) {
            query += ' WHERE departmentid = ' + parseInt(departmentid);
        }
        const result = await pool.request().query(query);
        res.status(200).json({
            status: "success",
            message: "Designations fetched successfully",
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

// Get designation by ID
const getDesignationById = async (req, res) => {
    try {
        const pool = getDB();
        const result = await pool.request()
            .input('id', req.params.id)
            .query('SELECT * FROM [dbo].[ATM_Designation_U88] WHERE id = @id');

        const designation = result.recordset[0];

        if (designation) {
            res.status(200).json({
                status: "success",
                message: "Designation fetched successfully",
                data: designation
            });
        } else {
            res.status(404).json({
                status: "error",
                message: "Designation not found",
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

// Create a new designation
const createDesignation = async (req, res) => {
    try {
        const { Desgid, Desgname, shortname, departmentid, status, archive, gradeid } = req.body;
        const pool = getDB();
        await pool.request()
            .input('Desgid', Desgid)
            .input('Desgname', Desgname)
            .input('shortname', shortname)
            .input('departmentid', departmentid)
            .input('status', status)
            .input('archive', archive)
            .input('gradeid', gradeid)
            .query(`INSERT INTO [dbo].[ATM_Designation_U88] 
                    (Desgid, Desgname, shortname, departmentid, status, archive, gradeid)
                    VALUES 
                    (@Desgid, @Desgname, @shortname, @departmentid, @status, @archive, @gradeid)`);

        res.status(201).json({
            status: "success",
            message: "Designation created successfully",
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

// Update a designation
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
            .query(`UPDATE [dbo].[ATM_Designation_U88] 
                    SET Desgid = @Desgid, Desgname = @Desgname, shortname = @shortname, 
                        departmentid = @departmentid, status = @status, archive = @archive, 
                        gradeid = @gradeid 
                    WHERE id = @id`);

        res.status(200).json({
            status: "success",
            message: "Designation updated successfully",
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

// Delete a designation
const deleteDesignation = async (req, res) => {
    try {
        const pool = getDB();
        await pool.request()
            .input('id', req.params.id)
            .query('DELETE FROM [dbo].[ATM_Designation_U88] WHERE id = @id');

        res.status(200).json({
            status: "success",
            message: "Designation deleted successfully",
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
    getAllDesignations,
    getDesignationById,
    createDesignation,
    updateDesignation,
    deleteDesignation
};
