import PageMeta from "../../../components/molecules/common/PageMeta";
import DemographicCard from "../../../components/organisms/ecommerce/DemographicCard";
import EcommerceMetrics from "../../../components/organisms/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../../components/organisms/ecommerce/MonthlySalesChart";
import MonthlyTarget from "../../../components/organisms/ecommerce/MonthlyTarget";
import RecentOrders from "../../../components/organisms/ecommerce/RecentOrders";
import StatisticsChart from "../../../components/organisms/ecommerce/StatisticsChart";
import userUserService from "../../../services/userUserService";
import useOrderService from "../../../services/useOrderService";

import { useEffect, useState } from "react";
import { UserData } from "../../../components/organisms/modal-create-update-user/ModalCreateUpdateUser";
import { or } from "firebase/firestore";
// Order.ts
export interface Package {
  id: string; // Unique identifier for the package
  name: string; // Name of the package
  price: string; // Price of the package
  description: string; // Description of the package
  period: string; // Period of the package (e.g., WEEKLY)
  delivery_included: number; // Delivery included count
  alerts_included: number; // Alerts included count
  isDeleted: boolean; // Indicates if the package is deleted
  createdAt: string; // Creation date in ISO format
  updatedAt: string; // Last updated date in ISO format
}

export interface User {
  id: string; // Unique identifier for the user
  username: string; // Username of the user
  password: string; // Password of the user (hashed)
  email: string; // Email of the user
  fullName: string; // Full name of the user
  image: string | null; // User's image URL or null
  phone: string; // Phone number of the user
  role: string; // Role of the user (e.g., user, admin)
  isDeleted: boolean; // Indicates if the user is deleted
}

export interface Order {
  id: string; // Unique identifier for the order
  status: string; // Status of the order (e.g., PAID)
  isActive: boolean; // Indicates if the order is active
  isDeleted: boolean; // Indicates if the order is deleted
  createdAt: string; // Creation date in ISO format
  updatedAt: string; // Last updated date in ISO format
  package: Package; // Package associated with the order
  user: User; // User associated with the order
}
export default function Overview() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [ordersByStatus, setOrdersByStatus] = useState<Order[]>([]);
  const { getUsersSearch } = userUserService();
  const { getOrderStatus } = useOrderService()
  const {getOrders} = useOrderService();
  const [orders, setOrders] = useState<Order[]>([])
  useEffect(() => {
    getUsersFromAdmin();
    getOrderStatusByAdmin()
  }, []);

  const getUsersFromAdmin = async () => {
    const response = await getUsersSearch("", "");
    console.log("response: ", response);
    if (response) {
      setUsers(response.users.filter((item: UserData) => item.role != "admin" && !item.isDeleted));
    }
  };
  const getOrderStatusByAdmin = async () => {
    const response = await getOrderStatus('PAID')
    if (response) {
      setOrdersByStatus(response)
    }
  }

  useEffect(()=>{
    getOrdersFromAdmin()
  }, [])

  const getOrdersFromAdmin = async()=>{
    const response = await getOrders('')
    if(response){
      setOrders(response.items)
    }
  }
  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics users={users} orders={ordersByStatus}/>

          <MonthlySalesChart orders={ordersByStatus}/>
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>

        <div className="col-span-12">
          <StatisticsChart orders={orders}/>
        </div>
{/* 
        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div> */}

        <div className="col-span-12 ">
          <RecentOrders/>
        </div>
      </div>
    </>
  );
}
