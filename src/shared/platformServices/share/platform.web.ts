
export async function fetchRemoteMedia(url: string, extension: string): Promise<string> {
  throw new Error('unsupported operation, fetchRemoteMedia is not implemented in web');
}

export async function openShare(url: string | null, message: string | null): Promise<any> {
  throw new Error('unsupported operation, openShare is not implemented in web');
}