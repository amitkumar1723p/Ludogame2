 


const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    babelTransformerPath: require.resolve(
      "react-native-svg-transformer/react-native"
    )
  },
  resolver: {
    assetExts: assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...sourceExts, "svg"]
  }
};

module.exports = mergeConfig(defaultConfig, config);
 
 




// const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");
// const { withNativeWind } = require("nativewind/metro");

// const defaultConfig = getDefaultConfig(__dirname);
// const { assetExts, sourceExts } = defaultConfig.resolver;

// const customConfig = {
//   transformer: {
//     babelTransformerPath: require.resolve("react-native-svg-transformer/react-native"),
//   },
//   resolver: {
//     assetExts: assetExts.filter((ext) => ext !== "svg"),
//     sourceExts: [...sourceExts, "svg"],
//   },
// };

// // Merge default + custom
// const mergedConfig = mergeConfig(defaultConfig, customConfig);

// // Wrap with NativeWind (pass global.css path if you have one)
// module.exports = withNativeWind(mergedConfig, {
//   input: "./global.css",
// });

