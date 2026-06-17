import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import Header from "../components/Header";
import { useAuth } from "../context/useAuth";

export default function Register() {
  const navigate = useNavigate();
  const { isSupabaseConfigured, signUp, user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/account", { replace: true });
    }
  }, [navigate, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak sama.");
      return;
    }

    setSubmitting(true);

    const { data, error: signUpError } = await signUp({
      email,
      password,
      fullName,
    });

    if (signUpError) {
      setError(signUpError.message);
    } else if (data.session) {
      setMessage("Register berhasil. Mengarahkan ke akun...");
      navigate("/account", { replace: true });
    } else {
      setMessage("Register berhasil. Cek email untuk konfirmasi akun.");
      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }

    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f3ef] font-dmsans text-[#1a1a1a]">
      <Header />

      <main className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-4 pb-12 pt-24 sm:px-6 sm:pt-28 lg:grid-cols-[1fr_440px] lg:px-8">
        <section className="hidden lg:block">
          <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-[#8f877c]">
            Create Account
          </p>
          <h1 className="max-w-2xl font-cormorant text-6xl font-light leading-none text-[#1a1a1a]">
            Build a saved space for your favorite pieces.
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-[#736c63]">
            Data pengguna dibuat melalui Supabase Auth, lalu profile otomatis
            siap dicatat ke tabel public.profiles lewat SQL schema yang
            disertakan.
          </p>
        </section>

        <section className="rounded-[28px] border border-[#e4ddd2] bg-[#f8f6f2] p-6 shadow-[0_24px_60px_rgba(26,26,26,0.06)]">
          <div className="mb-6 border-b border-[#e0dbd2] pb-5">
            <h2 className="font-cormorant text-4xl text-[#1a1a1a]">Register</h2>
            <p className="mt-2 text-sm text-[#736c63]">
              Buat akun baru dengan Supabase Auth.
            </p>
          </div>

          {!isSupabaseConfigured && (
            <div className="mb-5 rounded-2xl border border-[#d8d0c4] bg-white px-4 py-3 text-sm text-[#736c63]">
              Supabase belum aktif. Isi file .env dari contoh .env.example.
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#8f877c]">
                Nama
              </span>
              <input
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
                className="mt-2 w-full rounded-2xl border border-[#d8d0c4] bg-white px-4 py-3 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#1a1a1a]"
                placeholder="Nama lengkap"
              />
            </label>

            <label className="block">
              <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#8f877c]">
                Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="mt-2 w-full rounded-2xl border border-[#d8d0c4] bg-white px-4 py-3 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#1a1a1a]"
                placeholder="nama@email.com"
              />
            </label>

            <label className="block">
              <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#8f877c]">
                Password
              </span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={6}
                className="mt-2 w-full rounded-2xl border border-[#d8d0c4] bg-white px-4 py-3 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#1a1a1a]"
                placeholder="Minimal 6 karakter"
              />
            </label>

            <label className="block">
              <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#8f877c]">
                Konfirmasi Password
              </span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                minLength={6}
                className="mt-2 w-full rounded-2xl border border-[#d8d0c4] bg-white px-4 py-3 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#1a1a1a]"
                placeholder="Ulangi password"
              />
            </label>

            {error && (
              <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            {message && (
              <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || !isSupabaseConfigured}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1a1a1a] px-5 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#f5f3ef] transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
            >
              <UserPlus size={16} />
              {submitting ? "Memproses" : "Register"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#736c63]">
            Sudah punya akun?{" "}
            <Link to="/login" className="border-b border-[#1a1a1a] text-[#1a1a1a]">
              Login
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
