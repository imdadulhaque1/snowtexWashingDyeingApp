export interface employeeInfoInterface {
  Id: number;
  EmployeeID: string;
  PunchCardNo: string;
  NationalId: string;
  Active: number;
  ActiveStatus: string;
  Doj: string;
  Dob: string;
  Doc: string;
  FullName: string;
  NickName?: null;
  Photo: string;
  PhoneNo: string;
  MobileNo: string;
  EmergencyMobileNo: string;
  FamiliyMobileNo: string;
  Email: string;
  Designation: string;
  Department: string;
  Section: string;
  SubSection: string;
  Company: string;
  Unit: string;
  Grade: string;
  StaffCategory: string;
  SkillCategory: string;
  JobLocation: string;
  PaymentType: string;
  Bank: string;
  BankAcNo: string;
  TinNo: string;
  AppMenuDataList?: AppMenuDataListEntity[] | null;
}
export interface AppMenuDataListEntity {
  Id: number;
  Name: string;
  UrlName: string;
  NickName?: null;
  Title: string;
  Icon?: null;
  SerialNo: number;
  ReferId: number;
  All: number;
  Read: number;
  Write: number;
  Delete: number;
  CountNo: number;
}
