import { Router } from 'express';
import WixRouter from './wix';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/wix', WixRouter);

// Export the base-router
export default router;
