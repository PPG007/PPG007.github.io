export interface TaxProps {
  month: number; // 月份
  monthIncomeWithTax: number; // 本月税前收入
  taxThreshold: number; // 起征点
  deductionAmount: number; //  专项扣除
  extraDeductionAmount: number; // 专项附加扣除
  totalTax: number; // 累计应纳税额
  monthTaxableIncome: number; // 本月应纳税收入
  totalTaxableIncome: number; // 累计应纳税收入
  taxRate: number; // 税率
  quickDeductionAmount: number; // 速算扣除数
  paidTax: number; // 已缴税额
  monthTax: number; // 当月应缴税额
}

export interface Image {
  blob: Blob;
  url: string;
}