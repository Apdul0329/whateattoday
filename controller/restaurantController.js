import { errorGenerator } from '../middleware/errorHandler.js';

import getRestaurantWithFilter from '../model/restaurantModel.js';

const showAllRestaurants = async (req, res, next) => {
    try {
        // 요청 결과를 받는 변수 선언
        let queryResult = {};

        const DEFAULT_START_PAGE = 1;
        const DEFAULT_PAGE_SIZE = 4;
        const currentPage = req.query.page;
        const pageSize = req.query.page_size;

        let searchFilter;
        if (req.query.filter === 'name') searchFilter = 'restaurant_name';
        if (req.query.filter === 'kinds') searchFilter = 'restaurant_kind';
        if (req.query.filter === 'location') searchFilter = 'restaurant_address';
        console.log(searchFilter);

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

        const showWithFilter = await getRestaurantWithFilter(filterParam);

        queryResult = showWithFilter;
        // status code 200으로 게시글을 JSON형식으로 응답
        return res.status(200).json(queryResult);
    } catch (err) {
        console.log(err);

        next(err);
    }
}

export default showAllRestaurants;

