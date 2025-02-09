import { useState } from "react";
import MainLogo from "../../atoms/logo/MainLogo";
import NavbarMenuList from "../../molecules/nav-menu-list/NavBarMenuList";
import BookingNowButton from "../../atoms/button/BookingNowButton";

const Navbar = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="mx-3">
      <div className="flex justify-between items-center font-bold">
        <div className="flex items-center">
          <MainLogo/>
          <NavbarMenuList />
        </div>
        <BookingNowButton />
      </div>
    </div>
  );
};

export default Navbar;
