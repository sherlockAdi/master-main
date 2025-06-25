const { getDB } = require('../database');

const getAllBranches = async (req, res) => {
    try {
        const pool = getDB();
        const result = await pool.request().query('SELECT TOP (1000) [id], [Branchid], [Branchname], [LocationId], [cityname], [statename], [countryname], [Address], [phoneNo], [collegeid], [status], [archive], [shortname], [email], [url], [checkwebsite], [feebasedon], [istrainingcenter], [tehsil], [isactive], [defaultAccount], [ATMBCode] FROM [beta_atmcoll1_COMM_U88].[dbo].[ATM_Branches]');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const getBranchById = async (req, res) => {
    try {
        const pool = getDB();
        const result = await pool.request()
            .input('id', req.params.id)
            .query('SELECT * FROM [beta_atmcoll1_COMM_U88].[dbo].[ATM_Branches] WHERE id = @id');
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const createBranch = async (req, res) => {
    try {
        const { Branchid, Branchname, LocationId, cityname, statename, countryname, Address, phoneNo, collegeid, status, archive, shortname, email, url, checkwebsite, feebasedon, istrainingcenter, tehsil, isactive, defaultAccount, ATMBCode } = req.body;
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
            .query('INSERT INTO [beta_atmcoll1_COMM_U88].[dbo].[ATM_Branches] (Branchid, Branchname, LocationId, cityname, statename, countryname, Address, phoneNo, collegeid, status, archive, shortname, email, url, checkwebsite, feebasedon, istrainingcenter, tehsil, isactive, defaultAccount, ATMBCode) VALUES (@Branchid, @Branchname, @LocationId, @cityname, @statename, @countryname, @Address, @phoneNo, @collegeid, @status, @archive, @shortname, @email, @url, @checkwebsite, @feebasedon, @istrainingcenter, @tehsil, @isactive, @defaultAccount, @ATMBCode)');
        res.status(201).send('Branch created successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const updateBranch = async (req, res) => {
    try {
        const { Branchid, Branchname, LocationId, cityname, statename, countryname, Address, phoneNo, collegeid, status, archive, shortname, email, url, checkwebsite, feebasedon, istrainingcenter, tehsil, isactive, defaultAccount, ATMBCode } = req.body;
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
            .query('UPDATE [beta_atmcoll1_COMM_U88].[dbo].[ATM_Branches] SET Branchid=@Branchid, Branchname=@Branchname, LocationId=@LocationId, cityname=@cityname, statename=@statename, countryname=@countryname, Address=@Address, phoneNo=@phoneNo, collegeid=@collegeid, status=@status, archive=@archive, shortname=@shortname, email=@email, url=@url, checkwebsite=@checkwebsite, feebasedon=@feebasedon, istrainingcenter=@istrainingcenter, tehsil=@tehsil, isactive=@isactive, defaultAccount=@defaultAccount, ATMBCode=@ATMBCode WHERE id=@id');
        res.status(200).send('Branch updated successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const deleteBranch = async (req, res) => {
    try {
        const pool = getDB();
        await pool.request()
            .input('id', req.params.id)
            .query('DELETE FROM [beta_atmcoll1_COMM_U88].[dbo].[ATM_Branches] WHERE id = @id');
        res.status(200).send('Branch deleted successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports = {
    getAllBranches,
    getBranchById,
    createBranch,
    updateBranch,
    deleteBranch
}; 