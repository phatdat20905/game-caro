// src/pages/Auth/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import api from '../../services/api.js';
import { useStore } from '../../store/useStore.js';

export default function Register() {
  const [form, setForm] = useState({ username: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useStore();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!form.username) newErrors.username = 'Vui lòng nhập tên đăng nhập';
    else if (form.username.length < 3) newErrors.username = 'Tên đăng nhập ít nhất 3 ký tự';

    if (!form.password) newErrors.password = 'Vui lòng nhập mật khẩu';
    else if (form.password.length < 6) newErrors.password = 'Mật khẩu ít nhất 6 ký tự';

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await api.post('/auth/register', {
        username: form.username,
        password: form.password,
      });
      login(res.data.user, res.data.accessToken);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.error || 'Đăng ký thất bại';
      setErrors({ submit: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl mb-4 shadow-lg">
              <span className="text-5xl">🎯</span>
            </div>
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 animate-gradient">
              Caro Pro
            </h1>
            <p className="text-gray-600 mt-3 font-medium">Tham gia cộng đồng ngay!</p>
          </div>

          {errors.submit && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-400 text-red-700 rounded-xl text-sm font-semibold flex items-center gap-2 animate-shake">
              <span>❌</span>
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="👤 Tên đăng nhập"
              placeholder="3-30 ký tự"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              error={errors.username}
              className="transition-all duration-300 focus:scale-105"
            />
            <Input
              label="🔒 Mật khẩu"
              type="password"
              placeholder="Ít nhất 6 ký tự"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={errors.password}
              className="transition-all duration-300 focus:scale-105"
            />
            <Input
              label="🔑 Xác nhận mật khẩu"
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
              className="transition-all duration-300 focus:scale-105"
            />
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 hover:from-pink-700 hover:via-purple-700 hover:to-pink-700 text-lg font-bold py-3 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300" 
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang tạo tài khoản...
                </span>
              ) : (
                '✨ Tạo tài khoản'
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{' '}
              <Link 
                to="/login" 
                className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 transition-all duration-300 hover:scale-110 inline-block"
              >
                Đăng nhập ngay →
              </Link>
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-t-3xl"></div>
        </div>
      </div>
    </div>
  );
}