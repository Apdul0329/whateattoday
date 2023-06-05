import { userShow, userCreate, userLogIn, userLogOut, userEdit, userPwEdit, userDelete } from '../service/userService.js';

// 회원정보 출력 컨트롤러 콜백 함수
// 함수 구체적인 설명 필요
const showInform = async (req, res, next) => {
    try {
        const user = await userShow(req);

        // status code 200으로 회원정보를 JSON형식으로 응답
        return res.status(200).json(user);
    } catch (err) {
        console.log(err);
        next(err);
    }
};

// 회원가입 컨트롤러 콜백 함수
const signUp = async (req, res, next) => { 
    try {
        const message = await userCreate(req.body);
        const result = {
            message : message
        }

        // status code 201로 회원가입 성공을 JSON형식으로 응답
        return res.status(201).json(result);
    } catch (err) {
        console.log(err.stack);
        next(err);
    }
};

// 로그인 컨트롤러 콜백 함수
const logIn = async (req, res, next) => {    
    try {
        const message = await userLogIn(req);
        const result = {
            message : message
        }

        // status code 200로 로그인 성공을 JSON형식으로 응답
        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        next(err);
    }
};

// 로그아웃 컨트롤러 콜백 함수
const logOut = async (req, res, next) => {
    try {
        const message = await userLogOut(req.session);
        const result = {
            message : message
        }

        // status code 200으로 로그아웃 성공을 JSON형식으로 응답
        return res.status(200).json(result);
    } catch(err) {
        console.log(err);
        next(err);
    }
};

// 회원정보 수정 컨트롤러 콜백 함수
const changeInform = async (req, res, next) => {
    try {
        const message = await userEdit(req);
        const result = {
            message : message
        }

        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        next(err);
    }
};

// 회원 비밀번호 변경 컨트롤러 콜백 함수
const changePw = async (req, res, next) => {    
    try {
        const message = await userPwEdit(req);
        const result = {
            message : message
        }

        // status code 200로 회원 비밀번호 변경 성공을 JSON형식으로 응답
        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        next(err);
    }
};

// 회원 탈퇴 컨트롤러 콜백 함수
const deleteUser = async (req, res, next) => {
    try {
        const message = await userDelete(req);
        const result = {
            message : message
        }

        // status code 204로 회원탈퇴 성공을 JSON형식으로 응답
        return res.status(204).json(message);
    } catch (err) {
        console.log(err);
        next(err);
    }
};

export {
    showInform,
    signUp,
    logIn,
    logOut,
    changeInform,
    changePw,
    deleteUser
}