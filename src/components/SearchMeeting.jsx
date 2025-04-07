import { FaSearch } from "react-icons/fa";

export default function ZoomMeetingManager() {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center pb-5 
      bg-[url('/circle%20transparent.png')] bg-no-repeat bg-center bg-contain relative"
      style={{ backgroundSize: "80%", backgroundPositionY: "-70px" }}
    >
      {/* Background Images */}
      <img
        src="./yellow-background-img.png"
        className="absolute min-w-[200px] bottom-40 left-[-280px]"
        alt="Yellow decorative background"
      />
      <img
        src="./blue-background-img.png"
        className="absolute w-7xl top-50 right-[-750px]"
        alt="Blue decorative background"
      />

      {/* Main Content */}
      <div className="text-center text-white px-6 relative w-full max-w-4xl">
        <h1 className="text-5xl font-bold">Zoom Meeting Manager</h1>
        <p className="text-lg mt-2">
          Effortlessly Organize and Manage Your Zoom Meetings
        </p>

        {/* Search Bar */}
        <div className="mt-6 flex justify-center">
          <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md w-full max-w-lg">
            <input
              type="text"
              placeholder="Search Meetings Details..."
              className="flex-grow text-black outline-none px-2"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-blue-700">
              <FaSearch /> Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
