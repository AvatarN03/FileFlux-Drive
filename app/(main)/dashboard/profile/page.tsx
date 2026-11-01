"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { User, AlertOctagon, CheckCircle2, LogOut, Loader2, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useVault } from "@/context/VaultContext";
import authApi from "@/services/authApi";
import { formatFileSize } from "@/lib/file";
import toastC from "@/lib/toast";

const formatIndianDate = (dateVal?: string | Date | null) => {
  if (!dateVal) return "Active Member";
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) return "Active Member";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

const formatIndianDateTime = (dateVal?: string | Date | null) => {
  if (!dateVal) return "Current Session";
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) return "Current Session";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  })
    .format(date)
    .replace(" at ", ", ");
};

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { lockVault } = useVault();
  const queryClient = useQueryClient();
  const router = useRouter();

  const [nameInput, setNameInput] = useState(user?.name || "");
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  useEffect(() => {
    if (user?.name) {
      setNameInput(user.name);
    }
  }, [user?.name]);

  const handleUpdateName = async () => {
    const trimmed = nameInput.trim();
    if (!trimmed) {
      toastC({ data: "Full name cannot be empty", type: "error" });
      return;
    }
    if (trimmed === user?.name) return;

    try {
      setIsUpdatingName(true);
      const updated = await authApi.updateName(trimmed);
      queryClient.setQueryData(["auth", "user"], updated);
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
      toastC({ data: "Full name updated successfully!", type: "success" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update full name";
      toastC({ data: msg, type: "error" });
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      lockVault();
      await logout();
      toastC({
        data: "Signed out successfully",
        type: "success",
      });
      router.push("/auth");
    } catch {
      router.push("/auth");
    } finally {
      setIsSigningOut(false);
      setShowSignOutModal(false);
    }
  };

  return (
    <div className="w-full min-h-full p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-brand-violet">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-brand-cream border-2 border-brand-violet shadow-[4px_4px_0px_0px_#BA5624] p-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-brand-peach text-brand-violet text-[10px] font-mono font-bold uppercase tracking-wider border border-brand-border">
            <User className="w-3 h-3 text-brand-brown" />
            User Identity & Vault Authority
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Account Profile
          </h1>
          <p className="text-xs text-brand-violet/75">
            Manage your personal credentials, storage limits, and security assertions.
          </p>
        </div>

        <div className="px-3 py-1 bg-brand-violet text-brand-peach border border-brand-peach text-[11px] font-bold font-mono uppercase tracking-wider self-start sm:self-auto">
          Active Identity Mode
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="bg-brand-cream border-2 border-brand-violet shadow-[4px_4px_0px_0px_#BA5624] p-6 flex flex-col items-center text-center space-y-4">
          <div className="relative w-24 h-24 border-4 border-brand-brown shadow-[4px_4px_0px_0px_#381D2A] overflow-hidden bg-brand-peach">
            <Image
              src={user?.avatarUrl || "/default-avatar.webp"}
              alt="User Avatar"
              fill
              className="object-cover"
            />
          </div>

          <div>
            <h2 className="text-lg font-extrabold text-brand-violet">
              {user?.name || "FileFlux Explorer"}
            </h2>
            <p className="text-xs font-mono text-brand-violet/70">
              {user?.email || "user@example.com"}
            </p>
          </div>

          {user?.emailVerified ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600/15 border border-emerald-700 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Email Verified
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/15 border border-amber-600 text-amber-800 text-xs font-bold uppercase tracking-wider">
                <AlertOctagon className="w-3.5 h-3.5 text-amber-600" />
                Not Verified
              </div>
              <Link
                href="/verify-email"
                className="text-[11px] font-bold text-brand-brown hover:text-brand-brown-dark underline cursor-pointer"
              >
                Verify email now
              </Link>
            </div>
          )}

          <div className="w-full pt-4 border-t border-brand-border space-y-2 text-xs text-left">
            <div className="flex justify-between items-center py-1">
              <span className="text-brand-violet/70">Storage Limit:</span>
              <span className="font-bold text-brand-brown">
                {formatFileSize(user?.storageLimit || 52428800)}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-brand-violet/70">Vault Authority:</span>
              <span className="font-mono text-brand-violet font-bold">Standard Owner</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowSignOutModal(true)}
            className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 bg-brand-peach border-2 border-brand-violet text-brand-violet text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_#BA5624] hover:bg-brand-brown hover:text-brand-cream hover:shadow-[1px_1px_0px_0px_#BA5624] hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-brand-brown" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Identity Details & Telemetry */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-brand-cream border-2 border-brand-violet shadow-[4px_4px_0px_0px_#BA5624] p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-violet pb-3 border-b-2 border-brand-border">
              Authentication & Profile Attributes
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
              {/* Full Name (Editable) */}
              <div className="p-3 bg-brand-cream-muted border-2 border-brand-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-brand-violet/70 font-mono text-[10px] uppercase">
                    Full Name
                  </span>
                  <span className="text-[10px] font-bold text-brand-brown uppercase tracking-wider">
                    Editable
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Enter your full name"
                    className="flex-1 px-2.5 py-1.5 text-xs bg-brand-cream border-2 border-brand-violet font-bold text-brand-violet focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleUpdateName}
                    disabled={isUpdatingName || nameInput.trim() === user?.name}
                    className="px-3.5 py-1.5 bg-brand-brown hover:bg-brand-brown-dark text-brand-cream font-bold text-xs uppercase tracking-wider border-2 border-brand-violet shadow-[2px_2px_0px_0px_#381D2A] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1"
                  >
                    {isUpdatingName ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <Check className="w-3 h-3 text-brand-peach" />
                        Save
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Primary Email (Locked) */}
              <div className="p-3 bg-brand-cream-muted border border-brand-border space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-brand-violet/60 font-mono text-[10px] uppercase">
                    Primary Email
                  </span>
                  <span className="text-[10px] font-mono text-brand-violet/50">Cannot be updated</span>
                </div>
                <div className="font-bold text-brand-violet truncate mt-1">
                  {user?.email || "user@example.com"}
                </div>
              </div>

              {/* Account Registration */}
              <div className="p-3 bg-brand-cream-muted border border-brand-border space-y-1">
                <span className="text-brand-violet/60 font-mono text-[10px] uppercase">
                  Account Registration
                </span>
                <div className="font-mono text-brand-violet">
                  {formatIndianDate(user?.createdAt)}
                </div>
              </div>

              {/* Last Authentication */}
              <div className="p-3 bg-brand-cream-muted border border-brand-border space-y-1">
                <span className="text-brand-violet/60 font-mono text-[10px] uppercase">
                  Last Authentication
                </span>
                <div className="font-mono text-brand-violet">
                  {formatIndianDateTime(user?.lastLoginAt)}
                </div>
              </div>

              {/* Encryption Key Ownership */}
              <div className="p-3 bg-brand-cream-muted border border-brand-border space-y-1 sm:col-span-2">
                <span className="text-brand-violet/60 font-mono text-[10px] uppercase">
                  Encryption Key Ownership
                </span>
                <div className="font-bold text-brand-brown">
                  Zero-Knowledge Client Derivation
                </div>
              </div>
            </div>
          </div>

          {/* Session Management */}
          <div className="bg-brand-cream border-2 border-brand-violet shadow-[4px_4px_0px_0px_#BA5624] p-5 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b-2 border-brand-border">
              <LogOut className="w-4 h-4 text-brand-brown" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-violet">
                Session Management
              </h3>
            </div>

            <p className="text-xs text-brand-violet/75 leading-relaxed">
              Sign out of your active browser session. In-memory encryption keys will be immediately purged and the vault will be locked.
            </p>

            <button
              type="button"
              onClick={() => setShowSignOutModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-peach border-2 border-brand-violet text-brand-violet text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_#BA5624] hover:bg-brand-brown hover:text-brand-cream hover:shadow-[1px_1px_0px_0px_#BA5624] hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-brand-brown" />
              <span>Sign Out of Account</span>
            </button>
          </div>

          {/* Danger Zone */}
          <div className="bg-brand-cream border-2 border-red-600 shadow-[4px_4px_0px_0px_#381D2A] p-5">
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-red-300">
              <AlertOctagon className="w-4 h-4 text-red-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-red-600">
                Danger Zone · Irreversible Actions
              </h3>
            </div>

            <p className="text-xs text-brand-violet/80 leading-relaxed mb-4">
              Permanently delete your user account and all client-side encrypted vault assets. This action is immediate and cannot be recovered.
            </p>

            <button
              type="button"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-brand-cream text-xs font-bold uppercase tracking-wider border-2 border-red-800 shadow-[2px_2px_0px_0px_#381D2A] transition-all cursor-pointer"
            >
              Delete Account & Clear Vault
            </button>
          </div>
        </div>
      </div>

      {/* Neo-Brutalist Sign Out Confirmation Modal */}
      {showSignOutModal && (
        <div className="fixed inset-0 z-50 bg-brand-violet-dark/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-brand-cream border-2 border-brand-violet shadow-[6px_6px_0px_0px_#381D2A] w-full max-w-sm p-6 text-brand-violet space-y-4 animate-fadeIn">
            <div className="flex items-center gap-2 pb-2 border-b-2 border-brand-border">
              <LogOut className="w-4 h-4 text-brand-brown" />
              <h3 className="text-sm font-extrabold tracking-tight uppercase">
                Confirm Sign Out
              </h3>
            </div>

            <p className="text-xs text-brand-violet/80 leading-relaxed">
              Are you sure you want to sign out of your account? Your in-memory encryption keys will be purged and your vault will be locked.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSignOutModal(false)}
                disabled={isSigningOut}
                className="px-3.5 py-1.5 bg-brand-cream-muted border-2 border-brand-border hover:bg-brand-peach text-brand-violet font-bold text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_#381D2A] transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="px-4 py-1.5 bg-brand-brown hover:bg-brand-brown-dark text-brand-cream font-bold text-xs uppercase tracking-wider border-2 border-brand-violet shadow-[2px_2px_0px_0px_#381D2A] transition-all cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
              >
                {isSigningOut ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-peach" />
                    Signing Out...
                  </>
                ) : (
                  "Yes, Sign Out"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
