import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

// const fetchMeetings = async () => {
//   try {
//     const { data } = await axios.get(`${apiUrl}/api/zoom/upcoming/meeting`, {
//       data: { type: "upcoming" },
//     });
//     return data;
//   } catch (error) {
//     console.error("Error fetching meetings:", error);
//     throw new Error("Failed to fetch meetings");
//   }
// };

const deleteMeeting = async ({ id, host_id }) => {
  try {
    await axios.delete(`${apiUrl}/api/zoom/delete/meeting`, {
      data: { id, host_id },
    });
  } catch (error) {
    console.error("Error deleting meeting:", error);
    throw new Error("Failed to delete meeting");
  }
};

const UpcomingMeetings = () => {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["zoomMeetings"],
    queryFn: async () => {
      try {
        const { data } = await axios.get(
          `${apiUrl}/api/zoom/upcoming/meeting`,
          {
            data: { type: "upcoming" },
          }
        );
        return data;
      } catch (error) {
        console.error("Error fetching meetings:", error);
        throw new Error("Failed to fetch meetings");
      }
    },
  });

  const mutation = useMutation({
    mutationFn: deleteMeeting,
    onMutate: (variables) => {
      setDeletingId(variables.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zoomMeetings"] });
    },
    onSettled: () => {
      setDeletingId(null);
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  if (isLoading) return <p>Loading meetings...</p>;
  if (error) return <p className="text-red-500">{error.message}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Upcoming Zoom Meetings</h2>
      <div className="flex border-b mb-4">
        {data?.map((user) => (
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
      {selectedUser && (
        <div>
          {data
            .filter((user) => user.userName === selectedUser)
            .map((user) => (
              <div key={user.userName} className="mb-6">
                {user.meetings.length > 0 ? (
                  <ul className="mt-2 p-4 rounded-md">
                    {user.meetings.map((meeting) => (
                      <li
                        key={meeting.id}
                        className=" card w-full bg-base-100 card-xs  mb-2 flex justify-between hover:text-black hover:bg-blue-200 inset-shadow-2xs p-5 rounded-2xl shadow-lg items-center"
                      >
                        <div className="   card w-full  card-xs ">
                          <div className="card-body">
                            <h2 className="card-title text-2xl">
                              {meeting.topic}
                            </h2>
                            <p className="text-xl">
                              Date :{" "}
                              <span>
                                {
                                  new Date(meeting.start_time)
                                    .toLocaleString()
                                    .split(",")[0]
                                }
                              </span>
                            </p>

                            <p className="text-xl">
                              Time:{" "}
                              <span>
                                {
                                  new Date(meeting.start_time)
                                    .toLocaleString()
                                    .split(",")[1]
                                }
                              </span>
                            </p>

                            <div className="justify-end card-actions">
                              <div>
                                <a
                                  href={meeting.join_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-primary"
                                >
                                  Join Meeting
                                </a>
                              </div>
                              <div>
                                <button
                                  onClick={() =>
                                    mutation.mutate({
                                      id: meeting.id,
                                      host_id: meeting.host_id,
                                    })
                                  }
                                  className="btn bg-red-600"
                                  disabled={deletingId === meeting.id}
                                >
                                  {deletingId === meeting.id
                                    ? "Deleting..."
                                    : "Delete"}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
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
