import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <div className="text-3xl font-bold underline ">Hi DoMinh</div>,
  },
  {
    path: "/test",
    element: <div className="text-3xl font-bold underline ">Hi test</div>,
  },
]);
