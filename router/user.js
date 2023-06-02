// express 모듈을 사용.
import { Router } from 'express';
/**
 * @swagger
 * tags:
 *  name: User
 *  description: User's Router
 */

// express 모듈의 Router()를 사용해 router 생성
const userRouter = Router();

import { signUpValidationParam, logInValidationParam, makeValidationParam, changePwValidationParam, inputValidationParam, deleteUserValidationParam, validationCheck } from '../middleware/userValidator.js'

import { showInform, signUp, logIn, logOut, changeInform, changePw, deleteUser } from '../controller/userController.js';

import { isLogin, isDoubleLogin } from  '../middleware/authChecker.js';

/**
 * @swagger
 *   /user/{user_id}:
 *     get:
 *       summary: Select user's information
 *       description: Select user's information from user_information table & Response user's information
 *       tags:
 *       - User
 *       parameters:
 *       - in:  path
 *         type:  string
 *         required:  true
 *         default:  zziddae
 *         name:  user_id
 *         description:  해당 회원정보에 해당하는 회원 ID로 req.params로 받는다. 영어만 입력 가능하며 최소 4, 최대 10글자로 입력받아야 한다.
 *       produces:
 *       - application/json
 *         text/plain
 *       responses:
 *          "200":
 *              description: 회원정보 출력 성공으로 DB 테이블에서 req.params의 값을 user_id로 갖는 row의 정보(단, password는 제외)를 JSON 형식으로 출력한다.
 *              schema:
 *                  type: object
 *                  properties:
 *                      userId:
 *                          type:  string
 *                      userName:
 *                          type:  string
 *                      userBirthday:
 *                          type:  string
 *                      userPhoneNum:
 *                          type:  string
 *          "400":
 *              description: req.params.user_id를 잘못 입력했을 경우 오류가 발생한 이유를 문자열 형식으로 출력한다.
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
 *                                  example:  wrong input at userId please input 4 ~ 10 chars long
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
 *          "403":
 *              description: 세션에 저장된 유저 ID와 req.params.user_id의 값이 다를 경우 인가되지 않은 페이지임을 문자열 형식으로 출력한다.
 *              schema:
 *                  type:  object
 *                  properties:
 *                      error:
 *                          type:  object
 *                          properties:
 *                              code:
 *                                  type:  number
 *                                  example:  403
 *                              message:
 *                                  type:  string
 *                                  example: you don't have authority          
 *          "404":
 *              description: DB에서 찾는 회원정보가 없는 경우(삭제되었거나 업데이트가 되어 ID가 바뀌었을 때) 해당 정보가 없음을 문자열 형식으로 출력한다.
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

// 회원 정보 출력 라우터
userRouter.get('/user/:user_id', isLogin, inputValidationParam, validationCheck, showInform);

/**
 * @swagger
 *   /signup:
 *      post:
 *          summary:  Create a new user
 *          description:  Insert new user's information into user_information table
 *          tags:
 *          - User
 *          requestBody:
 *              required: true
 *              description:  회원가입 시 필요한 회원정보를 입력받는 req.body이다.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type:  object
 *                          properties:
 *                              userId:
 *                                  type:  string
 *                                  description:  회원 ID. 영어 대소문자만 가능하고 최소 4글자, 최대 10글자까지 입력 가능하다.
 *                                  example:  zziddae
 *                              userPw:
 *                                  type:  string
 *                                  description:  회원 PW. 영어 대소문자, 숫자, 서버에서 정한 특수문자(~!@#$%^&*()_+|<>?:{})만 가능하고 최소 8글자, 최대 15글자까지 입력 가능하다.
 *                                  example:  Tico@2067
 *                              userName:
 *                                  type:  string
 *                                  description: 회원 이름. 한글만 가능하고 최소 2글자, 최대 5글자까지 입력 가능하다.
 *                                  example:  노근우
 *                              userBirthday:
 *                                  type:  string
 *                                  description:  회원 생년월일. 문자열로 받으며 "xxxx-xx-xx" 형식으로 입력받아야 한다. 년도는 1900년부터 2000년대까지 입력 가능하고, 달과 일은 각각 1~12, 01~31까지 입력 가능하다.
 *                                  example: 1999-03-29
 *                              userPhoneNum:
 *                                  type:  string
 *                                  description:  회원 핸드폰 번호. 문자열로 받으며 "xxx-xxxx-xxx" 형식으로 입력받아야 한다. 
 *                                  example: 010-6774-2052
 *          responses:
 *              "201":
 *                  description:  회원가입 성공한 경우이다. 회원가입 성공한 사실을 message 키를 갖는 JSON 형식으로 출력한다.
 *                  schema:
 *                      type:  object
 *                      properties:
 *                          message:
 *                              type:  string
 *                              example: SignUp success
 *              "400":
 *                  description:  유저가 req.body에 회원정보를 잘못 입력하여 유효성 검사 미들웨어에서 걸려진 경우이다. 어떤 항목에서 어떻게 잘못되었는지 문자열 형식으로 오류를 출력한다.
 *                  schema:
 *                      type:  object
 *                      properties:
 *                          error:
 *                              type:  object
 *                              properties:
 *                                  code:
 *                                      type:  number
 *                                      example:  400
 *                                  message:
 *                                      type:  string
 *                                      example:  wrong input at userId please input 4 ~ 10 chars long
 *              "404":
 *                  description:  유저의 입력이 없을 경우이다. 입력을 안 했음을 문자열 형식으로 출력한다.
 *                  schema:
 *                      type:  object
 *                      properties:
 *                          error:
 *                              type:  object
 *                              properties:
 *                                  code:
 *                                      type:  number
 *                                      example:  404
 *                                  message:
 *                                      type:  string
 *                                      example:  you don't input please input anything
 *              "409":
 *                  description:  유저의 입력한 ID가 이미 DB에 있을 경우이다. 입력한 ID가 중복된 ID임을 문자열 형식으로 출력한다.
 *                  schema:
 *                      type:  object
 *                      properties:
 *                          error:
 *                              type:  object
 *                              properties:
 *                                  code:
 *                                      type:  number
 *                                      example:  409
 *                                  message:
 *                                      type:  string
 *                                      example:  This id already exist please input other id             
 */
