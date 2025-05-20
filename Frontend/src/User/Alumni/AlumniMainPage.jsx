import mapImage from '../../assets/alumni.jpeg'; 
import { FaSearch } from 'react-icons/fa';
import { useState, useEffect, use } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function AlumniMainPage() {
    const getInitial = (name = "") => name.charAt(0).toUpperCase();
    const [alumni, setAlumni] = useState([]);
    const token = Cookies.get('token');

    useEffect(() => {
        const fetchAlumni = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/view_all_alumni', {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('token')}`,
                    },
                });
                console.log(response.data);
                setAlumni(response.data);
            } catch (error) {
                console.error('Error fetching alumni data:', error);
            }
        };

        if (token) {
            fetchAlumni();
        }else{
            console.error('Token not found');
        }
    }, []);


    return(
        <section>
            {/* Banner */}
            <div
                className="relative w-full h-96 flex items-end"
                style={{ background: `url(${mapImage}) center/cover no-repeat` }}
            >
                <div className="absolute inset-0 bg-black/30" />
                    <div className="relative w-full max-w-7xl px-6 lg:px-20 pb-12">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-2">Alumni</h1>
                    <p className="text-xl text-white/90">
                        Connecting the Past, Inspiring the Future
                    </p>
                </div>
            </div>
            {/* Content */}
            <div className="px-20 mt-10 pb-12">
                {/* header row */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">Distinguished Alumni</h2>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search alumni…"
                            className="py-3 px-5 pr-12 border rounded-lg shadow-md w-[300px] sm:w-[420px] lg:w-[550px] focus:outline-denim"
                        />
                        <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                </div>

                <div className='grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
                    {alumni.map(alumni=>{
                        return(
                            <div
  key={alumni.id}
  className="bg-white shadow-lg border rounded-xl overflow-hidden p-6 flex flex-col items-center text-center transition hover:shadow-xl duration-300"
>
  {/* Profile Picture or Initials */}
  <div className="w-28 h-28 mb-4">
    {alumni.profile_picture ? (
      <img
        src={alumni.profile_picture}
        alt="profile"
        className="w-full h-full object-cover rounded-full border-4 border-blue-200 shadow-sm"
      />
    ) : (
      <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-3xl font-semibold">
        {getInitial(alumni?.name)}
      </div>
    )}
  </div>

  {/* Name */}
  <h3 className="text-xl font-semibold text-gray-800">{alumni.name}</h3>

  {/* Major / Faculty */}
  <p className="text-gray-500 text-sm mt-1">{alumni.major_name}</p>
  <p className="text-gray-400 text-sm">
    {alumni.major?.faculty_name || alumni.faculty}
  </p>

  {/* Graduation Year */}
  {alumni.graduation_year && (
    <p className="text-gray-500 text-sm mt-1">
      Class of {alumni.graduation_year}
    </p>
  )}

  {/* Job Details (if available) */}
  {(alumni.job_title || alumni.position || alumni.company) && (
    <div className="mt-3">
      {alumni.job_title && (
        <p className="text-blue-800 font-medium text-sm">
          {alumni.job_title}
        </p>
      )}
      {alumni.position && (
        <p className="text-blue-700 text-sm">{alumni.position}</p>
      )}
      {alumni.company && (
        <p className="text-gray-600 text-sm">{alumni.company}</p>
      )}
    </div>
  )}

  {/* Optional Email / Phone / Bio */}
  {alumni.bio && (
    <p className="mt-3 text-sm text-gray-500 line-clamp-3">{alumni.bio}</p>
  )}
</div>

                        )
                    })}
                </div>
            </div>
        </section>
    )
}