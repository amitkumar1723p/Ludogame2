import { View, StyleSheet } from 'react-native';
import React from 'react';
import {
  BannerAd,
  BannerAdSize,
  TestIds
} from 'react-native-google-mobile-ads';

const bannerAdUnitId = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-4274595540297099/4391176341';

const BannerAdds = () => {
  return (
    <View style={styles.container}>
      <BannerAd
        unitId={bannerAdUnitId}
        size={BannerAdSize.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center', // center horizontally
    justifyContent: 'center', // center vertically (optional)
    marginVertical: 10
  }
});

export default BannerAdds;
