import { ReactNode } from "react";
import Navbar from "../../organisms/navbar";
import { Outlet } from "react-router-dom";

const CustomerLayout: React.FC = () => {
    return (
        <div>
            <Navbar />
            <Outlet />
        </div>
    );
};

export default CustomerLayout;
