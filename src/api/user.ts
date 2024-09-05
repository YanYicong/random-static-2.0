import axiosInstance from "~/utils/request";


export const login = (params : any) => {
    return axiosInstance(
        {
            url: `/random/api/login`,
            method: 'POST',
            data: params,
        }
    )
};

export const register = (params : any) => {
    return axiosInstance(
        {
            url: `/random/api/register`,
            method: 'POST',
            data: params,
        }
    )
}

export const logout = (params : any) => {
    return axiosInstance(
        {
            url: `/random/api/logout`,
            method: 'POST',
            data: params,
        }
    )
}
