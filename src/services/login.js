import request from '@/utils/request';

export async function userLoginFetch(params) {
  return request('/users/login', {
    method: 'POST',
    data: params
  });
}
