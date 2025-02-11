import Text from "../../atoms/text/Text";
import {
  DownOutlined
} from '@ant-design/icons';
interface NavMenuProps {
  label: string;
  hasDropdown?: boolean;
  className?: string;
}

const NavMenu = ({ label, hasDropdown, className }: NavMenuProps) => {
  return (
    <div className="hover:bg-pink-100 p-2 rounded-xl">
      <Text>{label} {hasDropdown && <DownOutlined/>}</Text>
    </div>
  )
};

export default NavMenu;
