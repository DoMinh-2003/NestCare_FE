import { ReactNode } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { useCurrentUser } from "../utils/getcurrentUser";
import { toast } from "react-toastify";
import AdminLayout from "../components/layouts/admin-layout";
import { ADMIN_ROUTES, DOCTOR_ROUTES, NURSE_ROUTES, USER_ROUTES } from "../constants/routes";
import ManageUser from "../pages/admin/manage-user";
import ManageOverview from "../pages/admin/manage-overview";
import CustomerLayout from "../components/layouts/customer-layout";
import HomePage from "../pages/customer/home";
import Contact from "../pages/customer/contact";
import TeamOfDoctor from "../pages/customer/team-of-doctors";
import About from "../pages/customer/about";
import ServicesPage from "../pages/customer/services-page";
import Specialty from "../pages/customer/specialty";
import News from "../pages/customer/news";
import Recruitment from "../pages/customer/recruitment";
import Knowledge from "../pages/customer/knowledge";
import MedicalExaminationProcess from "../pages/customer/guides/medical-examination-process";
import AdmissionAndDischargeProcess from "../pages/customer/guides/admission_and_discharge_process";
import RightsOfPaitents from "../pages/customer/guides/rights-of-paitents";
import PrivacyPolicy from "../pages/customer/guides/privacy-policy";
import MethodOfPayingHospitalFees from "../pages/customer/guides/method-of-paying-hospital-fees/inddx";
import RegisterPage from "../pages/register";
import LoginPage from "../pages/login";
import AuthLayout from "../components/layouts/auth-layout";
import PregnancyCheckUpPackage from "../pages/customer/services-detail/pregnancy-checkup-package";
import FullBirthPackage from "../pages/customer/services-detail/full-birth-package";
import NewsDetail from "../pages/customer/news-detail";
import ManagerServices from "../pages/admin/manage-services";
import ManagePackage from "../pages/admin/manage-package";
import ManageUsers from "../pages/admin/manage-users";
import NurseLayout from "../components/layouts/nurse-layout";
import NurseManageUsers from "../pages/nurse/manage-users";
import NurseManageOrders from "../pages/nurse/manage-orders";

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
    ],
  },
  {
    path: NURSE_ROUTES.NURSE,
    element: (
      // <ProtectedRouteByRole allowedRoles={["ADMIN"]}>
      <NurseLayout/>
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
    ],
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
