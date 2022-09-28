import { formatTime } from "@/common/js/util";
import md5 from "js-md5";
import { defineStore } from "pinia";
import type { IReportState } from "./interface/report";

export const useReportStore = defineStore("report", {
  state: (): IReportState => ({
    userId: "",
    username: "",
    currentReport: "",
    reportList: [],
  }),
  getters: {},
  actions: {
    /**
     * 生成userId，根据当前用户的ip+当前时间+随机数
     */
    generateUserId() {
      const ip = ((window as any).returnCitySN as any).cip;
      const now = Date.now();
      const randomNum = Math.random();
      const hash = md5.create();
      hash.update(`${ip}${now}${randomNum}`);
      return hash.hex();
    },
    /**
     * 获取当天的日报，如果有
     */
    getTodayReport() {
      if (!this.userId) {
        return "";
      }
      const nowDate = formatTime(Date.now(), "yyyy-MM-dd");
      const reportDateList = this.reportList
        .map((report) => report.date)
        .sort((a, b) => {
          if (a < b) {
            return 1;
          }
          if (a > b) {
            return -1;
          }
          return 0;
        });
      const latestDate = formatTime(reportDateList[0], "yyyy-MM-dd");
      /** 存在同一天的日报时，更新当天日报 */
      if (nowDate === latestDate) {
        const latestDateReport = this.reportList.find(
          (report) => report.date === reportDateList[0]
        );
        return latestDateReport ? latestDateReport.content : "";
      }
      return "";
    },
    /**
     * 获取周报
     */
    getWeeklyReport() {
      const weekSeveral = new Date().getDay();
      const monday =
        formatTime(
          Date.now() - (weekSeveral - 1) * 3600 * 24 * 1000,
          "yyyy-MM-dd"
        ) + " 00:00:00";
      const reportContent = this.reportList
        .filter(
          (report) =>
            report.date >= Date.parse(monday) && report.date < Date.now()
        )
        .sort((a, b) => {
          if (a.date < b.date) {
            return -1;
          }
          if (a.date > b.date) {
            return 1;
          }
          return 0;
        })
        .map((report) => report.content)
        .reduce((prev, cur) => `${prev}\n${cur}`);
      return reportContent;
    },
    /**
     * 更新日报
     * @param report 日报
     */
    updateReportList(reportContent: string) {
      /** 不存在userId则生辰新的userId */
      if (!this.userId) {
        this.userId = this.generateUserId();
        this.reportList = [{ date: Date.now(), content: reportContent }];
      } else {
        if (this.reportList.length === 0) {
          this.reportList = [{ date: Date.now(), content: reportContent }];
        } else {
          const nowDate = formatTime(Date.now(), "yyyy-MM-dd");
          const reportDateList = this.reportList
            .map((report) => report.date)
            .sort((a, b) => {
              if (a < b) {
                return 1;
              }
              if (a > b) {
                return -1;
              }
              return 0;
            });
          const latestDate = formatTime(reportDateList[0], "yyyy-MM-dd");
          /** 存在同一天的日报时，更新当天日报 */
          if (nowDate === latestDate) {
            this.reportList = this.reportList.map((item) => {
              if (item.date === reportDateList[0]) {
                return {
                  ...item,
                  content: reportContent,
                };
              }
              return item;
            });
          } else {
            this.reportList = [
              ...this.reportList,
              { date: Date.now(), content: reportContent },
            ];
          }
        }
      }
    },
  },
  persist: true,
});
