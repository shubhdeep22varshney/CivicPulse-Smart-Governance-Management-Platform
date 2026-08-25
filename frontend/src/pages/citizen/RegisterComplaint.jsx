import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/RegisterComplaint.css";

function RegisterComplaint() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    priority: "Low",
    departmentId: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    "Street Light",
    "Road",
    "Water",
    "Sanitation",
    "Garbage",
    "Drainage",
    "Electricity",
    "Other",
  ];

  const departments = [
    {
      id: 7,
      name: "Electricity Department",
    },
    {
      id: 8,
      name: "Road Department",
    },
    {
      id: 9,
      name: "Water Department",
    },
    {
      id: 10,
      name: "Sanitation Department",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      submit: "",
    }));

    setSuccessMessage("");
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Complaint title is required.";
    }

    if (!formData.description.trim()) {
      newErrors.description =
        "Complaint description is required.";
    } else if (formData.description.trim().length < 10) {
      newErrors.description =
        "Description must be at least 10 characters.";
    }

    if (!formData.category) {
      newErrors.category =
        "Please select a complaint category.";
    }

    if (!formData.location.trim()) {
      newErrors.location =
        "Location is required.";
    }

    if (!formData.priority) {
      newErrors.priority =
        "Please select priority.";
    }

    if (!formData.departmentId) {
      newErrors.departmentId =
        "Please select a department.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});
    setSuccessMessage("");

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Get logged-in citizen
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        throw new Error(
          "Citizen information not found. Please login again."
        );
      }

      const user = JSON.parse(storedUser);

      /*
       * Your login response should contain the citizen ID.
       * Common possibilities:
       * user.id
       * user.citizenId
       */
      const citizenId =
        user.citizenId || user.id;

      if (!citizenId) {
        throw new Error(
          "Citizen ID not found. Please login again."
        );
      }

      const complaintData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        location: formData.location.trim(),
        priority: formData.priority,
        citizenId: Number(citizenId),
        status: "PENDING",
        departmentId: Number(formData.departmentId),
      };

      console.log(
        "Complaint data:",
        complaintData
      );

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8081/api/complaints",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && {
              Authorization: `Bearer ${token}`,
            }),
          },
          body: JSON.stringify(complaintData),
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to register complaint."
        );
      }

      console.log(
        "Complaint registered successfully:",
        data
      );

      setSuccessMessage(
        "Complaint registered successfully!"
      );

      setFormData({
        title: "",
        description: "",
        category: "",
        location: "",
        priority: "Low",
        departmentId: "",
      });

    } catch (error) {
      console.error(
        "Complaint registration error:",
        error
      );

      if (error instanceof TypeError) {
        setErrors({
          submit:
            "Unable to connect to the server. Please make sure the Spring Boot backend is running on port 8081.",
        });
      } else {
        setErrors({
          submit:
            error.message ||
            "Unable to register complaint.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-complaint-page">
      <Navbar />

      <main className="register-complaint-container">

        {/* Header */}
        <section className="complaint-header">
          <span className="complaint-badge">
            📝 Citizen Portal
          </span>

          <h1>Register a Complaint</h1>

          <p>
            Report a civic issue and submit it to the
            concerned department.
          </p>
        </section>

        {/* Form */}
        <section className="complaint-form-card">

          {successMessage && (
            <div className="success-box">
              ✅ {successMessage}
            </div>
          )}

          {errors.submit && (
            <div className="error-box">
              {errors.submit}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            noValidate
          >

            {/* Title */}
            <div className="form-group">
              <label htmlFor="title">
                Complaint Title
              </label>

              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Street Light Not Working"
              />

              {errors.title && (
                <span className="error-text">
                  {errors.title}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the civic issue in detail..."
                rows="5"
              />

              {errors.description && (
                <span className="error-text">
                  {errors.description}
                </span>
              )}
            </div>

            {/* Category */}
            <div className="form-group">
              <label htmlFor="category">
                Category
              </label>

              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">
                  Select Category
                </option>

                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </select>

              {errors.category && (
                <span className="error-text">
                  {errors.category}
                </span>
              )}
            </div>

            {/* Location */}
            <div className="form-group">
              <label htmlFor="location">
                Location
              </label>

              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Ghaziabad"
              />

              {errors.location && (
                <span className="error-text">
                  {errors.location}
                </span>
              )}
            </div>

            {/* Priority */}
            <div className="form-group">
              <label htmlFor="priority">
                Priority
              </label>

              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="Low">
                  Low
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="High">
                  High
                </option>
              </select>

              {errors.priority && (
                <span className="error-text">
                  {errors.priority}
                </span>
              )}
            </div>

            {/* Department */}
            <div className="form-group">
              <label htmlFor="departmentId">
                Department
              </label>

              <select
                id="departmentId"
                name="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
              >
                <option value="">
                  Select Department
                </option>

                {departments.map((department) => (
                  <option
                    key={department.id}
                    value={department.id}
                  >
                    {department.name}
                  </option>
                ))}
              </select>

              {errors.departmentId && (
                <span className="error-text">
                  {errors.departmentId}
                </span>
              )}
            </div>

            {/* Buttons */}
            <div className="complaint-form-actions">

              <button
                type="button"
                className="btn-cancel"
                onClick={() =>
                  navigate(
                    "/citizen/dashboard"
                  )
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn-submit"
                disabled={isLoading}
              >
                {isLoading
                  ? "Submitting..."
                  : "Submit Complaint"}
              </button>

            </div>

          </form>
        </section>

      </main>

      <Footer />
    </div>
  );
}

export default RegisterComplaint;