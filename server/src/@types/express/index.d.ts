import { WixRequest } from "src/schema";

export {};

declare global{
    namespace Express {
        interface Request {
            wix: WixRequest
        }
    }
}