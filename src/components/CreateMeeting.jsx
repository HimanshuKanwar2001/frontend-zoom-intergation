import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
// import { createMeeting } from "../api/zoom";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const CreateMeeting = () => {
  const [formData, setFormData] = useState({
    topic: "",
    start_time: "",
    durationHour: "0",
    durationMinute: "30",
    recurrence: false,
    recurrenceType: "daily",
    repeatEvery: "1",
    endDate: "",
  });

  const [meetingDetails, setMeetingDetails] = useState(null); // Store meeting details
  const queryClient = useQueryClient();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const {
    mutate: createMeeting,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async () => {
      try {
        const response = await axios.post(
          `${API_URL}/api/zoom/create/meeting`,
          formData
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Something went wrong");
        return response.data;
      } catch (error) {
        console.error("Error creating meeting:", error);
        return null;
      }

      // console.log("formData", formData);
      // return createMeeting(formData);
    },
    onSuccess: (data) => {
      toast.success("Meeting Created Successfully!");
      queryClient.invalidateQueries({ queryKey: ["zoomMeetings"] });
      setMeetingDetails(data); // Store response data
    },
    onError: () => {
      toast.error("Failed to create meeting");
      throw Error("Failed to create meeting");
    },
  });

  const copyToClipboard = () => {
    if (meetingDetails) {
      const meetingText = `📌 *Zoom Meeting Details* 📌

🔹 *Topic:* ${meetingDetails.data.topic}
📅 *Start Time:* ${new Date(meetingDetails.data.start_time).toLocaleString()}
🆔 *Meeting ID:* ${meetingDetails.data.id}
🔑 *Host Key:* ${meetingDetails.hostKey}
🔑 *Passcode:* ${meetingDetails.data.password}
🔗 *Join Link:* ${meetingDetails.data.join_url}

Join on time! ⏳`;

      navigator.clipboard.writeText(meetingText).then(() => {
        alert("Meeting details copied to clipboard! 📋");
      });
    }
  };

  return (
    <div className="flex gap-6 p-6">
      {/* Left Side: Create Meeting Form */}
      <div className="w-2/3 bg-white shadow-md rounded-lg p-6 border">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Schedule Meeting
        </h2>

        <div className="space-y-4">
          {/* Topic Input */}
          <div>
            <label className="block text-gray-700 font-medium">Topic</label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              className="w-full p-2 border text-black rounded focus:ring focus:border-blue-400"
              placeholder="Enter meeting topic"
            />
          </div>

          {/* Start Time Input */}
          <div>
            <label className="block text-gray-700 font-medium">
              Start Time
            </label>
            <input
              type="datetime-local"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              className="w-full p-2 border text-black rounded focus:ring focus:border-blue-400"
            />
          </div>

          {/* Duration Inputs */}
          <div>
            <label className="block text-gray-700 font-medium">Duration</label>
            <div className="flex space-x-2 text-black">
              <select
                name="durationHour"
                value={formData.durationHour}
                onChange={handleChange}
                className="p-2 border rounded w-full focus:ring"
              >
                {[...Array(24).keys()].map((h) => (
                  <option key={h} value={h}>
                    {h} hr
                  </option>
                ))}
              </select>
              <select
                name="durationMinute"
                value={formData.durationMinute}
                onChange={handleChange}
                className="p-2 border rounded text-black w-full focus:ring"
              >
                {["00", "15", "30", "45"].map((m) => (
                  <option key={m} value={m}>
                    {m} min
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Recurring Meeting */}
          <div className="text-black">
            <label className="flex items-center text-black space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="recurrence"
                checked={formData.recurrence}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-gray-700 font-medium">
                Recurring Meeting
              </span>
            </label>

            {formData.recurrence && (
              <div className="mt-2 p-4 border text-black rounded bg-gray-50">
                <label className="block text-gray-700 font-medium">
                  Recurrence
                </label>
                <select
                  name="recurrenceType"
                  value={formData.recurrenceType}
                  onChange={handleChange}
                  className="p-2 border rounded w-full focus:ring"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>

                <label className="block text-gray-700 font-medium mt-2">
                  Repeat every
                </label>
                <input
                  type="number"
                  name="repeatEvery"
                  value={formData.repeatEvery}
                  onChange={handleChange}
                  className="w-[90%] p-2 border rounded focus:ring"
                />
                <span> day(s)</span>

                <div className="mt-2">
                  <label className="block text-gray-700 font-medium">
                    End Date
                  </label>

                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:ring"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={() => createMeeting()}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            {isPending ? "Creating..." : "Create Meeting"}
          </button>
        </div>
      </div>

      {/* Right Side: Meeting Details */}
      <div className="w-1/3 bg-white relative shadow-md rounded-lg p-6 border">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Meeting Details
        </h2>
        {console.log(meetingDetails)}
        {meetingDetails ? (
          <button
            onClick={copyToClipboard}
            className="absolute top-3 right-3 px-3 py-1 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-700"
          >
            📋 Copy Details
          </button>
        ) : (
          ""
        )}

        {meetingDetails ? (
          <div className="space-y-2 text-black">
            <p className="text-black">
              {console.log(meetingDetails)}
              <strong className="text-black">Topic:</strong>{" "}
              {meetingDetails.data.topic}
            </p>
            <p>
              <strong>Start Time :</strong>{" "}
              {new Date(meetingDetails.data.start_time).toLocaleString()}
            </p>
            <p>
              <strong>Duration :</strong> {meetingDetails.data.duration} min
            </p>
            <p>
              <strong>Meeting ID :</strong> {meetingDetails.data.id}
            </p>
            <p>
              {" "}
              <strong>Email ID : </strong>
              {meetingDetails.data.host_email}
            </p>
            <p>
              {" "}
              <strong>HostKey : </strong>
              {meetingDetails.hostKey}
            </p>
            <p>
              {" "}
              <strong>UserName : </strong>
              {meetingDetails.name}
            </p>
            <p>
              <strong>Join URL:</strong>{" "}
              <a
                href={meetingDetails.data.join_url}
                className="text-blue-500 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {meetingDetails.data.join_url}
              </a>
            </p>
            {meetingDetails.data.recurrence && (
              <p>
                <strong>Recurrence:</strong>{" "}
                {meetingDetails.data.recurrence.type}
              </p>
            )}
          </div>
        ) : (
          <p className="text-gray-500">No meeting created yet.</p>
        )}
      </div>
    </div>
  );
};

export default CreateMeeting;
