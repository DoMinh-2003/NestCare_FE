import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";
export interface BreadcrumbsProps{
    title: string;
    link?: string;
} 
export interface CustomBreadcrumbsProps{
  items: BreadcrumbsProps[]
}
const CustomBreadcrumbs = ({items}: CustomBreadcrumbsProps) => {
  return (
    <Breadcrumb>
      {items.map((item, index) => (
        <Breadcrumb.Item key={index}>
          {item.link ? <Link to={item.link}>{item.title}</Link> : item.title}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

export default CustomBreadcrumbs;
