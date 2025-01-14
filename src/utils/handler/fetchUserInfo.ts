import AppURL from '@restApi/AppURL';
import axios from 'axios';

export const fetchUserInfo = async (urlString: string, remarks: string) => {
  try {
    const res = await axios.get(AppURL.getUserInfoApi(urlString, remarks));
    let response = res?.data;

    return response;
  } catch (err: any) {
    return err?.message;
  }
};
