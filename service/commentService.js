import { errorGenerator } from '../middleware/errorHandler.js';
import { createComment, getComment, getCommentsWithPage, findWriter, changeComment, clearComment } from '../model/commentModel.js';
import { checkPostExist } from '../model/postModel.js';

const commentCreate = async (req) => {
    try {
        const userSession = req.session.user;
        const writerId = userSession.userId;
        const relatedPostIndex = req.query.post_index;

        // DB에 저장할 회원 정보를 담는 배열 userInform
        const commentInform = [writerId, relatedPostIndex, req.body.content];
        
        const relatedPost = await checkPostExist(relatedPostIndex);

        if (relatedPost.length === 0) {
            errorGenerator("There is no result", 404);
        }

        await createComment(commentInform);

        const message = "write comment success"

        return message;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

const commentShow = async (index) => {
    try {
        const comment = await getComment(index);

        if (comment.length === 0) {
            errorGenerator("There is no result", 404);
        }

        const result = {
            writer : comment[0].write_id,
            date : comment[0].comments_date,
            content : comment[0].comments_content
        }

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

const commentEdit = async (req) => {
    try {
        const commentIndex = req.params.comment_index;
        const findWriterResult = await findWriter(commentIndex);

        if (findWriterResult.length === 0) {
            errorGenerator("There is no result", 404);
        }

        if (!(findWriterResult[0].write_id === req.session.user.userId)) {
            errorGenerator("you don't have authority", 403);
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
            errorGenerator("you don't input please input anything", 404);
        }

        for (let i in updateOption) {
            if (findWriterResult[0][i] === updateOption[i]) {
                errorGenerator(`input same ${i} please change your input`, 409);
            }
        }

        await changeComment(editParam);

        const message = "edit comment success"
        
        return message;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

const commentDelete = async (req) => {
    try {
        const commentIndex = req.params.comment_index;
        const findWriterResult = await findWriter(commentIndex);

        if (findWriterResult.length === 0) {
            errorGenerator("There is no result", 404);
        }

        if (!(findWriterResult[0].write_id === req.session.user.userId)) {
            errorGenerator("you don't have authority", 403);
        }

        await clearComment(commentIndex);

        const message = "delete comment success"

        return message;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

const commentShowAll = async (query) => {
    try {
        const DEFAULT_START_PAGE = 1;
        const DEFAULT_PAGE_SIZE = 4;
        const currentPage = query.page;
        const pageSize = query.page_size;
    
        if (!currentPage || currentPage <= 0) currentPage = DEFAULT_START_PAGE;
        if (!pageSize || pageSize <= 0) pageSize = DEFAULT_PAGE_SIZE;
        
        const relatedPostIndex = query.post_index;
        const offset = (currentPage - 1) * Number(pageSize);
        const limit = Number(pageSize);
        let pagingInform = [
            offset,
            limit
        ]

        const pagingParam = [relatedPostIndex, pagingInform];
        const relatedPost = await checkPostExist(relatedPostIndex);

        if (relatedPost.length === 0) {
            errorGenerator("There is no result", 404);
        }

        const showWithPage = await getCommentsWithPage(pagingParam);

        return showWithPage;
    } catch (err) {
        console.log(err);

        throw err;
    }
}

export {
    commentCreate,
    commentShow,
    commentEdit,
    commentDelete,
    commentShowAll
}