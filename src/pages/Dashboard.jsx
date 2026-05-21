import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'https://docappoint-server-pfb3.onrender.com';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBooking, setEditingBooking] = useState(null);

  // Fetch bookings
  useEffect(() => {
    if (!user) return;
    const fetchBookings = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/appointments`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setBookings(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  const deleteBooking = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;
    try {
      await axios.delete(`${API_URL}/api/appointments/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success("Appointment deleted successfully!");
      setBookings(bookings.filter(b => b._id !== id));
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const updateBooking = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/api/appointments/${editingBooking._id}`, editingBooking, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success("Appointment updated successfully!");
      setEditingBooking(null);
      // Refresh list
      const { data } = await axios.get(`${API_URL}/api/appointments`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setBookings(data);
    } catch (err) {
      toast.error("Failed to update");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      <div className="flex border-b mb-8">
        <button onClick={() => setActiveTab('bookings')} className={`px-8 py-4 font-medium ${activeTab === 'bookings' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-500'}`}>
          My Bookings
        </button>
        <button onClick={() => setActiveTab('profile')} className={`px-8 py-4 font-medium ${activeTab === 'profile' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-500'}`}>
          My Profile
        </button>
      </div>

      {/* My Bookings */}
      {activeTab === 'bookings' && (
        <div>
          {loading ? (
            <p>Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <p className="text-gray-500">No bookings found.</p>
          ) : (
            <div className="space-y-6">
              {bookings.map(booking => (
                <div key={booking._id} className="bg-white p-6 rounded-3xl shadow flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-xl">{booking.doctorName}</h3>
                    <p className="text-gray-600">{booking.patientName} • {booking.appointmentDate} at {booking.appointmentTime}</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setEditingBooking(booking)} className="px-6 py-3 bg-yellow-500 text-white rounded-2xl hover:bg-yellow-600">Update</button>
                    <button onClick={() => deleteBooking(booking._id)} className="px-6 py-3 bg-red-500 text-white rounded-2xl hover:bg-red-600">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* My Profile */}
      {activeTab === 'profile' && user && (
        <div className="max-w-md bg-white p-8 rounded-3xl shadow">
          <h2 className="text-2xl font-semibold mb-6">My Profile</h2>
          <img src={user.photoURL} alt="Profile" className="w-24 h-24 rounded-full mb-6" />
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      )}

      {/* Update Modal */}
      {editingBooking && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-6">Update Appointment</h3>
            <form onSubmit={updateBooking}>
              <input type="text" value={editingBooking.patientName} onChange={(e) => setEditingBooking({...editingBooking, patientName: e.target.value})} className="w-full mb-4 p-4 border rounded-2xl" />
              <input type="date" value={editingBooking.appointmentDate} onChange={(e) => setEditingBooking({...editingBooking, appointmentDate: e.target.value})} className="w-full mb-4 p-4 border rounded-2xl" />
              <input type="text" value={editingBooking.appointmentTime} onChange={(e) => setEditingBooking({...editingBooking, appointmentTime: e.target.value})} className="w-full mb-6 p-4 border rounded-2xl" />
              <div className="flex gap-4">
                <button type="button" onClick={() => setEditingBooking(null)} className="flex-1 py-4 border rounded-3xl">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-3xl">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;