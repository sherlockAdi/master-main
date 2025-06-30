const express = require('express');
const router = express.Router();
const {
    getAllCountries,
    getCountryById,
    createCountry,
    updateCountry,
    deleteCountry,
    getUnassociatedCountryStudentCount
} = require('../controllers/countryController');

router.get('/', getAllCountries);
router.get('/students/unassociated-country-count', getUnassociatedCountryStudentCount);
router.get('/:id', getCountryById);
router.post('/', createCountry);
router.put('/:id', updateCountry);
router.delete('/:id', deleteCountry);

module.exports = router; 