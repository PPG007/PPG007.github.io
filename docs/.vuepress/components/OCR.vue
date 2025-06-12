<template>
  <el-row v-if="selectedImage">
    <el-col :span="24">
      <el-image :src="selectedImage?.url" />
    </el-col>
  </el-row>
  <el-row justify="space-around" align="middle">
    <el-col :span="8">
      <el-button @click="readImage" size="large" type="primary">从剪切板读取图片</el-button>
    </el-col>
    <el-col :span="8">
      <el-upload accept="image/*" :limit="1" :auto-upload="false" :on-change="onImageSelected" :show-file-list="false">
        <el-button size="large" type="primary">从文件选取图片</el-button>
      </el-upload>
    </el-col>
    <el-col :span="3">
      <el-select v-model="selectedLanguage" size="large">
        <el-option v-for="(value, key) in supportedLanguages" :key="key" :label="value" :value="key" />
      </el-select>
    </el-col>
  </el-row>
  <el-row v-if="recognizedText">
    <el-col>
      <el-input :value="recognizedText" readonly type="textarea" resize="none" :autosize="{ minRows: 20 }" />
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { readImageFromClipboard, setLoading } from './utils';
import { UploadFile } from 'element-plus';
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
