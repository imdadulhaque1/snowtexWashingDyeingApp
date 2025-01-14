import axios from 'axios';
import VersionNumber from 'react-native-version-number';

export const fetchAppVersionInfo = async (baseURL: string) => {
  try {
    let currentVersion = await VersionNumber.appVersion;
    // await `http://182.160.125.3:1001/api/AnotherApps/GetCheckVersionAndDownloadApp?version=${currentVersion}&Type=${1}`;

    // App version URL:  http://182.160.125.3:91/api/AnotherApps/GetCheckVersionAndDownloadApp?version=1.0&Type=1
    const url =
      await `${baseURL}AnotherApps/GetCheckVersionAndDownloadApp?version=${currentVersion}&Type=${1}`;

    const {data} = await axios.get(url);
    console.log('versionResponse: ', JSON.stringify(data, null, 2));

    // await axios
    //   .get(url)
    //   .then(res => {
    //     let response = res?.data?.data;
    //     console.log('response: ', JSON.stringify(response, null, 2));

    //     return response;
    //   })
    //   .catch((err: any) => {
    //     console.log('App Info result err:', err?.message || 'Unknown error');
    //     throw err;
    //   });
  } catch (error: any) {
    console.log('Error in appVersionInfo:', error.message);
    throw error;
  }
};
