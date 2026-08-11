# Fluentia Android

Roboczy Application ID: com.fluentia.englishmentor. Zatwierdź go przed pierwszym uploadem do Google Play — po publikacji nie można go zmienić. Projekt używa compileSdk 36, targetSdk 36, versionCode 1 i versionName 1.0.

Finalny build wymaga Android Studio, właściwego JDK, Android SDK Platform 36 i Build Tools. Wynikiem publikacyjnym ma być podpisany Android App Bundle .aab.

Po instalacji zależności uruchom npm --prefix apps/mobile run sync. W projekcie Android compileSdk i targetSdk muszą wynosić 36. Release buduj przez npm --prefix apps/mobile run build:aab. Klucz uploadu skonfiguruj dopiero przy Play App Signing; nie zapisuj kluczy ani haseł w repozytorium.
