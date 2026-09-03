import React, { useState } from "react";
import "../../styles/Profile.css";

function Profile() {

  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "Citizen Name",
    email: "citizen@example.com",
    phone: "9876543210",
    address: "Citizen Address",
  });

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    setIsEditing(false);

    // Backend API integration will be added here
    console.log("Updated Profile:", profile);
  };

  return (
    <div className="profile-page">

      <div className="profile-container">

        <div className="profile-header">
          <h1>My Profile</h1>
          <p>Manage your personal information</p>
        </div>

        <div className="profile-card">

          {/* Profile Photo */}
          <div className="profile-photo-section">
            <div className="profile-photo">
              {profile.name.charAt(0).toUpperCase()}
            </div>

            <h2>{profile.name}</h2>
            <p>Citizen</p>
          </div>

          {/* Profile Information */}
          <div className="profile-information">

            <div className="profile-field">
              <label>Name</label>

              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                />
              ) : (
                <p>{profile.name}</p>
              )}
            </div>

            <div className="profile-field">
              <label>Email</label>

              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                />
              ) : (
                <p>{profile.email}</p>
              )}
            </div>

            <div className="profile-field">
              <label>Phone</label>

              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                />
              ) : (
                <p>{profile.phone}</p>
              )}
            </div>

            <div className="profile-field">
              <label>Address</label>

              {isEditing ? (
                <textarea
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                />
              ) : (
                <p>{profile.address}</p>
              )}
            </div>

          </div>

          {/* Buttons */}
          <div className="profile-actions">

            {isEditing ? (
              <>
                <button
                  className="save-profile-btn"
                  onClick={handleSave}
                >
                  Save Changes
                </button>

                <button
                  className="cancel-profile-btn"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                className="edit-profile-btn"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            )}

          </div>

        </div>
      </div>

    </div>
  );
}

export default Profile;