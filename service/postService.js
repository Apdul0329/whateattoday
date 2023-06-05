// 에러 핸들러 미들웨어로 에러를 보내주는 모듈
import { errorGenerator } from '../middleware/errorHandler.js';

import { createPost, getPost, getPostWithFilter, increaseView, findWriter, changePost, clearPost } from '../model/postModel.js';

const postCreate = async (req) => {
    try {
        const userSession = req.session.user;
        // 작성자의 ID로 쓰기 위해 세션의 user 객체 중 userId 프로퍼티를 저장하는 변수
        const writerId = userSession.userId;
        // 처음 작성된 게시글이기 때문에 조회수를 0으로 초기화하기 위해 변수 선언
        const initView = 0;
        // DB에 저장할 회원 정보를 담는 배열. 모델이 실행될 때 인자로 전달된다.
        const postInform = [writerId, req.body.title, req.body.content, initView];

        // 사용자가 게시글을 작성하지 않고 저장을 눌렀을 때 404 상태 코드로 예외처리
        if (!(postInform)) {
            errorGenerator("you don't input please input anything", 404);
        }

        // 게시글 정보를 저장하기 위해 INSERT 쿼리하는 모델 실행
        await createPost(postInform);

        const message = "write post success"

        return message;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

const postShow = async (index) => {
    try {
        // index를 index로 갖는 게시글 SELECT 쿼리하는 모델
        const post = await getPost(index);

        // index를 index로 갖는 게시글이 없는 경우 404 상태코드로 예외처리
        if (post.length === 0) {
            errorGenerator("There is no result", 404);
        }

        // 상세 조회 후 조회수 1 증가시켜 줌
        const view ={
            "look_views": post[0].look_views + 1
        } 
        const increaseViewParam = [view, index];
        
        // 증가한 조회수를 UPDATE 쿼리 해주는 모델 실행 
        await increaseView(increaseViewParam);
        
        const result = {
            "title" : post[0].post_title,
            "writer" : post[0].write_id,
            "date" : post[0].post_date,
            "content" : post[0].post_content,
            "views" : view.look_views
        }

        return result
    } catch (err) {
        console.log(err);
        throw err;
    }
}

const postEdit = async (req) => {
    try {
        const postIndex = req.params.post_index;
        
        /* postIndex에 해당하는 post의 작성자가 있는지 여부를
        *  findWriter 모델로 확인
        */
        const findWriterResult = await findWriter(postIndex);

        if (findWriterResult.length === 0) {
            errorGenerator("There is no result", 404);
        }

        if (!(findWriterResult[0].write_id === req.session.user.userId)) {
            errorGenerator("you don't have authority", 403);
        }

        const postInput = {
            title : req.body.title,
            content : req.body.content
        };
        // update문 실행 시 update 할 값들을 받은 updateOption 
        const updateOption = {};
        // inputParam의 각 프로퍼티가 존재하면 updateOption에 추가하는 if문 
        // 기획한 의도 설명 필요
        if (postInput.title) updateOption['post_title'] = postInput.title;
        if (postInput.content) updateOption['post_content'] = postInput.content;

        if (Object.keys(updateOption).length === 0) {
            errorGenerator("you don't input please input anything", 404);
        }
        
        // TODO 조건문이 어떤 조건인지 설명하는 주석 필요
        for (let i in updateOption) {
            if (findWriterResult[0][i] === updateOption[i]) {
                errorGenerator(`input same ${i} please change your input`, 409);
            }
        }

        const editParam = [updateOption, postIndex];
        await changePost(editParam);

        const message = "edit post success";

        return message;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

const postDelete = async (req) => {
    try {
        const postIndex = req.params.post_index;
        const findWriterResult = await findWriter(postIndex);

        if (findWriterResult.length === 0) {
            errorGenerator("There is no result", 404);
        }

        if (!(findWriterResult[0].write_id === req.session.user.userId)) {
            errorGenerator("you don't have authority", 403);
        }

        await clearPost(postIndex);
        
        const message = "delete post success"

        return message
    } catch (err) {
        console.log(err);
        throw err;
    }
}

const postShowAll = async (query) => {
    try {
        const DEFAULT_START_PAGE = 1;
        const DEFAULT_PAGE_SIZE = 5;
        const currentPage = query.page;
        const pageSize = query.page_size;

        // 검색 서비스 내에서 어떤 데이터를 받는 변수인지 설명
        let searchFilter;
        if (query.filter === 'title') searchFilter = 'post_title';
        if (query.filter === 'content') searchFilter = 'post_content';
        if (query.filter === 'writer') searchFilter = 'write_id';

        // TODO 변수명 수정 
        let inputText;
        let searchText;
        if (query.text) {
            inputText = (query.text).trim();
            searchText = inputText + "*"; 
            if (inputText.includes(' ')) {
                searchText = '';
                inputText = (req.query.text).split(" ");
                for (let i=0; i<inputText.length; i++) {
                   searchText += inputText[i] + '* ';  
                }
            }
        }
    
        if (!currentPage || currentPage <= 0) currentPage = DEFAULT_START_PAGE;
        if (!pageSize || pageSize <= 0) pageSize = DEFAULT_PAGE_SIZE;
        
        const offset = (currentPage - 1) * Number(pageSize);
        const limit = Number(pageSize);
        let pagingInform = [
            offset,
            limit
        ]

        const filterParam = [searchFilter, searchText, pagingInform];

        if (filterParam.length === 0) {
            errorGenerator("There is no result", 404);
        }

        const showWithFilter = await getPostWithFilter(filterParam);

        return showWithFilter;
    } catch (err) {
        console.log(err);

        throw err;
    }
}

export {
    postCreate,
    postShow,
    postEdit,
    postDelete,
    postShowAll
}