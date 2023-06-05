import {check, validationResult} from 'express-validator'
import { errorGenerator } from './errorHandler.js';

const writeCommentValidationParam = [
    check('post_index')
    .notEmpty().withMessage('please input data')
    .bail()
    .trim().withMessage('delete blank in your input')
    .isInt().withMessage('please input int')
    .bail(), 

    check('content')
    .notEmpty().withMessage('please input data')
    .bail()
    .trim().withMessage('delete blank in your input')
    .isLength({min: 1, max: 300}).withMessage('please input 1 ~ 300 chars long')
    .bail()
]

const makeValidationParam = async (req, res, next) => {
    const inputParam = {
        comment_index : req.params.comment_index,
        content : req.body.content
    };

    const validationParam = [];
    if (inputParam.content) {
        validationParam.push(await check('content')
        .notEmpty().withMessage('please input data')
        .bail()
        .trim().withMessage('delete blank in your input')
        .isLength({min: 1, max: 300}).withMessage('please input 1 ~ 300 chars long')
        .bail()
        .run(req)
        );
    }
    if (inputParam.comment_index) {
        validationParam.push(await check('comment_index')
        .notEmpty().withMessage('please input data')
        .bail()
        .trim().withMessage('delete blank in your input')
        .isInt().withMessage('please input int')
        .bail()
        .run(req)
        );
    }
   
    console.log(validationParam);
    next();
    return validationParam;
}

const inputValidationParam = async (req, res, next) => {
    const inputParam = {
        post_index : req.query.post_index,
        page : req.query.page,
        page_size : req.query.page_size,
        comment_index : req.params.comment_index
    };

    const validationParam = [];
    if (inputParam.post_index) {
        validationParam.push(await check('post_index')
        .notEmpty().withMessage('please input data')
        .bail()
        .trim().withMessage('delete blank in your input')
        .isInt().withMessage('please input int')
        .bail()
        .run(req)
        );
    }
    if (inputParam.page) {
        validationParam.push(await check('page')
        .notEmpty().withMessage('please input data')
        .bail()
        .trim().withMessage('delete blank in your input')
        .isInt().withMessage('please input int')
        .bail()
        .run(req)
        );
    }
    if (inputParam.page_size) {
        validationParam.push(await check('page_size')
        .notEmpty().withMessage('please input data')
        .bail()
        .trim().withMessage('delete blank in your input')
        .isInt().withMessage('please input int')
        .bail()
        .run(req)
        );
    }
    if (inputParam.comment_index) {
        validationParam.push(await check('comment_index')
        .notEmpty().withMessage('please input data')
        .bail()
        .trim().withMessage('delete blank in your input')
        .isInt().withMessage('please input int')
        .bail()
        .run(req)
        );
    }
    
    console.log(validationParam);
    next();
    return validationParam;
}

const validationCheck = async (req, res, next) => {
    const validateErr = validationResult(req);

    try{
        if (!(validateErr.isEmpty())) {
            console.log('find error');
            
            const validateErrArray = validateErr.array();
            const message = `wrong input at ${validateErrArray[0].param} ${validateErrArray[0].msg}`;

            errorGenerator(message, 400);
        };
        next();
    } catch (err) {
        next(err);
    }      
}

export {
    writeCommentValidationParam,
    makeValidationParam,
    inputValidationParam,
    validationCheck
}