import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'https://docappoint-server-pfb3.onrender.com';

const DoctorDetails = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patientName: '',
    gender: 'Male',
    phone: '',
    appointmentDate: '',
    appointmentTime: ''
  });

  useEffect(() => {
    axios.get(`${API_URL}/api/doctors/${id}`)
      .then(res => {
        setDoctor(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleBookClick = () => {
    if (!user) {
      toast.error('Please login to book an appointment');
      navigate('/login');
      return;
    }
    setShowModal(true);
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/appointments`, {
        ...formData,
        doctorName: doctor.name
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      toast.success('Appointment booked successfully!');
      setShowModal(false);
      setFormData({ patientName: '', gender: 'Male', phone: '', appointmentDate: '', appointmentTime: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    }
  };

  if (loading) return <p className="text-center text-2xl mt-20">Loading doctor details...</p>;
  if (!doctor) return <p className="text-center text-2xl mt-20 text-red-500">Doctor not found</p>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <img src={doctor.image} alt={doctor.name} className="w-full rounded-3xl shadow-2xl" />
          <div className="mt-8 bg-white p-6 rounded-3xl shadow">
            <h3 className="text-xl font-semibold mb-4">Availability</h3>
            {doctor.availability && doctor.availability.map((time, index) => (
              <p key={index} className="bg-gray-100 px-4 py-2 rounded-2xl inline-block mr-3 mb-3">
                {time}
              </p>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-5xl font-bold">{doctor.name}</h1>
          <p className="text-2xl text-blue-600 mt-2">{doctor.specialty}</p>
          
          <div className="flex items-center gap-2 mt-6">
            <span className="text-3xl font-bold text-green-600">৳{doctor.fee}</span>
            <span className="text-gray-500">per consultation</span>
          </div>

          <p className="mt-8 text-gray-700 leading-relaxed">{doctor.description}</p>

          <div className="mt-8 grid grid-cols-2 gap-6 text-sm">
            <div>
              <span className="font-medium">Experience:</span>
              <p className="text-lg">{doctor.experience}</p>
            </div>
            <div>
              <span className="font-medium">Hospital:</span>
              <p className="text-lg">{doctor.hospital}</p>
            </div>
            <div>
              <span className="font-medium">Location:</span>
              <p className="text-lg">{doctor.location}</p>
            </div>
          </div>

          <button
            onClick={handleBookClick}
            className="mt-12 w-full bg-blue-600 hover:bg-blue-700 text-white text-xl py-6 rounded-3xl font-semibold transition"
          >
            Book Appointment
          </button>
        </div>
      </div>

      {/* Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full mx-4 overflow-hidden">
            <div className="p-8">
              <h2 className="text-3xl font-bold text-center mb-8">Book with {doctor.name}</h2>
              
              <form onSubmit={handleSubmitBooking} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Patient Name</label>
                  <input
                    type="text"
                    value={formData.patientName}
                    onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                    className="w-full px-5 py-4 border rounded-2xl focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      className="w-full px-5 py-4 border rounded-2xl"
                    >
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-5 py-4 border rounded-2xl focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Date</label>
                    <input
                      type="date"
                      value={formData.appointmentDate}
                      onChange={(e) => setFormData({...formData, appointmentDate: e.target.value})}
                      className="w-full px-5 py-4 border rounded-2xl focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Time</label>
                    <input
                      type="text"
                      value={formData.appointmentTime}
                      onChange={(e) => setFormData({...formData, appointmentTime: e.target.value})}
                      className="w-full px-5 py-4 border rounded-2xl focus:outline-none focus:border-blue-500"
                      placeholder="10:30 AM"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-5 border border-gray-300 rounded-3xl font-medium hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-5 rounded-3xl font-medium hover:bg-blue-700"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDetails;