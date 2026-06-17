import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import Header from "../components/Header";
import { useAuth } from "../context/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSupabaseConfigured, signIn, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const returnTo = location.state?.from?.pathname ?? "/account";

  useEffect(() => {
    if (user) {
      navigate(returnTo, { replace: true });
    }
  }, [navigate, returnTo, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);

    const { error: signInError } = await signIn({ email, password });

    if (signInError) {
      setError(signInError.message);
    } else {
      setMessage("Login berhasil. Mengarahkan ke akun...");
      navigate(returnTo, { replace: true });
    }

    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f3ef] font-dmsans text-[#1a1a1a]">
      <Header />

      <main className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-4 pb-12 pt-24 sm:px-6 sm:pt-28 lg:grid-cols-[1fr_420px] lg:px-8">
        <section className="hidden lg:block">
          <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-[#8f877c]">
            Member Access
          </p>
          <h1 className="max-w-2xl font-cormorant text-6xl font-light leading-none text-[#1a1a1a]">
            Continue your curated interior journey.
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-[#736c63]">
            Masuk untuk menyimpan preferensi, wishlist, dan riwayat eksplorasi
            produk yang nanti bisa disambungkan ke tabel Supabase.
          </p>
        </section>

        <section className="rounded-[28px] border border-[#e4ddd2] bg-[#f8f6f2] p-6 shadow-[0_24px_60px_rgba(26,26,26,0.06)]">
          <div className="mb-6 border-b border-[#e0dbd2] pb-5">
            <h2 className="font-cormorant text-4xl text-[#1a1a1a]">Login</h2>
            <p className="mt-2 text-sm text-[#736c63]">
              Gunakan email dan password akun Supabase Auth.
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
              <LogIn size={16} />
              {submitting ? "Memproses" : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#736c63]">
            Belum punya akun?{" "}
            <Link to="/register" className="border-b border-[#1a1a1a] text-[#1a1a1a]">
              Register
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
