import { useState } from "react";
import { FaUpload, FaTimes } from "react-icons/fa";
import { IoClose, IoInformationCircle } from "react-icons/io5";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Cookies from "js-cookie";

export default function AddDonation({ onClose, passMessage}) {
  const token = Cookies.get("adminToken");
  const [formData, setFormData] = useState({
    donation_title: "",
    description: "",
    target_amount: "",
    end_date: "",
    photo: null,
    previewImage: null,
    fileName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const donationForm = new FormData();
    donationForm.append("donation_title", formData.donation_title);
    donationForm.append("description", formData.description);
    donationForm.append("target_amount", formData.target_amount);
    donationForm.append("end_date", formData.end_date);
    if (formData.photo) {
      donationForm.append("image", formData.photo);
    }

    console.log("FormData donationForm:");
    for (let [key, value] of donationForm.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/create_donation_post",
        donationForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data)
      toast.success("Donation added successfully");
      setTimeout(() => {
        onClose();
        passMessage();
      }, 3000);
      
    } catch (error) {
      console.error("Error adding donation:", error);
      toast.error("Failed to add donation");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        photo: file,
        previewImage: URL.createObjectURL(file),
        fileName: file.name,
      }));
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      photo: null,
      previewImage: null,
      fileName: "",
    }));
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <form onSubmit={handleSubmit} className="flex flex-col justify-between h-full">
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-bold text-2xl flex gap-2 items-center">
              Create Donation
              <div className="relative group">
                <IoInformationCircle className="text-blue-900 cursor-pointer" />
                <div className="absolute -top-2 left-8 w-64 z-50 hidden group-hover:block">
                  <div className="bg-blue-50 text-blue-800 p-3 rounded-md shadow-lg text-sm">
                    <h3 className="font-semibold mb-1">Tips for Success</h3>
                    <ul className="list-disc list-inside text-xs space-y-1">
                      <li>Set a clear, compelling title</li>
                      <li>Explain how donations will be used</li>
                      <li>Add an engaging image</li>
                      <li>Set a realistic target amount</li>
                    </ul>
                  </div>
                </div>
              </div>
            </h1>
            <IoClose className="cursor-pointer text-2xl" onClick={onClose} />
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">Title</label>
            <input
              type="text"
              name="donation_title"
              value={formData.donation_title}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1 text-gray-700">Target Amount</label>
              <input
                type="number"
                name="target_amount"
                value={formData.target_amount}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-gray-700">End Date</label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Donation Image</label>
            {formData.previewImage ? (
              <div className="relative">
                <img
                  src={formData.previewImage}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-md border"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                >
                  <FaTimes className="text-gray-600" />
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  Selected file: {formData.fileName}
                </p>
              </div>
            ) : (
              <label className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer block">
                <div className="flex flex-col items-center h-32 justify-center">
                  <FaUpload className="text-gray-400 mb-2" size={24} />
                  <p className="text-sm text-gray-600">Click to upload image</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            type="button"
            className="bg-gray-300 hover:bg-gray-500 text-white px-4 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md"
          >
            Create Donation
          </button>
        </div>
      </form>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        toastClassName={(context) =>
          `Toastify__toast bg-white shadow-md rounded text-black flex w-auto px-4 py-6 !min-w-[400px]`
        }
      />
    </div>
  );
}
