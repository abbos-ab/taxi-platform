import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OTPInput } from '../../components/ui/OTPInput';
import { Button } from '../../components/ui/Button';
import { useVerifyOTP, useRegister } from '../../api/hooks/useAuth';
import { useAuthStore } from '../../store/useAuthStore';
import { isValidOTP } from '../../utils/validators';
import { formatPhone } from '../../utils/formatters';
import { ru } from '../../i18n/ru';

export const OTPPage: React.FC = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const navigate = useNavigate();
  const phone = useAuthStore((s) => s.phone);
  const verifyMutation = useVerifyOTP();
  const resendMutation = useRegister();

  useEffect(() => {
    if (!phone) {
      navigate('/auth');
      return;
    }
    const interval = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [phone, navigate]);

  const handleVerify = async () => {
    if (!isValidOTP(code)) {
      setError('Введите 6-значный код');
      return;
    }
    setError('');
    try {
      await verifyMutation.mutateAsync({ phone, code });
      navigate('/');
    } catch {
      setError('Неверный код. Попробуйте снова.');
    }
  };

  const handleResend = async () => {
    try {
      await resendMutation.mutateAsync(phone);
      setTimer(60);
      setCode('');
    } catch {
      setError('Ошибка повторной отправки');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-primary mb-2">{ru.auth.otpTitle}</h2>
          <p className="text-text-secondary mb-6">
            {ru.auth.otpSent} {formatPhone(phone)}
          </p>

          <OTPInput value={code} onChange={setCode} />
          {error && <p className="text-danger text-sm mt-3 text-center">{error}</p>}

          <div className="mt-6">
            <Button
              fullWidth
              onClick={handleVerify}
              loading={verifyMutation.isPending}
              disabled={!isValidOTP(code)}
            >
              {ru.auth.verify}
            </Button>
          </div>

          <div className="mt-4 text-center">
            {timer > 0 ? (
              <p className="text-text-secondary text-sm">
                {ru.auth.resendIn} {timer} сек
              </p>
            ) : (
              <button
                onClick={handleResend}
                className="text-accent text-sm font-medium hover:underline"
                disabled={resendMutation.isPending}
              >
                {ru.auth.resend}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
