// User Routes
export enum USER_ROUTES {
  HOME = "/",
  HOME_PAGE = "",
  LOGIN = "login",
  REGISTER = "register",
  CONTACT = "contact",
  DOCTORS = "doctors",
  ABOUT_PAGE = "about",
  SERVICES_PAGE = "services",
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
  PREGNANCY_CHECK_UP_PACKAGE="/services/pregnancy-check-up-package",
  FULL_BIRTH_PACKAGE="/services/full-birth-package",
  AUTH = "auth",
}

export enum DOCTOR_ROUTES {
  DOCTOR = "doctor",
  USER = "user",
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