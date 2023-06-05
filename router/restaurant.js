// express 모듈을 사용.
import { Router } from 'express';
import { inputValidationParam, validationCheck } from '../middleware/restaurantValidator.js';
import { isLogin } from '../middleware/authChecker.js';
import showAllRestaurants from '../controller/restaurantController.js';

const restaurantRouter = Router();

restaurantRouter.get('/restaurants', isLogin, inputValidationParam, validationCheck, showAllRestaurants);

export default restaurantRouter;