// 회원가입 라우터
userRouter.post('/signup', signUpValidationParam, validationCheck, signUp);

/**
 * @swagger
 *   /login:
 *      post:
 *          summary:  LogIn user
 *          description: Select user's information from user_information table & compare user's input id,pw
 *          tags:
 *          - User
 *          requestBody:
 *              description: 로그인 시 회원 ID/PW를 받는 req.body이다.
 *              required:  true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type:  object
 *                          properties:
 *                              userId:
 *                                  type:  string
 *                                  description:  회원 ID. 영어 대소문자만 가능하고 최소 4글자, 최대 10글자까지 입력 가능하다.
 *                                  example:  zziddae
 *                              userPw:
 *                                  type:  string
 *                                  description:  회원 PW. 영어 대소문자, 숫자, 서버에서 정한 특수문자(~!@#$%^&*()_+|<>?:{})만 가능하고 최소 8글자, 최대 15글자까지 입력 가능하다.
 *                                  example:  Tico@2067
 *          responses:
 *              "200":
 *                  description:  로그인이 성공한 경우이다. 로그인 성공을 message 키를 갖는 JSON 형식으로 출력한다.
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type:  string
 *                              example:  Login successful!
 *              "400":
 *                  description:  유저가 req.body에 ID/PW를 잘못 입력하여 유효성 검사 미들웨어에서 걸려진 경우이다. 어떤 항목에서 어떻게 잘못되었는지 문자열 형식으로 오류를 출력한다. 
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                              type:  object
 *                              properties:
 *                                  code:
 *                                      type:  number
 *                                      example:  400
 *                                  message:
 *                                      type:  string
 *                                      example:  wrong input at userId please input 4 ~ 10 chars long
 *              "401":
 *                  description:  유효성 검사를 통과했지만 DB의 ID/Pw와 틀려 로그인 실패일 경우이다.
 *                  schema:
 *                      type:  object
 *                      properties:
 *                          error:
 *                              type: object
 *                              properties:
 *                                  code:
 *                                      type:  number
 *                                      example: 401
 *                                  message:
 *                                      type:  string
 *                                      example:  Login failed please check your id or password!
 *              "404":
 *                  description:  DB에서 찾는 회원정보가 없는 경우(삭제되었거나 업데이트가 되어 ID가 바뀌었을 때) 해당 정보가 없음을 문자열 형식으로 출력한다.
 *                  schema:
 *                      type:  object
 *                      properties:
 *                          error:
 *                              type:  object
 *                              properties:
 *                                  code:
 *                                      type:  number
 *                                      example:  404
 *                                  message:
 *                                      type:  string
 *                                      example:  You are not member please signup
 *              "409":
 *                  description: 로그인이 되어있는데 로그인을 한 번 더 요청한 경우이다. 로그인 확인 미들웨어에서 오류를 발생시켜 문자열 형식으로 출력한다.
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                              type:  object
 *                              properties:
 *                                  code:
 *                                      type:  number
 *                                      example:  409
 *                                  message:
 *                                      type:  string
 *                                      example:  Already logged in
 */
