// express 모듈을 사용.
import { Router } from 'express';
/**
 * @swagger
 * tags:
 *  name: Restaurant
 *  description: Restaurants's Router
 */

// express 모듈의 Router()를 사용해 router 생성
const restaurantRouter = Router();

import { inputValidationParam, validationCheck } from '../middleware/restaurantValidator.js';

import { isLogin } from '../middleware/authChecker.js';

import showAllRestaurants from '../controller/restaurantController.js';


restaurantRouter.get('/restaurants', isLogin, inputValidationParam, validationCheck, showAllRestaurants);

export default restaurantRouter;