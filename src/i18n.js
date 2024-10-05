import Vue from "vue";
import VueI18n from "vue-i18n";

import ja from "./locales/ja.json";
import zhTW from "./locales/zhTW.json";
import en from "./locales/en.json";
import ko from "./locales/ko.json";

import skillZhTW from "./locales/skill-zhTW.json";
import skillKo from "./locales/skill-ko.json";
import skillEn from "./locales/skill-en.json";

import tooltipKo from "./locales/tooltip-ko.json";

Object.assign(zhTW, { skill: skillZhTW });
Object.assign(ko, { skill: skillKo, tooltip: tooltipKo });
Object.assign(en, { skill: skillEn });

Vue.use(VueI18n);

const lang_array = ["ja", "zhTW", "ko", "en"];
const messages = {
  ja,
  zhTW,
  ko,
  en,
};

let lang;
let locale_lang;
let locale;

if (localStorage.getItem("lang") !== null) {
  locale = localStorage.getItem("lang");
} else {
  // get locale language
  locale_lang = window.navigator.userLanguage || window.navigator.language;
  lang = locale_lang.replace("-", "");

  // if locale language is not in setting, use korean as default
  if (lang_array.includes(lang)) {
    locale = lang;
  } else {
    locale = "ko";
  }
}

const i18n = new VueI18n({
  locale,
  messages,
});

export default i18n;
