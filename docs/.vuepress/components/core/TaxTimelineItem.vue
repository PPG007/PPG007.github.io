<template>
  <h3>第{{ value.month }}个月</h3>
  <p>
    <strong>本月应纳税所得额：</strong>
    税前总收入 - 起征点 - 专项扣除 - 专项附加扣除
    = {{ value.monthIncomeWithTax }} - {{ value.taxThreshold }} - {{ value.deductionAmount }} - {{
      value.extraDeductionAmount }} = {{ value.monthTaxableIncome }}元
  </p>
  <p>
    <strong>累计应纳税所得额：</strong>{{ value.totalTaxableIncome }}元
  </p>
  <p>
    <strong>适用税率：</strong>{{ value.taxRate }}%
  </p>
  <p>
    <strong>速算扣除数：</strong>{{ value.quickDeductionAmount }}
  </p>
  <p>
    <strong>应缴税额：</strong>
    {{ value.totalTaxableIncome }} * {{ value.taxRate }}% - {{ value.quickDeductionAmount }} = {{ value.totalTax }}元
  </p>
  <p>
    <strong>已缴税额：</strong>{{ value.paidTax }}元
  </p>
  <p>
    <strong>当月应缴税额：</strong>{{ value.totalTax }} - {{ value.paidTax }} = {{ value.monthTax }}元
  </p>
</template>

<script setup lang="ts">
import { TaxProps } from '../types';
const props = defineProps<{
  value: TaxProps;
}>();
</script>
