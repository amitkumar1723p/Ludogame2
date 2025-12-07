import { useEffect, useState } from 'react';
import {
  AdEventType,
  InterstitialAd,
  TestIds
} from 'react-native-google-mobile-ads';

// AdMob Interstitial Unit ID
const interstitialAdUnitId = __DEV__
  ? TestIds.INTERSTITIAL // Test ID (safe in dev)
  : 'ca-app-pub-4274595540297099/7730397345'; // Replace with your real one

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

  // useEffect(() => {
  //   // 🔹 When parent requests to show ad
  //   if (showAd) {
  //     if (loaded) {
  //       console.log('🎬 Showing interstitial ad...');
  //       interstitial.show();
  //     } else {
  //       console.log('⚠️ Interstitial not loaded yet, retrying...');
  //       interstitial.load();
  //     }
  //   }
  // }, [showAd, loaded]);

  useEffect(() => {
    if (showAd) {
      if (loaded) {
        console.log('🎬 Showing interstitial ad...');
        interstitial.show();
        // ✅ Reset request state to avoid repeat triggers
        if (onAdClosed) onAdClosed();
      } else {
        console.log('⚠️ Not loaded yet → Preloading...');
        interstitial.load();
      }
    }
  }, [showAd, loaded]);

  return null; // no UI
};

export default InterstitialAdComponent;
