import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const fetchMeetings = async () => {
  const { data } = await axios.get(`${apiUrl}/api/zoom/upcoming/meeting`, {
    data: { type: "upcoming" },
  });
  return data;
};

const deleteMeeting = async ({ id, host_id }) => {
  await axios.delete(`${apiUrl}/api/zoom/delete/meeting`, {
    data: { id, host_id },
  });
};

const UpcomingMeetings = () => {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState(null);

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ["zoomMeetings"],
    queryFn: fetchMeetings,
    refetchIntervalInBackground: true,
  });

  const mutation = useMutation({
    mutationFn: deleteMeeting,
    onSuccess: () => {
      toast.success("Meeting deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["zoomMeetings"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete meeting.");
    },
  });

  const isDeleting = (meeting) =>
    mutation.isPending &&
    mutation.variables?.id === meeting.id &&
    mutation.variables?.host_id === meeting.host_id;

  if (isLoading || isFetching)
    return (
      <div className="p-10 text-center text-white text-xl">
        Loading meetings...
      </div>
    );

  if (isError)
    return (
      <div className="p-10 text-red-500 text-center text-xl">
        Error: {error.message}
      </div>
    );

  return (
    <div className="p-4 mt-10">
      <h2 className="text-2xl text-white font-bold mb-4">
        Upcoming Zoom Meetings
      </h2>

      <div className="flex border-b mb-4">
        {data?.map((user) => (
          <button
            key={user.userName}
            onClick={() => setSelectedUser(user.userName)}
            className={`px-4 py-2 font-medium m-5 rounded-xl bg-[url(/meeting-cover.png)] bg-no-repeat bg-cover text-white focus:outline-none border-b-2 transition-colors duration-300 ${
              selectedUser === user.userName
                ? "shadow-cyan-500/50 shadow-xl text-blue-600"
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
                  <ul className="mt-2 p-10 rounded-md m-10 bg-gray-600 text-white shadow-2xl">
                    {user.meetings.map((meeting, index) => (
                      <li
                        key={index}
                        className="card w-full bg-black flex justify-between hover:text-black hover:bg-gray-100 p-5 rounded-2xl shadow-lg items-center mb-5"
                      >
                        <div className="card-body w-full">
                          <div className="flex justify-between">
                            <div>
                              <h2 className="card-title text-2xl mb-2">
                                {meeting.topic}
                              </h2>
                              <p className="text-xl">
                                Date:{" "}
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
                            </div>

                            <div className="flex flex-col justify-end gap-2">
                              <a
                                href={meeting.join_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary"
                              >
                                Join Meeting
                              </a>
                              <button
                                onClick={() =>
                                  mutation.mutate({
                                    id: meeting.id,
                                    host_id: meeting.host_id,
                                  })
                                }
                                className="btn bg-red-600 text-white"
                                disabled={isDeleting(meeting)}
                              >
                                {isDeleting(meeting) ? "Deleting..." : "Delete"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-white text-lg m-5">
                    No meetings scheduled.
                  </p>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingMeetings;
