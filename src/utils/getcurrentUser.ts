import { useSelector } from "react-redux";

export const useCurrentUser = () => {
  const user = useSelector((store: any) => store.user);
  return user;
};
