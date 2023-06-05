// express 모듈을 사용.
import { Router } from 'express';
import { writeComment, showComment, showAllComments, editComment, deleteComment } from '../controller/commentController.js';
import { writeCommentValidationParam, makeValidationParam, inputValidationParam, validationCheck } from '../middleware/commentValidator.js';
import { isLogin } from '../middleware/authChecker.js';

// express 모듈의 Router()를 사용해 router 생성
const commentRouter = Router();

commentRouter.post('/comment', isLogin, writeCommentValidationParam, validationCheck, writeComment);

commentRouter.get('/comment/:comment_index', isLogin, inputValidationParam, validationCheck, showComment);

commentRouter.get('/comments', isLogin, inputValidationParam, validationCheck, showAllComments);

commentRouter.patch('/comment/:comment_index', isLogin, makeValidationParam, validationCheck, editComment);

commentRouter.delete('/comment/:comment_index', isLogin, inputValidationParam, validationCheck, deleteComment);

export default commentRouter;