import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/useAuthStore';
import { getProfile, updateProfile } from '../../api/auth';
import { formatPhone } from '../../utils/formatters';
import { ru } from '../../i18n/ru';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getProfile()
      .then((res) => {
        setName(res.data.name || '');
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ name });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // TODO: error
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="max-w-sm mx-auto p-4">
      <h1 className="text-2xl font-bold text-primary mb-6">{ru.profile.title}</h1>

      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-4xl">
            👤
          </div>
        </div>

        <Input
          label={ru.profile.name}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ваше имя"
        />

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">{ru.profile.phone}</label>
          <p className="text-primary font-medium">{formatPhone(user?.phone || '')}</p>
        </div>

        <Button fullWidth onClick={handleSave} loading={saving}>
          {saved ? 'Сохранено!' : ru.profile.save}
        </Button>

        <Button fullWidth variant="ghost" onClick={handleLogout}>
          {ru.profile.logout}
        </Button>
      </div>
    </div>
  );
};
