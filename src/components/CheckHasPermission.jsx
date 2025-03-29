import { useAuth } from "../context/AuthContext";
import ROLES from "../constants/Roles";

const checkPermission = (permission) => {

    const { user } = useAuth();

    if (!user || !user.permissions) return null;

    return user?.role === ROLES.SUPER_ADMIN || user?.permissions?.includes(permission);
};
export default checkPermission;

