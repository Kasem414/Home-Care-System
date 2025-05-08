import React, { useState, useEffect } from "react";

const SchedulePreference = ({ data, onUpdate, onNext, onBack }) => {
  // Initialize state with existing data or defaults
  const [schedule, setSchedule] = useState({
    preferredDate: data.schedule?.preferredDate || "",
    preferredTime: data.schedule?.preferredTime || "",
    flexibility: data.schedule?.flexibility || "exact",
    flexibleDays: data.schedule?.flexibleDays || [],
    flexibleTimes: data.schedule?.flexibleTimes || [],
  });
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  // Validate form
  useEffect(() => {
    const newErrors = {};
    
    if (schedule.flexibility === "exact") {
      if (!schedule.preferredDate) {
        newErrors.preferredDate = "Please select a date";
      }
      if (!schedule.preferredTime) {
        newErrors.preferredTime = "Please select a time";
      }
    } else if (schedule.flexibility === "flexible") {
      if (schedule.flexibleDays.length === 0) {
        newErrors.flexibleDays = "Please select at least one day";
      }
      if (schedule.flexibleTimes.length === 0) {
        newErrors.flexibleTimes = "Please select at least one time slot";
      }
    }
    
    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  }, [schedule]);

  // Handle radio input changes
  const handleFlexibilityChange = (flexibility) => {
    setSchedule({
      ...schedule,
      flexibility,
    });
  };

  // Handle date & time input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSchedule({
      ...schedule,
      [name]: value,
    });
  };

  // Handle checkbox input changes for flexible days
  const handleDayToggle = (day) => {
    const updatedDays = [...schedule.flexibleDays];
    if (updatedDays.includes(day)) {
      const index = updatedDays.indexOf(day);
      updatedDays.splice(index, 1);
    } else {
      updatedDays.push(day);
    }
    setSchedule({
      ...schedule,
      flexibleDays: updatedDays,
    });
  };

  // Handle checkbox input changes for flexible time slots
  const handleTimeSlotToggle = (timeSlot) => {
    const updatedTimeSlots = [...schedule.flexibleTimes];
    if (updatedTimeSlots.includes(timeSlot)) {
      const index = updatedTimeSlots.indexOf(timeSlot);
      updatedTimeSlots.splice(index, 1);
    } else {
      updatedTimeSlots.push(timeSlot);
    }
    setSchedule({
      ...schedule,
      flexibleTimes: updatedTimeSlots,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid) {
      onUpdate({ schedule });
      onNext();
    }
  };

  // Get tomorrow's date for minimum date selection
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Time slots for checkbox selection
  const timeSlots = [
    { value: "morning", label: "Morning (8am - 12pm)" },
    { value: "afternoon", label: "Afternoon (12pm - 5pm)" },
    { value: "evening", label: "Evening (5pm - 9pm)" },
  ];

  // Days of the week for checkbox selection
  const daysOfWeek = [
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
    { value: "sunday", label: "Sunday" },
  ];

  return (
    <div className="schedule-preference">
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>When do you need this service?</h2>
          <p className="section-description">
            Let us know when you would like the service to be performed.
          </p>

          <div className="schedule-options">
            <div className="schedule-option">
              <div 
                className={`option-card ${schedule.flexibility === "exact" ? "selected" : ""}`}
                onClick={() => handleFlexibilityChange("exact")}
              >
                <div className="option-radio">
                  <input 
                    type="radio" 
                    name="flexibility" 
                    value="exact" 
                    checked={schedule.flexibility === "exact"} 
                    onChange={() => handleFlexibilityChange("exact")}
                  />
                </div>
                <div className="option-content">
                  <h3>Specific Date & Time</h3>
                  <p>I need the service at an exact date and time</p>
                </div>
              </div>
              
              {schedule.flexibility === "exact" && (
                <div className="option-details">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="preferredDate">Preferred Date *</label>
                      <input
                        type="date"
                        id="preferredDate"
                        name="preferredDate"
                        value={schedule.preferredDate}
                        onChange={handleChange}
                        min={getTomorrowDate()}
                        className={errors.preferredDate ? "error" : ""}
                      />
                      {errors.preferredDate && <div className="error-message">{errors.preferredDate}</div>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="preferredTime">Preferred Time *</label>
                      <input
                        type="time"
                        id="preferredTime"
                        name="preferredTime"
                        value={schedule.preferredTime}
                        onChange={handleChange}
                        className={errors.preferredTime ? "error" : ""}
                      />
                      {errors.preferredTime && <div className="error-message">{errors.preferredTime}</div>}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="schedule-option">
              <div 
                className={`option-card ${schedule.flexibility === "flexible" ? "selected" : ""}`}
                onClick={() => handleFlexibilityChange("flexible")}
              >
                <div className="option-radio">
                  <input 
                    type="radio" 
                    name="flexibility" 
                    value="flexible" 
                    checked={schedule.flexibility === "flexible"} 
                    onChange={() => handleFlexibilityChange("flexible")}
                  />
                </div>
                <div className="option-content">
                  <h3>Flexible Schedule</h3>
                  <p>I'm flexible with multiple days and times</p>
                </div>
              </div>
              
              {schedule.flexibility === "flexible" && (
                <div className="option-details">
                  <div className="form-group">
                    <label>Preferred Days *</label>
                    <div className="checkbox-group">
                      {daysOfWeek.map((day) => (
                        <div key={day.value} className="checkbox-item">
                          <input
                            type="checkbox"
                            id={day.value}
                            name="flexibleDays"
                            checked={schedule.flexibleDays.includes(day.value)}
                            onChange={() => handleDayToggle(day.value)}
                          />
                          <label htmlFor={day.value}>{day.label}</label>
                        </div>
                      ))}
                    </div>
                    {errors.flexibleDays && <div className="error-message">{errors.flexibleDays}</div>}
                  </div>

                  <div className="form-group">
                    <label>Preferred Time Slots *</label>
                    <div className="checkbox-group">
                      {timeSlots.map((slot) => (
                        <div key={slot.value} className="checkbox-item">
                          <input
                            type="checkbox"
                            id={slot.value}
                            name="flexibleTimes"
                            checked={schedule.flexibleTimes.includes(slot.value)}
                            onChange={() => handleTimeSlotToggle(slot.value)}
                          />
                          <label htmlFor={slot.value}>{slot.label}</label>
                        </div>
                      ))}
                    </div>
                    {errors.flexibleTimes && <div className="error-message">{errors.flexibleTimes}</div>}
                  </div>
                </div>
              )}
            </div>
          </div>
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