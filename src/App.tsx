/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Download, Info, AlertTriangle } from 'lucide-react';

export default function App() {
  const [packageName, setPackageName] = useState('com.prusoft.blindsocial');
  const [snippet, setSnippet] = useState('DIWT46TKZTZGOAAAAAAAAAAAAAA');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateZip = async () => {
    setIsGenerating(true);
    try {
      const zip = new JSZip();

      zip.file("settings.gradle", `rootProject.name = "VerifyApp"\ninclude ':app'`);

      zip.file("build.gradle", `buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath "com.android.tools.build:gradle:8.1.1"
    }
}
allprojects {
    repositories {
        google()
        mavenCentral()
    }
}`);

      zip.file("gradle.properties", `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRClass=true`);

      const app = zip.folder("app");
      app!.file("build.gradle", `plugins {
    id 'com.android.application'
}

android {
    namespace '${packageName}'
    compileSdk 34

    defaultConfig {
        applicationId "${packageName}"
        minSdk 24
        targetSdk 34
        versionCode 1
        versionName "1.0"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}

dependencies {
}`);

      const main = app!.folder("src")!.folder("main");
      
      main!.file("AndroidManifest.xml", `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <application
        android:allowBackup="true"
        android:label="VerifyApp"
        android:supportsRtl="true">
    </application>
</manifest>`);

      main!.folder("assets")!.file("adi-registration.properties", snippet);

      // Fetch the JKS file and add it to the ZIP
      try {
        const jksResponse = await fetch('/blind_social.jks');
        if (jksResponse.ok) {
          const jksBlob = await jksResponse.blob();
          app!.file("blind_social.jks", jksBlob);
        }
      } catch (err) {
        console.warn("Could not fetch JKS file", err);
      }

      // Add Github Actions workflow
      const github = zip.folder(".github")!.folder("workflows");
      github!.file("build.yml", `name: Build Release APK

on:
  push:
    branches:
      - main
      - master
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Setup Gradle
        uses: gradle/actions/setup-gradle@v3

      - name: Build and Sign APK
        run: gradle assembleRelease
        env:
          KEYSTORE_PASSWORD: \${{ secrets.KEYSTORE_PASSWORD }}
          KEY_ALIAS: \${{ secrets.KEY_ALIAS }}
          KEY_PASSWORD: \${{ secrets.KEY_PASSWORD }}

      - name: Upload APK
        uses: actions/upload-artifact@v4
        with:
          name: app-release
          path: app/build/outputs/apk/release/app-release.apk
`);

      // Add gradlew wrapper to the project
      zip.folder("gradle")!.folder("wrapper")!.file("gradle-wrapper.properties", `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.3-bin.zip
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists`);
      
      // Add fake gradlew so actions can run it (in real life you need gradle-wrapper.jar but Actions setup-java handles it if gradlew is present or we can just use gradle command)
      zip.file("gradlew", `#!/usr/bin/env sh
exec gradle "$@"
`);
      zip.file("gradlew.bat", `@echo off
gradle %*
`);

      app!.file("build.gradle", `plugins {
    id 'com.android.application'
}

android {
    namespace '${packageName}'
    compileSdk 34

    defaultConfig {
        applicationId "${packageName}"
        minSdk 24
        targetSdk 34
        versionCode 1
        versionName "1.0"
    }

    signingConfigs {
        release {
            storeFile file("blind_social.jks")
            storePassword System.getenv("KEYSTORE_PASSWORD")
            keyAlias System.getenv("KEY_ALIAS")
            keyPassword System.getenv("KEY_PASSWORD")
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}

dependencies {
}`);

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "GooglePlay_Dogrulama_Git_Projesi.zip");
    } catch (error) {
      console.error("Error generating zip", error);
      alert("ZIP dosyası oluşturulurken bir hata oluştu.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-gray-900">
      <div className="max-w-xl w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Download className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Play Console Doğrulama Projesi</h1>
          <p className="text-gray-500 max-w-sm mx-auto">
            Android derleme araçları (SDK/Gradle) bu ortamda bulunmadığı için doğrudan APK üretemiyorum. 
            Bunun yerine, doğrudan Android Studio'da açıp JKS dosyanızla imzalayabileceğiniz hazır projeyi indirebilirsiniz.
          </p>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-sm text-amber-800">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600" />
            <p>
              Ben yapay zeka asistanı olarak <strong>web ortamında</strong> çalışıyorum. Sizin için doğrudan APK oluşturamıyorum. 
              Ancak sizin için yüklediğiniz <strong>blind_social.jks</strong> dosyasını ve <strong>GitHub Actions</strong> üzerinden derlenebilecek yapılandırmayı (YAML dosyasını) içeren bir depo oluşturdum.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Paket Adı (Package Name)</label>
              <input 
                type="text" 
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Doğrulama Snippet'i</label>
              <input 
                type="text" 
                value={snippet}
                onChange={(e) => setSnippet(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm transition-all"
              />
            </div>
          </div>

          <button 
            onClick={generateZip}
            disabled={isGenerating || !packageName || !snippet}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg px-4 py-3 shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
          >
            {isGenerating ? 'Oluşturuluyor...' : 'Hazır Projeyi İndir (.ZIP)'}
            {!isGenerating && <Download className="w-5 h-5" />}
          </button>
        </div>
        
        <div className="bg-blue-50 text-blue-900 rounded-xl p-5 border border-blue-100 text-sm space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <Info className="w-5 h-5 text-blue-600" />
            <span>Ne yapmam gerekiyor?</span>
          </div>
          <ol className="list-decimal list-inside space-y-1.5 text-blue-800/80 ml-1">
            <li>Yukarıdaki butona tıklayıp <strong>ZIP</strong> dosyasını bilgisayarınıza indirin.</li>
            <li>İndirdiğiniz dosyaları klasöre çıkartın ve yeni bir <strong>GitHub Repository</strong>'sine yükleyin (Push yapın).</li>
            <li>GitHub'da deponuzun <strong>Settings &gt; Secrets and variables &gt; Actions</strong> bölümüne gidin.</li>
            <li>Şu üç <strong>Repository secret</strong>'ı oluşturun:
              <ul className="list-disc list-inside ml-5 mt-1 text-xs">
                <li><code>KEYSTORE_PASSWORD</code>: JKS dosyanızın şifresi</li>
                <li><code>KEY_ALIAS</code>: JKS dosyanızdaki alias adı</li>
                <li><code>KEY_PASSWORD</code>: Alias şifresi</li>
              </ul>
            </li>
            <li>GitHub <strong>Actions</strong> sekmesine gidin. Sol menüden <strong>Build Release APK</strong> workflow'una tıklayın.</li>
            <li>Sağ tarafta beliren <strong>Run workflow</strong> ikonuna (veya butonuna) tıklayarak işlemi başlatın.</li>
            <li>İşlem bitince oluşturulan imzalı <strong>APK</strong>'yı sayfanın altındaki <strong>Artifacts</strong> kısmından indirip Play Console'a yükleyin.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
