import React, { useState } from "react";
import { createMeeting } from "../api/zoom";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

const CreateMeeting = () => {
  const [formData, setFormData] = useState({
    email: "",
    topic: "",
    start_time: "",
    duration: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const response = await createMeeting(formData);
    setLoading(false);

    if (response) {
      alert("Meeting Created Successfully!");
      setFormData({  topic: "", start_time: "", duration: "" });
    } else {
      setError("Failed to create meeting. Try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card className="shadow-lg">
        <CardContent>
          <Typography variant="h6" className="font-bold mb-4">
            Create Zoom Meeting
          </Typography>
          {error && <p className="text-red-500">{error}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            
            <TextField
              label="Meeting Topic"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              type="datetime-local"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              type="number"
              label="Duration (minutes)"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Meeting"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateMeeting;
