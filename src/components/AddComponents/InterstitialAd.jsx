// import React, { useEffect, useState } from 'react';
// import {
//   InterstitialAd,
//   AdEventType,
//   TestIds
// } from 'react-native-google-mobile-ads';

// const interstitialAdUnitId = __DEV__
//   ? TestIds.INTERSTITIAL
//   : 'ca-app-pub-4274595540297099/9876543210'; // <-- apna real ad id yahan daal

// const interstitial = InterstitialAd.createForAdRequest(interstitialAdUnitId, {
//   requestNonPersonalizedAdsOnly: true
// });

// const InterstitialAdComponent = ({ showAd = false, onAdClosed }) => {
//   const [loaded, setLoaded] = useState(false);

//   useEffect(() => {
//     const unsubscribeLoaded = interstitial.addAdEventListener(
//       AdEventType.LOADED,
//       () => setLoaded(true)
//     );

//     const unsubscribeClosed = interstitial.addAdEventListener(
//       AdEventType.CLOSED,
//       () => {
//         console.log('Ad closed');
//         setLoaded(false);
//         interstitial.load(); // preload next ad
//         if (onAdClosed) onAdClosed(); // callback
//       }
//     );

//     const unsubscribeError = interstitial.addAdEventListener(
//       AdEventType.ERROR,
//       error => console.log('Interstitial Ad Error:', error)
//     );

//     interstitial.load();

//     return () => {
//       unsubscribeLoaded();
//       unsubscribeClosed();
//       unsubscribeError();
//     };
//   }, []);

//   useEffect(() => {
//     if (showAd && loaded) {
//       interstitial.show();
//     }
//   }, [showAd, loaded]);

//   return null; // No UI component needed
// };

// export default InterstitialAdComponent;

import React, { useEffect, useState } from 'react';
import {
  InterstitialAd,
  AdEventType,
  TestIds
} from 'react-native-google-mobile-ads';

// AdMob Interstitial Unit ID
const interstitialAdUnitId = __DEV__
  ? TestIds.INTERSTITIAL // Test ID (safe in dev)
  : 'ca-app-pub-4274595540297099/9876543210'; // Replace with your real one

// Create Interstitial Instance (singleton pattern)
const interstitial = InterstitialAd.createForAdRequest(interstitialAdUnitId, {
  requestNonPersonalizedAdsOnly: true
});

const InterstitialAdComponent = ({ showAd = false, onAdClosed }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // 🔹 Register listeners
    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        console.log('✅ Interstitial loaded');
        setLoaded(true);
      }
    );

    const unsubscribeClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        console.log('👋 Ad closed by user');
        setLoaded(false);
        interstitial.load(); // preload next ad
        if (onAdClosed) onAdClosed(); // callback to parent
      }
    );

    const unsubscribeError = interstitial.addAdEventListener(
      AdEventType.ERROR,
      error => {
        console.log('❌ Interstitial error:', error);
        setLoaded(false);
      }
    );

    // 🔹 Load the first ad
    interstitial.load();

    // Cleanup listeners on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeError();
    };
  }, []);

  useEffect(() => {
    // 🔹 When parent requests to show ad
    if (showAd) {
      if (loaded) {
        console.log('🎬 Showing interstitial ad...');
        interstitial.show();
      } else {
        console.log('⚠️ Interstitial not loaded yet, retrying...');
        interstitial.load();
      }
    }
  }, [showAd, loaded]);

  return null; // no UI
};

export default InterstitialAdComponent;
