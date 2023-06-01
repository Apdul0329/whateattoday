// 암호화를 위한 모듈
import { encryptedByBcrypt, comparePw } from '../service/encryption.js';
// 에러 핸드러 미들웨어 관련 모듈
import { errorGenerator } from '../middleware/errorHandler.js';
// 유저 관련 모델
import { createUser, getUser, findUserById, findUserByIndex, findAllUser, updateUser, withdrawalUser } from '../model/userModel.js';

// 회원정보 출력 컨트롤러 콜백 함수
// 함수 구체적인 설명 필요
const showInform = async (req, res, next) => {
    try {
        // 요청 결과를 받는 변수 선언
        let queryResult;                

        // 로그인 상태를 세션을 이용해 확인하기 위한 변수 userSession 초기화
        const userSession = req.session.user;
        // 세션에 저장된 user의 id를 userIdex에 받음
        const userIndex = userSession.userIndex;
        const userId = userSession.userId;

        const accessUserId = req.params.user_id;

        // TODO 왜 사용하는지에 대한 주석 처리
        if ((accessUserId !== userId)) {
            queryResult = "you don't have authority";

            errorGenerator(queryResult, 403);
        }
    
        const showInformResult = await getUser(userIndex);
        console.log(showInformResult[0]);

        if (showInformResult.length === 0) {
            queryResult = "There is no result";

            errorGenerator(queryResult, 404);
        }

        // 세션이 존재하고 에러도 없을 때 queryResult에 getUser()를 실행했을 때의 결과를 queryResult에 할당함
        queryResult = {
            "userId" : showInformResult[0].user_id,
            "userName" : showInformResult[0].user_name,
            "userBirthday" : showInformResult[0].user_birthday,
            "userPhoneNum" : showInformResult[0].user_phonenumber
        };
        // status code 200으로 회원정보를 JSON형식으로 응답
        return res.status(200).json(queryResult);
    } catch (err) {
        console.log(err);
        next(err);
    }
};

// 회원가입 컨트롤러 콜백 함수
const signUp = async (req, res, next) => { 
    try {
        // 요청 결과를 받는 변수 선언
        let queryResult;

        // DB에 저장할 회원 정보를 담는 배열 userInform
        const userInform = [req.body.userId, req.body.userPw, req.body.userName, new Date(req.body.userBirthday), req.body.userPhoneNum];
        
        // 유저의 입력이 없을 때
        if (!(userInform)) {
            // 메시지에 대한 고민
            queryResult = "you don't input please input anything";

            errorGenerator(queryResult, 404);
        }

        const findAllUserResult = await findAllUser();
        
        // 코드 update 필요
        // 로직에 대한 주석 필요
        for (let i in findAllUserResult) {
            console.log(findAllUserResult[i]);
            if (findAllUserResult[i].user_id === userInform[0]) {
                queryResult = "This id already exist please input other id"

                errorGenerator(queryResult, 409);
            }
        }
        
        const signUpResult = await createUser(userInform);

        queryResult = {
            message : "SignUp success"
        }
        // status code 201로 회원가입 성공을 JSON형식으로 응답
        return res.status(201).json(queryResult);
    } catch (err) {
        console.log(err.stack);
        next(err);
    }
};

// 로그인 컨트롤러 콜백 함수
const logIn = async (req, res, next) => {    
    try {
        // 비밀번호의 비교 결과 메시지를 저장한 resultParam 배열
        const resultParam = [
            {
                message : 'Login successful!'
            },
            {
                message : 'Login failed please check your id or password!'
            }
        ];
        // comparePw()의 return 값을 받는 변수 초기화
        let comparePwResult = false;
        // comparePwResult의 값에 따라 응답할 resultParam을 할당 받을 변수
        let queryResult = resultParam[1];

        const userInput = {
            id : req.body.userId,
            pw : req.body.userPw
        }

        const logInResult = await findUserById(userInput.id);

        if (logInResult.length === 0) errorGenerator('You are not member please signup', 404);
        
        // DB의 비밀번호와 user가 입력한 비밀번호가 일치하는 조건의 if문
        // 주석 수정
        if (logInResult[0].user_id === userInput.id) {
            // comparePw() 함수를 사용해서 비밀번호 비교하고 그 결과를 comparePwResult에 할당
            comparePwResult = await comparePw(userInput.pw, logInResult[0].user_password);
            console.log(comparePwResult);        
        }

        // 어떠한 상황에 대한 코드인지에 대한 설명
        // comparePwResult의 값이 true일 때 세션 생성
        if (comparePwResult) {
            req.session.user = {
                userIndex : logInResult[0].user_index,
                userId : logInResult[0].user_id,
                authorized : true
            };

            console.log(req.session);
            console.log(req.session.user);
            console.log(req.session.cookie);
            console.log(req.sessionID);
            console.log(req.cookies);

            queryResult = resultParam[0];
            // status code 200으로 로그인 성공을 JSON형식으로 응답
            return res.status(200).json(queryResult);
        };
        
        errorGenerator(queryResult.message, 401);
    } catch (err) {
        console.log(err);
        next(err);
    }
};