// 로그인 라우터
userRouter.post('/login', isDoubleLogin, logInValidationParam, validationCheck, logIn);

/**
 * @swagger
 *   /user/{user_id}:
 *      patch:
 *          summary:  Change user's information
 *          description: Update user's information from user_information to user's input
 *          tags:
 *          - User
 *          parameters:
 *          - in:  path
 *            type:  string
 *            required:  true
 *            default:  zziddae
 *            name:  user_id
 *            description:  회원정보 수정을 하려는 회원 ID로 req.params로 받는다. 영어만 입력 가능하며 최소 4, 최대 10글자로 입력받아야 한다.
 *          requestBody:
 *              required:  true
 *              description:  수정 후의 회원정보를 입력받는 req.body이다. 아무 항목도 입력되어 있지 않으면 404 에러를 출력한다.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type:  object
 *                          properties:
 *                              userId:
 *                                  type:  string
 *                                  description:  수정할 회원 ID. 영어 대소문자만 가능하고 최소 4글자, 최대 10글자까지 입력 가능하다.
 *                                  example:  zziddae
 *                              userName:
 *                                  type:  string
 *                                  description:  수정할 회원 이름. 한글만 가능하고 최소 2글자, 최대 5글자까지 입력 가능하다.
 *                                  example:  노근우
 *                              userBirthday:
 *                                  type:  string
 *                                  description:  수정할 회원 생년월일. 문자열로 받으며 "xxxx-xx-xx" 형식으로 입력받아야 한다. 년도는 1900년부터 2000년대까지 입력 가능하고, 달과 일은 각각 1~12, 01~31까지 입력 가능하다.
 *                                  example: 1999-03-29
 *                              userPhoneNum:
 *                                  type:  string
 *                                  description:  수정할 회원 핸드폰 번호. 문자열로 받으며 "xxx-xxxx-xxx" 형식으로 입력받아야 한다.
 *                                  example: 010-6774-2052
 *          responses:
 *              "200":
 *                  description:  회원정보 수정 성공한 경우이다. 회원정보 수정이 성공한 사실을 message 키를 갖는 JSON 형식으로 출력한다.
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type:  string
 *                              example:  Change information success please login again
 *              "400":
 *                  description:  req.params.user_id를 잘못 입력하여 유효성 검사 미들웨어에서 걸러진 경우이다. 오류가 발생한 이유를 문자열 형식으로 출력한다.
 *                  schema:
 *                      type:  object
 *                      properties:
 *                          error:
 *                              type:  object
 *                              properties:
 *                                  code:
 *                                      type:  number
 *                                      example:  400
 *                                  message:
 *                                      type:  string
 *                                      example:  wrong input at userId please input 4 ~ 10 chars long
 *              "401":
 *                  description:  로그인이 안 되어 있는 경우 로그인이 필요한 페이지임을 문자열 형식으로 출력한다.
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                              type:  object
 *                              properties:
 *                                  code:
 *                                      type:  number
 *                                      example:  401
 *                                  message:
 *                                      type:  string
 *                                      example:  Login isn't running please log in
 *              "403":
 *                  description:  세션에 저장된 유저 ID와 req.params.user_id의 값이 다를 경우 인가되지 않은 페이지임을 문자열 형식으로 출력한다.
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                              type:  object
 *                              properties:
 *                                  code:
 *                                      type:  number
 *                                      example:  403
 *                                  message:
 *                                      type:  string
 *                                      example:  you don't have authority
 *              "404":
 *                  description: 수정해야할 회원정보가 없는 경우(삭제되었거나 업데이트가 되어 ID가 바뀌었을 때)나 수정할 정보를 입력하지 않았을 경우, 해당 정보가 없음을 문자열 형식으로 출력한다.
 *                  schema:
 *                      type:  object
 *                      properties:
 *                          error:
 *                              type:  object
 *                              properties:
 *                                  code:
 *                                      type:  number
 *                                      example:  404
 *                                  message:
 *                                      type:  string
 *                                      example: you don't input please input anything
 *              "409":
 *                  description:  DB에 있는 기존의 정보와 똑같은 정보를 입력한 경우이다. 똑같은 정보를 입력했다는 사실을 문자열 형식으로 출력한다.
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                              type:  object
 *                              properties:
 *                                  code:
 *                                      type:  number
 *                                      example:  409
 *                                  message:
 *                                      type:  string
 *                                      example:  input same user_id please change your input
 */
