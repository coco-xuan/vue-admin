import axios from 'axios'

export function request(config) {
    const instance = axios.create({
        baseURL: 'http://timemeetyou.com:8889/api/private/v1',
        timeout: 5000
    })
    // 设置拦截器
    instance.interceptors.request.use(config => {
        config.headers.Authorization = window.sessionStorage.getItem('token')
        return config
    }, err => {
        console.log(err);
    })

    instance.interceptors.response.use(res => {
        return res.data
    }, err => {
        console.log(err);
    })

    return instance(config)

}
