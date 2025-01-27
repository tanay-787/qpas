import { useInstitution } from "../context/InstitutionContext";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";


export default function AdminDashboard() {
    const { user } = useAuth()
    const { institution } = useInstitution()
    const { data: WLRequests, isLoading, isSuccess, error } = useQuery({
        queryKey: ['waiting-lobby-requests'],
        queryFn: () => fetchWaitingLobbyRequests(user.uid),
        enabled: !!user
    })
    return (
        <div className="h-min-screen">
            <h1>Admin Dashboard</h1>
            <p>Welcome, {user.displayName}</p>
            <p>Institution: {institution.name}</p>
            <Button>Manage Waiting Lobby</Button>
        </div>
    )
}