import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Star } from 'lucide-react';

const Home = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        console.log("Fetching doctors from:", apiUrl);   // for debugging
        const res = await axios.get(`${apiUrl}/api/doctors`);
        console.log("Doctors received:", res.data);
        setDoctors(res.data.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleViewDetails = (doctorId) => {
    if (user) {
      navigate(`/doctor/${doctorId}`);
    } else {
      navigate('/login');
    }
  };

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative h-screen bg-gradient-to-r from-blue-900 to-blue-700 flex items-center justify-center text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h1 className="text-6xl font-bold mb-6">Book Your Doctor Appointment</h1>
          <p className="text-2xl mb-10">Instant, Secure & Hassle-Free Booking</p>
          <Link 
            to="/all-appointments" 
            className="bg-white text-blue-700 px-10 py-4 rounded-2xl text-xl font-semibold hover:bg-gray-100 transition"
          >
            Browse Doctors
          </Link>
        </div>
      </div>

      {/* Top Rated Doctors */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-4">Top Rated Doctors</h2>
        <p className="text-center text-gray-600 mb-12">Highly recommended by our patients</p>

        {loading ? (
          <p className="text-center text-xl">Loading doctors...</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {(doctors || []).map((doctor) => (
              <div key={doctor._id} className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all">
                <img 
                  src={doctor.image || "https://picsum.photos/id/1005/800/600"} 
                  alt={doctor.name} 
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-semibold">{doctor.name}</h3>
                      <p className="text-blue-600">{doctor.specialty}</p>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star size={20} fill="currentColor" />
                      <span className="font-bold">{doctor.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-4 line-clamp-3">{doctor.description}</p>
                  <div className="mt-6 flex justify-between items-center">
                    <div>
                      <span className="text-sm text-gray-500">Fee</span>
                      <p className="text-2xl font-bold text-green-600">৳{doctor.fee}</p>
                    </div>
                    <button
                      onClick={() => handleViewDetails(doctor._id)}
                      className="bg-blue-600 text-white px-8 py-3 rounded-2xl hover:bg-blue-700 transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;