import API from './auth';

export const getActiveRooms = () => API.get("/room/active");