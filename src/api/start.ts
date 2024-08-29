import {service} from "~/utils/request";
import {RANDOM_START} from "~/utils/globle";

/**
 * 获取随即项组及其随机项
 * @param data
 */
export const getCategoriesAndOptions = (params : any) => {
    return service(
        {
            url: `${RANDOM_START}/categories`,
            method: 'POST',
            data: params,
        }
    )
};

export const getRandomResultContext = (categoryId : string) => {
    return service(
        {
            url: `${RANDOM_START}/startRandom/${categoryId}`,
            method: 'POST',
        }
    )
};
