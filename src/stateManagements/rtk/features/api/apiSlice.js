import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

const payrollApi = createApi({
  reducerPath: 'payrollApi',
  // baseQuery: fetchBaseQuery({baseUrl: AppURL.profileBaseURL}),
  baseQuery: fetchBaseQuery({
    baseUrl: '', // Initially empty, will be passed dynamically
  }),
  endpoints: builder => ({
    getAttendanceInfo: builder.query({
      query: ({baseURL, token, fromDate, toDate}) => {
        return `${baseURL}androidapps/GetAttendanceInformationApk?token=${token}&otherPerson=false&fromDate=${fromDate}&toDate=${toDate}`;
      },
    }),

    getPunchData: builder.query({
      query: ({baseURL, token, empId, fromDate, toDate}) => {
        return `${baseURL}androidapps/GetPunchInformationsApk?token=${token}&id=${empId}&fromDate=${fromDate}&toDate=${toDate}`;
      },
    }),

    getLeaveHistoryData: builder.query({
      query: ({baseURL, token}) => {
        return `${baseURL}androidapps/getleaveinformationsApk?token=${token}`;
      },
    }),
    getLeaveBalanceData: builder.query({
      query: ({baseURL, token}) => {
        return `${baseURL}androidapps/GetLeaveBalancesApk?token=${token}`;
      },
    }),

    getLeaveCategories: builder.query({
      query: ({baseURL, token}) => {
        return `${baseURL}androidapps/GetLeaveTypesApk?token=${token}`;
      },
    }),
    getEmpBasicInfo: builder.query({
      query: ({baseURL, token}) => {
        return `${baseURL}androidapps/GetBasicInformationApk?token=${token}`;
      },
    }),

    getGeneralApprovalData: builder.query({
      query: ({baseURL, token, fromDate, toDate}) => {
        return `${baseURL}androidapps/GetGeneralLeaveApprovalsApk?token=${token}&fromDate=${fromDate}&toDate=${toDate}`;
      },
    }),

    // Used to get Data for medical and Online HR Approval
    getMedicalApprovalData: builder.query({
      query: ({baseURL, token, leaveUserType}) => {
        return `${baseURL}androidapps/GetMedicalHROfOnLineLeaveApprovalsApk?token=${token}&typeId=${leaveUserType}`;
      },
    }),
    getPunchApprovalAllData: builder.query({
      query: ({baseURL, token, fromDate, toDate}) => {
        return `${baseURL}androidapps/GetPunchApprovalApk?token=${token}&fromDate=${fromDate}&toDate=${toDate}`;
      },
    }),

    passwordChange: builder.mutation({
      query: ({password, userId, token}) => {
        return {
          url: `/UserInfos/ChangePassword/${password}/${userId}`,
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      transformResponse: res => {
        return res?.res;
      },
    }),

    emailChange: builder.mutation({
      query: ({email, userId, token}) => {
        return {
          url: `/UserInfos/ChangeEmail/${email}/${userId}`,
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      transformResponse: res => {
        return res?.res;
      },
    }),
  }),
});

export const {
  useGetAttendanceInfoQuery,
  useGetPunchDataQuery,
  useGetLeaveHistoryDataQuery,
  useGetLeaveBalanceDataQuery,
  useGetLeaveCategoriesQuery,
  useGetEmpBasicInfoQuery,
  useGetGeneralApprovalDataQuery,
  useGetMedicalApprovalDataQuery,
  useGetPunchApprovalAllDataQuery,
} = payrollApi;
export default payrollApi;
