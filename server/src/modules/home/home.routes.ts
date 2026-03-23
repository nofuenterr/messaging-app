import { Router } from 'express';

import * as homeController from './home.controller.js';

const homeRouter = Router();

// "/"
homeRouter.get('/', homeController.getUserConversationsWithLatestMessage);

export default homeRouter;
