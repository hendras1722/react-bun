export function isValidURL(url: string) {
  try {
    const result = new URL(url);

    return ['http:', 'https:'].includes(result.protocol);
  }
  catch {
    return false;
  }
}
