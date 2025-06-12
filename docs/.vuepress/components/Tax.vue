<template>
  <el-row justify="center" align="middle">
    <el-col :span="5">
      <el-text size="large" type="primary">专项附加扣除</el-text>
    </el-col>
    <el-col :span="5">
      <el-input-number v-model="extraDeductionAmount" :min="0" :precision="2" size="large" :controls="false">
      </el-input-number>
    </el-col>
  </el-row>
  <el-row justify="center" align="middle">
    <el-col :span="5">
      <el-tooltip placement="left" content="新建行的内容将与最后一行相同">
        <el-button size="large" :disabled="!appendable" @click="appendIncome">添加一行</el-button>
      </el-tooltip>
    </el-col>
    <el-col :span="5">
      <el-button size="large" type="primary" @click="calculate">计算</el-button>
    </el-col>
  </el-row>
  <el-row justify="center" align="middle" v-for="(income, index) in incomeList" :key="index">
    <el-col :span="3">
      <el-tag type="primary">{{ index + 1 }}月</el-tag>
    </el-col>
    <el-col :span="3">
      <el-text size="large">税前收入：</el-text>
    </el-col>
    <el-col :span="5">
      <el-input-number v-model="income.income" :controls="false" :min="0" :precision="2" />
    </el-col>
    <el-col :span="5">
      <el-text size="large">五险一金等专项扣除：</el-text>
    </el-col>
    <el-col :span="5">
      <el-input-number v-model="income.deductionAmount" :controls="false" :min="0" :precision="2" />
    </el-col>
    <el-col :span="2">
      <el-button @click="deleteItem(index)" :disabled="!index" type="danger">删除</el-button>
    </el-col>
  </el-row>

  <el-drawer v-model="isDrawerVisible" :show-close="false">
    <template #header>
      <el-text type="success" size="large">计算结果</el-text>
    </template>
    <el-timeline>
      <el-timeline-item v-for="(item, index) in taxProps" :key="index" hide-timestamp>
        <TaxTimelineItem :value="item" />
      </el-timeline-item>

      <el-timeline-item>
        <h3>累计应缴纳税额</h3>
        {{  totalTax }}元
      </el-timeline-item>
    </el-timeline>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { TaxProps } from './types';
import { round } from './utils';
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
