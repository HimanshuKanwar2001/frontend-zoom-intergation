import React from "react";
import CreateMeeting from "./components/CreateMeeting";
import UpcomingMeetings from "./components/UpcomingMeetings";
import { RecoilRoot } from "recoil";

const App = () => {
  return (
    <RecoilRoot>
      <div className="p-5 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-5">Zoom Meeting Manager</h1>
        <CreateMeeting />
        <UpcomingMeetings />
      </div>
    </RecoilRoot>
  );
};

export default App;
