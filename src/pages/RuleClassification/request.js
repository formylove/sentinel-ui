import request from '@/utils/request';

export async function createPullRequest() {
  return request('/pull-requests', {
    method: "post"
  });
}

export async function getPullRequestList(params) {
  return request('/pull-requests/', {params});
}

export async function getPullRequest(id) {
  return request(`/pull-requests/${id}`);
}

export async function updatePullRequest(id) {
  return request(`/pull-requests/${id}`, {
    method: 'PUT'
  });
}

export async function deletePullRequest(id) {
  return request(`/pull-requests/${id}`, {
    method: 'DELETE'
  });
}

export async function updatePullRequestStatus(id) {
  return request(`/pull-requests/${id}/status`, {
    method: "PATCH"
  });
}
