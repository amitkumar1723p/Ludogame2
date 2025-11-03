# Keep React Native classes
-keep class com.facebook.react.** { *; }
-dontwarn com.facebook.react.**

# Keep Hermes classes (if Hermes is enabled)
-keep class com.facebook.hermes.** { *; }
-dontwarn com.facebook.hermes.**

# Keep OkHttp (used by React Native networking)
-keep class okhttp3.** { *; }
-dontwarn okhttp3.**

# Keep classes for animated components and gesture handler (react-native-reanimated, react-native-gesture-handler)
-keep class com.swmansion.** { *; }
-dontwarn com.swmansion.**

# Keep vector icons
-keep class com.oblador.vectoricons.** { *; }
-dontwarn com.oblador.vectoricons.**

# Keep classes for safe serialization/deserialization
-keep class com.facebook.** { *; }
-dontwarn com.facebook.**



# Optional: Firebase or other specific SDKs (add rules as needed)

# Keep MainActivity and MainApplication classes
-keep class com.webpagewalla.ludogame.MainActivity { *; }
-keep class com.webpagewalla.ludogame.MainApplication { *; }

# Do not strip enum classes
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}
