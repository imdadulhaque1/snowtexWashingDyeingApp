import {NativeModules} from 'react-native';

// Destructure to get FingerprintModule from NativeModules
const {FingerprintModule} = NativeModules;

// Default export with the necessary methods
const getDataFromFingerprint = {
  isFingerprintAvailable: (): Promise<boolean> =>
    FingerprintModule.isFingerprintAvailable(),
  authenticate: (): Promise<string> => FingerprintModule.authenticate(),
};

// Function to check if fingerprint authentication is available
export const isAvailableFingerprint = async (): Promise<boolean> => {
  try {
    const available = await getDataFromFingerprint.isFingerprintAvailable();
    return available;
  } catch (error) {
    return false;
  }
};

export default getDataFromFingerprint;