// 회원정보 수정 라우터
userRouter.patch('/user/:user_id', isLogin, inputValidationParam, makeValidationParam, validationCheck, changeInform);

/**
 * @swagger
 *   /password:
 *      patch:
 *          summary:  Change user's password
 *          description: Update user's password from user_information table to user's input
 *          tags:
 *          - User
 *          requestBody:
 *              required: true
 *              description:  회원 비밀번호 수정을 위해 기존 비밀번호, 바꿀 비밀번호, 바꾼 비밀번호 확인을 위한 req.body이다.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type:  object
 *                          properties:
 *                              userPw:
 *                                  type:  string
 *                                  description:  기존 회원 PW. 영어 대소문자, 숫자, 서버에서 정한 특수문자(~!@#$%^&*()_+|<>?:{})만 가능하고 최소 8글자, 최대 15글자까지 입력 가능하다.
 *                                  example:  Tico@2067
 *                              inputPw:
 *                                  type:  string
 *                                  description: 수정할 회원 PW. 영어 대소문자, 숫자, 서버에서 정한 특수문자(~!@#$%^&*()_+|<>?:{})만 가능하고 최소 8글자, 최대 15글자까지 입력 가능하다.
 *                                  example: shrmsdn@2067
 *                              checkPw:
 *                                  type:  string
 *                                  description: 수정한 회원 PW 확인. 영어 대소문자, 숫자, 서버에서 정한 특수문자(~!@#$%^&*()_+|<>?:{})만 가능하고 최소 8글자, 최대 15글자까지 입력 가능하다. 만약, inputPw와 다르면 400 에러를 출력한다.
 *                                  example: shrmsdn@2067
 *          responses:
 *              "200":
 *                  description:  회원 비밀번호 변경을 성공한 경우이다. 회원 비밀번호 변경이 성공한 사실을 message 키를 갖는 JSON 형식으로 출력한다.
 *                  schema:
 *                      type:  object
 *                      properties:
 *                          message:
 *                              type:  string
 *                              example:  Change password success please login again
 *              "400":
 *                  description:  유저의 비밀번호 입력이 잘못되어 유효성 검사 미들웨어에 걸러지거나 바꿀 비밀번호와 이중확인 비밀번호가 다른 경우이다. 문자열 형식으로 어떤 오류인지 출력한다.
 *                  schema:
 *                      type:  object
 *                      properties:
 *                          error:
 *                              type:  object
 *                              properties:
 *                                  code:
 *                                      type:  number
 *                                      example:  400
 *                                  message:
 *                                      type: string
 *                                      example:  Password is different please check your password
 *              "401":
 *                  description:  로그인이 안 되어 있는 경우 로그인이 필요한 페이지임을 문자열 형식으로 출력한다.
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                              type:  object
 *                              properties:
 *                                  code:
 *                                      type:  number
 *                                      example: 401
 *                                  message:
 *                                      type:  string
 *                                      example:  Login isn't running please log in
 *              "403":
 *                  description:  사용자 인증을 위해 입력한 기존 비밀번호가 DB와 다를 경우이다. 입력한 비밀번호가 기존의 비밀번호와 다름을 문자열 형식으로 출력한다.
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                              type:  object
 *                              properties:
 *                                  code:
 *                                      type:  number
 *                                      example: 403
 *                                  message:
 *                                      type:  string
 *                                      example:  Input password is wrong please check your password
 *              "404":
 *                  description: DB에서 찾는 회원정보가 없는 경우(삭제되었거나 업데이트가 되어 ID가 바뀌었을 때) 해당 정보가 없음을 문자열 형식으로 출력한다.
 *                  schema:
 *                      type:  object
 *                      properties:
 *                          error:
 *                              type:  object
 *                              properties:
 *                                  code:
 *                                      type:  number
 *                                      example:  404
 *                                  message:
 *                                      type:  string
 *                                      example: There is no result
 *              "409":
 *                  description:  사용자가 입력한 바꿀 비밀번호가 기존의 비밀번호와 같은 경우이다. 바꿀 비밀번호에 입력한 값이 기존의 비밀번호와 같음을 문자열 형식으로 출력한다.
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                              type:  object
 *                              properties:
 *                                  code:
 *                                      type:  number
 *                                      example: 409
 *                                  message:
 *                                      type:  string
 *                                      example:  Input same Password please check your password
 */
// 회원 비밀번호 수정 라우터
userRouter.patch('/password', isLogin, changePwValidationParam, validationCheck, changePw);

