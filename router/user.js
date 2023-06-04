// express 모듈을 사용.
import { Router } from 'express';

// express 모듈의 Router()를 사용해 router 생성
const userRouter = Router();

import { signUpValidationParam, logInValidationParam, makeValidationParam, changePwValidationParam, inputValidationParam, deleteUserValidationParam, validationCheck } from '../middleware/userValidator.js'

import { showInform, signUp, logIn, logOut, changeInform, changePw, deleteUser } from '../controller/userController.js';

import { isLogin, isDoubleLogin } from  '../middleware/authChecker.js';

// 회원 정보 출력 라우터
userRouter.get('/user/:user_id', isLogin, inputValidationParam, validationCheck, showInform);

// 회원가입 라우터
userRouter.post('/signup', signUpValidationParam, validationCheck, signUp);

// 로그인 라우터
userRouter.post('/login', isDoubleLogin, logInValidationParam, validationCheck, logIn);

// 회원정보 수정 라우터
userRouter.patch('/user/:user_id', isLogin, inputValidationParam, makeValidationParam, validationCheck, changeInform);

// 회원 비밀번호 수정 라우터
userRouter.patch('/password', isLogin, changePwValidationParam, validationCheck, changePw);

// 로그아웃 라우터
userRouter.post('/logout', isLogin, logOut);

// 회원탈퇴 라우터
userRouter.delete('/user', isLogin, deleteUserValidationParam, validationCheck, deleteUser); 
 
export default userRouter; 