import express from 'express';
import JourneyPlanController from '../controllers/JourneyPlanController.class.js';

const controller = JourneyPlanController.getInstance();

const router = express.Router();

router.get(
    '/',
    controller.checkForJWTToken,
    (req, res)=>{
        controller.getPlansByUserId(req, res).catch(error=>{
            console.error(error);
            res.status(500).json({error:'An error has occurred'});
        });
    }
);

router.post(
    '/',
    controller.checkForJWTToken,
    (req, res)=>{
        controller.addPlan(req, res).catch((error)=>{
            console.error(error);
            res.status(500).json({error:'An error has occurred'});
        });
    }
);

router.patch(
    '/',
    controller.checkForJWTToken,
    (req, res)=>{
        controller.updatePlan(req, res).catch((error)=>{
            console.error(error);
            res.status(500).json({error:'An error has occurred'});
        });
    }
);

router.delete(
    '/:idJourneyPlans',
    controller.checkForJWTToken,
    (req, res)=>{
        controller.deletePlan(req, res).catch((error)=>{
            console.error(error);
            res.status(500).json({error:'An error has occurred'});
        });
    }
);

export default router;