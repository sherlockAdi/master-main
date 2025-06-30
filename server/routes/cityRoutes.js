const express = require('express');
const router = express.Router();
const {
    getAllCities,
    getCityById,
    createCity,
    updateCity,
    deleteCity,
    getTopCities,
    getAllCitiessum,
    getUnassociatedCityStudentCount
} = require('../controllers/cityController');

router.get('/', getAllCities);
router.get('/sum', getAllCitiessum);
router.get('/top', getTopCities);
router.get('/students/unassociated-city-count', getUnassociatedCityStudentCount);
router.get('/:id', getCityById);
router.post('/', createCity);
router.put('/:id', updateCity);
router.delete('/:id', deleteCity);

module.exports = router; 