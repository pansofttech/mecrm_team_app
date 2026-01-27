export enum AppSettingsConfigKey {
  FileName = 'appsettings.json',
  Path = 'assets',
}

export enum AppRoutePaths {
  Default = '',
  Login = 'login',
  Empty = 'empty',
  Dashboard = 'dashboard',
  Notification = 'notification',
  EnquiryUpdate = 'enquiry-update',
  ResetPassword = 'reset-password',
  Email = 'email',
  ForgotPassword = 'forgot-password',
  EnquiryDetails = 'enquiry-details',
  EnquiryDetailsListView = 'enquiry-listview',
  LoginDialog = 'login-dialog',
  EnquiryDetailsHistory = 'enquiry-details-history',
  EnquiryDetailsUpdate = 'enquiry-details-update',
  ServiceCalendar = 'service-calendar',
  SRLC = 'srlc',
  ServiceCSRGenerator = 'csr-generator',
  WorksheetDetails = 'worksheet-details',
  WorksheetApproval = 'worksheet-approval',
  SalesPartsManagementList = 'sales-parts-management',
  SalesPartsManagementSupplierList = 'sales-parts-management-supplist',
  SalesPartsManagementApproval = 'sales-parts-management-approval',
  PartsRequestWorkList = 'parts-requisition-worklist',
  PartsRequestApproval = 'parts-request-approval',
}

export enum EcrmUserAdminRoutePath {
  Default = '',
  User = 'users/:id',
  Users = 'users',
  AddUser = 'new-user',
}
