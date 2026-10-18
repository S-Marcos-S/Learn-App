# ==============================================================================
# Regras de Otimização e Ofuscação R8 para LearnApp
# ==============================================================================
-optimizationpasses 5
-allowaccessmodification

# Preserva a interface JavaScript e anotações nativas
-keepattributes JavascriptInterface
-keepattributes *Annotation*

-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

-keep class com.learnapp.WebAppInterface {
    public <methods>;
}

-keep class com.learnapp.MainActivity {
    public *;
}

# Bibliotecas AndroidX e WebKit
-keep class androidx.webkit.** { *; }
-dontwarn androidx.webkit.**
-dontwarn com.google.android.material.**