/**
 * @swagger
 *   /logout:
 *      post:
 *          summary:  Logout user
 *          description:  Destroy user's session for logout
 *          tags:
 *          - User
 *          produces:
 *          - text/plain
 *          responses:
 *              "200":
 *                  description:  로그아웃 성공한 경우이다. 로그아웃 성공한 사실을 message 키를 갖는 JSON 형식으로 출력한다.
 *                  schema:
 *                      type:  object
 *                      properties:
 *                          message:
 *                              type:  string
 *                              example: Logout success
 *              "401":
 *                  description: 로그인이 안 되어 있는 경우 로그인이 필요한 페이지임을 문자열 형식으로 출력한다.
 *                  schema:
 *                      type:  object
 *                      properties:
 *                          error:
 *                              type:  object
 *                              properties:
 *                                  code:
 *                                      type:  number
 *                                      example:  401
 *                                  message:
 *                                      type:  string
 *                                      example:  Login isn't running please log in
 *              "403":
 *                  description: 세션의 authorized가 false인 경우 인가되지 않은 페이지임을 문자열 형식으로 출력한다.
 *                  schema:
 *                      type:  object
 *                      properties:
 *                          error:
 *                              type:  object
 *                              properties:
 *                                  code:
 *                                      type:  number
 *                                      example:  403
 *                                  message:
 *                                      type:  string
 *                                      example:  you don't have authority
 */
// 로그아웃 라우터
userRouter.post('/logout', isLogin, logOut);

/**
 * @swagger
 *   /user:
 *      delete:
 *          summary:  Withdrawal user's membership
 *          description:  Delete user's information form user_information table
 *          tags:
 *          - User
 *          requestBody:
 *              required:  true
 *              description:  회원탈퇴로 회원정보를 삭제하기 전, 사용자 인증을 위해 회원 비밀번호를 req.body로 받는다.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type:  object
 *                          properties:
 *                              inputPw:
 *                                  type:  string
 *                                  description:  회원탈퇴 전 사용자 인증을 위해 회원 비밀번호. 영어 대소문자, 숫자, 서버에서 정한 특수문자(~!@#$%^&*()_+|<>?:{})만 가능하고 최소 8글자, 최대 15글자까지 입력 가능하다.
 *                                  example:  shrmsdn@2067
 *          responses:
 *              "204":
 *                  description: 회원탈퇴를 성공한 경우이다. 회원탈퇴 성공한 사실을 message 키를 갖는 JSON 형식으로 출력한다.
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type:  string
 *                              example:  Membership cancellation success
 *              "400":
 *                  description:  유저가 req.body에 회원 비밀번호를 잘못 입력하여 유효성 검사 미들웨어에서 걸려진 경우(입력을 안 함, 비밀번호 정규표현식에 어긋남)이다. 비밀번호를 어떻게 잘못 입력했는지 문자열 형식으로 오류를 출력한다.
 *                  schema:
 *                      type:  object
 *                      properties:
 *                          error:
 *                              type:  object
 *                              properties:
 *                                  code:
 *                                      type:  number
 *                                      example:  400
 *                                  message:
 *                                      type: string
 *                                      example:  delete blank in your input
 *              "401":
 *                  description:  로그인이 안 되어 있는 경우 로그인이 필요한 페이지임을 문자열 형식으로 출력한다.
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                              type:  object
 *                              properties:
 *                                  code:
 *                                      type:  number
 *                                      example: 401
 *                                  message:
 *                                      type:  string
 *                                      example:  Login isn't running please log in
 *              "403":
 *                  description:  사용자 인증을 위해 입력한 비밀번호가 다른 경우이다. 비밀번호가 틀렸다는 것을 문자열 형식으로 출력한다.
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                              type:  object
 *                              properties:
 *                                  code:
 *                                      type:  number
 *                                      example: 403
 *                                  message:
 *                                      type:  string
 *                                      example:  Input password is wrong please check your password
 *              "404":
 *                  description: DB에서 찾는 회원정보가 없는 경우(삭제되었거나 업데이트가 되어 ID가 바뀌었을 때) 해당 정보가 없음을 문자열 형식으로 출력한다.
 *                  schema:
 *                      type:  object
 *                      properties:
 *                          error:
 *                              type:  object
 *                              properties:
 *                                  code:
 *                                      type:  number
 *                                      example:  404
 *                                  message:
 *                                      type:  string
 *                                      example: There is no result
 */
// 회원탈퇴 라우터
userRouter.delete('/user', isLogin, deleteUserValidationParam, validationCheck, deleteUser); 
 
export default userRouter; 