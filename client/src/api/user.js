import API from './auth';

export const getSessions = () => API.get("/user/sessions");
export const getRooms = () => API.get("/user/rooms");