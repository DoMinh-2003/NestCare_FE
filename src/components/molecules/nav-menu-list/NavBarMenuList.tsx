import NavMenu from "../nav-menu/NavMenu";
import PopoverNavList from "../popover-nav-list/PopoverNavList";

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
    <div className="flex space-x-5 pl-10">
      {menuItems.map((item, index) => (
        <>
          {
            item.label === "Tin tức" || item.label === "Chuyên khoa" || item.label === "Dịch vụ" || item.label === "Hướng dẫn" || item.label === "Kiến thức"
              ?
              <PopoverNavList title={item.label} />
              :
              <NavMenu key={index} {...item} />
          }
        </>
      ))}
    </div>
  );
};

export default NavbarMenuList;
