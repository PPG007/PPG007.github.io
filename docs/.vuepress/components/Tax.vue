<template>
  <ElRow justify="center" align="middle">
    <ElCol :span="5">
      <ElText size="large" type="primary">专项附加扣除</ElText>
    </ElCol>
    <ElCol :span="5">
      <ElInputNumber v-model="extraDeductionAmount" :min="0" :precision="2" size="large" :controls="false">
      </ElInputNumber>
    </ElCol>
  </ElRow>
  <ElRow justify="center" align="middle">
    <ElCol :span="5">
      <ElTooltip placement="left" content="新建行的内容将与最后一行相同">
        <ElButton size="large" :disabled="!appendable" @click="appendIncome">添加一行</ElButton>
      </ElTooltip>
    </ElCol>
    <ElCol :span="5">
      <ElButton size="large" type="primary" @click="calculate">计算</ElButton>
    </ElCol>
  </ElRow>
  <ElRow justify="center" align="middle" v-for="(income, index) in incomeList" :key="index">
    <ElCol :span="3">
      <ElTag type="primary">{{ index + 1 }}月</ElTag>
    </ElCol>
    <ElCol :span="3">
      <ElText size="large">税前收入：</ElText>
    </ElCol>
    <ElCol :span="5">
      <ElInputNumber v-model="income.income" :controls="false" :min="0" :precision="2" />
    </ElCol>
    <ElCol :span="5">
      <ElText size="large">五险一金等专项扣除：</ElText>
    </ElCol>
    <ElCol :span="5">
      <ElInputNumber v-model="income.deductionAmount" :controls="false" :min="0" :precision="2" />
    </ElCol>
    <ElCol :span="2">
      <ElButton @click="deleteItem(index)" :disabled="!index" type="danger">删除</ElButton>
    </ElCol>
  </ElRow>

  <ElDrawer v-model="isDrawerVisible" :show-close="false">
    <template #title>
      <ElText type="success" size="large">计算结果</ElText>
    </template>
    <ElTimeline>
      <ElTimelineItem v-for="(item, index) in taxProps" :key="index" hide-timestamp>
        <TaxTimelineItem :value="item" />
      </ElTimelineItem>

      <ElTimelineItem>
        <h3>累计应缴纳税额</h3>
        {{  totalTax }}元
      </ElTimelineItem>
    </ElTimeline>
  </ElDrawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElRow, ElCol, ElButton, ElInputNumber, ElText, ElTag, ElTooltip, ElDrawer, ElTimeline, ElTimelineItem } from 'element-plus';
import { TaxProps } from './types';
import { round } from '../utils';
import { TaxTimelineItem } from './core';

interface TaxRate {
  minAmount: number;
  maxAmount: number;
  rate: number;
  quickNumber: number;
}

const yearTaxRateTable: Array<TaxRate> = [
  {
    minAmount: 0,
    maxAmount: 36000,
    rate: 3,
    quickNumber: 0,
  },
  {
    minAmount: 36001,
    maxAmount: 144000,
    rate: 10,
    quickNumber: 2520,
  },
  {
    minAmount: 144001,
    maxAmount: 300000,
    rate: 20,
    quickNumber: 16920,
  },
  {
    minAmount: 300001,
    maxAmount: 420000,
    rate: 25,
    quickNumber: 31920,
  },
  {
    minAmount: 420001,
    maxAmount: 660000,
    rate: 30,
    quickNumber: 52920,
  },
  {
    minAmount: 660001,
    maxAmount: 960000,
    rate: 35,
    quickNumber: 85920,
  },
  {
    minAmount: 960000,
    maxAmount: 0,
    rate: 45,
    quickNumber: 181920,
  },
];

const taxThreshold = 5000;

interface Income {
  income: number;
  deductionAmount: number;
}

const extraDeductionAmount = ref(0);
const isDrawerVisible = ref(false);
const incomeList = ref<Array<Income>>([{ income: 0, deductionAmount: 0 }]);
const appendable = computed(() => {
  return incomeList.value.length < 12;
});
const appendIncome = () => {
  incomeList.value.push({
    income: incomeList.value[incomeList.value.length - 1].income,
    deductionAmount: incomeList.value[incomeList.value.length - 1].deductionAmount,
  });
}

const taxProps = computed(() => {
  const items: Array<TaxProps> = [];
  let total = 0;
  let tax = 0;
  incomeList.value.forEach((item, index) => {
    const amount = item.income - taxThreshold - item.deductionAmount - extraDeductionAmount.value;
    total = round(amount + total);
    const rate = yearTaxRateTable.find((rate) => {
      return rate.minAmount <= total && rate.maxAmount >= total || rate.minAmount <= total && rate.maxAmount === 0;
    });
    if (!rate) {
      return;
    }
    const totalTax = round(total * rate.rate * 0.01 - rate.quickNumber);
    const currentTax = round(totalTax - tax);
    const paidTax = tax;
    tax = round(tax + currentTax);
    items.push({
      month: index + 1,
      monthIncomeWithTax: round(item.income),
      taxThreshold,
      deductionAmount: item.deductionAmount,
      extraDeductionAmount: extraDeductionAmount.value,
      totalTax,
      taxRate: rate.rate,
      quickDeductionAmount: rate.quickNumber,
      paidTax,
      monthTax: currentTax,
      monthTaxableIncome: round(amount),
      totalTaxableIncome: round(total),
    })
  });
  return items;
});

const totalTax = computed(() => {
  return taxProps.value.reduce((acc, cur) => {
    return acc + cur.monthTax;
  }, 0);
});

const calculate = () => {
  isDrawerVisible.value = true;
};

const deleteItem = (index: number) => {
  incomeList.value.splice(index, 1);
}
</script>

<style lang="css" scoped>
.el-row {
  margin-top: 30px;
}
</style>