// 로그아웃 컨트롤러 콜백 함수
const logOut = async (req, res, next) => {
    try {
        // 요청 결과를 받는 변수 선언
        let queryResult;
        
        // 로그인 상태를 세션을 이용해 확인하기 위한 변수 userSession 초기화
        let userSession = req.session.user;
        // 세션에 저장된 user의 authorized를 변수 isLogin에 할당
        const isLogin = userSession.authorized;

        // isLogin이 false일 때 실행되는 if문
        if (!(isLogin)) {
            queryResult = "you don't have authority";

            errorGenerator(queryResult, 403);
        }

        // 로그아웃을 위해 해당 유저의 세션 삭제
        await req.session.destroy();
        console.log("Delete session success");
        queryResult = {
            message : "Logout success"
        }

        // status code 200으로 로그아웃 성공을 JSON형식으로 응답
        return res.status(200).json(queryResult);
    } catch(err) {
        console.log(err);
        next(err);
    }
};

// 회원정보 수정 컨트롤러 콜백 함수
const changeInform = async (req, res, next) => {
    try {
        // 요청 결과를 받는 변수 선언
        let queryResult;

        // 로그인 상태를 세션을 이용해 확인하기 위한 변수 userSession 초기화
        let userSession = req.session.user;
        // 세션에 저장된 user의 index를 inputIndex에 받음
        const userIndex = userSession.userIndex;
        const userId = userSession.userId;

        const accessUserId = req.params.user_id;

        if (accessUserId !== userId) {
            queryResult = "you don't have authority";

            errorGenerator(queryResult, 403);
        }

        // user의 입력을 저장하는 객체 userInput
        const userInput = {
            inputId : req.body.userId,
            inputName : req.body.userName,
            inputBirth : req.body.userBirthday,
            inputPhoneNum : req.body.userPhoneNum
        };

        const findUserResult = await getUser(userIndex);

        if (findUserResult.length === 0) {
            queryResult = "There is no result";

            errorGenerator(queryResult, 404);
        }

        // updateQuery()로 update문 실행 시 update 할 값들을 받은 updateOption 
        const updateOption = {};
        // inputParam의 각 프로퍼티가 존재하면 updateOption에 추가하는 if문 
        if (userInput.inputId) updateOption['user_id'] = userInput.inputId;
        if (userInput.inputName) updateOption['user_name'] = userInput.inputName;
        if (userInput.inputBirth) updateOption['user_birthday'] = userInput.inputBirth;
        if (userInput.inputPhoneNum) updateOption['user_phonenumber'] = userInput.inputPhoneNum;
        console.log(updateOption);

        // 주석 처리 필요
        if (Object.keys(updateOption).length === 0) {
            queryResult = "you don't input please input anything";

            errorGenerator(queryResult, 404);
        }

        for (let i in updateOption) {
            if (findUserResult[0][i] === updateOption[i]) {
                queryResult = `input same ${i} please change your input`;
    
                errorGenerator(queryResult, 409);
            }
        }
        
        const updateInform = [updateOption, userIndex];
        const changeInformResult = await updateUser(updateInform);
        // 회원정보 수정 후 로그아웃을 위해 해당 유저의 세션 삭제
        await req.session.destroy();

        queryResult = {
            message : "Change information success please login again"
        };
        // status code 200로 회원정보 수정 성공을 JSON형식으로 응답
        return res.status(200).json(queryResult);
    } catch (err) {
        console.log(err);
        next(err);
    }
};

