import React, { useState } from 'react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Imane Elbar',
    email: 'imane.elbar@example.com',
    phone: '+213 555 123 456',
    organization: 'AI Prediction Co.',
  });

  const [image, setImage] = useState(null);

  const stats = {
    predictions: 3542,
    subscriptions: 2,
    reports: 17,
  };

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 ml-[200px] p-6">
      {/* Sidebar Profile Image */}
      <div className="w-1/5 pr-6">
        <div
          className={`w-40 h-40 rounded-full overflow-hidden shadow-lg border-4 border-white bg-gray-200 cursor-pointer ${
            isEditing ? 'hover:opacity-80 transition' : ''
          }`}
          onClick={() => isEditing && document.getElementById('upload').click()}
        >
          {image ? (
            <img
              src={image}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-4xl text-white bg-teal-700">
              {profileData.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()}
            </div>
          )}
        </div>
        <input
          id="upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
        <p className="mt-4 text-lg font-semibold text-gray-700">{profileData.name}</p>
        <p className="text-sm text-gray-500">{profileData.organization}</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Top Right Stats */}
        <div className="flex justify-end gap-6 mb-10">
          {Object.entries(stats).map(([label, value]) => (
            <div
              key={label}
              className="bg-white rounded-lg shadow p-4 w-40 text-center"
            >
              <p className="text-sm text-gray-500 capitalize">{label}</p>
              <p className="text-xl font-bold text-teal-700">{value}</p>
            </div>
          ))}
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-lg shadow p-6 max-w-3xl mx-auto">
          <h1 className="text-2xl font-semibold mb-6 text-teal-700">Profile Details</h1>
          <form className="space-y-4">
            {['name', 'email', 'phone', 'organization'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {field}
                </label>
                <input
                  name={field}
                  value={profileData[field]}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:ring-teal-500 focus:border-teal-500 disabled:bg-gray-100"
                />
              </div>
            ))}
          </form>

          <div className="mt-6 text-right">
            <button
              type="button"
              className="bg-teal-700 text-white px-6 py-2 rounded hover:bg-teal-800 transition"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Save Changes' : 'Modify Profile'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
