import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Update booking modal state
  const [editingBooking, setEditingBooking] = useState(null);

  // Profile update state
  const [profileData, setProfileData] = useState({ name: '', photoURL: '' });

  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name, photoURL: user.photoURL });
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/appointments', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm('Delete this appointment?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/appointments/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Appointment deleted successfully!');
      fetchBookings();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const updateBooking = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/appointments/${editingBooking._id}`, editingBooking, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Appointment updated successfully!');
      setEditingBooking(null);
      fetchBookings();
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      // For simplicity we update localStorage (you can extend backend later if needed)
      const updatedUser = { ...user, ...profileData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      {/* Tabs */}
      <div className="flex border-b mb-8">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-8 py-4 font-medium ${activeTab === 'bookings' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-500'}`}
        >
          My Bookings
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-8 py-4 font-medium ${activeTab === 'profile' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-500'}`}
        >
          My Profile
        </button>
      </div>

      {/* My Bookings Tab */}
      {activeTab === 'bookings' && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">My Bookings</h2>
          {loading ? (
            <p>Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <p className="text-gray-500">No bookings yet.</p>
          ) : (
            <div className="grid gap-6">
              {bookings.map(booking => (
                <div key={booking._id} className="bg-white p-6 rounded-3xl shadow flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-xl">{booking.doctorName}</h3>
                    <p className="text-gray-600">{booking.patientName} • {booking.appointmentDate} at {booking.appointmentTime}</p>
                    <p className="text-sm text-gray-500">Phone: {booking.phone}</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setEditingBooking(booking)}
                      className="px-6 py-3 bg-yellow-500 text-white rounded-2xl hover:bg-yellow-600"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => deleteBooking(booking._id)}
                      className="px-6 py-3 bg-red-500 text-white rounded-2xl hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* My Profile Tab */}
      {activeTab === 'profile' && (
        <div className="max-w-md">
          <h2 className="text-2xl font-semibold mb-6">My Profile</h2>
          <form onSubmit={updateProfile} className="space-y-6 bg-white p-8 rounded-3xl shadow">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full px-5 py-4 border rounded-2xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email (cannot change)</label>
              <input type="email" value={user.email} disabled className="w-full px-5 py-4 border rounded-2xl bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Profile Photo URL</label>
              <input
                type="text"
                value={profileData.photoURL}
                onChange={(e) => setProfileData({ ...profileData, photoURL: e.target.value })}
                className="w-full px-5 py-4 border rounded-2xl"
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-3xl font-semibold hover:bg-blue-700">
              Update Profile
            </button>
          </form>
        </div>
      )}

      {/* Update Booking Modal */}
      {editingBooking && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-6">Update Appointment</h3>
            <form onSubmit={updateBooking}>
              <input
                type="text"
                value={editingBooking.patientName}
                onChange={(e) => setEditingBooking({ ...editingBooking, patientName: e.target.value })}
                className="w-full mb-4 px-4 py-3 border rounded-2xl"
                placeholder="Patient Name"
              />
              <input
                type="date"
                value={editingBooking.appointmentDate}
                onChange={(e) => setEditingBooking({ ...editingBooking, appointmentDate: e.target.value })}
                className="w-full mb-4 px-4 py-3 border rounded-2xl"
              />
              <input
                type="text"
                value={editingBooking.appointmentTime}
                onChange={(e) => setEditingBooking({ ...editingBooking, appointmentTime: e.target.value })}
                className="w-full mb-6 px-4 py-3 border rounded-2xl"
                placeholder="Time (e.g. 10:30 AM)"
              />
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