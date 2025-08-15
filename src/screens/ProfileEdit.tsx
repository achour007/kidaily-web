import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '../store/slices/userSlice';
import { RootState } from '../store';
import './ProfileEdit.css';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profession?: string;
  organization?: string;
  bio?: string;
  language?: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfileEdit: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state: RootState) => state.user);
  
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profession: '',
    organization: '',
    bio: '',
    language: 'fr'
  });
  
  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile?.firstName || '',
        lastName: profile?.lastName || '',
        email: profile?.email || '',
        phone: profile?.phone || '',
        profession: profile?.profession || '',
        organization: profile?.organization || '',
        bio: profile?.bio || '',
        language: profile?.language || 'fr'
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      await dispatch(updateUserProfile(formData) as any);
      setMessage('✅ Profil mis à jour avec succès !');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      setMessage('❌ Erreur lors de la mise à jour du profil');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPasswordSubmitting(true);
    setPasswordMessage('');

    // Vérifier que les mots de passe correspondent
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage('❌ Les mots de passe ne correspondent pas');
      setIsPasswordSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/users/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordMessage('✅ Mot de passe modifié avec succès !');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setPasswordMessage(`❌ ${data.error || 'Erreur lors du changement de mot de passe'}`);
      }
    } catch (error) {
      setPasswordMessage('❌ Erreur de connexion');
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="profile-edit-container">
        <div className="loading">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="profile-edit-container">
      <div className="profile-edit-header">
        <h1>Modifier le profil</h1>
        <p>Mettez à jour vos informations personnelles</p>
      </div>

      {message && (
        <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="profile-edit-form">
        <div className="form-section">
          <h3>Informations personnelles</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">Prénom *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                placeholder="Votre prénom"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">Nom *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                placeholder="Votre nom"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="votre.email@exemple.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Téléphone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+41 79 123 45 67"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Informations professionnelles</h3>
          
          <div className="form-group">
            <label htmlFor="profession">Profession</label>
            <input
              type="text"
              id="profession"
              name="profession"
              value={formData.profession}
              onChange={handleInputChange}
              placeholder="Ex: Pédiatre, Psychologue, Éducateur..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="organization">Organisation</label>
            <input
              type="text"
              id="organization"
              name="organization"
              value={formData.organization}
              onChange={handleInputChange}
              placeholder="Ex: Hôpital, Cabinet privé, École..."
            />
          </div>
        </div>

        <div className="form-section">
          <h3>À propos</h3>
          
          <div className="form-group">
            <label htmlFor="bio">Biographie</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Parlez-nous de vous, de votre expérience..."
              rows={4}
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Préférences</h3>
          
          <div className="form-group">
            <label htmlFor="language">Langue de l'application</label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleInputChange}
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="de">Deutsch</option>
              <option value="it">Italiano</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3>Modifier le mot de passe</h3>
          
          {passwordMessage && (
            <div className={`message ${passwordMessage.includes('✅') ? 'success' : 'error'}`}>
              {passwordMessage}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="password-form">
            <div className="form-group">
              <label htmlFor="currentPassword">Mot de passe actuel *</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
                placeholder="Votre mot de passe actuel"
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">Nouveau mot de passe *</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                minLength={6}
                placeholder="Votre nouveau mot de passe"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmer le nouveau mot de passe *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                minLength={6}
                placeholder="Confirmez votre nouveau mot de passe"
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isPasswordSubmitting}
              >
                {isPasswordSubmitting ? 'Modification...' : 'Modifier le mot de passe'}
              </button>
            </div>
          </form>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={handleCancel}
            className="btn btn-secondary"
            disabled={isSubmitting}
          >
            Annuler
          </button>
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Mise à jour...' : 'Sauvegarder'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit; 