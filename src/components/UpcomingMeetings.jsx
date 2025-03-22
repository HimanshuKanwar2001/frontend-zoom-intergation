import React, { useState } from "react";
import { useRecoilValueLoadable } from "recoil";
import { upcomingMeetingsState } from "../recoil/state";
import {
  CircularProgress,
  Pagination,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

const UpcomingMeetings = () => {
  const meetingsLoadable = useRecoilValueLoadable(upcomingMeetingsState);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  if (meetingsLoadable.state === "loading") {
    return (
      <div className="flex justify-center">
        <CircularProgress />
      </div>
    );
  }

  if (meetingsLoadable.state === "hasError") {
    return (
      <div className="text-red-500 text-center">Error fetching meetings.</div>
    );
  }

  const meetings = meetingsLoadable.contents;
  const totalPages = Math.ceil(meetings.length / itemsPerPage);
  const displayedMeetings = meetings.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Upcoming Meetings</h2>
      {displayedMeetings.length === 0 ? (
        <p className="text-center">No upcoming meetings</p>
      ) : (
        displayedMeetings.map((meeting) => (
          <Card key={meeting.id} className="mb-4 shadow-lg">
            <CardContent>
              <Typography variant="h6" className="font-bold">
                {meeting.topic}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {new Date(meeting.start_time).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        ))
      )}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </div>
      )}
    </div>
  );
};

export default UpcomingMeetings;
