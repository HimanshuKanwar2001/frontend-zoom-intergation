import React from "react";
import CreateMeeting from "./components/CreateMeeting";
import UpcomingMeetings from "./components/UpcomingMeetings";
import { RecoilRoot } from "recoil";
import ZoomMeetings from "./components/CreateMeeting";
import ZoomMeetingForm from "./components/ZoomMeetingForm";
import SearchMeetings from "./components/SearchMeetings";
import SearchMeeting from "./components/SearchMeeting";
import ZoomForm from "./components/ZoomForm";
import RecurringMeetingForm from "./components/RecurringMeetingForm";
import ZoomRecurrenceForm from "./components/NewForm";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <RecoilRoot>
      <div className="bg-black mx-auto min-w-screen min-h-screen">
        {/* <div className="p-5  mx-auto"> */}

        <SearchMeeting />
        <ZoomForm />
        {/* <ZoomRecurrenceForm/> */}
        {/* <SearchMeetings /> */}
        {/* <CreateMeeting /> */}
        <UpcomingMeetings />
      </div>
      <Toaster />
    </RecoilRoot>
  );
};

export default App;
