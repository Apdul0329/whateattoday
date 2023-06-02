// 에러 핸들러 미들웨어로 에러를 보내주는 모듈
import { errorGenerator } from '../middleware/errorHandler.js';

// 게시글 관련 모델 모듈
import { createPost, getPost, getPostWithFilter, increaseView, findWriter, changePost, clearPost } from '../model/postModel.js';

/* URL : /post
*  게시글 작성 컨트롤러
*/
const writePost = async (req, res, next) => {
    try {
        // 결과를 출력하기 위한 변수
        let queryResult;

        const userSession = req.session.user;
        // 작성자의 ID로 쓰기 위해 세션의 user 객체 중 userId 프로퍼티를 저장하는 변수
        const writerId = userSession.userId;
        // 처음 작성된 게시글이기 때문에 조회수를 0으로 초기화하기 위해 변수 선언
        const initView = 0;
        // DB에 저장할 회원 정보를 담는 배열. 모델이 실행될 때 인자로 전달된다.
        const postInform = [writerId, req.body.title, req.body.content, initView];

        // 사용자가 게시글을 작성하지 않고 저장을 눌렀을 때 404 상태 코드로 예외처리
        if (!(postInform)) {
            queryResult = "you don't input please input anything";

            errorGenerator(queryResult, 404);
        }

        // 게시글 정보를 저장하기 위해 INSERT 쿼리하는 모델 실행
        await createPost(postInform);

        queryResult = {
            message : "write post success"
        }
        // status code 201로 게시글 작성 성공을 JSON형식으로 응답
        return res.status(201).json(queryResult);
    } catch (err) {
        console.log(err);
        next(err);
    }
}

/*URL : /post/:post_index
* 게시글 상세 조회 컨트롤러
*/
const showPost = async (req, res, next) => {
    try {
        // 결과를 출력하기 위한 변수
        let queryResult;

        // 상세 조회할 게시글의 index
        const postIndex = req.params.post_index;
        // postIndex를 index로 갖는 게시글 SELECT 쿼리하는 모델
        const showPostResult = await getPost(postIndex);

        // postIndex를 index로 갖는 게시글이 없는 경우 404 상태코드로 예외처리
        if (showPostResult.length === 0) {
            queryResult = "There is no result";

            errorGenerator(queryResult, 404);
        }

        // 상세 조회 후 조회수 1 증가시켜 줌
        const viewResult ={
            "look_views": showPostResult[0].look_views + 1
        } 
        const increaseViewParam = [viewResult, postIndex];
        
        // 증가한 조회수를 UPDATE 쿼리 해주는 모델 실행 
        await increaseView(increaseViewParam);
        
         // queryResult에 getPost() 모델 결과를 할당함
         queryResult = {
            "title" : showPostResult[0].post_title,
            "writer" : showPostResult[0].write_id,
            "date" : showPostResult[0].post_date,
            "content" : showPostResult[0].post_content,
            "views" : viewResult.look_views
        };

        // status code 200으로 게시글을 JSON형식으로 응답
        return res.status(200).json(queryResult);
    } catch (err) {
        console.log(err);
        next(err);
    }
}

const editPost = async (req, res, next) => {
    try {
        // 요청 결과를 받는 변수 선언
        let queryResult;

        const postIndex = req.params.post_index;
        // TODO 주석 처리
        const findWriterResult = await findWriter(postIndex);

        if (findWriterResult.length === 0) {
            // TODO: Message를 좀 더 구체적으로 설명해 줄 것
            queryResult = "There is no result";

            errorGenerator(queryResult, 404);
        }

        if (!(findWriterResult[0].write_id === req.session.user.userId)) {
            queryResult = {
                message : "you don't have authority"
            };
            errorGenerator(queryResult.message, 403);
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
            queryResult = "you don't input please input anything";

            errorGenerator(queryResult, 404);
        }
        
        // TODO 조건문이 어떤 조건인지 설명하는 주석 필요
        for (let i in updateOption) {
            if (findWriterResult[0][i] === updateOption[i]) {
                queryResult = `input same ${i} please change your input`;
    
                errorGenerator(queryResult, 409);
            }
        }

        const editParam = [updateOption, postIndex];

        await changePost(editParam);

        queryResult = {
            message : "edit post success"
        }
        
        // status code 200로 게시글 수정 성공을 JSON형식으로 응답
        return res.status(200).json(queryResult);
    } catch (err) {
        console.log(err);
        next(err);
    }
}

const deletePost = async (req, res, next) => {
    try {
        // 요청 결과를 받는 변수 선언
        let queryResult;

        const postIndex = req.params.post_index;
        const findWriterResult = await findWriter(postIndex);

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

        await clearPost(postIndex);
        
        queryResult = {
            message : "delete post success"
        }
        // status code 204로 게시글 삭제 성공을 JSON형식으로 응답
        return res.status(204).json(queryResult);
    } catch (err) {
        console.log(err);
        next(err);
    }
}

const showAllPosts = async (req, res, next) => {
    try {
        // 요청 결과를 받는 변수 선언
        let queryResult = {};

        const DEFAULT_START_PAGE = 1;
        const DEFAULT_PAGE_SIZE = 5;
        const currentPage = req.query.page;
        const pageSize = req.query.page_size;

        // 검색 서비스 내에서 어떤 데이터를 받는 변수인지 설명
        let searchFilter;
        if (req.query.filter === 'title') searchFilter = 'post_title';
        if (req.query.filter === 'content') searchFilter = 'post_content';
        if (req.query.filter === 'writer') searchFilter = 'write_id';
        console.log(searchFilter);

        // TODO 변수명 수정 
        let inputText;
        let searchText;
        if (req.query.text) {
            inputText = (req.query.text).trim();
            searchText = inputText + "*"; 
            if (inputText.includes(' ')) {
                searchText = '';
                inputText = (req.query.text).split(" ");
                for (let i=0; i<inputText.length; i++) {
                   searchText += inputText[i] + '* ';  
                }
            }
        }
        console.log(inputText);
        console.log(searchText);
    
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
            queryResult = "There is no result";

            errorGenerator(queryResult, 404);
        }

        const showWithFilter = await getPostWithFilter(filterParam);

        queryResult = showWithFilter;
        // status code 200으로 게시글을 JSON형식으로 응답
        return res.status(200).json(queryResult);
    } catch (err) {
        console.log(err);

        next(err);
    }
}

export {
    writePost,
    showPost,
    editPost,
    deletePost,
    showAllPosts
}