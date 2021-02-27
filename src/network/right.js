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

export function editSearch(id) {

    return request({
        url: '/roles/' + id,
        method: 'get'
    })

}

export function editRoles(id, data) {
    return request({
        url: '/roles/' + id,
        method: 'put',
        data: data
    }).catch(res => {
        console.log(res);
    })
}

export function deleteRoles(id) {
    return request({
        url: '/roles/' + id,
        method: 'delete'
    })
}

export function deleteThree(id1, id2) {
    return request({
        url: `/roles/${id1}/rights/${id2}`,
        method: 'delete'
    })
}

export function getRight() {
    return request({
        url: '/rights/tree',
        method: 'get'
    })
}