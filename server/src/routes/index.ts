import { Router } from 'express';
import UserRouter from './Users';
import WixRouter from './wix';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/users', UserRouter);
router.use('/wix', WixRouter);

// Export the base-router
export default router;
