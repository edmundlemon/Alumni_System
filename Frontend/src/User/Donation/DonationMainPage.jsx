import donation from "../../assets/donation.png";
import { useState, useEffect, use } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function DonationMainPage() {
    const navigate = useNavigate();
    const [donationData, setDonationData] = useState([]);
    const token = Cookies.get("token");

    useEffect(() => {
        const fetchDonationData = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/view_all_donations", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setDonationData(response.data);
            } catch (error) {
                console.error("Error fetching donation data:", error);
            }
        };

        if (token) {
            fetchDonationData();
        } else {
            console.log("Token not found");
            navigate("/userLogin");
        }
    }, []);

    return (
        <section className="">
            <div
                className="relative w-full h-96 flex items-end"
                style={{
                    backgroundImage: `url(${donation})`,
                    backgroundSize: 'cover',         // Ensures image fills the area
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center'
                }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                <div className="relative w-full max-w-7xl px-6 lg:px-20 pb-12">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-2">Donations</h1>
                    <p className="text-xl text-white/90">
                        Your Kindness Makes a Difference and Be the Reason Someone Smiles Today
                    </p>
                </div>
            </div>

            <div className="px-20 mt-10">
                <h1 className="text-3xl font-bold text-gray-800 capitalize">
                Featured Programs
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">

                </div>
            </div>
        </section>
    );
}
