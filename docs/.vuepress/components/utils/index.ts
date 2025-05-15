import { ElMessage, ElLoading } from 'element-plus';
import { Image } from '../types';

export const copyToClipboard = async (content: string) => {
  await navigator.clipboard.writeText(content);
  ElMessage.success('复制成功');
};

export const setLoading = () => {
  return ElLoading.service({
    lock: true,
  });
};

export const formatTimestamp = (t: Date | number, unit: 'ms' | 's' = 's') => {
  if (typeof t === 'number') {
    return t;
  }
  if (unit === 'ms') {
    return t.getTime();
  }
  return Math.floor(t.getTime() / 1000);
};

export const formatDate = (t: Date | number, unit: 'ms' | 's' = 's') => {
  if (t instanceof Date) {
    return t;
  }
  let date = new Date(t * 1);
  if (unit === 's') {
    date = new Date(t * 1000);
  }
  return date;
};

export const round = (n: number, digits: number = 2): number => {
  const temp = Math.pow(10, digits);
  return Math.round(n * temp) / temp;
};

export const readImageFromClipboard = async (): Promise<Image | undefined> => {
  const items = await navigator.clipboard.read();
  for (const item of items) {
    if (item.types.length && item.types[0].startsWith('image')) {
      const blob = await item.getType(item.types[0]);
      const url = URL.createObjectURL(blob);
      return {
        blob,
        url,
      };
    }
  }
  return undefined;
};

export const replaceEscapes = (str: string) => {
  const escapeMap = {
    "\\n": "\n",
    "\\r": "\r",
    "\\t": "\t",
    "\\b": "\b",
    "\\f": "\f",
    "\\\\": "\\",
    '\\"': '"',
    "\\'": "'"
  };

  return str.replace(/\\[nrtbf\\'"]/g, match => escapeMap[match]);
}
