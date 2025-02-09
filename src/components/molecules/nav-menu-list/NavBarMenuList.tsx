import NavMenu from "../nav-menu/NavMenu";

const menuItems = [
  { label: "Giới thiệu", hasDropdown: false },
  { label: "Chuyên khoa", hasDropdown: true },
  { label: "Dịch vụ", hasDropdown: true },
  { label: "Bác sĩ", hasDropdown: false },
  { label: "Tin tức", hasDropdown: false },
  { label: "Hướng dẫn", hasDropdown: true },
  { label: "Kiến thức", hasDropdown: true },
  { label: "Tuyển dụng", hasDropdown: false },
  { label: "Liên hệ", hasDropdown: false },
];

const NavbarMenuList = () => {
  return (
    <div className="flex space-x-5">
      {menuItems.map((item, index) => (
        <NavMenu key={index} {...item} />
      ))}
    </div>
  );
};

export default NavbarMenuList;
