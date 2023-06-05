import { commentCreate, commentShow, commentEdit, commentDelete, commentShowAll } from '../service/commentService.js';

const writeComment = async (req, res, next) => {
    try {
        const message = await commentCreate(req);
        const result = {
            message : message
        }

        // status code 201로 게시글 작성 성공을 JSON형식으로 응답
        return res.status(201).json(result);
    } catch (err) {
        console.log(err);
        next(err);
    }
}
 
const showComment = async (req, res, next) => {
    try {
        const comment = await commentShow(req.params.comment_index);

        // status code 200으로 게시글을 JSON형식으로 응답
        return res.status(200).json(comment);
    } catch (err) {
        console.log(err);
        next(err);
    }
}

const editComment = async (req, res, next) => {
    try {
        const message = await commentEdit(req);
        const result = {
            message : message
        }

        
        // status code 200로 게시글 수정 성공을 JSON형식으로 응답
        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        next(err);
    }
}

const deleteComment = async (req, res, next) => {
    try {
        const message = await commentDelete(req);
        const result = {
            message : message
        }

        // status code 204로 게시글 삭제 성공을 JSON형식으로 응답
        return res.status(204).json(result);
    } catch (err) {
        console.log(err);
        next(err);
    }
}

const showAllComments = async (req, res, next) => {
    try {
        const result = await commentShowAll(req.query);

        // status code 200으로 게시글을 JSON형식으로 응답
        return res.status(200).json(result);
    } catch (err) {
        console.log(err);

        next(err);
    }
}

export {
    writeComment,
    showComment,
    showAllComments,
    editComment,
    deleteComment
}