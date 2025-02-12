import NavMenu from "../nav-menu/NavMenu";
import PopoverNavList from "../popover-nav-list/PopoverNavList";

const menuItems = [
  { label: "Giới thiệu", hasDropdown: false, link: "/about" },
  { label: "Chuyên khoa", hasDropdown: true, link: "/specialty" },
  { label: "Dịch vụ", hasDropdown: true, link: "/services" },
  { label: "Bác sĩ", hasDropdown: false, link: "/doctors" },
  { label: "Tin tức", hasDropdown: false, link: "/tin-tuc" },
  { label: "Hướng dẫn", hasDropdown: true, link: "/huong-dan" },
  { label: "Kiến thức", hasDropdown: true, link: "/kien-thuc" },
  { label: "Tuyển dụng", hasDropdown: false, link: "/tuyen-dung" },
  { label: "Liên hệ", hasDropdown: false, link: "/contact" },
];


const NavbarMenuList = () => {
  return (
    <div className="flex space-x-5 pl-10">
      {menuItems.map((item, index) => (
        <>
          {
            item.label === "Tin tức" || item.label === "Chuyên khoa" || item.label === "Dịch vụ" || item.label === "Hướng dẫn" || item.label === "Kiến thức"
              ?
              <PopoverNavList title={item.label} link={item.link}/>
              :
              <NavMenu key={index} {...item} />
          }
        </>
      ))}
    </div>
  );
};

export default NavbarMenuList;
