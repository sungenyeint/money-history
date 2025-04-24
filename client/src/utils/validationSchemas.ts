
import * as Yup from "yup";

export const transactionValidationSchema = Yup.object().shape({
    category: Yup.string().required("အမျိုးအစား ရွေးရန် လိုအပ်သည်။"),
    amount: Yup.number()
      .required("ငွေပမာဏ ဖြည့်ရန် လိုအပ်သည်။")
      .positive("ငွေပမာဏသည် အပေါင်းဖြစ်ရမည်။"),
    date: Yup.date().required("ရက်စွဲ ဖြည့်ရန် လိုအပ်သည်။"),
    note: Yup.string().max(200, "မှတ်စုသည် စာလုံး ၂၀၀ ထက် မကျော်သင့်ပါ။"),
});
