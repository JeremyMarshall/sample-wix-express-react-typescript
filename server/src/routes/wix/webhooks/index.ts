import { Request, Response, Router } from 'express';
import bodyParser from 'body-parser';

import { WixRequest} from '@schema';
import { WixConfigInstance } from '@entities';

// Init shared
const router = Router();

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.text());
router.use(bodyParser.json());

router.use(async function (req: Request, res: Response, next: Function) {
    console.log('got webhook event from Wix!', req.body);
    console.log("===========================");
    try {
        req.wix = new WixRequest({ webHook: WixConfigInstance.verify(req.body) });

        if (!req.wix.webHook) {
            res.status(401).end();
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(500).end();
    }
})


/******************************************************************************
 *                      "POST /api/wix/webhooks/removed"
 ******************************************************************************/
router.post('/removed', (req, res) => {
    try {
        if (req.wix.webHook && req.wix.webHook?.eventType == 'AppRemoved') {
            const instance = req.wix.webHook.instanceId as string;
            WixConfigInstance.deleteInstance(req.wix.webHook.instanceId)
                .then( response => console.log(`deleted: ${instance} response: ${response.deleted}`));

            res.status(200).send(req.body);
        } else {
            res.status(400).end();

        }
    } catch (error) {
        console.log(error);
        res.status(500).end();
    }
});
  
export default router;
