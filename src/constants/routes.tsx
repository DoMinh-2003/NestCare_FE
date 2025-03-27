// User Routes
export enum USER_ROUTES {
  HOME = "/",
  HOME_PAGE = "",
  LOGIN = "/auth/login",
  REGISTER = "/auth/register",
  CONTACT = "contact",
  DOCTORS = "doctors",
  ABOUT_PAGE = "about",
  SERVICES_PAGE = "/services",
  PACKAGE_DETAIL = "/services/:id",
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
  PURCHASED_HISTORY = "/purchased-history",
  BOOKING_DOCTOR = "/booking-doctor",
  APPOINTMENT_HISTORY = "/appointment-history",
  FETAL_CHART = "/fetal-chart",
  BLOG_PAGE = "/blog",
  BLOG_DETAIL = "/blog/:id",
  PROFILE = "/profile",
  MY_SERVICES = '/my-services'
}

export enum DOCTOR_ROUTES {
  DOCTOR = "doctor",
  USER = "user",
  FETALS_DETAIL = "appointments/fetals/:id",
  APPOINTMENT = "appointments",
  REQUEST_APPOINTMENT = "request/appointments",
}

export enum NURSE_ROUTES {
  NURSE = "nurse",
  USER = "users",
  ORDER = "orders",
  NURSE_APPOINTMENT = "appointments",
  NURSE_CREATE_APPOINTMENT = "create-appointment",
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
  MEDICINES = "medicines",
  FEATALS_RECORD = "fetals/:id",
  WEEK_CHECKUPS = "week-checkups",
  CATEGORIES = "category",
  BLOGS = "blog",
  SLOTS = "slot"
}