const express = require('express');
const router = express.Router();
const {
    getAllTehsils,
    getTehsilById,
    createTehsil,
    updateTehsil,
    deleteTehsil,
    getTopTehsils,
    getAllTehsilSum,
    getUnassociatedLocalityStudentCount
} = require('../controllers/localityController');

router.get('/', getAllTehsils);
router.get('/sum', getAllTehsilSum);
router.get('/top', getTopTehsils);
router.get('/students/unassociated-locality-count', getUnassociatedLocalityStudentCount);
router.get('/:id', getTehsilById);
router.post('/', createTehsil);
router.put('/:id', updateTehsil);
router.delete('/:id', deleteTehsil);

module.exports = router;
