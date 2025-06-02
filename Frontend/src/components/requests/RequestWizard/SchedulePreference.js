import React, { useState, useEffect } from "react";
import "../../../styles/components/requests/SchedulePreference.css";

const SchedulePreference = ({ data, onUpdate, onNext, onBack }) => {
  const [scheduleData, setScheduleData] = useState({
    schedule_type: data.schedule_type || "specific",
    preferred_date: data.preferred_date || "",
    preferred_time: data.preferred_time || "",
    flexible_schedule_days: data.flexible_schedule_days || [],
    flexible_time_slots: data.flexible_time_slots || [],
  });

  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [touched, setTouched] = useState({
    preferred_date: false,
    preferred_time: false,
    flexible_schedule_days: false,
    flexible_time_slots: false,
  });

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const timeSlots = [
    "Morning (8AM - 12PM)",
    "Afternoon (12PM - 4PM)",
    "Evening (4PM - 8PM)",
  ];

  // Validate form
  useEffect(() => {
    const newErrors = {};

    if (scheduleData.schedule_type === "specific") {
      if (touched.preferred_date && !scheduleData.preferred_date) {
        newErrors.preferred_date = "Please select a date";
      }
      if (touched.preferred_time && !scheduleData.preferred_time) {
        newErrors.preferred_time = "Please select a time";
      }
    } else {
      if (
        touched.flexible_schedule_days &&
        scheduleData.flexible_schedule_days.length === 0
      ) {
        newErrors.flexible_schedule_days = "Please select at least one day";
      }
      if (
        touched.flexible_time_slots &&
        scheduleData.flexible_time_slots.length === 0
      ) {
        newErrors.flexible_time_slots = "Please select at least one time slot";
      }
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  }, [scheduleData, touched]);

  // Handle schedule type change
  const handleScheduleTypeChange = (type) => {
    setScheduleData((prev) => ({
      ...prev,
      schedule_type: type,
      preferred_date: type === "specific" ? prev.preferred_date : "",
      preferred_time: type === "specific" ? prev.preferred_time : "",
      flexible_schedule_days:
        type === "flexible" ? prev.flexible_schedule_days : [],
      flexible_time_slots: type === "flexible" ? prev.flexible_time_slots : [],
    }));
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Format date and time values
    let formattedValue = value;
    if (name === "preferred_date") {
      // Ensure date is in YYYY-MM-DD format
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        formattedValue = date.toISOString().split("T")[0];
      }
    } else if (name === "preferred_time") {
      // Ensure time is in HH:mm format
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (timeRegex.test(value)) {
        formattedValue = value;
      }
    }

    setScheduleData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  // Handle day selection
  const handleDayToggle = (day) => {
    setTouched((prev) => ({
      ...prev,
      flexible_schedule_days: true,
    }));
    setScheduleData((prev) => {
      const days = prev.flexible_schedule_days.includes(day)
        ? prev.flexible_schedule_days.filter((d) => d !== day)
        : [...prev.flexible_schedule_days, day];
      return {
        ...prev,
        flexible_schedule_days: days,
      };
    });
  };

  // Handle time slot selection
  const handleTimeSlotToggle = (slot) => {
    setTouched((prev) => ({
      ...prev,
      flexible_time_slots: true,
    }));
    setScheduleData((prev) => {
      const slots = prev.flexible_time_slots.includes(slot)
        ? prev.flexible_time_slots.filter((s) => s !== slot)
        : [...prev.flexible_time_slots, slot];
      return {
        ...prev,
        flexible_time_slots: slots,
      };
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({
      preferred_date: true,
      preferred_time: true,
      flexible_schedule_days: true,
      flexible_time_slots: true,
    });

    if (isValid) {
      onUpdate(scheduleData);
      onNext();
    }
  };

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  return (
    <div className="schedule-preference">
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Schedule Preference</h2>

          <div className="schedule-type-selector">
            <button
              type="button"
              className={`schedule-type-btn ${
                scheduleData.schedule_type === "specific" ? "active" : ""
              }`}
              onClick={() => handleScheduleTypeChange("specific")}
            >
              <span className="icon">📅</span>
              <span>Specific Date & Time</span>
            </button>
            <button
              type="button"
              className={`schedule-type-btn ${
                scheduleData.schedule_type === "flexible" ? "active" : ""
              }`}
              onClick={() => handleScheduleTypeChange("flexible")}
            >
              <span className="icon">🔄</span>
              <span>Flexible Schedule</span>
            </button>
          </div>

          {scheduleData.schedule_type === "specific" ? (
            <div className="specific-schedule">
              <div className="form-group">
                <label htmlFor="preferred_date">Preferred Date *</label>
                <input
                  type="date"
                  id="preferred_date"
                  name="preferred_date"
                  value={scheduleData.preferred_date}
                  onChange={handleChange}
                  min={getMinDate()}
                  className={errors.preferred_date ? "error" : ""}
                />
                {errors.preferred_date && (
                  <div className="error-message">{errors.preferred_date}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="preferred_time">Preferred Time *</label>
                <input
                  type="time"
                  id="preferred_time"
                  name="preferred_time"
                  value={scheduleData.preferred_time}
                  onChange={handleChange}
                  className={errors.preferred_time ? "error" : ""}
                />
                {errors.preferred_time && (
                  <div className="error-message">{errors.preferred_time}</div>
                )}
              </div>
            </div>
          ) : (
            <div className="flexible-schedule">
              <div className="form-group">
                <label>Available Days *</label>
                <div className="days-grid">
                  {daysOfWeek.map((day) => (
                    <div
                      key={day}
                      className={`day-card ${
                        scheduleData.flexible_schedule_days.includes(day)
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => handleDayToggle(day)}
                    >
                      <span className="day-name">{day}</span>
                    </div>
                  ))}
                </div>
                {errors.flexible_schedule_days && (
                  <div className="error-message">
                    {errors.flexible_schedule_days}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Preferred Time Slots *</label>
                <div className="time-slots-grid">
                  {timeSlots.map((slot) => (
                    <div
                      key={slot}
                      className={`time-slot-card ${
                        scheduleData.flexible_time_slots.includes(slot)
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => handleTimeSlotToggle(slot)}
                    >
                      <span className="time-slot-name">{slot}</span>
                    </div>
                  ))}
                </div>
                {errors.flexible_time_slots && (
                  <div className="error-message">
                    {errors.flexible_time_slots}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="wizard-actions">
          <button
            type="button"
            className="btn btn-outlined back-button"
            onClick={onBack}
          >
            Back
          </button>
          <button
            type="submit"
            className="btn btn-primary next-button"
            disabled={!isValid}
          >
            Next: Requirements
          </button>
        </div>
      </form>
    </div>
  );
};

export default SchedulePreference;
