import { ReactNode } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import AdminLayout from "../components/layouts/admin-layout";
import AuthLayout from "../components/layouts/auth-layout";
import CustomerLayout from "../components/layouts/customer-layout";
import NurseLayout from "../components/layouts/nurse-layout";
import PackageDetail from "../components/molecules/package-detail";
import { ADMIN_ROUTES, NURSE_ROUTES, USER_ROUTES } from "../constants/routes";
import ManageOverview from "../pages/admin/manage-overview";
import ManagePackage from "../pages/admin/manage-package";
import ManagerServices from "../pages/admin/manage-services";
import ManageUsers from "../pages/admin/manage-users";
import About from "../pages/customer/about";
import Contact from "../pages/customer/contact";
import AdmissionAndDischargeProcess from "../pages/customer/guides/admission_and_discharge_process";
import MedicalExaminationProcess from "../pages/customer/guides/medical-examination-process";
import MethodOfPayingHospitalFees from "../pages/customer/guides/method-of-paying-hospital-fees/inddx";
import PrivacyPolicy from "../pages/customer/guides/privacy-policy";
import RightsOfPaitents from "../pages/customer/guides/rights-of-paitents";
import HomePage from "../pages/customer/home";
import Knowledge from "../pages/customer/knowledge";
import News from "../pages/customer/news";
import NewsDetail from "../pages/customer/news-detail";
import PurchasedHistory from "../pages/customer/purchased-history";
import Recruitment from "../pages/customer/recruitment";
import ResultPayment from "../pages/customer/result-payment";
import PaymentCancel from "../pages/customer/result-payment/payment-cancel";
import PaymentFailure from "../pages/customer/result-payment/payment-failure";
import PaymentSuccess from "../pages/customer/result-payment/payment-success";
import FullBirthPackage from "../pages/customer/services-detail/full-birth-package";
import PregnancyCheckUpPackage from "../pages/customer/services-detail/pregnancy-checkup-package";
import ServicesPage from "../pages/customer/services-page";
import Specialty from "../pages/customer/specialty";
import TeamOfDoctor from "../pages/customer/team-of-doctors";
import LoginPage from "../pages/login";
import FetalDetail from "../pages/nurse/fetal-detail";
import NurseManageOrders from "../pages/nurse/manage-orders";
import NurseManageUsers from "../pages/nurse/manage-users";
import RegisterPage from "../pages/register";
import { useCurrentUser } from "../utils/getcurrentUser";
import BookingDoctor from "../pages/customer/booking-doctor";
import AppointmentHistory from "../pages/customer/appointment-history";
import AdminManageMedicines from "../pages/admin/manage-medicines";


interface ProtectedRouteByRoleProps {
  children: ReactNode;
  allowedRoles: Array<"ADMIN" | "USER">; // Các vai trò cho phép
}

interface ProtectedRouteAuthProps {
  children: ReactNode;
}

const ProtectedRouteAuth: React.FC<ProtectedRouteAuthProps> = ({
  children,
}) => {
  const user = useCurrentUser();

  if (!user) {
    toast.error("You need to login first!!");
    return <Navigate to="/" replace />;
  }

  return children;
};

const ProtectedRouteByRole: React.FC<ProtectedRouteByRoleProps> = ({
  children,
  allowedRoles,
}) => {
  const user = useCurrentUser();

  if (!user || !allowedRoles.includes(user.role)) {
    toast.error("You do not have permissions to access");
    return <Navigate to="/" replace />;
  }

  return children;
};

