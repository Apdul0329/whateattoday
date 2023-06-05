import { postCreate, postShow, postEdit, postDelete, postShowAll } from '../service/postService.js'

/* URL : /post
*  게시글 작성 컨트롤러
*/
const writePost = async (req, res, next) => {
    try {
        const message = await postCreate(req);
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

/*URL : /post/:post_index
* 게시글 상세 조회 컨트롤러
*/
const showPost = async (req, res, next) => {
    try {
        const post = await postShow(req.params.post_index);

        // status code 200으로 게시글을 JSON형식으로 응답
        return res.status(200).json(post);
    } catch (err) {
        console.log(err);
        next(err);
    }
}

const editPost = async (req, res, next) => {
    try {
        const message = await postEdit(req);
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

const deletePost = async (req, res, next) => {
    try {
        const message = await postDelete(req);
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

const showAllPosts = async (req, res, next) => {
    try {
        const result = await postShowAll(req.query);

        // status code 200으로 게시글을 JSON형식으로 응답
        return res.status(200).json(result);
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