import Share from "react-native-share";
import fs from 'react-native-fs';

export async function fetchRemoteMedia(url: string, extension: string): Promise<string> {
  // 画像は base64 で受け渡ししてもシェアできるが，動画はファイルでないとうまくいかない
  // （Twitter は拡張子によってファイル形式が判別するらしく，base64 で共有すると動画と認識してくれない）
  const cacheFilePath = fs.CachesDirectoryPath + '/cache.' + extension;
  const { promise } = fs.downloadFile({
    fromUrl: url,
    toFile: cacheFilePath,
  });
  await promise;
  return cacheFilePath;
}

export async function openShare(url: string | null, message: string | null): Promise<any> {
  return new Promise(resolve => {
    setTimeout(() => resolve(Share.open({ url, message })), 1);
  });
}