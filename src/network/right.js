import { request } from './request'

export function getRoleslist() {
    return request({
        url: '/roles',
        method: 'get'
    })
}

export function getaddRoles(data) {
    return request({
        url: '/roles',
        method: 'post',
        data: data
    })
}
export function editRoles(id, data) {
    return request({
        url: '/roles/' + id,
        method: 'put',
        data: data
    })
}