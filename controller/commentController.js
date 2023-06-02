import { errorGenerator } from '../middleware/errorHandler.js';

import { createComment, getComment, getCommentsWithPage, findWriter, changeComment, clearComment } from '../model/commentModel.js';

import { checkPostExist } from '../model/postModel.js';

const writeComment = async (req, res, next) => {
    try {
        // 요청 결과를 받는 변수 선언
        let queryResult;

        const userSession = req.session.user;
        const writerId = userSession.userId;
        console.log(writerId);
        const relatedPostIndex = req.query.post_index;
        // DB에 저장할 회원 정보를 담는 배열 userInform
        const commentInform = [writerId, relatedPostIndex, req.body.content];
        
        const relatedPost = await checkPostExist(relatedPostIndex);

        if (relatedPost.length === 0) {
            queryResult = "There is no result";

            errorGenerator(queryResult, 404);
        }

        await createComment(commentInform);

        queryResult = {
            message : "write comment success"
        }
        // status code 201로 게시글 작성 성공을 JSON형식으로 응답
        return res.status(201).json(queryResult);
    } catch (err) {
        console.log(err);
        next(err);
    }
}
 
const showComment = async (req, res, next) => {
    try {
        // 요청 결과를 받는 변수 선언
        let queryResult;
 
        const commentIndex = req.params.comment_index;
        const showCommentResult = await getComment(commentIndex);

        if (showCommentResult.length === 0) {
            queryResult = "There is no result";

            errorGenerator(queryResult, 404);
        }

        // 세션이 존재하고 에러도 없을 때 queryResult에 selectQuery()를 실행했을 때의 결과를 queryResult에 할당함
        queryResult = {
            writer : showCommentResult[0].write_id,
            date : showCommentResult[0].comments_date,
            content : showCommentResult[0].comments_content
        }
        // status code 200으로 게시글을 JSON형식으로 응답
        return res.status(200).json(queryResult);
    } catch (err) {
        console.log(err);
        next(err);
    }
}

const editComment = async (req, res, next) => {
    try {
        // 요청 결과를 받는 변수 선언
        let queryResult;
       
        const commentIndex = req.params.comment_index;
        const findWriterResult = await findWriter(commentIndex);

        if (findWriterResult.length === 0) {
            queryResult = "There is no result";

            errorGenerator(queryResult, 404);
        }

        if (!(findWriterResult[0].write_id === req.session.user.userId)) {
            queryResult = {
                message : "you don't have authority"
            };
            errorGenerator(queryResult.message, 403);
        }

        const commentInput = {
            content : req.body.content
        };
        // updateQuery()로 update문 실행 시 update 할 값들을 받은 updateOption 
        const updateOption = {};
        // inputParam의 각 프로퍼티가 존재하면 updateOption에 추가하는 if문 
        if (commentInput.content) updateOption['comments_content'] = commentInput.content;
        const editParam = [updateOption, commentIndex];
        
        if (Object.keys(updateOption).length === 0) {
            queryResult = "you don't input please input anything";

            errorGenerator(queryResult, 404);
        }

        for (let i in updateOption) {
            if (findWriterResult[0][i] === updateOption[i]) {
                queryResult = `input same ${i} please change your input`;
    
                errorGenerator(queryResult, 409);
            }
        }

        await changeComment(editParam);

        queryResult = {
            message : "edit comment success"
        }
        
        // status code 200로 게시글 수정 성공을 JSON형식으로 응답
        return res.status(200).json(queryResult);
    } catch (err) {
        console.log(err);
        next(err);
    }
}

const deleteComment = async (req, res, next) => {
    try {
        // 요청 결과를 받는 변수 선언
        let queryResult;
       
        const commentIndex = req.params.comment_index;
        const findWriterResult = await findWriter(commentIndex);

        if (findWriterResult.length === 0) {
            queryResult = "There is no result";

            errorGenerator(queryResult, 404);
        }

        if (!(findWriterResult[0].write_id === req.session.user.userId)) {
            queryResult = {
                message : "you don't have authority"
            };
            errorGenerator(queryResult.message, 403);
        }

        await clearComment(commentIndex);

        queryResult = {
            message : "delete comment success"
        }
        // status code 204로 게시글 삭제 성공을 JSON형식으로 응답
        return res.status(204).json(queryResult);
    } catch (err) {
        console.log(err);
        next(err);
    }
}

const showAllComments = async (req, res, next) => {
    try {
        // 요청 결과를 받는 변수 선언
        let queryResult = {};

        const DEFAULT_START_PAGE = 1;
        const DEFAULT_PAGE_SIZE = 4;
        const currentPage = req.query.page;
        const pageSize = req.query.page_size;
    
        if (!currentPage || currentPage <= 0) currentPage = DEFAULT_START_PAGE;
        if (!pageSize || pageSize <= 0) pageSize = DEFAULT_PAGE_SIZE;
        
        const relatedPostIndex = req.query.post_index;
        const offset = (currentPage - 1) * Number(pageSize);
        const limit = Number(pageSize);
        let pagingInform = [
            offset,
            limit
        ]

        const pagingParam = [relatedPostIndex, pagingInform];
        const relatedPost = await checkPostExist(relatedPostIndex);

        if (relatedPost.length === 0) {
            queryResult = "There is no result";

            errorGenerator(queryResult, 404);
        }

        const showWithPage = await getCommentsWithPage(pagingParam);
        queryResult = showWithPage

        // status code 200으로 게시글을 JSON형식으로 응답
        return res.status(200).json(queryResult);
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