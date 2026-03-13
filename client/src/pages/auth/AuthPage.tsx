import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneInput } from '../../components/ui/PhoneInput';
import { Button } from '../../components/ui/Button';
import { useRegister } from '../../api/hooks/useAuth';
import { useAuthStore } from '../../store/useAuthStore';
import { isValidPhone } from '../../utils/validators';
import { ru } from '../../i18n/ru';

export const AuthPage: React.FC = () => {
  const [phone, setPhone] = useState('+992');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const registerMutation = useRegister();
  const setStorePhone = useAuthStore((s) => s.setPhone);

  const handleSubmit = async () => {
    if (!isValidPhone(phone)) {
      setError('Введите корректный номер +992XXXXXXXXX');
      return;
    }
    setError('');
    try {
      await registerMutation.mutateAsync(phone);
      setStorePhone(phone);
      navigate('/auth/otp');
    } catch {
      setError('Ошибка отправки кода. Попробуйте снова.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">{ru.app.name}</h1>
          <p className="text-text-secondary">{ru.app.tagline}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-primary mb-6">{ru.auth.title}</h2>
          <PhoneInput value={phone} onChange={setPhone} error={error} />
          <div className="mt-6">
            <Button
              fullWidth
              onClick={handleSubmit}
              loading={registerMutation.isPending}
              disabled={!isValidPhone(phone)}
            >
              {ru.auth.getCode}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
