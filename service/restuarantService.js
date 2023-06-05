import { errorGenerator } from '../middleware/errorHandler.js';
import getRestaurantWithFilter from '../model/restaurantModel.js';

const restaurantShowAll = async (query) => {
    try {
        const DEFAULT_START_PAGE = 1;
        const DEFAULT_PAGE_SIZE = 4;
        const currentPage = query.page;
        const pageSize = query.page_size;

        let searchFilter;
        if (query.filter === 'name') searchFilter = 'restaurant_name';
        if (query.filter === 'kinds') searchFilter = 'restaurant_kind';
        if (query.filter === 'location') searchFilter = 'restaurant_address';
        console.log(searchFilter);

        let inputText;
        let searchText;
        if (query.text) {
            inputText = (query.text).trim();
            searchText = inputText + "*"; 
            if (inputText.includes(' ')) {
                searchText = '';
                inputText = (query.text).split(" ");
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
            errorGenerator("There is no result", 404);
        }

        const showWithFilter = await getRestaurantWithFilter(filterParam);

        return showWithFilter
    } catch (err) {
        console.log(err);

        throw err;
    }
}

export {
    restaurantShowAll
}