import axiosInstance from "~/utils/request";

export const getEmailCaptcha = (email: string) => {
    return axiosInstance({
        url: `/random/api/emailCaptcha/${email}`,
        method: 'GET',
        data: email,
    })
}

export const login = (params: { user: any, captchaParam: string }) => {
    return axiosInstance({
        url: `/random/api/login?captcha=${params.captchaParam}`,
        method: 'POST',
        data: params.user,
    });
};

export const register = (params : {param: any, emailCaptcha: String}) => {
    return axiosInstance(
        {
            url: `/random/api/register?emailCaptcha=${params.emailCaptcha}`,
            method: 'POST',
            data: params.param,
        });
};

export const logout = (params : any) => {
    return axiosInstance(
        {
            url: `/random/api/logout`,
            method: 'POST',
            data: params,
        }
    )
}
