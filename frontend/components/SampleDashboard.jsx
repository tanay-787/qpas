import { useAuth } from "../context/AuthContext";
import { useInstitution } from "../context/InstitutionContext"

export default function SampleDashboard(){
    const { user } = useAuth();
    const { institution } = useInstitution();
    return(
        <div>
            <h1>Sample Dashboard</h1>
            <p>Welcome to the Sample Dashboard for {institution?.name ? institution?.name : 'Inst'} created by {user?.displayName ? user?.displayName : 'F'}</p>
        </div>
    )
}