import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

export const openPDF = async (url: string | undefined) => {
  if (!url) {
    console.log('No URL provided');
    return;
  }

  if (Platform.OS === 'web') {
    window.open(url, '_blank');
  } else {
    await WebBrowser.openBrowserAsync(url);
  }
};
