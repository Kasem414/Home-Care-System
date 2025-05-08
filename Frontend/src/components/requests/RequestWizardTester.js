import React, { useState } from "react";
import ServiceSelection from "./RequestWizard/ServiceSelection";
import LocationDetails from "./RequestWizard/LocationDetails";
import SchedulePreference from "./RequestWizard/SchedulePreference";
import Requirements from "./RequestWizard/Requirements";
import RequestSummary from "./RequestWizard/RequestSummary";

/**
 * This component is for development and testing purposes only.
 * It allows viewing and testing individual steps of the RequestWizard
 * without needing to complete the full wizard flow.
 */
const RequestWizardTester = () => {
  // Test data
  const [testData, setTestData] = useState({
    serviceType: "cleaning",
    serviceDetails:
      "I need a deep cleaning service for my 3-bedroom house. All rooms need to be cleaned, including bathrooms and kitchen.",
    location: {
      address: "123 Main St",
      city: "Boston",
      state: "Massachusetts",
      zipCode: "02108",
      additionalInfo: "Apartment 4B, second floor",
    },
    schedule: {
      preferredDate: "2023-12-15",
      preferredTime: "14:00",
      flexibility: "flexible",
      flexibleDays: ["monday", "wednesday", "friday"],
      flexibleTimes: ["morning", "afternoon"],
    },
    requirements: {
      description:
        "Looking for someone with experience in deep cleaning. Must bring their own cleaning supplies. Special focus on bathroom grout and kitchen appliances.",
      budget: {
        min: 25,
        max: 45,
        type: "hourly",
      },
      preferredQualifications: ["experienced", "insured"],
      attachments: [
        {
          id: "1",
          name: "bathroom_photo.jpg",
          size: 1250000,
          type: "image/jpeg",
        },
        {
          id: "2",
          name: "kitchen_layout.pdf",
          size: 523000,
          type: "application/pdf",
        },
      ],
    },
    status: "draft",
    customerId: "test123",
    createdAt: new Date(),
  });

  // Step handling
  const [activeStep, setActiveStep] = useState(1);

  // Update test data
  const handleUpdate = (newData) => {
    setTestData({ ...testData, ...newData });
    console.log("Updated Data:", { ...testData, ...newData });
  };

  // Navigation
  const nextStep = () => {
    setActiveStep((prev) => (prev < 5 ? prev + 1 : prev));
  };

  const prevStep = () => {
    setActiveStep((prev) => (prev > 1 ? prev - 1 : prev));
  };

  // Submit handler
  const handleSubmit = () => {
    console.log("Final Request Data:", testData);
    alert("Request Submitted! See console for details.");
  };

  return (
    <div className="request-wizard-tester container">
      <div className="tester-header">
        <h1>RequestWizard Tester</h1>
        <p>Use this component to test individual steps of the wizard</p>

        <div className="tester-controls">
          <button
            className={`tester-step-btn ${activeStep === 1 ? "active" : ""}`}
            onClick={() => setActiveStep(1)}
          >
            Step 1: Service
          </button>
          <button
            className={`tester-step-btn ${activeStep === 2 ? "active" : ""}`}
            onClick={() => setActiveStep(2)}
          >
            Step 2: Location
          </button>
          <button
            className={`tester-step-btn ${activeStep === 3 ? "active" : ""}`}
            onClick={() => setActiveStep(3)}
          >
            Step 3: Schedule
          </button>
          <button
            className={`tester-step-btn ${activeStep === 4 ? "active" : ""}`}
            onClick={() => setActiveStep(4)}
          >
            Step 4: Requirements
          </button>
          <button
            className={`tester-step-btn ${activeStep === 5 ? "active" : ""}`}
            onClick={() => setActiveStep(5)}
          >
            Step 5: Summary
          </button>
        </div>
      </div>

      <div className="wizard-content">
        {activeStep === 1 && (
          <ServiceSelection
            data={testData}
            onUpdate={handleUpdate}
            onNext={nextStep}
          />
        )}

        {activeStep === 2 && (
          <LocationDetails
            data={testData}
            onUpdate={handleUpdate}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}

        {activeStep === 3 && (
          <SchedulePreference
            data={testData}
            onUpdate={handleUpdate}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}

        {activeStep === 4 && (
          <Requirements
            data={testData}
            onUpdate={handleUpdate}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}

        {activeStep === 5 && (
          <RequestSummary
            data={testData}
            onUpdate={handleUpdate}
            onSubmit={handleSubmit}
            onBack={prevStep}
          />
        )}
      </div>

      <div className="debug-panel">
        <div className="debug-panel-header">
          <h3>Current Data State</h3>
          <button
            className="reset-data-btn"
            onClick={() =>
              window.confirm("Reset data to defaults?") &&
              setTestData({
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
                  flexibility: "exact",
                  flexibleDays: [],
                  flexibleTimes: [],
                },
                requirements: {
                  description: "",
                  budget: {
                    min: 0,
                    max: 0,
                    type: "hourly",
                  },
                  preferredQualifications: [],
                  attachments: [],
                },
                status: "draft",
                customerId: "test123",
                createdAt: new Date(),
              })
            }
          >
            Reset Data
          </button>
        </div>
        <pre className="debug-output">{JSON.stringify(testData, null, 2)}</pre>
      </div>
    </div>
  );
};

export default RequestWizardTester;
