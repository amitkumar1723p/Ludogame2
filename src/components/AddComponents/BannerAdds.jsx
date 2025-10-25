import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  TestIds
} from 'react-native-google-mobile-ads';

const bannerAdUnitId = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-4274595540297099/4391176341';

const BannerAdds = ({ size = BannerAdSize.BANNER, style }) => {
  return (
    <View style={[styles.container, style]}>
      <BannerAd
        unitId={bannerAdUnitId}
        size={size}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10
  }
});

export default BannerAdds;
