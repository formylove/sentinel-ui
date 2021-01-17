import request from '@/utils/request';

export async function createPullRequest(data) {
  return request('/pull-requests', {
    method: "post",
    data
  });
}

export async function getPullRequestList(params) {
  return request('/pull-requests/', {params});
}

export async function getPullRequest(id) {
  return request(`/pull-requests/${id}`);
}

export async function updatePullRequest(id, data) {
  return request(`/pull-requests/${id}`, {
    method: 'PUT',
    data
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

export async function getRuleClassifications () {
  return request('/rule-classifications/')
}

export async function getRuleList () {
  return request('/rules/')
}

export async function getUserList() {
  return request('/users/')
}

export async function postPullRequestReviews(pid, data) {
  return request(`/pull-requests/${pid}/reviews`, {
    method: 'post',
    data
  })
}

export async function getPullRequestReviewsList(pid) {
  return request(`/pull-requests/${pid}/reviews`)
}

export async function deleteReviews(rid) {
  return request(`/reviews/${rid}`, {
    method: 'DELETE'
  })
}
