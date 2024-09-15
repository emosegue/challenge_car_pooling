import { Router, Request, Response } from 'express';
import { CarController, JourneyController } from '@controllers';
import { HTTP_STATUS_CODE } from '@constants';

const router = Router();

router.get('/status', (_req: Request, res: Response) => {
    res.status(HTTP_STATUS_CODE.OK)
    res.send()
});

router.put('/cars', CarController);
router.post('/journey', JourneyController);

router.post('/locate', (_req: Request, res: Response) => {
    res.status(200)
    res.send()
});

router.post('/locate', (_req: Request, res: Response) => {
    res.status(200)
    res.send()
});


export default router;