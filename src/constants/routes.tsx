// User Routes
export enum USER_ROUTES {
  HOME = "/",
  HOME_PAGE = "",
  LOGIN = "/auth/login",
  REGISTER = "/auth/register",
  CONTACT = "contact",
  DOCTORS = "doctors",
  ABOUT_PAGE = "about",
  SERVICES_PAGE = "/goi-dich-vu",
  PACKAGE_DETAIL = "/goi-dich-vu/:id",
  SPECIALTY = "specialty",
  NEWS_PAGE = "news",
  NEWS_DETAIL_PAGE = "news/detail",
  RECRUITMENT_PAGE = "recruitment",
  MEDICAL_EXAMINATION_PROCESS = "medical-examination-process",
  ADMISSION_AND_DISCHARGE_PROCESS = "admission-and-discharge-process",
  KNOWLEDGE_PAGE = "/knowledge",
  RIGHTS_OF_PATIENTS_PAGE = "/rights-of-patients",
  PRIVACY_POLICY_PAGE = "/privacy-policy",
  METHOD_OF_PAYING_HOSPITAL_FEES = "/method-of-paying-hospital-fees",
  PREGNANCY_CHECK_UP_PACKAGE = "/services/pregnancy-check-up-package",
  FULL_BIRTH_PACKAGE = "/services/full-birth-package",
  AUTH = "auth",
  PAYMENT = "/payment/result",
  PAYMENT_SUCCESS = "/payment/result/success",
  PAYMENT_FAILURE = "/payment/result/failure",
  PAYMENT_CANCEL = "/payment/result/cancel",
  PURCHASED_HISTORY = "/purchased-history"
}

export enum DOCTOR_ROUTES {
  DOCTOR = "doctor",
  USER = "user",
}
export enum NURSE_ROUTES {
  NURSE = "nurse",
  USER = "users",
  ORDER = "orders",
  FETALS_DETAIL = "users/fetals/:id",
}
// Admin Routes
export enum ADMIN_ROUTES {
  ADMIN = "admin",
  USER = "user",
  CONFIG = "config",
  OVERVIEW = "overview",
  SERVICES = "services",
  PACKAGES = "packages",
}