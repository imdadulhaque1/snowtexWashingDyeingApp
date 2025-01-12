import AppURL from '@restApi/AppURL';
import axios from 'axios';

export const fetchMenuItems = async (urlString: string, remarks: string) => {
  console.log('Only menus: ', AppURL.getMenusApi(urlString, remarks));

  try {
    const res = await axios.get(AppURL.getMenusApi(urlString, remarks));
    let response = res?.data;

    return response;
  } catch (err: any) {
    return err?.message;
  }
};
