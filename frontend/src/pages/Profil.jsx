import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    phone: '',
    company_name: '',
    business_type: '',
    subscription_type: '',
    is_subscription_active: false,
    predictions_count: 0
  });

  const [image, setImage] = useState(null);
  const [stats, setStats] = useState({
    predictions: 0,
    subscriptions: 0,
    reports: 0
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await api.get('/auth/profile/');
      const userData = response.data;
      
      setProfileData({
        username: userData.username || '',
        email: userData.email || '',
        phone: userData.phone || '',
        company_name: userData.company_name || '',
        business_type: userData.business_type || '',
        subscription_type: userData.subscription_type || '',
        is_subscription_active: userData.is_subscription_active || false,
        predictions_count: userData.predictions_count || 0
      });

      setStats({
        predictions: userData.predictions_count || 0,
        subscriptions: userData.subscription_type !== 'FREE' ? 1 : 0,
        reports: 0
      });
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/profile/', {
        username: profileData.username,
        email: profileData.email,
        phone: profileData.phone,
        company_name: profileData.company_name,
        business_type: profileData.business_type
      });
      alert('Profil mis à jour !');
      setIsEditing(false);
      fetchProfileData();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) fetchProfileData();
  };

  const getSubscriptionDisplayName = () => {
    const subscriptionMap = {
      'FREE': 'Essai Gratuit',
      'BASIC_MONTHLY': 'Basique Mensuel',
      'PREMIUM_MONTHLY': 'Premium Mensuel',
      'BASIC_ANNUAL': 'Basique Annuel',
      'PREMIUM_ANNUAL': 'Premium Annuel'
    };
    return subscriptionMap[profileData.subscription_type] || 'Aucun Abonnement';
  };

  return (
    <div className="flex min-h-screen bg-gray-100 px-6">
      <div className="w-1/5 pr-6">
        <div
          className={`w-40 h-40 rounded-full overflow-hidden shadow-lg border-4 border-white bg-gray-200 cursor-pointer ${
            isEditing ? 'hover:opacity-80 transition' : ''
          }`}
          onClick={() => isEditing && document.getElementById('upload').click()}
        >
          {image ? (
            <img src={image} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-4xl text-white bg-teal-700">
              {profileData.username.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
          )}
        </div>
        <input id="upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        <p className="mt-4 text-lg font-semibold text-gray-700">{profileData.username}</p>
        <p className="text-sm text-gray-500">{profileData.company_name}</p>
        
        <div className="mt-4 p-3 bg-white rounded shadow">
          <p className="text-sm font-medium">Abonnement:</p>
          <p className="text-teal-700">{getSubscriptionDisplayName()}</p>
          <p className="text-xs mt-1">
            {profileData.is_subscription_active ? (
              <span className="text-green-600">Actif</span>
            ) : (
              <span className="text-red-600">Inactif</span>
            )}
          </p>
          <p className="text-xs">Prédictions: {profileData.predictions_count}</p>
        </div>
      </div>

      <div className="flex-1 p-6">
        <div className="flex justify-end gap-6 mb-10">
          {Object.entries(stats).map(([label, value]) => (
            <div key={label} className="bg-white rounded-lg shadow p-4 w-40 text-center">
              <p className="text-sm text-gray-500 capitalize">{label}</p>
              <p className="text-xl font-bold text-teal-700">{value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow p-6 max-w-3xl mx-auto">
          <h1 className="text-2xl font-semibold mb-6 text-teal-700">Profil</h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {['username', 'email', 'phone', 'company_name', 'business_type'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {field.replace('_', ' ')}
                </label>
                <input
                  name={field}
                  value={profileData[field] || ''}
                  onChange={handleChange}
                  disabled={!isEditing || field === 'email'}
                  className={`mt-1 block w-full rounded-md border px-4 py-2 shadow-sm focus:ring-teal-500 focus:border-teal-500 ${
                    !isEditing || field === 'email' ? 'bg-gray-100' : 'bg-white'
                  }`}
                />
              </div>
            ))}
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Type d'abonnement</label>
              <input
                value={getSubscriptionDisplayName()}
                readOnly
                className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm bg-gray-100"
              />
            </div>

            <div className="mt-6 text-right">
              <button
                type="button"
                className="bg-teal-700 text-white px-6 py-2 rounded hover:bg-teal-800 transition"
                onClick={handleEditToggle}
              >
                {isEditing ? 'Annuler' : 'Modifier Profil'}
              </button>

              {isEditing && (
                <button
                  type="submit"
                  className="ml-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
                >
                  Enregistrer
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
