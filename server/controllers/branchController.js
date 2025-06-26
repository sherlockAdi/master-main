const { getDB } = require('../database');

// Get all branches
const getAllBranches = async (req, res) => {
    try {
        const pool = getDB();
        const result = await pool.request().query(`
            SELECT TOP (1000) [id], [Branchid], [Branchname], [LocationId], [cityname], 
            [statename], [countryname], [Address], [phoneNo], [collegeid], [status], 
            [archive], [shortname], [email], [url], [checkwebsite], [feebasedon], 
            [istrainingcenter], [tehsil], [isactive], [defaultAccount], [ATMBCode] 
            FROM [beta_atmcoll1_COMM_U88].[dbo].[ATM_Branches]
        `);
        res.status(200).json({
            status: "success",
            message: "Branches fetched successfully",
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

// Get branch by ID
const getBranchById = async (req, res) => {
    try {
        const pool = getDB();
        const result = await pool.request()
            .input('id', req.params.id)
            .query('SELECT * FROM [beta_atmcoll1_COMM_U88].[dbo].[ATM_Branches] WHERE id = @id');

        const branch = result.recordset[0];

        if (branch) {
            res.status(200).json({
                status: "success",
                message: "Branch fetched successfully",
                data: branch
            });
        } else {
            res.status(404).json({
                status: "error",
                message: "Branch not found",
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

// Create a new branch
const createBranch = async (req, res) => {
    try {
        const {
            Branchid, Branchname, LocationId, cityname, statename, countryname,
            Address, phoneNo, collegeid, status, archive, shortname, email, url,
            checkwebsite, feebasedon, istrainingcenter, tehsil, isactive,
            defaultAccount, ATMBCode
        } = req.body;

        const pool = getDB();
        await pool.request()
            .input('Branchid', Branchid)
            .input('Branchname', Branchname)
            .input('LocationId', LocationId)
            .input('cityname', cityname)
            .input('statename', statename)
            .input('countryname', countryname)
            .input('Address', Address)
            .input('phoneNo', phoneNo)
            .input('collegeid', collegeid)
            .input('status', status)
            .input('archive', archive)
            .input('shortname', shortname)
            .input('email', email)
            .input('url', url)
            .input('checkwebsite', checkwebsite)
            .input('feebasedon', feebasedon)
            .input('istrainingcenter', istrainingcenter)
            .input('tehsil', tehsil)
            .input('isactive', isactive)
            .input('defaultAccount', defaultAccount)
            .input('ATMBCode', ATMBCode)
            .query(`
                INSERT INTO [beta_atmcoll1_COMM_U88].[dbo].[ATM_Branches]
                (Branchid, Branchname, LocationId, cityname, statename, countryname,
                Address, phoneNo, collegeid, status, archive, shortname, email, url,
                checkwebsite, feebasedon, istrainingcenter, tehsil, isactive, defaultAccount, ATMBCode)
                VALUES (@Branchid, @Branchname, @LocationId, @cityname, @statename, @countryname,
                @Address, @phoneNo, @collegeid, @status, @archive, @shortname, @email, @url,
                @checkwebsite, @feebasedon, @istrainingcenter, @tehsil, @isactive, @defaultAccount, @ATMBCode)
            `);

        res.status(201).json({
            status: "success",
            message: "Branch created successfully",
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

// Update branch by ID
const updateBranch = async (req, res) => {
    try {
        const {
            Branchid, Branchname, LocationId, cityname, statename, countryname,
            Address, phoneNo, collegeid, status, archive, shortname, email, url,
            checkwebsite, feebasedon, istrainingcenter, tehsil, isactive,
            defaultAccount, ATMBCode
        } = req.body;

        const pool = getDB();
        await pool.request()
            .input('id', req.params.id)
            .input('Branchid', Branchid)
            .input('Branchname', Branchname)
            .input('LocationId', LocationId)
            .input('cityname', cityname)
            .input('statename', statename)
            .input('countryname', countryname)
            .input('Address', Address)
            .input('phoneNo', phoneNo)
            .input('collegeid', collegeid)
            .input('status', status)
            .input('archive', archive)
            .input('shortname', shortname)
            .input('email', email)
            .input('url', url)
            .input('checkwebsite', checkwebsite)
            .input('feebasedon', feebasedon)
            .input('istrainingcenter', istrainingcenter)
            .input('tehsil', tehsil)
            .input('isactive', isactive)
            .input('defaultAccount', defaultAccount)
            .input('ATMBCode', ATMBCode)
            .query(`
                UPDATE [beta_atmcoll1_COMM_U88].[dbo].[ATM_Branches]
                SET Branchid=@Branchid, Branchname=@Branchname, LocationId=@LocationId,
                cityname=@cityname, statename=@statename, countryname=@countryname,
                Address=@Address, phoneNo=@phoneNo, collegeid=@collegeid, status=@status,
                archive=@archive, shortname=@shortname, email=@email, url=@url,
                checkwebsite=@checkwebsite, feebasedon=@feebasedon, istrainingcenter=@istrainingcenter,
                tehsil=@tehsil, isactive=@isactive, defaultAccount=@defaultAccount, ATMBCode=@ATMBCode
                WHERE id=@id
            `);

        res.status(200).json({
            status: "success",
            message: "Branch updated successfully",
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

// Delete branch by ID
const deleteBranch = async (req, res) => {
    try {
        const pool = getDB();
        await pool.request()
            .input('id', req.params.id)
            .query('DELETE FROM [beta_atmcoll1_COMM_U88].[dbo].[ATM_Branches] WHERE id = @id');

        res.status(200).json({
            status: "success",
            message: "Branch deleted successfully",
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
    getAllBranches,
    getBranchById,
    createBranch,
    updateBranch,
    deleteBranch
};
