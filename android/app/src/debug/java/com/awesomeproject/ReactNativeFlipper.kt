package com.awesomeproject

import android.content.Context
import com.facebook.flipper.android.AndroidFlipperClient
import com.facebook.flipper.android.utils.FlipperUtils
import com.facebook.flipper.plugins.network.FlipperOkhttpInterceptor
import com.facebook.flipper.plugins.network.NetworkFlipperPlugin
import com.facebook.flipper.plugins.sharedpreferences.SharedPreferencesFlipperPlugin
import com.facebook.react.ReactInstanceManager
import com.facebook.react.bridge.ReactContext
import com.facebook.react.modules.network.NetworkingModule
import com.facebook.react.modules.network.OkHttpClientProvider
import okhttp3.OkHttpClient
import java.lang.reflect.Field

object ReactNativeFlipper {
  @JvmStatic
  fun initializeFlipper(context: Context, reactInstanceManager: ReactInstanceManager) {
    if (FlipperUtils.shouldEnableFlipper(context)) {
      val client = AndroidFlipperClient.getInstance(context)

      // Shared Preferences Plugin
      client.addPlugin(SharedPreferencesFlipperPlugin(context))

      // Network Plugin
      val networkFlipperPlugin = NetworkFlipperPlugin()
      NetworkingModule.setCustomClientBuilder { builder: OkHttpClient.Builder ->
        builder.addNetworkInterceptor(FlipperOkhttpInterceptor(networkFlipperPlugin))
      }
      client.addPlugin(networkFlipperPlugin)

      client.start()
    }
  }
}
