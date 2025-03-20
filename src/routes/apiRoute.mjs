import { Router } from 'express'
import form from '../endpoints/form.mjs'
import session from '../endpoints/session.mjs'
const router = Router();

router.use('/form', form);
router.use('/session', session);

export default router;