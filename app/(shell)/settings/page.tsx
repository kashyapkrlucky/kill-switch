"use client";

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import {
  Settings2Icon,
  User,
  Key,
  Trash2,
  Edit3,
  Camera,
  Shield,
  Mail,
  Calendar,
  MapPin,
  Save,
} from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { Button } from "@/components/ui/Button";
import { ButtonOutline } from "@/components/ui/ButtonOutline";
import LabeledInputField from "@/components/ui/LabeledInputField";
import LabeledPasswordField from "@/components/ui/LabeledPasswordField";

export default function SettingsPage() {
  const { profile, updateProfile, logout, isLoading } = useUserStore();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "danger">(
    "profile"
  );

  const [profileForm, setProfileForm] = useState(() => ({
    name: profile?.name || "",
    username: profile?.username || "",
    email: profile?.user?.email || "",
    country: profile?.country || "",
  }));

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [deleteForm, setDeleteForm] = useState({
    password: "",
    confirmation: "",
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(profileForm);
      setIsEditingProfile(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    // TODO: Implement password change API call
    setIsChangingPassword(false);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleAccountDeletion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteForm.confirmation !== "DELETE") {
      alert("Please type DELETE to confirm");
      return;
    }
    // TODO: Implement account deletion API call
    await logout();
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "danger", label: "Danger Zone", icon: Trash2 },
  ];

  return (
    <div className="w-full p-2">
      <PageHeader
        title="Settings"
        description="Manage your account settings, profile, and preferences"
        icon={<Settings2Icon className="w-5 h-5 text-emerald-500" />}
      />

      <div className="flex flex-col gap-4">
        {/* Sidebar */}
        <nav className="flex flex-row gap-4 w-full bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(tab.id as "profile" | "security" | "danger")
                }
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-emerald-500/10 text-emerald-400 border-b-2 border-emerald-500"
                    : "text-gray-400 hover:text-white hover:bg-slate-700/30"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-4">
              {/* Profile Header */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-emerald-500" />
                    Profile Information
                  </h2>
                  {!isEditingProfile && (
                    <Button
                      size="sm"
                      onClick={() => setIsEditingProfile(true)}
                      className="flex items-center gap-2"
                    >
                      <Edit3 className="w-3 h-3" />
                      Edit Profile
                    </Button>
                  )}
                </div>

                {!isEditingProfile ? (
                  <div className="space-y-4">
                    {/* Avatar and Basic Info */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative">
                        <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center">
                          {profile?.user?.avatar ? (
                            <div
                              style={{
                                backgroundImage: `url(${profile.user.avatar})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }}
                              className="w-full h-full rounded-full"
                            />
                          ) : (
                            <User className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                        <button className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                          <Camera className="w-3 h-3" />
                        </button>
                      </div>
                      <div>
                        <h3 className="text-white font-medium text-lg">
                          {profile?.name || profile?.username}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          @{profile?.username}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          Joined{" "}
                          {profile?.createdAt
                            ? new Date(profile.createdAt).toLocaleDateString()
                            : "Unknown"}
                        </p>
                      </div>
                    </div>

                    {/* Profile Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="text-sm text-white">
                            {profile?.user?.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Member Since</p>
                          <p className="text-sm text-white">
                            {profile?.createdAt
                              ? new Date(profile.createdAt).toLocaleDateString()
                              : "Unknown"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Location</p>
                          <p className="text-sm text-white">
                            {profile?.country
                              ? `${profile.country}`
                              : "Not specified"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <LabeledInputField
                        label="Name"
                        value={profileForm.name}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            name: e.target.value,
                          })
                        }
                        placeholder="Enter your name"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <LabeledInputField
                        label="Country"
                        value={profileForm.country}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            country: e.target.value,
                          })
                        }
                        placeholder="United States"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <ButtonOutline
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                      >
                        Cancel
                      </ButtonOutline>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center gap-2"
                      >
                        <Save className="w-3 h-3" />
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-4">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Key className="w-5 h-5 text-emerald-500" />
                    Change Password
                  </h2>
                </div>

                <form
                  onSubmit={handlePasswordChange}
                  className="flex flex-col gap-4"
                >
                  <div className="flex flex-row gap-4">
                    <LabeledPasswordField
                      label="Current Password"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          currentPassword: e.target.value,
                        })
                      }
                      placeholder="Enter your current password"
                    />
                    <LabeledPasswordField
                      label="New Password"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: e.target.value,
                        })
                      }
                      placeholder="Enter your new password"
                    />
                    <LabeledPasswordField
                      label="Confirm New Password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="Confirm your new password"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <ButtonOutline
                      type="button"
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordForm({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                      }}
                    >
                      Cancel
                    </ButtonOutline>
                    <Button type="submit">Update Password</Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Danger Zone Tab */}
          {activeTab === "danger" && (
            <div className="space-y-4">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Trash2 className="w-5 h-5 text-red-500" />
                  <h2 className="text-lg font-semibold text-red-400">
                    Danger Zone
                  </h2>
                </div>
                <p className="text-gray-400 mb-6">
                  Once you delete your account, there is no going back. Please
                  be certain.
                </p>

                {!isDeletingAccount ? (
                  <Button
                    onClick={() => setIsDeletingAccount(true)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Delete Account
                  </Button>
                ) : (
                  <form onSubmit={handleAccountDeletion} className="space-y-4">
                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                      <h3 className="text-white font-medium mb-3">
                        This action cannot be undone.
                      </h3>
                      <ul className="text-gray-400 text-sm space-y-1 mb-4">
                        <li>• All your projects will be permanently deleted</li>
                        <li>• All your feature flags will be removed</li>
                        <li>• Your profile and settings will be erased</li>
                        <li>• You will lose access to all associated data</li>
                      </ul>

                      <LabeledPasswordField
                        label="Confirm Password"
                        value={deleteForm.password}
                        onChange={(e) =>
                          setDeleteForm({
                            ...deleteForm,
                            password: e.target.value,
                          })
                        }
                        placeholder="Enter your password to confirm"
                      />

                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1.5">
                          Type &quot;DELETE&quot; to confirm
                        </label>
                        <input
                          type="text"
                          value={deleteForm.confirmation}
                          onChange={(e) =>
                            setDeleteForm({
                              ...deleteForm,
                              confirmation: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200 text-sm"
                          placeholder="DELETE"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <ButtonOutline
                        type="button"
                        onClick={() => {
                          setIsDeletingAccount(false);
                          setDeleteForm({ password: "", confirmation: "" });
                        }}
                      >
                        Cancel
                      </ButtonOutline>
                      <Button
                        type="submit"
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Delete Account Forever
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