export const router = createBrowserRouter([
  {
    path: USER_ROUTES.HOME,
    element: (
      <CustomerLayout />
    ),
    children: [
      {
        path: USER_ROUTES.HOME_PAGE,
        element: <HomePage />,
      },
      {
        path: USER_ROUTES.DOCTORS,
        element: <TeamOfDoctor />,
      },
      {
        path: USER_ROUTES.CONTACT,
        element: <Contact />,
      },
      {
        path: USER_ROUTES.ABOUT_PAGE,
        element: <About />,
      },
      {
        path: USER_ROUTES.SERVICES_PAGE,
        element: <ServicesPage />,
      },
      {
        path: USER_ROUTES.PACKAGE_DETAIL,
        element: <PackageDetail />,
      },
      {
        path: USER_ROUTES.SPECIALTY,
        element: <Specialty />,
      },
      {
        path: USER_ROUTES.NEWS_PAGE,
        element: <News />,
      },
      {
        path: USER_ROUTES.RECRUITMENT_PAGE,
        element: <Recruitment />,
      },
      {
        path: USER_ROUTES.MEDICAL_EXAMINATION_PROCESS,
        element: <MedicalExaminationProcess />,
      },
      {
        path: USER_ROUTES.ADMISSION_AND_DISCHARGE_PROCESS,
        element: <AdmissionAndDischargeProcess />,
      },
      {
        path: USER_ROUTES.RIGHTS_OF_PATIENTS_PAGE,
        element: <RightsOfPaitents />,
      },
      {
        path: USER_ROUTES.KNOWLEDGE_PAGE,
        element: <Knowledge />,
      },
      {
        path: USER_ROUTES.PRIVACY_POLICY_PAGE,
        element: <PrivacyPolicy />,
      },
      {
        path: USER_ROUTES.METHOD_OF_PAYING_HOSPITAL_FEES,
        element: <MethodOfPayingHospitalFees />,
      },
      {
        path: USER_ROUTES.PREGNANCY_CHECK_UP_PACKAGE,
        element: <PregnancyCheckUpPackage />,
      },
      {
        path: USER_ROUTES.FULL_BIRTH_PACKAGE,
        element: <FullBirthPackage />,
      },
      {
        path: USER_ROUTES.NEWS_DETAIL_PAGE,
        element: <NewsDetail />,
      },
      {
        path: USER_ROUTES.PURCHASED_HISTORY,
        element: <PurchasedHistory />,
      },
      {
        path: USER_ROUTES.BOOKING_DOCTOR,
        element: <BookingDoctor />,
      },
      {
        path: USER_ROUTES.APPOINTMENT_HISTORY,
        element: <AppointmentHistory />,
      },
    ],
  },
  {
    path: USER_ROUTES.AUTH,
    element: <AuthLayout />,
    children: [
      {
        path: USER_ROUTES.REGISTER,
        element: <RegisterPage />,
      },
      {
        path: USER_ROUTES.LOGIN,
        element: <LoginPage />,
      },
    ],
  },
  {
    path: "/test",
    element: (
      <ProtectedRouteByRole allowedRoles={["ADMIN"]}>
        <div className="text-3xl font-bold underline ">Hi ADMIN</div>
      </ProtectedRouteByRole>
    ),
  },
  {
    path: ADMIN_ROUTES.ADMIN,
    element: (
      // <ProtectedRouteByRole allowedRoles={["ADMIN"]}>
      <AdminLayout />
      // </ProtectedRouteByRole>
    ),
    children: [
      {
        path: ADMIN_ROUTES.USER,
        element: <ManageUsers />,
      },
      {
        path: ADMIN_ROUTES.OVERVIEW,
        element: <ManageOverview />,
      },
      {
        path: ADMIN_ROUTES.SERVICES,
        element: <ManagerServices />,
      },
      {
        path: ADMIN_ROUTES.PACKAGES,
        element: <ManagePackage />,
      },
      {
        path: ADMIN_ROUTES.MEDICINES,
        element: <AdminManageMedicines />,
      },
    ],
  },
  {
    path: NURSE_ROUTES.NURSE,
    element: (
      // <ProtectedRouteByRole allowedRoles={["ADMIN"]}>
      <NurseLayout />
      // </ProtectedRouteByRole>
    ),
    children: [
      {
        path: NURSE_ROUTES.USER,
        element: <NurseManageUsers />,
      },
      {
        path: NURSE_ROUTES.ORDER,
        element: <NurseManageOrders />,
      },
      {
        path: NURSE_ROUTES.FETALS_DETAIL,
        element: <FetalDetail />,
      },
    ],
  },
  {
    path: USER_ROUTES.PAYMENT, //payment/result
    element: <ResultPayment />,
  },
  {
    path: USER_ROUTES.PAYMENT_SUCCESS, //payment/success
    element: <PaymentSuccess />,
  },
  {
    path: USER_ROUTES.PAYMENT_CANCEL, //payment/cancel
    element: <PaymentCancel />,
  },
  {
    path: USER_ROUTES.PAYMENT_FAILURE, //payment/failure
    element: <PaymentFailure />,
  },


  // {
  //   path: DOCTOR_ROUTES.DOCTOR,
  //   element: (
  //     // <ProtectedRouteByRole allowedRoles={["ADMIN"]}>
  //       <DashboardLayout />
  //     // </ProtectedRouteByRole>
  //   ),
  //   children: [
  //     {
  //       path: DOCTOR_ROUTES.USER,
  //       element: <ManageUser />,
  //     },
  //     // {
  //     //   path: ADMIN_ROUTES.OVERVIEW,
  //     //   element: <ManageOverview />,
  //     // },
  //   ],
  // },

]);
