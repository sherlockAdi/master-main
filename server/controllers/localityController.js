const { getDB } = require('../database');

// Get all tehsils
const getAllTehsils = async (req, res) => {
    try {
        const pool = getDB();
        const result = await pool.request().query('SELECT * FROM [dbo].[ATM_UPSDM_Tehsil_U88]');
        res.status(200).json({
            status: "success",
            message: "Tehsils fetched successfully",
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

// Get tehsil by ID
const getTehsilById = async (req, res) => {
    try {
        const pool = getDB();
        const result = await pool.request()
            .input('tehsil_id', req.params.id)
            .query('SELECT * FROM [dbo].[ATM_UPSDM_Tehsil_U88] WHERE tehsil_id = @tehsil_id');

        const tehsil = result.recordset[0];

        if (tehsil) {
            res.status(200).json({
                status: "success",
                message: "Tehsil fetched successfully",
                data: tehsil
            });
        } else {
            res.status(404).json({
                status: "error",
                message: "Tehsil not found",
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

// Create a new tehsil
const createTehsil = async (req, res) => {
    try {
        const { district_code, tehsil_code, Tehsil_names, atmcityid } = req.body;
        const pool = getDB();
        await pool.request()
            .input('district_code', district_code)
            .input('tehsil_code', tehsil_code)
            .input('Tehsil_names', Tehsil_names)
            .input('atmcityid', atmcityid)
            .query(`
                INSERT INTO [dbo].[ATM_UPSDM_Tehsil_U88]
                (district_code, tehsil_code, Tehsil_names, atmcityid)
                VALUES (@district_code, @tehsil_code, @Tehsil_names, @atmcityid)
            `);

        res.status(201).json({
            status: "success",
            message: "Tehsil created successfully",
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

// Update tehsil by ID
const updateTehsil = async (req, res) => {
    try {
        const { district_code, tehsil_code, Tehsil_names, atmcityid } = req.body;
        const pool = getDB();
        await pool.request()
            .input('tehsil_id', req.params.id)
            .input('district_code', district_code)
            .input('tehsil_code', tehsil_code)
            .input('Tehsil_names', Tehsil_names)
            .input('atmcityid', atmcityid)
            .query(`
                UPDATE [dbo].[ATM_UPSDM_Tehsil_U88]
                SET district_code = @district_code, tehsil_code = @tehsil_code,
                    Tehsil_names = @Tehsil_names, atmcityid = @atmcityid
                WHERE tehsil_id = @tehsil_id
            `);

        res.status(200).json({
            status: "success",
            message: "Tehsil updated successfully",
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

// Delete tehsil by ID
const deleteTehsil = async (req, res) => {
    try {
        const pool = getDB();
        await pool.request()
            .input('tehsil_id', req.params.id)
            .query('DELETE FROM [dbo].[ATM_UPSDM_Tehsil_U88] WHERE tehsil_id = @tehsil_id');

        res.status(200).json({
            status: "success",
            message: "Tehsil deleted successfully",
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

// Get top 1000 tehsils
const getTopTehsils = async (req, res) => {
    try {
        const pool = getDB();
        const result = await pool.request().query(`
            SELECT TOP (1000) [tehsil_id], [district_code], [tehsil_code], [Tehsil_names], [atmcityid]
            FROM [dbo].[ATM_UPSDM_Tehsil_U88]
        `);

        res.status(200).json({
            status: "success",
            message: "Top tehsils fetched successfully",
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


// Get all tehsils with student count summary
const getAllTehsilSum = async (req, res) => {
    try {
        const pool = getDB();
        const result = await pool.request().query(`
            SELECT 
                t.tehsil_id,
                t.district_code,
                t.tehsil_code,
                t.Tehsil_names,
                t.atmcityid,
                (
                    SELECT COUNT(DISTINCT sg.sid)
                    FROM [dbo].[Atm_T_StudentGurdianinfo88] sg
                    WHERE sg.tehsile_code = t.tehsil_id
                ) AS TotalStudents
            FROM [dbo].[ATM_UPSDM_Tehsil_U88] t
            ORDER BY t.tehsil_id
        `);

        res.status(200).json({
            status: "success",
            message: "Tehsils with summary fetched successfully",
            data: result.recordset
        });
    } catch (err) {
        console.error("Tehsil Summary API Error:", err);
        res.status(500).json({
            status: "error",
            message: err.message,
            data: null
        });
    }
};




module.exports = {
    getAllTehsils,
    getTehsilById,
    createTehsil,
    updateTehsil,
    deleteTehsil,
    getTopTehsils,
    getAllTehsilSum,
};
