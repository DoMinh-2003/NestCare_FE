import { ReactNode } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { useCurrentUser } from "../utils/getcurrentUser";
import { toast } from "react-toastify";
import AdminLayout from "../components/layouts/admin-layout";
import { ADMIN_ROUTES, DOCTOR_ROUTES, USER_ROUTES } from "../constants/routes";
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
     <CustomerLayout/>
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
        element: <ManageUser />,
      },
      {
        path: ADMIN_ROUTES.OVERVIEW,
        element: <ManageOverview />,
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
