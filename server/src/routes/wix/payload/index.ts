import { Request, Response, Router } from 'express';
import { Token } from 'src/schema';

import { WixConfigInstance } from '../../../entities/';

// Init shared
const router = Router();

router.use(function (req: Request, res: Response, next: Function) {
    if (typeof req.headers['instance'] != 'string') {
        res.status(403).end();
    } else {
        const instance = WixConfigInstance.decodeInstance(req.headers['instance']);
        if (typeof instance == 'undefined') {
            res.status(403).end();
        } else {
            req.instance = instance as Token;
            next();
        }
    }
})

router.use(async function (req: Request, res: Response, next: Function) {
    const wixToken = await WixConfigInstance.getToken(req.instance.instanceId)
    if (typeof wixToken != 'string') {
        res.status(403).end();
    } else {
        req.wixToken = wixToken as string;
        next();
    }
})

/******************************************************************************
 *                      "GET /api/wix/payload/instance"
 ******************************************************************************/

router.get('/instance', (req: Request, res: Response) => {
    console.log(req.instance)
    const payload = [req.instance];
    console.log(JSON.stringify(payload));
    return res.status(200).json({payload});
});

router.get('/test2', async (req: Request, res: Response) => {
    console.log(req.instance)
    res.status(200).json("{'status':200}");
});
export default router;
