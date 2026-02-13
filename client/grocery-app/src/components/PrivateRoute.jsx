import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({allowedRoles}) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
    console.log("the user role "+role)
  if(!token){
    return <Navigate to="/login" replace></Navigate>
  }

  if(allowedRoles && !allowedRoles.includes(role)){
    return <Navigate to="/login" replace></Navigate>
  }
  return <Outlet />
};

export default PrivateRoute;