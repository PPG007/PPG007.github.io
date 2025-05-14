import { ElMessage } from 'element-plus';

export const copyToClipboard = async (content: string) => {
  await navigator.clipboard.writeText(content);
  ElMessage.success('复制成功');
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
