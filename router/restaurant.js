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

/**
 * @swagger
 *   /restaurants:
 *     get:
 *       summary: Select restaurants' information with pagination and search function
 *       description: Select restaurants' information from restaurant_information table & Response restaurants' information with page and search function
 *       tags:
 *       - Restaurant
 *       parameters:
 *       - in:  query
 *         type:  int
 *         required:  true
 *         default:  1
 *         name:  page
 *         description:  페이지네이션할 때, 페이지에 해당하는 값으로 req.query.page로 받는다. 숫자만 입력 가능하다.
 *       - in:  query
 *         type:  int
 *         required:  true
 *         default:  4
 *         name:  page_size
 *         description:  페이지네이션할 때, 페이지 크기에 해당하는 값으로 req.query.page_size로 받는다. 숫자만 입력 가능하다.
 *       - in:  query
 *         type:  string
 *         required:  false
 *         name:  filter 
 *         description:  검색할 때 검색 기준에 해당하는 값으로 req.query.filter로 받는다. 가게 이름으로 검색하고자 한다면 name, 가게 종류로 검색하고자 한다면 kinds, 위치로 검색하고자 한다면 location으로 입력하면 된다.
 *       - in:  query
 *         type:  string
 *         required:  false
 *         name:  text
 *         description:  검색할 때 검색어에 해당하는 값으로 req.query.text로 받는다. 최소 2글자에서 최대 10글자까지 입력할 수 있다.
 *       produces:
 *       - application/json
 *         text/plain
 *       responses:
 *          "200":
 *              description: 식당 목록 출력 성공으로 DB 테이블에서 req.query의 페이지와 페이지 크기만큼의 식당 목록을 JSON 형식으로 출력한다.
 *              schema:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          restaurant_name:
 *                              type:  string
 *                          restaurant_rating:
 *                              type:  boolean
 *                          restaurant_kind:
 *                              type:  string
 *                          restaurant_address:
 *                              type:  string
 *                          restaurant_image:
 *                              type:  string
 *                          restaurant_link:
 *                              type:  string
 *          "400":
 *              description: req.query(page, page_size, filter, text)를 잘못 입력해 유효성 검사 미들웨어에서 걸러지는 경우이다. 오류가 발생한 이유를 문자열 형식으로 출력한다.
 *              schema:
 *                  type:  object
 *                  properties:
 *                      error:
 *                          type:  object
 *                          properties:
 *                              code:
 *                                  type:  number
 *                                  example:  400
 *                              message:
 *                                  type:  string
 *                                  example:  wrong input at page please input int
 *          "401":
 *              description: 로그인이 안 되어 있는 경우 로그인이 필요한 페이지임을 문자열 형식으로 출력한다.
 *              schema:
 *                  type:  object
 *                  properties:
 *                      error:
 *                          type:  object
 *                          properties:
 *                              code:
 *                                  type:  number
 *                                  example:  401
 *                              message:
 *                                  type:  string
 *                                  example:  Login isn't running please log in          
 *          "404":
 *              description: req.query의 값들을 저장한 배열에 값이 없는 경우 해당 정보가 없음을 문자열 형식으로 출력한다.
 *              schema:
 *                  type:  object
 *                  properties:
 *                      error:
 *                          type:  object
 *                          properties:
 *                              code:
 *                                  type:  number
 *                                  example:  404
 *                              message:
 *                                  type:  string
 *                                  example: There is no result
 */
restaurantRouter.get('/restaurants', isLogin, inputValidationParam, validationCheck, showAllRestaurants);

export default restaurantRouter;