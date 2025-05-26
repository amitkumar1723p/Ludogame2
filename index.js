/**
 * @format
 */
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import ErrorBoundary from './ErrorBoundary';

// 🔥 Global error + flipper setup outside the component
if (__DEV__) {
  const defaultHandler = global.ErrorUtils.getGlobalHandler();

  global.ErrorUtils.setGlobalHandler((error, isFatal) => {
    console.error("🔥 Caught JS Error:", error.message, error.stack);
    defaultHandler(error, isFatal);
  });

  const tracking = (reason) => {
    console.error("🔥 Unhandled Promise Rejection:", reason);
  };
  process.on?.("unhandledRejection", tracking);

  // Optionally load Flipper plugin
  import('react-native-flipper').then(flipper => {
    try {
      flipper.addPlugin(require('flipper-plugin-react-native-network'));
    } catch (e) {
      console.warn("❗ Flipper plugin load failed", e);
    }
  });
}

// ✅ Root component wrapping App with ErrorBoundary
const Root = () => (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

AppRegistry.registerComponent(appName, () => Root);
