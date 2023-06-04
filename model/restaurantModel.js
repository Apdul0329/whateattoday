import { whatEatTodayPool } from '../config/whatEatTodayDB.js';

import { errorGenerator } from '../middleware/errorHandler.js';

const getRestaurantWithFilter = async (data) => {
    let restaurantConnection = await whatEatTodayPool.getConnection(async conn => conn);
    let sql = `SELECT restaurant_name, restaurant_rating, restaurant_kind, restaurant_address, restaurant_image, restaurant_link FROM restaurant_information WHERE MATCH (${data[0]}) AGAINST ('${data[1]}' IN BOOLEAN MODE) LIMIT ${data[2]}`;

    if (!(data[0]) || !(data[1])) sql = `SELECT restaurant_name, restaurant_rating, restaurant_kind, restaurant_address, restaurant_image, restaurant_link FROM restaurant_information LIMIT  ${data[2]}`;

    try {
        await restaurantConnection.beginTransaction();
        console.log(sql);
        let [selectRows] = await restaurantConnection.query(sql, data);
        await restaurantConnection.commit();

        console.log('select success');
        return selectRows;
    } catch (err) {
        await restaurantConnection.rollback();

        errorGenerator(err.message, err.errno);
    } finally {
        restaurantConnection.release();
    }
}

export default getRestaurantWithFilter;