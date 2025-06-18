import { useState, useEffect } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import { FaUpload, FaTimes } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { IoInformationCircle } from "react-icons/io5";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default  function EditDonation({onClose, donation, passMessage}){
    const [formData, setFormData] = useState({
        donation_title: donation.donation_title || "",
        description: donation.description || "",
        target_amount: donation.target_amount || "",
        end_date: donation.end_date || "",
        photo: null,
        previewImage: null,
        fileName: donation.photo || "",
    });
    const donationId = donation.id; 
    const token = Cookies.get("adminToken");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

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
  useEffect(() => {
    console.log("Donation photo changed:", donation.photo);
  if (donation.photo && !formData.previewImage) {
    setFormData((prev) => ({
      ...prev,
      previewImage: `http://localhost:8000/storage/${donation.photo}`, // adjust if your URL is different
      fileName: donation.photo,
    }));
  }
}, [donation.photo]);


    const handleSubmit = (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append("donation_title", formData.donation_title);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("target_amount", formData.target_amount);
        formDataToSend.append("end_date", formData.end_date);
        formDataToSend.append("_method", "PUT");
        if (formData.photo) {
            formDataToSend.append("photo", formData.photo);
        }

        axios.post(`http://localhost:8000/api/edit_donation_post/${donationId}`, formDataToSend, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        })
        .then(response => {
           toast.success("Donation updated successfully");
                setTimeout(() => {
                  onClose();
                  passMessage();
                }, 1000);
            console.log("Donation updated successfully:", response.data);
        })
        .catch(error => {
            console.error("Error updating donation:", error);
            toast.error("Failed to Edit donation");
        });
    }

    return (
    <div className="flex flex-col justify-between h-full">
      <form onSubmit={handleSubmit} className="flex flex-col justify-between h-full">
        <div className="space-y-2 ">
            <div className="flex items-center justify-between mb-4">
                <h1 className="font-bold text-2xl flex gap-2 items-center">
                Edit Donation
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
            <label className="block font-medium text-gray-700 mb-1">
              Donation Image
            </label>

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
            Save & Change
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