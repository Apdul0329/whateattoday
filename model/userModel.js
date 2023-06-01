import { whatEatTodayPool } from '../config/whatEatTodayDB.js';

import { errorGenerator } from '../middleware/errorHandler.js';

// 암호화를 위한 모듈
import { encryptedByBcrypt } from '../service/encryption.js';

const createUser = async (data) => {
    let userConnection = await whatEatTodayPool.getConnection(async conn => conn);
    let sql = `INSERT INTO user_information (user_id, user_password, user_name, user_birthday, user_phonenumber) VALUES (?, ?, ?, ?, ?)`;

    // encryptPw 모듈을 사용해 'bcrypt'방식으로 req.body.userPw 암호화하고 encryptedPw에 할당
    const encryptedPw = await encryptedByBcrypt(data[1]);
    console.log(encryptedPw);
    data.splice(1, 1, encryptedPw);
    console.log(data);

    try {
        await userConnection.beginTransaction();
        let [insertRows, insertField] = await userConnection.query(sql, data);
        await userConnection.commit();

        console.log('insert success');
        return [insertRows, insertField];
    } catch (err) {
        await userConnection.rollback();

        errorGenerator(err.message, err.errno);
    } finally {
        userConnection.release();
    }
}

const getUser = async (data) => {
    let userConnection = await whatEatTodayPool.getConnection(async conn => conn);
    let sql = `SELECT user_id, user_name, DATE_FORMAT(user_birthday, '%Y-%m-%d') as user_birthday, user_phonenumber FROM user_information WHERE user_index = ?`;

    try {
        await userConnection.beginTransaction();
        let [selectRows] = await userConnection.query(sql, data);
        await userConnection.commit();

        console.log('select success');
        return selectRows;
    } catch (err) {
        await userConnection.rollback();

        errorGenerator(err.message, err.errno);
    } finally {
        userConnection.release();
    }
}

const findUserById = async (data) => {
    let userConnection = await whatEatTodayPool.getConnection(async conn => conn);
    let sql = `SELECT user_index, user_id, user_password FROM user_information WHERE user_id = ?`;

    try {
        await userConnection.beginTransaction();
        let [selectRows] = await userConnection.query(sql, data);
        await userConnection.commit();

        console.log('select success');
        return selectRows;
    } catch (err) {
        await userConnection.rollback();

        errorGenerator(err.message, err.errno);
    } finally {
        userConnection.release();
    }
}

const findUserByIndex = async (data) => {
    let userConnection = await whatEatTodayPool.getConnection(async conn => conn);
    let sql = `SELECT user_password FROM user_information WHERE user_index = ?`;

    try {
        await userConnection.beginTransaction();
        let [selectRows] = await userConnection.query(sql, data);
        await userConnection.commit();

        console.log('select success');
        console.log(selectRows);
        return selectRows;
    } catch (err) {
        await userConnection.rollback();

        errorGenerator(err.message, err.errno);
    } finally {
        userConnection.release();
    }
}

const findAllUser = async () => {
    let userConnection = await whatEatTodayPool.getConnection(async conn => conn);
    let sql = `SELECT user_id FROM user_information`;

    try {
        await userConnection.beginTransaction();
        let [selectRows] = await userConnection.query(sql);
        await userConnection.commit();

        console.log('select success');
        console.log(selectRows);
        return selectRows;
    } catch (err) {
        await userConnection.rollback();

        errorGenerator(err.message, err.errno);
    } finally {
        userConnection.release();
    }
}

const updateUser = async (data) => {
    let userConnection = await whatEatTodayPool.getConnection(async conn => conn);
    let sql = `UPDATE user_information SET ? WHERE user_index = ?`;

    try {
        await userConnection.beginTransaction();
        let [updateRows] = await userConnection.query(sql, data);
        await userConnection.commit();

        console.log('update success');
        return updateRows;
    } catch (err) {
        await userConnection.rollback();

        errorGenerator(err.message, err.errno);
    } finally {
        userConnection.release();
    }
}

const withdrawalUser = async (data) => {
    let userConnection = await whatEatTodayPool.getConnection(async conn => conn);
    let sql = `DELETE FROM user_information WHERE user_index = ?`;

    try {
        await userConnection.beginTransaction();
        let [deleteRows] = await userConnection.query(sql, data);
        await userConnection.commit();

        console.log('delete success');
        return deleteRows;
    } catch (err) {
        await userConnection.rollback();

        errorGenerator(err.message, err.errno);
    } finally {
        userConnection.release();
    }
}

export {
    createUser,
    getUser,
    findUserById,
    findUserByIndex,
    findAllUser,
    updateUser,
    withdrawalUser
}