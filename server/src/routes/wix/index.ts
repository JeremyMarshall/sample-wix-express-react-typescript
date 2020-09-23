import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';
import path from 'path';

import { WixConfigInstance } from '../../entities/';

// import UserDao from '@daos/User/UserDao.mock';
import { paramMissingError } from '@shared/constants';
import { receiveMessageOnPort } from 'worker_threads';
import Axios from 'axios';
import bodyParser from 'body-parser';

import WixPayloadRouter from './payload';

// Init shared
const router = Router();
// const userDao = new UserDao();

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.text());
router.use(bodyParser.json());

/******************************************************************************
 *                      "GET /api/wix/signup"
 ******************************************************************************/

router.get('/signup',  (req: Request, res: Response) => {
    // This route  is called before the user is asked to provide consent
    // Configure the `Redirect URL` in  Wix Developers to point here
    // *** PUT YOUR SIGNUP CODE HERE *** ///

    const redirectUrl = `https://${req.get('host')}/api/wix/login`;
    const token = req.query.token;
    const url = `${WixConfigInstance.permissionRequestUrl}?token=${token}&appId=${WixConfigInstance.appId}&redirectUrl=${redirectUrl}`

    console.log("=============================");
    console.log(`redirect signup ${url}`);

    res.redirect(url);
});

/******************************************************************************
 *                      "GET /api/wix/login"
 ******************************************************************************/
router.get('/login', async (req, res) => {
    // This route  is called once the user finished installing your application and Wix redirects them to your application's site (here).
    // Configure the `App URL` in the Wix Developers to point here
    // *** PUT YOUR LOGIN CODE HERE *** ///

    const authorizationCode: string = req.query.code as string;

    console.log("authorizationCode = " + authorizationCode);

    try {
        const tokens = await WixConfigInstance.getTokensFromWix(authorizationCode);

        const instance = await WixConfigInstance.getAppInstance(tokens.refresh_token);
        // TODO: Save the instanceId and tokens for future API calls

        // need to post https://www.wix.com/app-oauth-installation/token-received to notify wix that we finished getting the token
        const url = `https://www.wix.com/_api/site-apps/v1/site-apps/token-received?${tokens.access_token }`;
        // res.redirect(url);

        // or post to here to complete the oauth flow
        // and carry on
        // this gave a forbidden message
        // Axios.post('https://www.wix.com/_api/site-apps/v1/site-apps/token-received', {
        //     headers: {'Authorization': authorizationCode}
        // })

        Axios.get(url)
        .then((response) => {
            res.sendFile('thanks.html', {root: path.join(__dirname, 'views')});
        })
        .catch((error) => {
            console.log(error);
            res.sendFile('error.html', {root: path.join(__dirname, 'views')});
        })
    } catch (wixError) {
        console.log("Error getting token from Wix");
        console.log({ wixError });
        res.status(500).end();
        return;
    }
});

/******************************************************************************
 *                      "GET /api/wix/instance"
 ******************************************************************************/
router.get('/instance',  (req, res) => {
    const instance = WixConfigInstance.decodeInstance(req.headers.instance as string);
    res.send(instance);
});

/******************************************************************************
 *                      "POST /api/wix/webhook-callback"
 ******************************************************************************/
router.post('/webhook-callback', (req, res) => {
    try {
        console.log('got webhook event from Wix!', req.body);
        console.log("===========================");
        const data = WixConfigInstance.verify(req.body);

        if (data?.eventType == 'AppRemoved') {
            WixConfigInstance.deleteInstance(data.instanceId)
                .then( response => console.log(`deleted: ${data.instanceId} response: ${response.deleted}`));
        }

        if (data) {
            console.log('webhook event data after verification:', data);
            res.status(200).send(req.body);
        } else {
            res.status(400).end();

        }
    } catch (error) {
        console.log(error);
        res.status(500).end();
    }
  });

router.use('/payload', WixPayloadRouter);

export default router;
