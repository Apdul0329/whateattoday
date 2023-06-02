import { whatEatTodayPool } from '../config/whatEatTodayDB.js';

import { errorGenerator } from '../middleware/errorHandler.js';

const createComment = async (data) => {
    let commentConnection = await whatEatTodayPool.getConnection(async conn => conn);
    let sql = `INSERT INTO comment_information (write_id, related_post, comments_date, comments_content) VALUES (?, ?, NOW(), ?)`;

    try {
        await commentConnection.beginTransaction();
        let [insertRows, insertField] = await commentConnection.query(sql, data);
        await commentConnection.commit();

        console.log('insert success');
        return [insertRows, insertField];
    } catch (err) {
        await commentConnection.rollback();

        errorGenerator(err.message, err.errno);
    } finally {
        commentConnection.release();
    }
}

const getComment = async (data) => {
    let commentConnection = await whatEatTodayPool.getConnection(async conn => conn);
    let sql = `SELECT write_id, comments_date, comments_content FROM comment_information WHERE comments_index = ?`;

    try {
        await commentConnection.beginTransaction();
        let [selectRows] = await commentConnection.query(sql, data);
        await commentConnection.commit();

        console.log('select success');
        return selectRows;
    } catch (err) {
        await commentConnection.rollback();

        errorGenerator(err.message, err.errno);
    } finally {
        commentConnection.release();
    }
}

const getCommentsWithPage = async (data) => {
    let commentConnection = await whatEatTodayPool.getConnection(async conn => conn);
    let sql = `SELECT write_id, comments_date, comments_content FROM comment_information WHERE related_post = ? LIMIT ?`

    try {
        await commentConnection.beginTransaction();
        console.log(sql);
        let [selectRows] = await commentConnection.query(sql, data);
        await commentConnection.commit();

        console.log('select success');
        return selectRows;
    } catch (err) {
        await commentConnection.rollback();

        errorGenerator(err.message, err.errno);
    } finally {
        commentConnection.release();
    }
}

const findWriter = async (data) => {
    let commentConnection = await whatEatTodayPool.getConnection(async conn => conn);
    let sql = `SELECT write_id, comments_content FROM comment_information WHERE comments_index = ?`;

    try {
        await commentConnection.beginTransaction();
        let [selectRows] = await commentConnection.query(sql, data);
        await commentConnection.commit();

        console.log('select success');
        return selectRows;
    } catch (err) {
        await commentConnection.rollback();

        errorGenerator(err.message, err.errno);
    } finally {
        commentConnection.release();
    }
}

const changeComment = async (data) => {
    let commentConnection = await whatEatTodayPool.getConnection(async conn => conn);
    let sql = `UPDATE comment_information SET comments_date = NOW(), ? WHERE comments_index = ?`;

    try {
        await commentConnection.beginTransaction();
        let [updateRows] = await commentConnection.query(sql, data);
        await commentConnection.commit();

        console.log('update success');
        return updateRows;
    } catch (err) {
        await commentConnection.rollback();

        errorGenerator(err.message, err.errno);
    } finally {
        commentConnection.release();
    }
}

const clearComment = async (data) => {
    let commentConnection = await whatEatTodayPool.getConnection(async conn => conn);
    let sql = `DELETE FROM post_information WHERE post_index = ?`;

    try {
        await commentConnection.beginTransaction();
        let [deleteRows] = await commentConnection.query(sql, data);
        await commentConnection.commit();

        console.log('delete success');
        return deleteRows;
    } catch (err) {
        await commentConnection.rollback();

        errorGenerator(err.message, err.errno);
    } finally {
        commentConnection.release();
    }
}

export {
    createComment,
    getComment,
    getCommentsWithPage,
    findWriter,
    changeComment,
    clearComment
}