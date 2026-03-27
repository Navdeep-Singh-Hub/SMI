import React, { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { VscAccount, VscCheck, VscWarning, VscCloudUpload } from 'react-icons/vsc';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const API_ORIGIN = API_BASE.replace(/\/api\/?$/, '');

const kycLabel = {
  none: 'Not submitted',
  pending: 'Under review',
  approved: 'Approved',
  rejected: 'Rejected — please resubmit'
};

const Profile = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saveOk, setSaveOk] = useState(false);

  const [kycStatus, setKycStatus] = useState('none');
  const [kycReason, setKycReason] = useState('');
  const [kycSubmitting, setKycSubmitting] = useState(false);
  const [kycError, setKycError] = useState('');
  const [kycOk, setKycOk] = useState(false);
  const [files, setFiles] = useState({
    aadhaarFront: null,
    aadhaarBack: null,
    panCard: null,
    holdingPhoto: null
  });

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setSaveError('');
    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(`${API_BASE}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to load profile');
      const data = await res.json();
      setProfile(data);
      setUsername(data.username || '');
      setPhone(data.phone || '');
      setAddress(data.address || '');
      setKycStatus(data.kycStatus || 'none');
      setKycReason(data.kycRejectedReason || '');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [getAccessTokenSilently]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaveError('');
    setSaveOk(false);
    if (!phone.trim() || !address.trim()) {
      setSaveError('Phone number and address are required.');
      return;
    }
    setSaving(true);
    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(`${API_BASE}/user/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          username: username.trim(),
          phone: phone.trim(),
          address: address.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setSaveError(data.message || 'Save failed');
        return;
      }
      setProfile((p) => ({ ...p, ...data }));
      setSaveOk(true);
      window.dispatchEvent(new Event('profileUpdated'));
    } catch (err) {
      setSaveError('Network error');
    } finally {
      setSaving(false);
    }
  };

  const handleKycFile = (field, file) => {
    setFiles((f) => ({ ...f, [field]: file }));
    setKycError('');
  };

  const handleKycSubmit = async (e) => {
    e.preventDefault();
    setKycError('');
    setKycOk(false);
    if (!files.aadhaarFront || !files.aadhaarBack || !files.panCard || !files.holdingPhoto) {
      setKycError('Please upload all four documents.');
      return;
    }
    setKycSubmitting(true);
    try {
      const token = await getAccessTokenSilently();
      const fd = new FormData();
      fd.append('aadhaarFront', files.aadhaarFront);
      fd.append('aadhaarBack', files.aadhaarBack);
      fd.append('panCard', files.panCard);
      fd.append('holdingPhoto', files.holdingPhoto);
      const res = await fetch(`${API_BASE}/user/kyc/submit`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setKycError(data.message || 'Upload failed');
        return;
      }
      setKycOk(true);
      setKycStatus(data.kycStatus || 'pending');
      setFiles({
        aadhaarFront: null,
        aadhaarBack: null,
        panCard: null,
        holdingPhoto: null
      });
      fetchProfile();
    } catch (err) {
      setKycError('Network error');
    } finally {
      setKycSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-1 sm:px-0 py-12 text-center text-white/60">Loading profile…</div>
    );
  }

  const docUrl = (name) => (name ? `${API_ORIGIN}/api/uploads/kyc/${name}` : '');

  return (
    <div className="max-w-3xl mx-auto px-1 sm:px-0 space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <VscAccount className="text-purple-400" size={28} />
          Profile
        </h2>
        <p className="text-white/60 text-sm sm:text-base">
          Keep your details up to date. KYC is required only when you want to withdraw funds.
        </p>
      </div>

      {/* Personal */}
      <div className="bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white mb-4">Personal information</h3>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-white/70 text-sm mb-1">Email</label>
            <input
              type="email"
              readOnly
              value={profile?.email || ''}
              className="w-full px-4 py-3 rounded-lg border border-white/20 bg-black/30 text-white/70 cursor-not-allowed"
            />
            <p className="text-white/40 text-xs mt-1">Email is managed by your login provider and cannot be changed here.</p>
          </div>
          <div>
            <label htmlFor="prof-username" className="block text-white/70 text-sm mb-1">Username</label>
            <input
              id="prof-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/40 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="prof-phone" className="block text-white/70 text-sm mb-1">Mobile number *</label>
            <input
              id="prof-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/40 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="prof-address" className="block text-white/70 text-sm mb-1">Address *</label>
            <textarea
              id="prof-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              placeholder="Full address including city, state, PIN"
              className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/40 focus:ring-2 focus:ring-purple-500 focus:outline-none resize-y min-h-[88px]"
              required
            />
          </div>
          {saveError && <p className="text-red-400 text-sm">{saveError}</p>}
          {saveOk && <p className="text-green-400 text-sm flex items-center gap-1"><VscCheck /> Saved successfully.</p>}
          <button
            type="submit"
            disabled={saving}
            className="min-h-[44px] px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save profile'}
          </button>
        </form>
      </div>

      {/* KYC */}
      <div className="bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <h3 className="text-lg font-semibold text-white">KYC verification</h3>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              kycStatus === 'approved'
                ? 'bg-green-500/20 text-green-400'
                : kycStatus === 'pending'
                  ? 'bg-amber-500/20 text-amber-300'
                  : kycStatus === 'rejected'
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-white/10 text-white/60'
            }`}
          >
            {kycLabel[kycStatus] || kycLabel.none}
          </span>
        </div>
        <p className="text-white/60 text-sm mb-4">
          Submit when you are ready to withdraw. Upload Aadhaar (front &amp; back), PAN card, and a clear photo of yourself holding your Aadhaar. Your documents will be sent for manual approval.
        </p>

        {kycStatus === 'pending' && (
          <div className="flex items-start gap-2 text-amber-200/90 text-sm bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
            <VscWarning className="flex-shrink-0 mt-0.5" />
            <span>Your documents are under review. You will be able to withdraw after approval.</span>
          </div>
        )}

        {kycStatus === 'approved' && (
          <div className="flex items-start gap-2 text-green-300 text-sm bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <VscCheck className="flex-shrink-0 mt-0.5" />
            <span>KYC approved. You can submit withdrawal requests.</span>
          </div>
        )}

        {kycStatus === 'rejected' && kycReason && (
          <div className="text-red-300/90 text-sm mb-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3">{kycReason}</div>
        )}

        {(kycStatus === 'none' || kycStatus === 'rejected') && (
          <form onSubmit={handleKycSubmit} className="space-y-4 mt-4">
            {[
              { key: 'aadhaarFront', label: 'Aadhaar card — front' },
              { key: 'aadhaarBack', label: 'Aadhaar card — back' },
              { key: 'panCard', label: 'PAN card' },
              { key: 'holdingPhoto', label: 'Your photo holding Aadhaar' }
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-white/70 text-sm mb-1">{label}</label>
                <label className="flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-lg border border-dashed border-white/30 bg-black/20 cursor-pointer hover:bg-white/5">
                  <VscCloudUpload className="text-purple-400" />
                  <span className="text-white/80 text-sm truncate">
                    {files[key] ? files[key].name : 'Choose image (JPEG, PNG, WebP, max ~6MB)'}
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => handleKycFile(key, e.target.files?.[0] || null)}
                  />
                </label>
              </div>
            ))}
            {kycError && <p className="text-red-400 text-sm">{kycError}</p>}
            {kycOk && <p className="text-green-400 text-sm">Documents submitted for approval.</p>}
            <button
              type="submit"
              disabled={kycSubmitting}
              className="min-h-[44px] px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold hover:opacity-90 disabled:opacity-50"
            >
              {kycSubmitting ? 'Uploading…' : 'Submit for approval'}
            </button>
          </form>
        )}

        {profile?.kycFiles && kycStatus !== 'none' && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-white/50 text-xs mb-2">Your submitted files (for your reference)</p>
            <div className="flex flex-wrap gap-2">
              {[
                { k: 'aadhaarFront', label: 'Aadhaar front' },
                { k: 'aadhaarBack', label: 'Aadhaar back' },
                { k: 'panCard', label: 'PAN' },
                { k: 'holdingPhoto', label: 'Holding photo' }
              ].map(({ k, label }) => {
                const name = profile.kycFiles[k];
                if (!name) return null;
                return (
                  <a
                    key={k}
                    href={docUrl(name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-cyan-400 hover:underline"
                  >
                    View {label}
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
