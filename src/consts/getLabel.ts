export const getRoleLabel = (role: string) => {
    switch (role) {
      case "customer":
        return "Customer";
      case "manager":
        return "Manager";
      case "staff":
        return "Staff";
      case "admin":
        return "Admin";
      case "all":
        return "All";
      default:
        return "";
    }
  };