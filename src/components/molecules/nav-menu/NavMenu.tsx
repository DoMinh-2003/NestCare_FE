import Text from "../../atoms/text/Text";

interface NavMenuProps {
  label: string;
  hasDropdown?: boolean;
}

const NavMenu: React.FC<NavMenuProps> = ({ label, hasDropdown }) => {
  return <Text>{label} {hasDropdown && "▼"}</Text>;
};

export default NavMenu;
