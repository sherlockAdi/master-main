const express = require('express');
const router = express.Router();
const {
    getAllStates,
    getStateById,
    createState,
    updateState,
    deleteState,
    getstatesummary
} = require('../controllers/stateController');

router.get('/', getAllStates);
router.get('/sum', getstatesummary)
router.get('/:id', getStateById);
router.post('/', createState);
router.put('/:id', updateState);
router.delete('/:id', deleteState);

module.exports = router; 