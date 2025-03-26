import axios from "axios";

export const fetchWaitingLobbyRequests = async (institutionId) => {
    const response = await axios.get(`/api/waiting-lobby/${institutionId}/teachers`);
    return response.data;
}

export const fetchMembers = async (institutionId) => {
    const response = await axios.get(`/api/members/${institutionId}/teachers`);
    return response.data;
}

export const updateTeacherRequestStatus = async (institutionId, requestId, action) => {
    const response = await axios.patch(`/api/waiting-lobby/${institutionId}/teachers/${requestId}/${action}`);
    return response.data;
}

export const modifyMemberStatus = async (institutionId, userId, action) => {
    const response = await axios.post(`/api/members/${institutionId}/teachers/${userId}/${action}`);
    return response.data;
}

//implement rest of utility fns here