// 회원 비밀번호 변경 컨트롤러 콜백 함수
const changePw = async (req, res, next) => {    
    try {
        // 요청 결과를 받는 변수 선언
        let queryResult;
        // 로그인 상태를 세션을 이용해 확인하기 위한 변수 userSession 초기화
        let userSession = req.session.user;
        // 세션에 저장된 user의 index를 userIndex에 받음
        const userIndex = userSession.userIndex;
        // comparePw()의 return 값을 받는 변수 초기화
        let comparePwResult = false;
        // req.body.userPw를 할당 받는 userPw 초기화
        const userPw = req.body.userPw;

        // findUserByIndex 변수명 수정
        const findUserResult = await findUserByIndex(userIndex);

        // 주석처리
        if (findUserResult.length === 0) {
            queryResult = "There is no result";

            errorGenerator(queryResult, 404);        
        }

        // comparePw() 함수를 사용해서 비밀번호 비교하고 그 결과를 comparePwResult에 할당
        comparePwResult = await comparePw(userPw, findUserResult[0].user_password);
        console.log(comparePwResult);

        if (!comparePwResult) {
            queryResult = {
                message : "Input password is wrong please check your password"
            }

            errorGenerator(queryResult.message, 403);
        }

        if (userPw === req.body.inputPw) {
            queryResult = {
                message : "Input same Password please check your password"
            }

            errorGenerator(queryResult.message, 409);
        }

        /*
        * user가 비밀번호를 바꾸려 입력한 inputPw와
        * 바꾼 비밀번호를 한 번 더 확인하기 위한 checkPw가 다를 경우의 if문
        */ 
        if (req.body.inputPw !== req.body.checkPw) {
            queryResult = {
                message : "Password is different please check your password"
            }
            // status code 400으로 입력한 두 값이 다름을 JSON형식으로 응답
            errorGenerator(queryResult.message, 400);
        };

        // 입력받은 두 값이 같으면 req.body.inputPw 암호화 한 후 newPw에 할당
        let newPw =  await encryptedByBcrypt(req.body.inputPw);
        console.log(newPw);

        // updateUser()로 update문 실행 시 update 할 값들을 받은 updateOption 
        const updateOption = {
            'user_password' : newPw
        };
        // updateUser()의 매개변수로 들어갈 updateInform
        const updateInform = [updateOption, userIndex];

        const changePwResult = await updateUser(updateInform);
        // 회원 비밀번호 변경 성공시 해당 유저의 세션 삭제
        await req.session.destroy();

        queryResult = {
            message : "Change password success please login again"
        };

        // status code 200로 회원 비밀번호 변경 성공을 JSON형식으로 응답
        return res.status(200).json(queryResult);
    } catch (err) {
        console.log(err);
        next(err);
    }
};

// 회원 탈퇴 컨트롤러 콜백 함수
const deleteUser = async (req, res, next) => {
    try {
        // 요청 결과를 받는 변수 선언
        let queryResult;
        // 로그인 상태를 세션을 이용해 확인하기 위한 변수 userSession 초기화
        let userSession = req.session.user;
        // 세션에 저장된 user의 index를 inputIndex에 받음
        const userIndex = userSession.userIndex;
        // comparePw()의 return 값을 받는 변수 초기화
        let comparePwResult = false;
        const inputPw = req.body.inputPw;

        const findUserResult = await findUserByIndex(userIndex);
        console.log(findUserResult);

        // selectResults가 undefine일 때
        if (findUserResult.length === 0) {
            queryResult = "There is no result";

            errorGenerator(queryResult, 404);
        }

        // comparePw() 함수를 사용해서 비밀번호 비교하고 그 결과를 comparePwResult에 할당
        comparePwResult = await comparePw(inputPw, findUserResult[0].user_password);
        console.log(comparePwResult); 

        if (!comparePwResult) {
            queryResult = {
                message : "Input password is wrong please check your password"
            }

            errorGenerator(queryResult.message, 403);
        }

        // withdrawalUser()의 실행 결과를 할당 받는 변수 deleteUserResult 초기화
        // withdrawalUser()이 어떤 기능을 하는지에 대한 설명이 필요 or 변수명 고민
        const deleteUserResult= await withdrawalUser(userIndex);
        console.log(deleteUserResult); 
        
        // 회원탈퇴 시 해당 유저의 세션 삭제
        await req.session.destroy();

        queryResult = {
            message : "Membership cancellation success"
        };

        console.log(queryResult);
        // status code 204로 회원탈퇴 성공을 JSON형식으로 응답
        return res.status(204).json(queryResult);
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