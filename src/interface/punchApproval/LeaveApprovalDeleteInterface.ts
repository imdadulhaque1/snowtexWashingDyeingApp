export interface LeaveApprovalDeleteInterface {
  Id: number;
  EmpId: number;
  WorkDate: string;
  Time: string;
  EmployeeID: string;
  PunchCardNo: string;
  EmployeeName: string;
  Remarks?: null;
  Lat: number;
  Lon: number;
  PunchType: number;
  PunchStatus: string;
  ActionStatus: string;
  Approved: number;
  TextMode: number;
  Token: string;
}
