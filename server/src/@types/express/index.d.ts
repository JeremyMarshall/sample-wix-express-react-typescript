import { Token } from "src/schema";

export {};

declare global{
    namespace Express {
        interface Request {
            instance: Token
        }
    }
}