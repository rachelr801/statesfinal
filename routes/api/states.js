const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/statesController');

router.route('/')
    .get(ctrl.getAllStates);

router.route('/:state')
    .get(ctrl.getState);

router.route('/:state/funfact')
    .get(ctrl.getFunFact)
    .post(ctrl.addFunFacts)
    .patch(ctrl.updateFunFact)
    .delete(ctrl.deleteFunFact);

router.get('/:state/capital', ctrl.getCapital);
router.get('/:state/nickname', ctrl.getNickname);
router.get('/:state/population', ctrl.getPopulation);
router.get('/:state/admission', ctrl.getAdmission);

module.exports = router;

