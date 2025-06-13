<template>
  <ElRow>
    <ElCol :span="4" :offset="10">
      <ElSelect v-model="selectedMethod" size="large">
        <ElOption v-for="(method, index) in supportedMethods" :key="index" :value="method" :label="method" />
      </ElSelect>
    </ElCol>
  </ElRow>
  <ElRow justify="space-around" align="middle">
    <ElCol :span="8">
      <ElInput type="textarea" v-model="input" :autosize="{ minRows: 15 }" resize="none" placeholder="原始内容"/>
    </ElCol>
    <ElCol :span="7">
      <ElInput type="textarea" v-model="key" :autosize="{ minRows: 15 }" resize="none" placeholder="密钥（可选）"/>
    </ElCol>
    <ElCol :span="8">
      <ElInput type="textarea" :value="output" readonly :autosize="{ minRows: 15 }" resize="none" />
    </ElCol>
  </ElRow>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElInput, ElSelect, ElOption, ElRow, ElCol } from 'element-plus';
import crypto from 'crypto-js';

const { enc, HmacMD5, HmacSHA1, HmacSHA256, HmacSHA512, MD5, SHA1, SHA256, SHA512 } = crypto;

type method = 'md5' | 'sha1' | 'sha256' | 'sha512';
const supportedMethods = ['md5', 'sha1', 'sha256', 'sha512'];
const selectedMethod = ref<method>('md5');
const input = ref('');
const key = ref('');
const toHex = enc.Hex.stringify;
const output = computed(() => {
  const keyValue = key.value.trim();
  if (!input.value) {
    return '';
  }
  switch (selectedMethod.value) {
    case 'md5':
      return keyValue ? toHex(HmacMD5(input.value, keyValue)) : toHex(MD5(input.value));
    case 'sha1':
      return keyValue ? toHex(HmacSHA1(input.value, keyValue)) : toHex(SHA1(input.value));
    case 'sha256':
      return keyValue ? toHex(HmacSHA256(input.value, keyValue)) : toHex(SHA256(input.value));
    case 'sha512':
      return keyValue ? toHex(HmacSHA512(input.value, keyValue)) : toHex(SHA512(input.value));
  }
})
</script>

<style lang="css" scoped>
.el-row {
  margin-top: 50px;
}
</style>
