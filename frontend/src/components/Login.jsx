import { useState } from 'react';

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isRegister) {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (!res.ok) throw new Error('Registration failed');
        alert('Registration successful! Please login.');
        setIsRegister(false);
        setFormData({ username: '', password: '', name: '' });
        return;
      } else {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: formData.username, password: formData.password })
        });
        if (!res.ok) throw new Error('Login failed');
        const data = await res.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-background-light font-display text-text-main transition-colors duration-200 min-h-screen flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
      
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#dcbca8]/20 rounded-full blur-[120px] mix-blend-multiply"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#E3DDD1]/40 rounded-full blur-[100px] mix-blend-multiply"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="h-14 w-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20 ring-4 ring-card-light">
            <span className="material-symbols-outlined text-[32px]">bolt</span>
          </div>
        </div>
        <h2 className="text-center text-3xl font-bold tracking-tight text-text-main">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-text-muted">
          Please enter your details to sign in.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-card-light py-10 px-6 shadow-earthy sm:rounded-2xl sm:px-10 border border-white/50 transition-colors duration-200 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegister && (
              <div>
                <label className="block text-sm font-medium leading-6 text-text-main mb-2">
                  Full Name
                </label>
                <div className="relative rounded-xl shadow-input">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <span className="material-symbols-outlined text-text-muted text-[20px]">person</span>
                  </div>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="block w-full rounded-xl border-0 py-4 pl-11 text-text-main shadow-sm ring-1 ring-inset ring-border-light placeholder:text-text-muted/60 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 bg-input-bg transition-all hover:ring-primary/30"
                    placeholder="John Doe"
                    required={isRegister}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium leading-6 text-text-main mb-2" htmlFor="email">
                {isRegister ? 'Username' : 'Email address'}
              </label>
              <div className="relative rounded-xl shadow-input">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <span className="material-symbols-outlined text-text-muted text-[20px]">mail</span>
                </div>
                <input
                  id="email"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="block w-full rounded-xl border-0 py-4 pl-11 text-text-main shadow-sm ring-1 ring-inset ring-border-light placeholder:text-text-muted/60 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 bg-input-bg transition-all hover:ring-primary/30"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium leading-6 text-text-main" htmlFor="password">
                  Password
                </label>
              </div>
              <div className="relative rounded-xl shadow-input">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <span className="material-symbols-outlined text-text-muted text-[20px]">lock</span>
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="block w-full rounded-xl border-0 py-4 pl-11 pr-12 text-text-main shadow-sm ring-1 ring-inset ring-border-light placeholder:text-text-muted/60 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 bg-input-bg transition-all hover:ring-primary/30"
                  placeholder="Enter your password"
                  required
                />
                <div 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer text-text-muted hover:text-text-main transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </div>
              </div>
            </div>

            {!isRegister && (
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-border-light text-primary focus:ring-primary cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-text-main cursor-pointer select-none">
                  Remember for 30 days
                </label>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-xl bg-primary px-3 py-4 text-sm font-bold leading-6 text-white shadow-md shadow-primary/20 hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-300 ease-out transform hover:-translate-y-0.5 active:scale-[0.98]"
              >
                {isRegister ? 'Sign up' : 'Sign in'}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-text-muted">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="font-semibold leading-6 text-primary hover:text-primary-hover transition-colors underline decoration-transparent hover:decoration-primary/50 ml-1"
            >
              {isRegister ? 'Sign in' : 'Sign up'}
            </button>
          </p>

          
        </div>
        
        <div className="mt-8 flex justify-center gap-2 text-text-muted opacity-70">
          <span className="material-symbols-outlined text-[18px]">lock</span>
          <span className="text-xs font-medium tracking-wide">Secure Connection</span>
        </div>
      </div>
    </div>
  );
}
