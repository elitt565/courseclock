import express from 'express';

import { createPassword} from '../controllers/password.controller';

//TODO: Potentially adding reset password functionality
const router = express.Router();

router.post('/', createPassword);
// router.get('/password', getPassword);
// router.put('/password', updatePassword);

export default router;
