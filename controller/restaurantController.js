import { restaurantShowAll } from '../service/restuarantService.js';

const showAllRestaurants = async (req, res, next) => {
    try {
        const result = await restaurantShowAll(req.query);

        return res.status(200).json(result);
    } catch (err) {
        console.log(err);

        next(err);
    }
}

export default showAllRestaurants;

