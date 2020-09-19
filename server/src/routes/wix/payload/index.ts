import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';

import { WixConfigInstance } from '../../../entities/';

import { paramMissingError } from '@shared/constants';
import { receiveMessageOnPort } from 'worker_threads';
import express from 'express';
import Axios from 'axios';

import { Token } from '../schema'

// Init shared
const router = Router();

router.use(function (req: Request, res: Response, next: Function) {
    req.instance = WixConfigInstance.decodeInstance(req.headers['instance'] as string)
    next();
})

/******************************************************************************
 *                      "GET /api/wix/payload/instance"
 ******************************************************************************/

router.get('/instance', async (req: Request, res: Response) => {
    console.log(req.instance)
    const payload = [req.instance];
    console.log(JSON.stringify(payload));
    return res.status(OK).json({payload});
});

router.get('/test2', async (req: Request, res: Response) => {
    console.log(req.instance)
    res.status(200).json("{'status':200}");
});
export default router;
