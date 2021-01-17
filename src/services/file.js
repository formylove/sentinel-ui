import request from '@/utils/request';

export async function getFilePreview(filename, scope) {
  return request(`/file/${filename}/${scope}`);
}
