// i18n 入口
// 当前只有中文，未来加英文版时：
// 1. 新建 en.ts 实现 Dict 类型
// 2. 把 currentLocale 改为 server-side 读取（cookie / accept-language）
// 3. URL 加 [locale] 段或保持现状用 cookie 切换

import { zh, type Dict } from "./zh";

export const supportedLocales = ["zh-CN"] as const;
export type Locale = (typeof supportedLocales)[number];
export const defaultLocale: Locale = "zh-CN";

const dictionaries: Record<Locale, Dict> = {
  "zh-CN": zh,
};

// 当前实现：单语言，直接导出 zh
// 未来：getUI(locale) 根据 locale 返回对应字典
export function getUI(locale: Locale = defaultLocale): Dict {
  return dictionaries[locale];
}

// 默认导出，组件 import { ui } from "@/lib/i18n" 即可使用
export const ui = getUI(defaultLocale);

export type { Dict };
