import React from "react";
import CreateMeeting from "./components/CreateMeeting";
import UpcomingMeetings from "./components/UpcomingMeetings";
import { RecoilRoot } from "recoil";
import ZoomMeetings from "./components/CreateMeeting";
import ZoomMeetingForm from "./components/ZoomMeetingForm";
import SearchMeetings from "./components/SearchMeetings";

const App = () => {
  return (
    <RecoilRoot>
      <div className="p-5  mx-auto">
        <h1 className="text-3xl font-bold text-center mb-5">
          Zoom Meeting Manager
        </h1>
        <SearchMeetings />
        <CreateMeeting />
        {/* <ZoomMeetings /> */}
        <UpcomingMeetings />
        {/* <ZoomMeetingForm/> */}
      </div>
    </RecoilRoot>
  );
};

export default App;
