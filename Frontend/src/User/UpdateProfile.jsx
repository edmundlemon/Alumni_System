import { useState, useEffect, useMemo, useRef } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { FaUser } from "react-icons/fa";
import { PiUploadThin } from "react-icons/pi";
import Select from "react-select";
import countryList from "react-select-country-list";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Import profile images (preset picks)
import img from "../assets/profile/img_1.jpeg";
import img1 from "../assets/profile/img_2.jpeg";
import img2 from "../assets/profile/img_3.jpeg";
import img3 from "../assets/profile/img_4.jpeg";
import img4 from "../assets/profile/img_5.jpeg";
import img5 from "../assets/profile/img_6.jpeg";
import img6 from "../assets/profile/img_7.jpeg";
import img7 from "../assets/profile/img_8.jpeg";
import img8 from "../assets/profile/img_9.jpeg";
import img9 from "../assets/profile/img_10.jpeg";
import img10 from "../assets/profile/img_11.jpeg";
import img11 from "../assets/profile/img_12.jpeg";
import img12 from "../assets/profile/img_13.jpeg";
import img13 from "../assets/profile/img_14.jpeg";
import img14 from "../assets/profile/img_15.jpeg";

export default function UpdateProfile() {
  const profileImages = [
    img, img1, img2, img3, img4, img5, img6, img7,
    img8, img9, img10, img11, img12, img13, img14,
  ];

  const token = Cookies.get("token");
  const userId = Cookies.get("userId");
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [chnageUserData, setChangeUserData] = useState({
    image: "",
    imageFile: null,
    bio: "",
    phone: "",
    home_country: "",
    internationality: "",
    educationLevel: "",
    company: "",
    position: "",
    job_title: "",
  });

  const educationLevel = [
    { value: "undergraduate", label: "Undergraduate" },
    { value: "postgraduate", label: "Postgraduate" },
    { value: "phd", label: "PhD" },
  ];

  const internationality = [
    { value: "malaysia", label: "Malaysia" },
    { value: "non malaysia", label: "Non Malaysia" },
  ];

  const countryOptions = useMemo(() => countryList().getData(), []);
  const [showImagePicker, setShowImagePicker] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/view_user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data);

        setChangeUserData({
          image: response.data.image || "",
          imageFile: null,
          bio: response.data.bio || "",
          phone: response.data.phone || "",
          home_country: response.data.home_country || "",
          internationality: response.data.internationality || "",
          educationLevel: response.data.educationLevel || "",
          company: response.data.company || "",
          position: response.data.position || "",
          job_title: response.data.job_title || "",
        });
      } catch (error) {
        console.error("Error fetching alumni data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProfile();
  }, [token, userId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setChangeUserData((prev) => ({
          ...prev,
          image: reader.result,
          imageFile: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    const payload = new FormData();

    payload.append("bio", chnageUserData.bio);
    payload.append("phone", chnageUserData.phone);
    payload.append("home_country", chnageUserData.home_country);
    payload.append("internationality", chnageUserData.internationality);
    payload.append("educationLevel", chnageUserData.educationLevel);
    payload.append("company", chnageUserData.company);
    payload.append("position", chnageUserData.position);
    payload.append("job_title", chnageUserData.job_title);

    if (chnageUserData.imageFile) {
      payload.append("image", chnageUserData.imageFile);
    }

    try {
      const response = await axios.put(
        `http://localhost:8000/api/edit_users/${userId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Profile updated successfully:", response.data);
      setUser((prev) => ({ ...prev, ...chnageUserData }));
      alert("Profile updated!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Check console.");
    }
  };

  return (
    <div className="bg-[#f7f9f9] min-h-screen py-10">
      <section className="mx-20 border border-gray-300 bg-white py-7 rounded-lg shadow-lg">
        {/* Header and Image */}
        <div className="relative flex w-full items-center justify-center pb-6">
          <div className="w-44 h-44 rounded-full bg-blue-100 overflow-hidden border-4 border-blue-300 shadow">
            {loading ? (
              <Skeleton height="100%" width="100%" className="rounded-full" />
            ) : chnageUserData.image ? (
              <img
                src={chnageUserData.image}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white bg-blue-400">
                <FaUser size={100} />
              </div>
            )}
          </div>
          <h1 className="text-4xl font-semibold absolute top-0 left-10">
            {loading ? <Skeleton width={250} /> : "UPDATE PROFILE"}
          </h1>
        </div>

        {/* Upload Button */}
        {!loading && (
          <>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />

            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="px-8 py-2 rounded border text-base border-gray-300 gap-2 flex items-center"
              >
                <PiUploadThin size={20} /> Upload Image
              </button>
              <button
                type="button"
                className="px-8 py-2 rounded border text-base border-gray-300 gap-2 flex items-center"
                onClick={() => setShowImagePicker((prev) => !prev)}
              >
                <PiUploadThin size={20} /> Pick Image
              </button>
            </div>
          </>
        )}

        {/* Form Content */}
        {loading ? (
          <div className="px-10 mt-10">
            <Skeleton count={10} height={40} />
          </div>
        ) : (
          <form onSubmit={updateProfile}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-10">
              <Input label="Full Name" value={user?.name} readOnly />
              <Input label="Email Address" value={user?.email} readOnly />
              <Input
                label="Phone Number"
                value={chnageUserData.phone}
                onChange={(e) =>
                  setChangeUserData((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
              />
              <Input label="Role" value={user?.role} readOnly />

              <div className="flex flex-col gap-2">
                <label className="py-0">Internationality</label>
                <Select
                  options={internationality}
                  value={internationality.find(
                    (opt) => opt.value === chnageUserData.internationality
                  )}
                  onChange={(selected) =>
                    setChangeUserData((prev) => ({
                      ...prev,
                      internationality: selected.value,
                      home_country:
                        selected.value === "malaysia" ? "Malaysia" : "",
                    }))
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="py-0">Home Country</label>
                {chnageUserData.internationality === "malaysia" ? (
                  <input
                    type="text"
                    value="Malaysia"
                    readOnly
                    className="border border-gray-300 rounded px-4 py-2 bg-gray-100"
                  />
                ) : (
                  <Select
                    options={countryOptions}
                    value={countryOptions.find(
                      (c) => c.value === chnageUserData.home_country
                    )}
                    onChange={(selected) =>
                      setChangeUserData((prev) => ({
                        ...prev,
                        home_country: selected.value,
                      }))
                    }
                  />
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="py-0">Education Level</label>
                <Select
                  options={educationLevel}
                  value={educationLevel.find(
                    (opt) => opt.value === chnageUserData.educationLevel
                  )}
                  onChange={(selected) =>
                    setChangeUserData((prev) => ({
                      ...prev,
                      educationLevel: selected.value,
                    }))
                  }
                />
              </div>

              <Input label="Major" value={user?.major_name} readOnly />
              <Input label="Faculty" value={user?.faculty} readOnly />
              <Input
                label="Company Name"
                value={chnageUserData.company}
                onChange={(e) =>
                  setChangeUserData((prev) => ({
                    ...prev,
                    company: e.target.value,
                  }))
                }
              />
              <Input
                label="Position"
                value={chnageUserData.position}
                onChange={(e) =>
                  setChangeUserData((prev) => ({
                    ...prev,
                    position: e.target.value,
                  }))
                }
              />
              <Input
                label="Job Title"
                value={chnageUserData.job_title}
                onChange={(e) =>
                  setChangeUserData((prev) => ({
                    ...prev,
                    job_title: e.target.value,
                  }))
                }
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-6 justify-end w-full font-semibold px-10 mt-7">
              <button
                type="button"
                className="px-6 py-2 rounded border border-gray-300"
                onClick={() => window.location.reload()}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-denim text-white font-semibold px-6 py-[6px] rounded"
              >
                Save & Change
              </button>
            </div>
          </form>
        )}

        {/* Image Picker Modal */}
        {showImagePicker && !loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg p-6 shadow-xl max-w-4xl w-full mx-4 relative">
              <h2 className="text-xl font-bold mb-4 text-center text-blue-900">
                Select a Profile Image
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 max-h-[400px] overflow-y-auto px-4">
                {profileImages.map((image, index) => (
                  <div className="flex items-center justify-center" key={index}>
                    <img
                      src={image}
                      alt={`Profile ${index + 1}`}
                      className={`w-24 h-24 object-cover rounded-full border-4 cursor-pointer transition-all duration-200 ${
                        chnageUserData.image === image
                          ? "border-blue-600 ring-2 ring-blue-300"
                          : "border-gray-300 hover:border-blue-400"
                      }`}
                      onClick={() =>
                        setChangeUserData((prev) => ({
                          ...prev,
                          image,
                          imageFile: null, // clear file input because this is a preset
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-4 mt-6 px-4">
                <button
                  className="px-6 py-2 rounded border border-gray-300 hover:bg-gray-100"
                  onClick={() => setShowImagePicker(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2 rounded bg-denim text-white hover:bg-blue-700"
                  onClick={() => setShowImagePicker(false)}
                >
                  Save & Change
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

// Reusable input component
function Input({ label, value, onChange = () => {}, readOnly = false }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="py-0">{label}</label>
      <input
        type="text"
        value={value || ""}
        onChange={onChange}
        readOnly={readOnly}
        className="border border-gray-300 rounded px-4 py-2"
      />
    </div>
  );
}
