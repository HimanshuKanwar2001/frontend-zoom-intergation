import { useState } from "react";

export default function ZoomMeetingForm() {
  const [meetingDetails, setMeetingDetails] = useState(null);   

  const createMeeting = async () => {
    // Simulating API call response
    const response = {
      topic: "hahaha Meetingasdasd",
      start_time: "2025-03-29T19:47:00Z",
      join_url:
        "https://us06web.zoom.us/j/82463404620?pwd=tAYxSfem2rUWfsoDwL5G9vCQMmetSR.1",
      id: 82463404620,
      password: "123456",
    };
    setMeetingDetails(response);
  };

  const copyToClipboard = () => {
    if (meetingDetails) {
      const meetingText = `📌 *Zoom Meeting Details* 📌

🔹 *Topic:* ${meetingDetails.topic}
📅 *Start Time:* ${new Date(meetingDetails.start_time).toLocaleString()}
🆔 *Meeting ID:* ${meetingDetails.id}
🔑 *Passcode:* ${meetingDetails.password}
🔗 *Join Link:* ${meetingDetails.join_url}

Join on time! ⏳`;

      navigator.clipboard.writeText(meetingText).then(() => {
        alert("Meeting details copied to clipboard! 📋");
      });
    }
  };

  return (
    <div className="flex gap-6 p-6">
      {/* Form Section */}
      <div className="w-2/3 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Create a Zoom Meeting</h2>
        <button
          onClick={createMeeting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Create Meeting
        </button>
      </div>

      {/* Meeting Details Section */}
      {meetingDetails && (
        <div className="w-1/3 bg-gray-100 p-6 rounded-xl shadow-md relative">
          {/* Copy Button */}
          <button
            onClick={copyToClipboard}
            className="absolute top-3 left-3 px-3 py-1 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-700"
          >
            📋 Copy Details
          </button>

          <h3 className="text-lg font-semibold mt-8">Meeting Details</h3>
          <p>
            <strong>Topic:</strong> {meetingDetails.topic}
          </p>
          <p>
            <strong>Start Time:</strong>{" "}
            {new Date(meetingDetails.start_time).toLocaleString()}
          </p>
          <p>
            <strong>Meeting ID:</strong> {meetingDetails.id}
          </p>
          <p>
            <strong>Passcode:</strong> {meetingDetails.password}
          </p>
          <p>
            <strong>Join Link:</strong>{" "}
            <a
              href={meetingDetails.join_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Click here to join
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
