const express = require('express');
const router = express.Router();
const {
    getAllTehsils,
    getTehsilById,
    createTehsil,
    updateTehsil,
    deleteTehsil
} = require('../controllers/tehsilController');

router.get('/', getAllTehsils);
router.get('/:id', getTehsilById);
router.post('/', createTehsil);
router.put('/:id', updateTehsil);
router.delete('/:id', deleteTehsil);

module.exports = router; 