import { Router, Request, Response } from 'express';
const router = Router();

router.get('/ping', (_req: Request, res: Response) => {
    res.json({
        message: 'Pong'
    });
});

export default router;