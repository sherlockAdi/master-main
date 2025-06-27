const express = require('express');
const router = express.Router();
const localityController = require('../controllers/localityController');

router.get('/', localityController.getAllTehsilSum);
router.get('/sum', localityController.getAllTehsilSum); // Optional: only if implemented
router.get('/top', localityController.getTopTehsils);
// router.get('/:id', localityController.get);
router.post('/', localityController.createTehsil);
router.put('/:id', localityController.updateTehsil);
router.delete('/:id', localityController.deleteTehsil);

module.exports = router;
