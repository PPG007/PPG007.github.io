import { ref } from 'vue';

const url = ref<string>('');

export default function () {
  return url;
}
