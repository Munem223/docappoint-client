import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Search } from 'lucide-react';

const AllAppointments = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const apiUrl = 'https://docappoint-server-pfb3.onrender.com';
        const res = await axios.get(`${apiUrl}/api/doctors`);
        setDoctors(res.data);
        setFilteredDoctors(res.data);
      } catch (err) {
        console.error("Failed to fetch doctors", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Search
  useEffect(() => {
    const filtered = doctors.filter(doctor =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDoctors(filtered);
  }, [searchTerm, doctors]);

  const handleViewDetails = (doctorId) => {
    if (user) {
      navigate(`/doctor/${doctorId}`);
    } else {
      navigate('/login');
    }
  };

  if (loading) return <p className="text-center text-xl py-20">Loading doctors...</p>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">All Doctors</h1>
        
        <div className="relative mt-4 md:mt-0 w-full md:w-80">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by doctor name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 border border-gray-300 rounded-3xl focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredDoctors.map(doctor => (
          <div key={doctor._id} className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all">
            <img src={doctor.image} alt={doctor.name} className="w-full h-64 object-cover" />
            <div className="p-6">
              <h3 className="text-2xl font-semibold">{doctor.name}</h3>
              <p className="text-blue-600 font-medium">{doctor.specialty}</p>
              <div className="mt-6 flex justify-between items-center">
                <div>
                  <span className="text-sm text-gray-500">Fee</span>
                  <p className="text-3xl font-bold text-green-600">৳{doctor.fee}</p>
                </div>
                <button
                  onClick={() => handleViewDetails(doctor._id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-medium transition"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllAppointments;