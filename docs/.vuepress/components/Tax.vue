<template>

</template>

<script setup lang="ts">
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

const taxFreeAmount = 5000;

interface Income {
  income: number;
  deductionAmount: number;
}

</script>
