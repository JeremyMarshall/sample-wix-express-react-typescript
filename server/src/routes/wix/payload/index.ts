import { Request, Response, Router } from 'express';
import { Token, WixRequest } from '@schema';

import { WixConfigInstance } from '@entities';

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
            req.wix = new WixRequest({ instance: instance });
            req.wix.instance = instance as Token;
            next();
        }
    }
})

router.use(async function (req: Request, res: Response, next: Function) {
    if (req.wix.instance) {
        const wixToken = await WixConfigInstance.getToken(req.wix.instance.instanceId)
        if (typeof wixToken != 'string') {
            res.status(403).end();
        } else {
            req.wix.wixToken = wixToken as string;
            next();
        }
    } else {
        res.status(403).end();
    }
})

/******************************************************************************
 *                      "GET /api/wix/payload/instance"
 ******************************************************************************/

router.get('/instance', (req: Request, res: Response) => {
    console.log(req.wix.instance)
    const payload = [req.wix.instance];
    console.log(JSON.stringify(payload));
    return res.status(200).json({payload});
});

router.get('/test2', async (req: Request, res: Response) => {
    console.log(req.wix.instance)
    res.status(200).json("{'status':200}");
});
export default router;
