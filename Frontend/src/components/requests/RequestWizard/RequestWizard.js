import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ServiceSelection from "./ServiceSelection";
import LocationDetails from "./LocationDetails";
import SchedulePreference from "./SchedulePreference";
import Requirements from "./Requirements";
import RequestSummary from "./RequestSummary";
import { useAuth } from "../../../contexts/AuthContext";
import { getUserIdFromToken, techProfileService } from "../../../services/api";
import { requestService } from "../../../services/requestService";
import { notificationService } from "../../../services/notificationService";
import { toast } from "react-toastify";

const RequestWizard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [techProfiles, setTechProfiles] = useState([]);
  const [requestData, setRequestData] = useState({
    customer_id: getUserIdFromToken() || "",
    service_type: "",
    street_address: "123 Main Street", // Hardcoded as per requirement
    city: "",
    region: "",
    additional_info: "",
    preferred_date: "",
    preferred_time: "",
    schedule_type: "specific",
    flexible_schedule_days: [],
    flexible_time_slots: [],
    description: "",
    budget_type: "hourly",
    budget_min_hourly: "0",
    budget_max_hourly: "0",
    fixed_price_offer: "0",
    preferred_qualifications: [],
    attachments: [],
    is_urgent: false,
  });

  // Fetch tech profiles when component mounts
  useEffect(() => {
    fetchTechProfiles();
  }, []);

  const fetchTechProfiles = async () => {
    try {
      const profiles = await techProfileService.getAllProfiles();
      if (Array.isArray(profiles)) {
        setTechProfiles(profiles);
      }
    } catch (error) {
      console.error("Error fetching tech profiles:", error);
    }
  };

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    navigate("/login", { state: { from: "/request/new" } });
    return null;
  }

  // Update request data based on step input
  const updateRequestData = (stepData) => {
    setRequestData((prevData) => ({
      ...prevData,
      ...stepData,
    }));
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

  // Prepare request data for submission
  const prepareRequestData = () => {
    const data = { ...requestData };

    // Convert empty strings to null for required fields
    Object.keys(data).forEach((key) => {
      if (data[key] === "") {
        data[key] = null;
      }
    });

    // Handle budget values
    if (data.budget_type === "hourly") {
      delete data.fixed_price_offer;
      data.budget_min_hourly = parseFloat(data.budget_min_hourly) || 0;
      data.budget_max_hourly = parseFloat(data.budget_max_hourly) || 0;
    } else {
      delete data.budget_min_hourly;
      delete data.budget_max_hourly;
      data.fixed_price_offer = parseFloat(data.fixed_price_offer) || 0;
    }

    // Handle schedule data
    if (data.schedule_type === "specific") {
      // Ensure date is in YYYY-MM-DD format
      if (data.preferred_date) {
        const date = new Date(data.preferred_date);
        if (!isNaN(date.getTime())) {
          data.preferred_date = date.toISOString().split("T")[0];
        }
      }

      // Ensure time is in HH:mm format
      if (data.preferred_time) {
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(data.preferred_time)) {
          // Convert to 24-hour format if needed
          const timeParts = data.preferred_time.split(":");
          if (timeParts.length >= 2) {
            data.preferred_time = `${timeParts[0].padStart(
              2,
              "0"
            )}:${timeParts[1].padStart(2, "0")}`;
          }
        }
      }

      delete data.flexible_schedule_days;
      delete data.flexible_time_slots;
    } else {
      delete data.preferred_date;
      delete data.preferred_time;
    }

    // Ensure customer_id is a number
    data.customer_id = parseInt(data.customer_id);

    data.is_urgent = data.is_urgent ? true : false;

    return data;
  };

  // Submit the request
  const submitRequest = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // Prepare the request data
      const preparedData = prepareRequestData();

      // Create the request
      const response = await requestService.createRequest(preparedData);

      // Get the created request data with ID
      const createdRequest = response.data || response;

      // Notify relevant providers based on tech profiles
      try {
        if (createdRequest.id) {
          // Filter tech profiles by service type and region/city
          const relevantProfiles = techProfiles.filter((profile) => {
            const matchesCategory =
              Array.isArray(profile.serviceCategories) &&
              profile.serviceCategories.includes(preparedData.service_type);
            console.log("serviceCategories", profile.serviceCategories);
            console.log("service_type", preparedData.service_type);
            const matchesRegion =
              Array.isArray(profile.serviceRegions) &&
              (profile.serviceRegions.includes(preparedData.region) ||
                profile.serviceRegions.includes(preparedData.city));
            console.log("serviceRegions", profile.serviceRegions);
            console.log("region", preparedData.region);
            console.log("city", preparedData.city);
            console.log("matchesRegion", matchesRegion);
            return matchesCategory;
          });

          // Send notifications to all relevant provider user IDs
          for (const profile of relevantProfiles) {
            if (profile.user) {
              await notificationService.notifyServiceRequest(
                profile.user.id,
                "provider",
                createdRequest
              );
              console.log(
                `Notification sent to provider user ${profile.user} about new service request`
              );
            }
          }

          console.log(
            `Service request created, notifications sent to ${relevantProfiles.length} providers`
          );
        }
      } catch (notificationError) {
        console.error("Error sending notifications:", notificationError);
        // We don't want to fail the request creation if notifications fail
      }

      toast.success("Service request created successfully!");
      navigate("/requests");
    } catch (error) {
      console.error("Error submitting request:", error);
      const errorMessage =
        error.response?.data?.message ||
        Object.values(error.response?.data?.errors || {})
          .flat()
          .join(", ") ||
        "Failed to create service request";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
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
        isSubmitting={isSubmitting}
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
