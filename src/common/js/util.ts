import type { IDateFormat } from "./interface";

/**
 * 转换传入的时间为指定的格式
 * @param timestamp 时间戳(支持字符串和数字)
 * @param pattern 时间格式，如: yyyy-MM-dd hh:mm:ss
 * @returns
 */
export function formatTime(
  timestamp: number | string = 1585734546,
  pattern = "yyyy-MM-dd hh:mm:ss"
): string {
  let dateObj;
  if (typeof timestamp === "number") {
    dateObj = new Date(timestamp);
  } else if (typeof timestamp === "string") {
    if (!isNaN(Number(timestamp))) {
      dateObj = new Date(Number(timestamp));
    } else {
      const timeString = timestamp.replace(/-/g, "/");
      dateObj = new Date(Date.parse(timeString));
    }
  } else {
    return "请传入时间戳或者时间字符串";
  }
  return dateFormat(dateObj, pattern);
}

/**
 * 把时间对象转换成指定的格式
 * @param date 时间对象
 * @param pattern 时间格式，如: yyyy-MM-dd
 * @returns
 */
function dateFormat(date: Date, pattern: string) {
  if (date instanceof Date) {
    const o: IDateFormat = {
      "M+": date.getMonth() + 1, // 月份
      "d+": date.getDate(), // 日
      "h+": date.getHours(), // 小时
      "m+": date.getMinutes(), // 分
      "s+": date.getSeconds(), // 秒
      "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
      S: date.getMilliseconds(), // 毫秒
    };
    if (/(y+)/.test(pattern)) {
      pattern = pattern.replace(
        RegExp.$1,
        (date.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    }
    for (const k in o) {
      if (new RegExp("(" + k + ")").test(pattern)) {
        const replaceStr =
          RegExp.$1.length === 1
            ? String(o[k])
            : `00${o[k]}`.substr(String(o[k]).length);
        pattern = pattern.replace(RegExp.$1, replaceStr);
      }
    }
    return pattern;
  } else {
    return date;
  }
}
