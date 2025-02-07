import { ReactNode } from "react";
import Navbar from "../../nav";
import Footer from "../../footer";

interface CustomerLayoutProps {
  children: ReactNode;
}

const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
  return (
    <div>
      <Navbar/>
      <main className="p-4">{children}</main>
      <Footer/>
    </div>
  );
};

export default CustomerLayout;
