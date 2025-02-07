import { createBrowserRouter } from "react-router-dom";
import { ROLE } from "../enum/role";
import { PATH } from "../consts";
import CustomerLayout from "../components/layouts/customer";
import HomePage from "../pages/home";
 // Import Layout

// Kiểm tra nếu pathname thuộc nhóm không cần header/footer
const isNotUseHeaderFooter = 
  location.pathname.includes(ROLE.ADMIN) ||
  location.pathname.includes(ROLE.STAFF) ||
  location.pathname.includes(ROLE.MANAGER) ||
  location.pathname.includes(PATH.LOGIN) ||
  location.pathname.includes(PATH.REGISTER);

export const router = createBrowserRouter([
  {
    path: "/",
    element: !isNotUseHeaderFooter ? (
      <CustomerLayout>
        <HomePage/>
      </CustomerLayout>
    ) : (
      <div className="text-3xl font-bold underline ">Hi DoMinh</div>
    ),
  },
  {
    path: "/test",
    element: !isNotUseHeaderFooter ? (
      <CustomerLayout>
        <div className="text-3xl font-bold underline ">Hi test</div>
      </CustomerLayout>
    ) : (
      <div className="text-3xl font-bold underline ">Hi test</div>
    ),
  },
]);
