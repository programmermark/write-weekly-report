export interface IReportState {
  userId: string;
  username: string;
  currentReport: string /** 当前日报｜周报｜月报 */;
  reportList: IReport[];
}

export interface IReport {
  date: number /** 新增/更新日报的时间戳 */;
  content: string;
}
