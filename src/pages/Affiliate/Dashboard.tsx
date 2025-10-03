import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Affiliate } from '../../types';
import { Helmet } from 'react-helmet-async';

const AffiliateDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [affiliateData, setAffiliateData] = useState<Affiliate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAffiliateData = async () => {
      if (currentUser && currentUser.role === 'affiliate') {
        const affiliateDocRef = doc(db, 'affiliates', currentUser.uid);
        const affiliateDocSnap = await getDoc(affiliateDocRef);
        if (affiliateDocSnap.exists()) {
          setAffiliateData(affiliateDocSnap.data() as Affiliate);
        }
      }
      setLoading(false);
    };

    fetchAffiliateData();
  }, [currentUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!affiliateData) {
    return <div>Could not load affiliate data.</div>;
  }

  return (
    <>
      <Helmet>
        <title>Affiliate Dashboard - FrameGlobe</title>
      </Helmet>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Affiliate Dashboard</h1>
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Your Referral Link</h2>
          <p className="text-gray-600 mb-4">Share this link with artists to invite them to FrameGlobe.</p>
          <div className="bg-gray-100 p-4 rounded-md">
            <code className="text-lg">{`https://frameglobe.com/register?ref=${affiliateData.referralCode}`}</code>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Referred Users</h2>
          {affiliateData.referredUsers.length > 0 ? (
            <ul>
              {affiliateData.referredUsers.map((userId) => (
                <li key={userId} className="border-b py-2">{userId}</li>
              ))}
            </ul>
          ) : (
            <p>You haven't referred any users yet.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default AffiliateDashboard;
