import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchMeetings = async () => {
  const { data } = await axios.get(
    "http://localhost:5000/api/zoom/upcoming/meeting",
    {
      data: { type: "upcoming" },
    }
  );
  return data;
};

const UpcomingMeetings = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["zoomMeetings"],
    queryFn: fetchMeetings,
  });

  const [selectedUser, setSelectedUser] = useState(null);

  if (isLoading) return <p>Loading meetings...</p>;
  if (error) return <p>Error loading meetings: {error.message}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Upcoming Zoom Meetings</h2>
      {/* Tabs for users */}
      <div className="flex border-b mb-4">
        {data.map((user) => (
          <button
            key={user.userName}
            onClick={() => setSelectedUser(user.userName)}
            className={`px-4 py-2 font-medium focus:outline-none border-b-2 transition-colors duration-300 ${
              selectedUser === user.userName
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-600"
            }`}
          >
            {user.userName}
          </button>
        ))}
      </div>
      {/* Display meetings for the selected user */}
      {selectedUser && (
        <div>
          {data
            .filter((user) => user.userName === selectedUser)
            .map((user) => (
              <div key={user.userName} className="mb-6">
                {user.meetings.length > 0 ? (
                  <ul className="mt-2 border p-4 rounded-md">
                    {user.meetings.map((meeting) => (
                      <li key={meeting.id} className="mb-2">
                        <p className="font-medium">{meeting.topic}</p>
                        <p>
                          Start Time:{" "}
                          {new Date(meeting.start_time).toLocaleString()}
                        </p>
                        <a
                          href={meeting.join_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Join Meeting
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No meetings scheduled.</p>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingMeetings;
