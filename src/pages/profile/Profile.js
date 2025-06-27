import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axiosClient from "../../api/axiosClient";
import "./Profile.css";

const Profile = () => {
  //get the user object from authentication context
  const { user } = useAuth();

  // State to hold the form data
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");


  // fetch current user's profile when the page loads
  useEffect(() => {
    const fetchProfile = async () => {
      // can only fetch if the user object exists
      if (user) {
        try {
          const response = await axiosClient.get("/profile");
          setProfileData(response.data);
        } catch (err) {
          console.err("Failed to fetch profile", err);
          setError("Could not load your profile. Please try again later.");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError("Could not identify user. Please log in again.");
      }
    };

    fetchProfile();
  }, [user]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

    const handleUpdateProfile = async (event) => {
        // prevent the default page reload
        event.preventDefault();

        // use reportValidity() on the form to check AND show errors
        // if the form is invalid, this shows the UI popups and returns false
        const isFormValid = event.currentTarget.reportValidity();

        // if the form is not valid, stop right here
        if (!isFormValid) {
            return;
        }

        // this code will ONLY run if all fields are valid
        setError('');
        setSuccessMessage('');
        try {
            await axiosClient.put('/profile', profileData);
            setSuccessMessage("Profile updated successfully!");
        } catch (err) {
            console.error("Failed to update profile:", err);
            setError("Update failed. Please try again.");
        }
    };

  if (loading) {
    return <div className="loading-message">Loading your profile...</div>;
  }

  return (
    <div className="profile-container">
      <form onSubmit={handleUpdateProfile} className="profile-form" noValidate>
        <h2>Your Profile</h2>

        <div className="input-group">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            placeholder="Enter your first name"
            value={profileData.firstName || ""}
            onChange={handleInputChange}
          />
        </div>

        <div className="input-group">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            placeholder="Enter your last name"
            value={profileData.lastName || ""}
            onChange={handleInputChange}
          />
        </div>

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={profileData.email || ""}
            onChange={handleInputChange}
            //use regex pattern for validation
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            // show error message how to fix if bad input
            title="Please enter a valid email address (e.g., user@example.com)"
          />
        </div>

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={profileData.email || ""}
            onChange={handleInputChange}
          />
        </div>

        <div className="input-group">
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            placeholder="e.g., 123-456-7890"
            value={profileData.phone || ""}
            onChange={handleInputChange}
            //use regex pattern for validation
            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
            // show error message how to fix if bad input
            title="Phone number must be in the format 123-456-7890"
          />
        </div>

        <div className="input-group">
          <label>Address</label>
          <input
            type="tel"
            name="address"
            placeholder="Enter your address"
            value={profileData.address || ""}
            onChange={handleInputChange}
          />
        </div>

        <div className="input-group">
          <label>City</label>
          <input
            type="text"
            name="city"
            placeholder="Enter your city"
            value={profileData.city || ""}
            onChange={handleInputChange}
          />
        </div>

        <div className="input-group">
          <label>State</label>
          <input
            type="text"
            name="state"
            placeholder="Enter your state"
            value={profileData.state || ""}
            onChange={handleInputChange}
          />
        </div>

        <div className="input-group">
          <label>Zip</label>
          <input
            type="text"
            name="zip"
            placeholder="Enter your zip code"
            value={profileData.zip || ""}
            onChange={handleInputChange}
          />
        </div>

        {successMessage && <p className="success-message">{successMessage}</p>}
        {error && <p className="error-message">{error}</p>}

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;
