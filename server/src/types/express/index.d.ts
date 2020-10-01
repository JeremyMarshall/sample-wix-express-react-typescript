import { WixRequest } from '@schema';

export {};

declare global{
    namespace Express {
        interface Request {
            wix: WixRequest
        }
    }
}