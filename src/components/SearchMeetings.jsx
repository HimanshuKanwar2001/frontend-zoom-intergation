import { useState, useEffect } from "react";
import axios from "axios";

export default function SearchMeetings() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setResults([]);
      setError(null);
      return;
    }

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      handleSearch();
    }, 500); // 500ms debounce time

    setDebounceTimeout(timeout);
  }, [searchQuery]);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const response = await axios.post(`${apiUrl}/api/zoom/search`, {
        searchQuery,
      });
      setResults(response.data.results);
    } catch (error) {
      console.log("ERROR:", error);
      setError("Failed to fetch meetings");
    }

    setLoading(false);
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">Search Zoom Meetings</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter meeting title"
          className="border p-2 w-full rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {loading && <p className="text-blue-500">Searching...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul className="space-y-2">
        {results.map((meeting, index) => (
          <li key={index} className="p-2 border rounded">
            <p className="font-semibold">{meeting.topic}</p>
            <p className="text-sm text-gray-600">{meeting.startTime}</p>
            <p className="text-sm text-gray-500">
              Created by: {meeting.accountEmail}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
