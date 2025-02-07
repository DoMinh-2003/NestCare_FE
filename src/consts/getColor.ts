export const getRoleColor = (role: string) => {
    switch (role) {
      case "customer":
        return "text-blue-800";
      case "manager":
        return "text-green-700";
      case "staff":
        return "text-orange-500";
      case "admin":
        return "text-violet-500";
      default:
        return "";
    }
  };