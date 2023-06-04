// express 모듈을 사용.
import { Router } from 'express';

// express 모듈의 Router()를 사용해 router 생성
const postRouter = Router();

import { writePostValidationParam, makeValidationParam, inputValidationParam, validationCheck} from '../middleware/postValidator.js';

import { writePost, showPost, editPost, deletePost, showAllPosts } from '../controller/postController.js';

import { isLogin } from  '../middleware/authChecker.js';


postRouter.post('/post', isLogin, writePostValidationParam, validationCheck, writePost);

postRouter.get('/posts', isLogin, inputValidationParam, validationCheck, showAllPosts);

postRouter.get('/post/:post_index', isLogin, inputValidationParam, validationCheck, showPost);

postRouter.patch('/post/:post_index', isLogin, makeValidationParam, validationCheck, editPost);

postRouter.delete('/post/:post_index', isLogin, inputValidationParam, validationCheck, deletePost);

export default postRouter;

