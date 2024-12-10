import { axiosClient, axiosClientFileStorage } from "./ApiConfig";

const getBookingsIncompleted = async () => {
    try {
        const response = await axiosClient.get("/bookings");
        return response;
    } catch (error) {
        return { status: error.response.status, message: error.response.data.message };
    }
};

const getBookingDetail = async (id) => {
    try {
        const response = await axiosClient.get(`/bookings/${id}`);
        return response;
    } catch (error) {
        return { status: error.response.status, message: error.response.data.message };
    }
};
const BookingApiCall = {
    getBookingsIncompleted,
    getBookingDetail

}
export default BookingApiCall;