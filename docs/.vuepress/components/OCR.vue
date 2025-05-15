<template>
  <ElRow v-if="selectedImage">
    <ElCol :span="24">
      <ElImage :src="selectedImage?.url" />
    </ElCol>
  </ElRow>
  <ElRow justify="space-around" align="middle">
    <ElCol :span="8">
      <ElButton @click="readImage" size="large" type="primary">从剪切板读取图片</ElButton>
    </ElCol>
    <ElCol :span="8">
      <ElUpload accept="image/*" :limit="1" :auto-upload="false" :on-change="onImageSelected" :show-file-list="false">
        <ElButton size="large" type="primary">从文件选取图片</ElButton>
      </ElUpload>
    </ElCol>
    <ElCol :span="3">
      <ElSelect v-model="selectedLanguage" size="large">
        <ElOption v-for="(value, key) in supportedLanguages" :key="key" :label="value" :value="key" />
      </ElSelect>
    </ElCol>
  </ElRow>
  <ElRow v-if="recognizedText">
    <ElCol>
      <ElInput :value="recognizedText" readonly type="textarea" resize="none" :autosize="{ minRows: 20 }" />
    </ElCol>
  </ElRow>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ElImage, ElButton, ElRow, ElCol, ElUpload, UploadFile, ElInput, ElSelect, ElOption } from 'element-plus';
import { readImageFromClipboard, setLoading } from './utils';
import tesseract from 'tesseract.js';
import { Image } from './types';

const supportedLanguages = {
  eng: '英语',
  chi_sim: '简体中文',
  chi_tra: '繁体中文',
  jpn: '日语',
};

const selectedImage = ref<Image>();
const selectedLanguage = ref<string>('eng');
const recognizedText = ref<string>('');
const readImage = async () => {
  const image = await readImageFromClipboard();
  if (image) {
    selectedImage.value = image;
  }
}
const onImageSelected = (file: UploadFile) => {
  recognizedText.value = '';
  if (file.raw) {
    selectedImage.value = {
      blob: file.raw,
      url: URL.createObjectURL(file.raw),
    };
  }
}
watch([selectedImage, selectedLanguage], ([newImage, newLanguage]) => {
  if (!newImage) {
    return;
  }
  const loading = setLoading();
  tesseract.recognize(newImage.blob, newLanguage).then(({ data: { text } }) => {
    recognizedText.value = text;
  }).finally(() => {
    loading.close();
  })
})
</script>

<style lang="css" scoped>
.el-row {
  margin-top: 30px;
}
</style>
