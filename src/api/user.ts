import axiosInstance from "~/utils/request";

/**
 * 获取邮箱验证码
 * @param email
 */
export const getEmailCaptcha = (email: string) => {
    return axiosInstance({
        url: `/random/api/emailCaptcha/${email}`,
        method: 'GET',
        data: email,
    })
}

/**
 * 登录
 * @param params
 */
export const login = (params: { user: any, captchaParam: string }) => {
    return axiosInstance({
        url: `/random/api/login?captcha=${params.captchaParam}`,
        method: 'POST',
        data: params.user,
    });
};

/**
 * 注册
 * @param params
 */
export const register = (params : {param: any, emailCaptcha: string}) => {
    return axiosInstance(
        {
            url: `/random/api/register?emailCaptcha=${params.emailCaptcha}`,
            method: 'POST',
            data: params.param,
        });
};

/**
 * 修改密码
 * @param params
 */
export const remakePassword = (params : {param: any, captcha: string}) => {
    return axiosInstance({
        url: `/random/api/remakePassword?emailCaptcha=${params.captcha}`,
        method: 'POST',
        data: params.param,
    });
}
/**
 * 注销
 * @param params
 */
export const logout = (params : any) => {
    return axiosInstance(
        {
            url: `/random/api/logout`,
            method: 'POST',
            data: params,
        }
    );
}
