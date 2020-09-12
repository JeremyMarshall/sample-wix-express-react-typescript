import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';

import WixConfig from '../../entities/WixConfig';

// import UserDao from '@daos/User/UserDao.mock';
import { paramMissingError } from '@shared/constants';
import { receiveMessageOnPort } from 'worker_threads';

// Init shared
const router = Router();
// const userDao = new UserDao();


/******************************************************************************
 *                      "GET /api/wix/signup"
 ******************************************************************************/

router.get('/signup', async (req: Request, res: Response) => {
    // This route  is called before the user is asked to provide consent
    // Configure the `Redirect URL` in  Wix Developers to point here
    // *** PUT YOUR SIGNUP CODE HERE *** ///

    const redirectUrl = `https://${req.get('host')}/api/wix/login`;
    const token = req.query.token;
    const url = `${WixConfig.permissionRequestUrl}?token=${token}&appId=${WixConfig.appId}&redirectUrl=${redirectUrl}`

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
        const data = await WixConfig.getTokensFromWix(authorizationCode);

        const refreshToken: string = data.refresh_token as string;
        const accessToken: string = data.access_token as string;

        console.log("refreshToken = " + refreshToken);
        console.log("accessToken = " + accessToken);
        console.log("=============================");

        const instance = await WixConfig.getAppInstance(refreshToken);

        const url = `https://www.wix.com/_api/site-apps/v1/site-apps/token-received?${accessToken}`;
        console.log("=============================");
        console.log(`redirect login ${url}`);

        // TODO: Save the instanceId and tokens for future API calls

        // need to post https://www.wix.com/app-oauth-installation/token-received to notif wix that we finished getting the token
        res.redirect(url);

    } catch (wixError) {
        console.log("Error getting token from Wix");
        console.log({ wixError });
        res.status(500);
        return;
    }
});

export default router;
