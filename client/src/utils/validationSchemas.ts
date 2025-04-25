
import * as Yup from "yup";

export const transactionValidationSchema = Yup.object().shape({
    category: Yup.string().required("အမျိုးအစား ရွေးရန် လိုအပ်သည်။"),
    amount: Yup.number()
        .required("ငွေပမာဏ ဖြည့်ရန် လိုအပ်သည်။")
        .positive("ငွေပမာဏသည် အပေါင်းဖြစ်ရမည်။"),
    date: Yup.date().required("ရက်စွဲ ဖြည့်ရန် လိုအပ်သည်။"),
    note: Yup.string().max(200, "မှတ်စုသည် စာလုံး ၂၀၀ ထက် မကျော်သင့်ပါ။"),
});

export const signUpValidationSchema = Yup.object().shape({
    email: Yup.string()
        .email("အီးမေးလ်လိပ်စာသည် မှန်ကန်ရမည်။")
        .required("အီးမေးလ် ဖြည့်ရန် လိုအပ်သည်။"),

    password: Yup.string()
        .min(6, "စကားဝှက်သည် အနည်းဆုံး စာလုံး ၆ လုံးရှိရမည်။")
        .required("စကားဝှက် ဖြည့်ရန် လိုအပ်သည်။"),

    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), undefined], "စကားဝှက်နှစ်ခု မတူညီပါ။")
        .required("စကားဝှက် အတည်ပြုရန် လိုအပ်သည်။"),
});

export const loginValidationScheme = Yup.object().shape({
    email: Yup.string()
        .email("အီးမေးလ်လိပ်စာသည် မှန်ကန်ရမည်။")
        .required("အီးမေးလ် ဖြည့်ရန် လိုအပ်သည်။"),

    password: Yup.string()
        .min(6, "စကားဝှက်သည် အနည်းဆုံး စာလုံး ၆ လုံးရှိရမည်။")
        .required("စကားဝှက် ဖြည့်ရန် လိုအပ်သည်။"),
});
