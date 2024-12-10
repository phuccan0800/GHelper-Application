import { axiosClient, axiosClientFileStorage } from "./ApiConfig";

const submitReview = async (review) => {
    try {
        const response = await axiosClient.post("/reviews", review);
        return response;
    } catch (error) {
        return { status: error.response.status, message: error.response.data.message };
    }
}

const ReviewApiCall = {

    submitReview
}
export default ReviewApiCall;