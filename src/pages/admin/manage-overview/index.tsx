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
import useTransaction from "../../../services/useTransaction";
import { Typography } from "antd";



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

export interface Transaction {
  id: string;
  type: string;
  status: string;
  amount: string;
  description: string;
  paymentGatewayReference: string | null;
  createdAt: string;
  user: User;
  appointment: any | null;
  userPackage: any | null;
  serviceBilling: any | null;
}
const { Title, Text } = Typography;

export default function Overview() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [ordersByStatus, setOrdersByStatus] = useState<Order[]>([]);
  const { getUsersSearch } = userUserService();
  const { getOrderStatus } = useOrderService()
  const { getOrders } = useOrderService();
  const [orders, setOrders] = useState<Order[]>([])

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const { getTransactions } = useTransaction();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, ordersResponse, transactionsResponse] = await Promise.all([
          getUsersSearch("", ""),
          getOrderStatus("PAID"),
          getTransactions(),
        ]);

        // Lọc người dùng không phải admin và chưa bị xóa
        const filteredUsers = usersResponse.users.filter(
          (item) => item.role !== "admin" && !item.isDeleted
        );
        setUsers(filteredUsers);

        // Cập nhật ordersByStatus
        setOrdersByStatus(ordersResponse);

        // Cập nhật transactions và tính tổng doanh thu
        setTransactions(transactionsResponse);
        const revenue = transactionsResponse.reduce(
          (sum, transaction) => sum + parseFloat(transaction.amount),
          0
        );
        setTotalRevenue(revenue);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const getOrdersFromAdmin = async () => {
      const response = await getOrders("");
      if (response) {
        setOrders(response.items);
      }
    };
    getOrdersFromAdmin();
  }, []);
  return (
    <>
      <Title level={3}>📊 Thống kê hệ thống</Title>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* EcommerceMetrics trên 1 hàng riêng */}
        <div className="col-span-12">
          <EcommerceMetrics users={users} orders={ordersByStatus} transactions={transactions} totalRevenue={totalRevenue} />
        </div>

        {/* MonthlySalesChart trên 1 hàng riêng */}
        <div className="col-span-12">
          <MonthlySalesChart transactions={transactions} />
        </div>

        {/* StatisticsChart */}
        <div className="col-span-12">
          <StatisticsChart orders={orders} />
        </div>

        {/* RecentOrders */}
        <div className="col-span-12">
          <RecentOrders transactions={transactions} />
        </div>
      </div>


    </>
  );
}
