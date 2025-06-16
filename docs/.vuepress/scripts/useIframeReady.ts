import { ref } from 'vue';

const ready = ref(false);

export default function () {
  return ready;
}
