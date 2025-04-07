import React, { useState } from "react";
import ZoomRecurrenceForm from "./NewForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const ZoomForm = () => {
  const [formData, setFormData] = useState({
    topic: "",
    start_time: "",
    durationHour: "0",
    durationMinute: "30",
    recurrence: false,
    recurrenceType: "daily",
    repeatEvery: "1",
    end_date_time: "",
    end_times: "",
    monthly_day: "",
    monthly_week: "",
    monthly_week_day: "",
    repeat_interval: "",
    type: 1,
    weekly_days: "",
    endDate: "",
  });

  const [isRecurring, setIsRecurring] = useState(true);
  const [meetingDetails, setMeetingDetails] = useState(null);
  const [errors, setErrors] = useState({});
  const queryClient = useQueryClient();

  const validateForm = () => {
    let newErrors = {};
    if (!formData.topic.trim()) newErrors.topic = true;
    if (!formData.start_time) newErrors.start_time = true;
    if (formData.durationHour === "0" && formData.durationMinute === "00")
      newErrors.duration = true;

    if (Object.keys(newErrors).length) {
      if (newErrors.topic) toast.error("❗ Please enter a meeting subject.");
      else if (newErrors.start_time)
        toast.error("❗ Please select a start date & time.");
      else if (newErrors.duration)
        toast.error("❗ Duration must be at least 1 minute.");
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const { mutate: createMeeting, isPending } = useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        `${API_URL}/api/zoom/create/meeting`,
        formData
      );
      return response.data;
    },
    onSuccess: (data) => {
      setMeetingDetails(data);
      toast.success("✅ Meeting Created Successfully!");
      queryClient.invalidateQueries({ queryKey: ["zoomMeetings"] });
      queryClient.refetchQueries({ queryKey: ["zoomMeetings"] });
    },
    
    onError: (error) => {
      console.error("Error creating meeting:", error);
      toast.error(
        `❌ Failed to create meeting: ${
          error.response?.data?.message || error.message
        }`
      );
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleRecurrence = (e) => {
    setIsRecurring(!isRecurring);
    handleChange(e);
  };

  const handleCreateMeeting = () => {
    if (!validateForm()) return;
    createMeeting();
  };

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
        toast.success("📋 Meeting details copied to clipboard!");
      });
    }
  };

  return (
    <div className="ml-50 text-white flex gap-x-10">
      <div
        className="text-center border rounded-2xl p-5 shadow-lg bg-white-500 shadow-cyan-500/50 border-white bg-center bg-no-repeat w-[40%]"
        style={{ backgroundSize: "100%" }}
      >
        <h3 className="font-bold text-4xl mb-5">Schedule Meeting</h3>

        <div className="text-left w-[90%]">
          {/* Subject */}
          <input
            type="text"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            placeholder="Specify Meeting Subject"
            className={`input rounded-full p-4 w-full mb-4 placeholder-black text-black text-xl bg-white ${
              errors.topic ? "border-2 border-red-500" : ""
            }`}
          />

          {/* Date & Time */}
          <input
            type="datetime-local"
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
            className={`input rounded-full text-black p-4 w-full mb-4 text-xl bg-white ${
              errors.start_time ? "border-2 border-red-500" : ""
            }`}
          />

          {/* Duration */}
          <label className="text-2xl mb-2 block">Duration</label>
          <div className="flex gap-x-2 w-full text-black mb-4">
            <select
              name="durationHour"
              value={formData.durationHour}
              onChange={handleChange}
              className={`select w-1/2 rounded-full ${
                errors.duration ? "border-2 border-red-500" : ""
              }`}
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
              className={`select w-1/2 rounded-full ${
                errors.duration ? "border-2 border-red-500" : ""
              }`}
            >
              {["00", "15", "30", "45"].map((m) => (
                <option key={m} value={m}>
                  {m} min
                </option>
              ))}
            </select>
          </div>

          {/* Recurring */}
          {/* <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              name="recurrence"
              checked={formData.recurrence}
              onChange={handleRecurrence}
              className="checkbox checkbox-primary"
            />
            <span className="text-lg font-semibold">Recurring meeting</span>
          </label> */}

          {formData.recurrence && (
            <div className="text-white p-6 rounded-md">
              <ZoomRecurrenceForm
                formData={formData}
                setFormData={setFormData}
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          onClick={handleCreateMeeting}
          disabled={isPending}
          className="btn btn-active btn-primary mt-4"
        >
          {isPending ? "Creating..." : "Create Meeting"}
        </button>
      </div>

      {/* Right Section */}
      <div className="bg-black relative shadow-md rounded-lg p-6 shadow-cyan-500/50 border-white bg-center bg-no-repeat w-[40%] border">
        <h2 className="text-2xl font-semibold text-white mb-4">
          Meeting Details
        </h2>

        {meetingDetails && (
          <button
            onClick={copyToClipboard}
            className="absolute top-3 right-3 px-3 py-1 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-700"
          >
            📋 Copy Details
          </button>
        )}

        {meetingDetails ? (
          <div className="space-y-2 text-white">
            <p>
              <strong>Topic:</strong> {meetingDetails.data.topic}
            </p>
            <p>
              <strong>Start Time:</strong>{" "}
              {new Date(meetingDetails.data.start_time).toLocaleString()}
            </p>
            <p>
              <strong>Duration:</strong> {meetingDetails.data.duration} min
            </p>
            <p>
              <strong>Meeting ID:</strong> {meetingDetails.data.id}
            </p>
            <p>
              <strong>Email:</strong> {meetingDetails.data.host_email}
            </p>
            <p>
              <strong>Host Key:</strong> {meetingDetails.hostKey}
            </p>
            <p>
              <strong>User Name:</strong> {meetingDetails.name}
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
                <strong>Recurrence Type:</strong>{" "}
                {meetingDetails.data.recurrence.type}
              </p>
            )}
          </div>
        ) : (
          <p className="text-white">No meeting created yet.</p>
        )}
      </div>
    </div>
  );
};

export default ZoomForm;
