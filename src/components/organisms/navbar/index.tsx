import { useState } from "react";
import MainLogo from "../../atoms/logo/MainLogo";
import NavbarMenuList from "../../molecules/nav-menu-list/NavBarMenuList";
import BookingNowButton from "../../atoms/button/BookingNowButton";
import { Button } from "../../atoms/button/Button";

const Navbar = () => {
    //   const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="mx-3">
            <div className="flex justify-between items-center font-bold">
                <div className="flex items-center">
                    <MainLogo />
                    <NavbarMenuList />
                </div>
                <Button
                    type="button"
                    status="pending"
                    styleClass="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                >
                    Đặt lịch ngay
                </Button>

            </div>
        </div>
    );
};

export default Navbar;
