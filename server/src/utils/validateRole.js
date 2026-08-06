import { Role } from "../generated/prisma/enums.ts"

export const validateRole = (requiredRole, role) => {   
    if (requiredRole === role)
    {
        return true;
    }    
    if (role === Role.ADMIN)
    {
        return true;
    }
    return false;
}