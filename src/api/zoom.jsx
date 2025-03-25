import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const createMeeting = async (meetingData) => {
  try {
    const response = await axios.post(`${API_URL}/api/zoom/create/meeting`, meetingData);
    return response.data;
  } catch (error) {
    console.error("Error creating meeting:", error);
    return null;
  }
};

export const getUpcomingMeetings = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/api/zoom/upcoming/meeting`, { email });
    return response.data;
  } catch (error) {
    console.error("Error fetching meetings:", error);
    return [];
  }
};
