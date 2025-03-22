import { atom, selector } from "recoil";
import axios from "axios";

// Store User Data
export const userState = atom({
  key: "userState",
  default: null,
});

// Fetch Meetings with Loading & Error Handling
export const upcomingMeetingsState = selector({
  key: "upcomingMeetings",
  get: async ({ get }) => {
    const user = get(userState);
    if (!user) return [];

    try {
      const response = await axios.post("http://localhost:5000/api/zoom/upcoming/meeting", {
        email: user.email,
      });
      return response.data;
    } catch (error) {
      console.log("error in upcomingMeetings State:", error);
      throw error;
    }
  },
});
