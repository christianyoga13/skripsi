import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import Header from "../components/Header";
import { useAuth } from "../context/useAuth";

export default function Account() {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fullName = user?.user_metadata?.full_name;

  const handleSignOut = async () => {
    setError("");
    setSubmitting(true);

    const { error: signOutError } = await signOut();

    if (signOutError) {
      setError(signOutError.message);
    } else {
      navigate("/", { replace: true });
    }

    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f3ef] font-dmsans text-[#1a1a1a]">
      <Header />

      <main className="mx-auto max-w-5xl px-4 pb-12 pt-24 sm:px-6 sm:pt-28 lg:px-8">
        <section className="rounded-[28px] border border-[#e4ddd2] bg-[#f8f6f2] p-6 shadow-[0_24px_60px_rgba(26,26,26,0.06)] sm:p-8">
          <div className="flex flex-col gap-6 border-b border-[#e0dbd2] pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-[#8f877c]">
                Account
              </p>
              <h1 className="font-cormorant text-5xl font-light leading-none text-[#1a1a1a]">
                {fullName || "Your Profile"}
              </h1>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#1a1a1a] px-5 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#1a1a1a] transition-colors hover:bg-[#1a1a1a] hover:text-[#f5f3ef] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LogOut size={16} />
              {submitting ? "Keluar" : "Logout"}
            </button>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div className="rounded-[22px] bg-white p-5">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f5f3ef] text-[#1a1a1a]">
                <User size={20} />
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#9a9389]">
                Email
              </p>
              <p className="mt-2 break-all text-sm text-[#1a1a1a]">{user?.email}</p>
            </div>

            <div className="rounded-[22px] bg-white p-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#9a9389]">
                User ID
              </p>
              <p className="mt-2 break-all font-mono text-xs text-[#1a1a1a]">
                {user?.id}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[#736c63]">
                ID ini sama dengan public.profiles.id pada schema Supabase yang
                disiapkan.
              </p>
            </div>
          </div>

          {error && (
            <p className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
