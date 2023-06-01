// sha512 암호화를 하기 위한 crypto 모듈 사용
import { pbkdf2Sync, randomBytes } from 'crypto';
// bcrypt 암호화를 하기 위해 bcrypt 모듈 사용
import { genSalt, hash, compare } from 'bcrypt';

// sha512 방식으로 암호화하는 함수 encryptedBySha512
const encryptedBySha512 = (inputPw) => {
    // crypto 모듈의 randomBytes()를 사용해 32글자의 랜덤 salt를 구함
    const randomSalt = randomBytes(32).toString("hex");
    // crypto 모듈의 pbkdf2Sync()를 사용해 sha512 방식으로 암호화
    const cryptedPw = pbkdf2Sync(inputPw, randomSalt, 65536, 64, "sha512").toString("hex");
    /*
    * sha512 방식으로 암호화된 비밀번호 pwWithSalt라는 변수에 할당
    * 나중에 inputPwVerify()에서 비밀번호를 비교할 때 $로 cryptedPw와 randomSalt를 구별
    */
    const pwWithSalt = cryptedPw + "$" + randomSalt;

    return pwWithSalt;
}


// bcrypt 방식으로 암호화하는 함수 encryptedByBcrypt
const encryptedByBcrypt = async (inputPw) => {
    try {
        // salt 횟수를 저장하는 변수 saltRounds
        const saltRounds = await genSalt(10);
        // bcrypt 모듈의 hashSync 함수를 사용해 bcrypt 암호화
        const encryptedPw = await hash(inputPw, saltRounds);

        return encryptedPw;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

// user가 입력한 pw를 sha512 방식으로 암호화 해 DB와 비교해주는 inputPwVerify 함수
const inputPwVerify = (inputPw, encryptedParam) => {
    // 비밀번호의 결과 메시지를 저장한 resultParam 배열
    const resultParam = [
        {
            message : 'Login successful!'
        },
        {
            message : 'Login failed please check your id or password!'
       }
    ];

    // $를 구분자로 갖는 split() 함수 사용해서 비밀번호와 salt 분리하고 배열에 저장
    const [encrypted, salt] = encryptedParam.split("$");
    // user가 입력한 비밀번호를 sha512 방식으로 암호화
    const inputEncrypted = pbkdf2Sync(inputPw, salt, 65536, 64, "sha512").toString("hex");
    
    /*
    * user가 입력한 비밀번호를 암호화한 inputEncryted와 db에 저장된 encrypted 비교
    * 같을 경우
    */
    if (inputEncrypted === encrypted) {
        console.log('success');
        return  resultParam[0];
    };
    // 다를 경우
    console.log('fail');
    return resultParam[1];

}

// user가 입력한 pw를 bcrypt 방식으로 암호화 해 DB와 비교해주는 inputPwVerify 함수
const comparePw = async (inputPw, encryptedParam) => {
    // 비밀번호의 결과 메시지를 저장한 resultParam 배열
    const resultParam = [
        {
            message : 'Login successful!'
        },
        {
            message : 'Login failed please check your id or password!'
       }
    ];

    try {
        console.log(inputPw);
        console.log(encryptedParam);
        // bcryt모듈의 compareSync 함수를 사용해 user가 입력한 inputPw와 DB에 있는 encrytedParam 비교
        const comparePwResult = await compare(inputPw, encryptedParam);
        
        return comparePwResult;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export {
    encryptedBySha512,
    encryptedByBcrypt,
    inputPwVerify,
    comparePw
};