import { request } from './request'


export function getDeleteCate(id) {
    return request({
        url: `/categories/${id}`,
        method: 'delete'
    })
}

export function deleteParams(id1, id2) {
    return request({
        url: `categories/${id1}/attributes/${id2}`,
        method: 'delete'
    })
}