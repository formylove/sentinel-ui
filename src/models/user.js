import { getUserInfo } from '@/services/user';

const UserModel = {
  namespace: 'user',
  state: {
    name: localStorage.getItem('name') || '',
    role: localStorage.getItem('role') || '',
  },
  effects: {
    *fetchUserInfo(_, { call, put }) {
      const response = yield call(getUserInfo);
      yield put({
        type: 'saveUserInfo',
        payload: response.data,
      });
    },
  },
  reducers: {
    saveUserInfo(state, action) {
      return { ...state, userInfo: action.payload || {} };
    },
  },
};

export default UserModel;
