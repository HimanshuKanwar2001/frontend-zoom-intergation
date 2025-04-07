import React, { useState } from "react";

const ZoomRecurrenceForm = ({ setFormData, formData }) => {
  const [type, setType] = useState(1); // 1 - Daily, 2 - Weekly, 3 - Monthly
  const [repeatInterval, setRepeatInterval] = useState(1);
  const [endOption, setEndOption] = useState("none"); // 'none' | 'date' | 'after'
  const [endDate, setEndDate] = useState("");
  const [endTimes, setEndTimes] = useState(1);
  const [weeklyDays, setWeeklyDays] = useState([]);
  const [monthlyDay, setMonthlyDay] = useState(1);
  const [monthlyWeek, setMonthlyWeek] = useState(1);
  const [monthlyWeekDay, setMonthlyWeekDay] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedData = {
      recurrence: true,
      type: type,
      repeat_interval: repeatInterval,
      end_date_time: "",
      end_times: "",
      weekly_days: "",
      monthly_day: "",
      monthly_week: "",
      monthly_week_day: "",
      endDate: "",
    };

    if (type === 2) {
      updatedData.weekly_days = weeklyDays.join(",");
    }

    if (type === 3) {
      updatedData.monthly_day = monthlyDay;
      updatedData.monthly_week = monthlyWeek;
      updatedData.monthly_week_day = monthlyWeekDay;
    }

    if (endOption === "date") {
      updatedData.end_date_time = new Date(endDate).toISOString();
      updatedData.endDate = endDate;
    } else if (endOption === "after") {
      updatedData.end_times = endTimes;
    }

    // Update parent formData
    setFormData((prev) => ({
      ...prev,
      ...updatedData,
    }));

    console.log("Zoom Recurrence Payload:", formData);
  };

  const toggleWeeklyDay = (day) => {
    setWeeklyDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <form
      onChange={handleSubmit}
      className="p-4  mx-auto space-y-4 bg-black rounded-xl shadow"
    >
      <h2 className="text-xl font-bold">Recurring Meeting</h2>

      <div>
        <label className="block font-medium">Recurrence Type</label>
        <select
          value={type}
          onChange={(e) => setType(Number(e.target.value))}
          className="border p-2 bg-white text-black rounded-full w-full"
        >
          <option value={1}>Daily</option>
          <option value={2}>Weekly</option>
          <option value={3}>Monthly</option>
        </select>
      </div>

      <div>
        <label className="block font-medium ">Repeat every</label>
        <input
          type="number"
          min={1}
          value={repeatInterval}
          onChange={(e) => setRepeatInterval(Number(e.target.value))}
          className="border p-2 w-full bg-white text-black rounded-full"
        />
      </div>

      {type === 2 && (
        <div>
          <label className="block font-medium">Repeat on (Weekly)</label>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {["1", "2", "3", "4", "5", "6", "7"].map((day) => (
              <label key={day} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={weeklyDays.includes(day)}
                  onChange={() => toggleWeeklyDay(day)}
                />
                {
                  ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                    parseInt(day) - 1
                  ]
                }
              </label>
            ))}
          </div>
        </div>
      )}

      {type === 3 && (
        <>
          <div>
            <label className="block font-medium">Monthly Day</label>
            <input
              type="number"
              min={1}
              max={31}
              value={monthlyDay}
              onChange={(e) => setMonthlyDay(Number(e.target.value))}
              className="border p-2 w-full bg-white text-black rounded-full"
            />
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block font-medium">Monthly Week</label>
              <select
                value={monthlyWeek}
                onChange={(e) => setMonthlyWeek(Number(e.target.value))}
                className="border p-2 w-full bg-white text-black rounded-full"
              >
                <option value={1}>First</option>
                <option value={2}>Second</option>
                <option value={3}>Third</option>
                <option value={4}>Fourth</option>
                <option value={-1}>Last</option>
              </select>
            </div>
            <div className="w-1/2">
              <label className="block font-medium">Monthly Week Day</label>
              <select
                value={monthlyWeekDay}
                onChange={(e) => setMonthlyWeekDay(Number(e.target.value))}
                className="border p-2 w-full bg-white text-black rounded-full"
              >
                <option value={1}>Sunday</option>
                <option value={2}>Monday</option>
                <option value={3}>Tuesday</option>
                <option value={4}>Wednesday</option>
                <option value={5}>Thursday</option>
                <option value={6}>Friday</option>
                <option value={7}>Saturday</option>
              </select>
            </div>
          </div>
        </>
      )}

      <div>
        <label className="block font-medium">End Date</label>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="end"
              checked={endOption === "none"}
              onChange={() => setEndOption("none")}
            />
            No end time
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="end"
              checked={endOption === "date"}
              onChange={() => setEndOption("date")}
            />
            By:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border p-1 bg-white text-black rounded-full"
            />
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="end"
              checked={endOption === "after"}
              onChange={() => setEndOption("after")}
            />
            After:
            <input
              type="number"
              min={1}
              value={endTimes}
              onChange={(e) => setEndTimes(Number(e.target.value))}
              className="border p-1 w-20 bg-white text-black rounded-full"
            />
            occurrences
          </label>
        </div>
      </div>

      {/* <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Create Recurring Meeting
      </button> */}
    </form>
  );
};

export default ZoomRecurrenceForm;
