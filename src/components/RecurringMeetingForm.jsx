import { useState } from "react";

export default function RecurringMeetingForm({ formData, handleChange }) {
  const [isRecurring, setIsRecurring] = useState(true);
  const [recurrence, setRecurrence] = useState("daily");
  const [repeatEvery, setRepeatEvery] = useState(1);
  const [endType, setEndType] = useState("date");
  const [endDate, setEndDate] = useState("2025-04-10");
  const [occurrences, setOccurrences] = useState(7);

  const handleRecurrence=(e)=>{
    setIsRecurring(!isRecurring)
            handleChange(e);
  }

  return (
    <div className="p-6  shadow-md rounded-lg w-full max-w-lg">
      {/* Recurring Meeting Toggle */}
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          name="recurrence"
          checked={formData.recurrence}
          className="checkbox checkbox-primary"
          onChange={handleRecurrence}
        />
        <span className="text-lg font-semibold">Recurring meeting</span>
      </label>

      {formData.recurrence && (
        <div className="mt-4 space-y-4">
          {/* Recurrence Type */}
          <div>
            <label className="block text-white font-medium">Recurrence</label>
            <select
              name="recurrenceType"
              value={formData.recurrenceType}
              onChange={handleChange}
              className="select select-bordered text-black w-full mt-1"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          {/* Repeat Every */}
          <div>
            <label className="block text-text-white font-medium">
              Repeat every
            </label>
            <div className="flex items-center space-x-2 mt-1">
              <input
                className="input text-black input-bordered w-16"
                min="1"
                type="number"
                name="repeatEvery"
                value={formData.repeatEvery}
                onChange={handleChange}
              />
              <span>
                {recurrence === "daily"
                  ? "day(s)"
                  : recurrence === "weekly"
                  ? "week(s)"
                  : "month(s)"}
              </span>
            </div>
          </div>

          {/* End Date Options */}
          <div>
            <label className="block text-white font-medium">End date</label>
            <div className="flex flex-col space-y-2 mt-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="end"
                  className="radio checked:bg-blue-600"
                  checked={endType === "none"}
                  onChange={() => setEndType("none")}
                />
                <span>No end time</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="end"
                  className="radio checked:bg-blue-600"
                  checked={endType === "date"}
                  onChange={() => setEndType("date")}
                />
                <span>By</span>
                <input
                  type="date"
                  className="input text-black input-bordered"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={endType !== "date"}
                />
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="end"
                  className="radio checked:bg-blue-600"
                  checked={endType === "occurrences"}
                  onChange={() => setEndType("occurrences")}
                />
                <span>After</span>
                <input
                  type="number"
                  className="input input-bordered text-black w-16"
                  min="1"
                  value={occurrences}
                  onChange={(e) => setOccurrences(Number(e.target.value))}
                  disabled={endType !== "occurrences"}
                />
                <span>occurrences</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
