import { request } from './request'

export function getMenusList() {
    return request({
        url: '/menus'
    }).catch(err => {
        err
    })
}
export function getUserList(data) {
    return request({
        url: '/users',
        params: data
    })
}

