import {check, param, validationResult} from 'express-validator'
import { errorGenerator } from './errorHandler.js';

const checkPasswordPattern = (str) => { 
    const numRegExp = /[0-9]/;
    const alphaRegExp = /[a-zA-Z]/; 
    const specialRegExp = /[~!@#$%^&*()_+|<>?:{}]/;
    if (!numRegExp.test(str) || !alphaRegExp.test(str) || !specialRegExp.test(str)) return false; 
    return true;
}

const checkNamePattern = (str) => {
    const nameRegExp = /^[가-힣]*$/;

    if (!nameRegExp.test(str)) return false;
    return true;
}

const checkBirthPattern = (str) => {
    const birthRegExp = /^(19[0-9][0-9]|20\d{2})-(0[0-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;

    if (!birthRegExp.test(str)) return false;
    return true;
}

const checkPhoneNumPattern = (str) => {
    const phoneNumRegExp = /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}/;

    if (!phoneNumRegExp.test(str)) return false;
    return true;
}

const signUpValidationParam = [
    check('userId')
    .notEmpty().withMessage('please input data')
    .bail()
    .trim().withMessage('delete blank in your input')
    .isLength({min: 4, max: 10}).withMessage('please input 4 ~ 10 chars long')
    .bail()
    .isAlpha().withMessage('please input only alphabet')
    .bail(),
    
    check('userPw')
    .notEmpty().withMessage('please input data')
    .bail()
    .trim().withMessage('delete blank in your input')
    .isLength({min: 8, max: 15}).withMessage('please input 8 ~ 15 chars long')
    .bail()
    .custom(checkPasswordPattern).withMessage('please input with alphabet & number & special char')
    .bail(),
    
    check('userName')
    .notEmpty().withMessage('please input data')
    .bail()
    .trim().withMessage('delete blank in your input')
    .isLength({min: 2, max: 5}).withMessage('please input 2 ~ 5 chars long')
    .bail()
    .custom(checkNamePattern).withMessage('please input only korean')
    .bail(),
 
    check('userBirthday')
    .notEmpty().withMessage('please input data')
    .bail()
    .trim().withMessage('delete blank in your input')
    .custom(checkBirthPattern)
    .bail(),
    
    check('userPhoneNum')
    .notEmpty().withMessage('please input data')
    .bail()
    .trim().withMessage('delete blank in your input')
    .custom(checkPhoneNumPattern)
    .bail()
]

const logInValidationParam = [
    check('userId')
    .notEmpty().withMessage('please input data')
    .bail()
    .trim().withMessage('delete blank in your input')
    .isLength({min: 4, max: 10}).withMessage('please input 4 ~ 10 chars long')
    .bail()
    .isAlpha().withMessage('please input only alphabet')
    .bail(),
    
    check('userPw')
    .notEmpty().withMessage('please input data')
    .bail()
    .trim().withMessage('delete blank in your input')
    .isLength({min: 8, max: 15}).withMessage('please input 8 ~ 15 chars long')
    .bail()
    .custom(checkPasswordPattern).withMessage('please input with alphabet & number & special char')
    .bail()
]

const makeValidationParam = async (req, res, next) => {
    const inputParam = {
        inputId : req.body.userId,
        inputName : req.body.userName,
        inputBirth : req.body.userBirthday,
        inputPhoneNum : req.body.userPhoneNum
    };

    const validationParam = [];
    if (inputParam.inputId) {
        validationParam.push(await check('userId')
        .notEmpty().withMessage('please input data')
        .bail()
        .trim().withMessage('delete blank in your input')
        .isLength({min: 4, max: 10}).withMessage('please input 4 ~ 10 chars long')
        .bail()
        .isAlpha().withMessage('please input only alphabet')
        .bail()
        .run(req)
        );
    }
    if (inputParam.inputName) {
        validationParam.push(await check('userName')
        .notEmpty().withMessage('please input data')
        .bail()
        .trim().withMessage('delete blank in your input')
        .isLength({min: 2, max: 5}).withMessage('please input 2 ~ 5 chars long')
        .bail()
        .custom(checkNamePattern).withMessage('please input only korean')
        .bail()
        .run(req)
        );
    } 
    if (inputParam.inputBirth) {
        validationParam.push(await check('userBirthday')
        .notEmpty().withMessage('please input data')
        .bail()
        .trim().withMessage('delete blank in your input')
        .custom(checkBirthPattern)
        .bail()
        .run(req)
        );
    }
    if (inputParam.inputPhoneNum) {
        validationParam.push(await check('userPhoneNum')
        .notEmpty().withMessage('please input data')
        .bail()
        .trim().withMessage('delete blank in your input')
        .custom(checkPhoneNumPattern)
        .bail()
        .run(req)
        );
    }

    console.log(validationParam);
    next();
    return validationParam;
}

const changePwValidationParam = [
    check('userPw')
    .notEmpty().withMessage('please input data')
    .bail()
    .trim().withMessage('delete blank in your input')
    .isLength({min: 8, max: 15}).withMessage('please input 8 ~ 15 chars long')
    .bail()
    .custom(checkPasswordPattern).withMessage('please input with alphabet & number & special char')
    .bail(),

    check('inputPw')
    .notEmpty().withMessage('please input data')
    .bail()
    .trim().withMessage('delete blank in your input')
    .isLength({min: 8, max: 15}).withMessage('please input 8 ~ 15 chars long')
    .bail()
    .custom(checkPasswordPattern).withMessage('please input with alphabet & number & special char')
    .bail(),

    check('checkPw')
    .notEmpty().withMessage('please input data')
    .bail()
    .trim().withMessage('delete blank in your input')
    .isLength({min: 8, max: 15}).withMessage('please input 8 ~ 15 chars long')
    .bail()
    .custom(checkPasswordPattern).withMessage('please input with alphabet & number & special char')
    .bail()
]

const inputValidationParam = [
    param('user_id')
    .notEmpty().withMessage('please input data')
    .bail()
    .trim().withMessage('delete blank in your input')
    .isLength({min: 4, max: 10}).withMessage('please input 4 ~ 10 chars long')
    .bail()
    .isAlpha().withMessage('please input only alphabet')
    .bail()
]

const deleteUserValidationParam =[
    check('inputPw')
    .notEmpty().withMessage('please input data')
    .bail()
    .trim().withMessage('delete blank in your input')
    .isLength({min: 8, max: 15}).withMessage('please input 8 ~ 15 chars long')
    .bail()
    .custom(checkPasswordPattern).withMessage('please input with alphabet & number & special char')
    .bail()
]

const validationCheck = async (req, res, next) => {
    const validateErr = validationResult(req);

    try{
        if (!(validateErr.isEmpty())) {
            console.log('find error');
            console.log(validateErr.array());
            
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
    signUpValidationParam,
    logInValidationParam,
    makeValidationParam,
    changePwValidationParam,
    inputValidationParam,
    deleteUserValidationParam,
    validationCheck
}