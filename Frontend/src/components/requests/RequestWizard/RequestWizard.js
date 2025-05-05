import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ServiceSelection from "./ServiceSelection";
import LocationDetails from "./LocationDetails";
import SchedulePreference from "./SchedulePreference";
import Requirements from "./Requirements";
import RequestSummary from "./RequestSummary";
import { useAuth } from "../../../contexts/AuthContext";

const RequestWizard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [requestData, setRequestData] = useState({
    serviceType: "",
    serviceDetails: "",
    location: {
      address: "",
      city: "",
      state: "",
      zipCode: "",
      additionalInfo: "",
    },
    schedule: {
      preferredDate: null,
      preferredTime: null,
      flexibility: "exact", // or "flexible"
      flexibleDays: [],
      flexibleTimes: [],
    },
    requirements: {
      description: "",
      budget: {
        min: 0,
        max: 0,
        type: "hourly", // or "fixed"
      },
      attachments: [],
      preferredQualifications: [],
    },
    status: "draft",
    customerId: user?.id || "",
    createdAt: new Date(),
  });

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    navigate("/login", { state: { from: "/request" } });
    return null;
  }

  // Update request data based on step input
  const updateRequestData = (stepData) => {
    setRequestData({ ...requestData, ...stepData });
  };

  // Go to next step
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  // Go to previous step
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Submit the request
  const submitRequest = async () => {
    try {
      // Here we would call an API to save the request
      console.log("Submitting request:", requestData);
      // On success, redirect to requests list
      navigate("/requests");
    } catch (error) {
      console.error("Error submitting request:", error);
    }
  };

  // Define the steps
  const totalSteps = 5;
  const stepComponents = {
    1: (
      <ServiceSelection
        data={requestData}
        onUpdate={updateRequestData}
        onNext={nextStep}
      />
    ),
    2: (
      <LocationDetails
        data={requestData}
        onUpdate={updateRequestData}
        onNext={nextStep}
        onBack={prevStep}
      />
    ),
    3: (
      <SchedulePreference
        data={requestData}
        onUpdate={updateRequestData}
        onNext={nextStep}
        onBack={prevStep}
      />
    ),
    4: (
      <Requirements
        data={requestData}
        onUpdate={updateRequestData}
        onNext={nextStep}
        onBack={prevStep}
      />
    ),
    5: (
      <RequestSummary
        data={requestData}
        onUpdate={updateRequestData}
        onSubmit={submitRequest}
        onBack={prevStep}
      />
    ),
  };

  return (
    <div className="request-wizard container">
      <div className="wizard-header">
        <h1>Request a Service</h1>
        <div className="progress-bar">
          {[...Array(totalSteps)].map((_, i) => (
            <div
              key={i}
              className={`progress-step ${
                i + 1 === currentStep
                  ? "active"
                  : i + 1 < currentStep
                  ? "completed"
                  : ""
              }`}
            >
              <div className="step-number">{i + 1}</div>
              <div className="step-label">
                {i === 0
                  ? "Service"
                  : i === 1
                  ? "Location"
                  : i === 2
                  ? "Schedule"
                  : i === 3
                  ? "Requirements"
                  : "Review"}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="wizard-content">{stepComponents[currentStep]}</div>
    </div>
  );
};

export default RequestWizard;