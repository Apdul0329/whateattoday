import { whatEatTodayPool } from '../config/whatEatTodayDB.js';
import { errorGenerator } from '../middleware/errorHandler.js';

const createPost = async (data) => {
    let postConnection = await whatEatTodayPool.getConnection(async conn => conn);
    let sql = `INSERT INTO post_information (write_id, post_title, post_date, post_content, look_views) VALUES (?, ?, NOW(), ?, ?)`;

    try {
        await postConnection.beginTransaction();
        let [insertRows, insertField] = await postConnection.query(sql, data);
        await postConnection.commit();

        console.log('insert success');
        return [insertRows, insertField];
    } catch (err) {
        await postConnection.rollback();

        errorGenerator(err.message, err.errno);
    } finally {
        postConnection.release();
    }
}

const getPost = async (data) => {
    let postConnection = await whatEatTodayPool.getConnection(async conn => conn);
    let sql = `SELECT post_title, write_id, post_date, post_content, look_views FROM post_information WHERE post_index = ?`;

    try {
        await postConnection.beginTransaction();
        let [selectRows] = await postConnection.query(sql, data);
        await postConnection.commit();

        console.log('select success');
        return selectRows;
    } catch (err) {
        await postConnection.rollback();

        errorGenerator(err.message, err.errno);
    } finally {
        postConnection.release();
    }
}

const getPostWithFilter = async (data) => {
    let postConnection = await whatEatTodayPool.getConnection(async conn => conn);
    let sql = `SELECT post_title, write_id, post_date, post_content, look_views FROM post_information WHERE MATCH (${data[0]}) AGAINST ('${data[1]}' IN BOOLEAN MODE) LIMIT ${data[2]}`

    if (!(data[0]) || !(data[1])) sql = `SELECT post_title, write_id, post_date, post_content, look_views FROM post_information LIMIT  ${data[2]}`;

    try {
        await postConnection.beginTransaction();
        console.log(sql);
        let [selectRows] = await postConnection.query(sql, data);
        await postConnection.commit();

        console.log('select success');
        return selectRows;
    } catch (err) {
        await postConnection.rollback();

        errorGenerator(err.message, err.errno);
    } finally {
        postConnection.release();
    }
}

const increaseView = async (data) => {
    let postConnection = await whatEatTodayPool.getConnection(async conn => conn);
    let sql = `UPDATE post_information SET ? WHERE post_index = ?`;

    try {
        await postConnection.beginTransaction();
        let [updateRows] = await postConnection.query(sql, data);
        await postConnection.commit();

        console.log('update success');
        return updateRows;
    } catch (err) {
        await postConnection.rollback();

        errorGenerator(err.message, err.errno);
    } finally {
        postConnection.release();
    }
}

const findWriter = async (data) => {
    let postConnection = await whatEatTodayPool.getConnection(async conn => conn);
    let sql = `SELECT write_id, post_title, post_content FROM post_information WHERE post_index = ?`;

    try {
        await postConnection.beginTransaction();
        let [selectRows] = await postConnection.query(sql, data);
        await postConnection.commit();

        console.log('select success');
        return selectRows;
    } catch (err) {
        await postConnection.rollback();

        errorGenerator(err.message, err.errno);
    } finally {
        postConnection.release();
    }
}

const changePost = async (data) => {
    let postConnection = await whatEatTodayPool.getConnection(async conn => conn);
    let sql = `UPDATE post_information SET post_date = NOW(), ? WHERE post_index = ?`;

    try {
        await postConnection.beginTransaction();
        let [updateRows] = await postConnection.query(sql, data);
        await postConnection.commit();

        console.log('update success');
        return updateRows;
    } catch (err) {
        await postConnection.rollback();

        errorGenerator(err.message, err.errno);
    } finally {
        postConnection.release();
    }
}

const clearPost = async (data) => {
    let postConnection = await whatEatTodayPool.getConnection(async conn => conn);
    let sql = `DELETE FROM post_information WHERE post_index = ?`;

    try {
        await postConnection.beginTransaction();
        let [deleteRows] = await postConnection.query(sql, data);
        await postConnection.commit();

        console.log('delete success');
        return deleteRows;
    } catch (err) {
        await postConnection.rollback();

        errorGenerator(err.message, err.errno);
    } finally {
        postConnection.release();
    }
}

const checkPostExist = async (data) => {
    let postConnection = await whatEatTodayPool.getConnection(async conn => conn);
    let sql = `SELECT post_index FROM post_information WHERE post_index = ?`;

    try {
        await postConnection.beginTransaction();
        let [selectRows] = await postConnection.query(sql, data);
        await postConnection.commit();

        console.log('select success');
        return selectRows;
    } catch (err) {
        await postConnection.rollback();

        errorGenerator(err.message, err.errno);
    } finally {
        postConnection.release();
    }
}

export {
    createPost,
    getPost,
    getPostWithFilter,
    increaseView,
    findWriter,
    changePost,
    clearPost,
    checkPostExist
}