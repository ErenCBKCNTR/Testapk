import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-gray-900">
      <div className="max-w-xl w-full space-y-6">
        <div className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Proje Dosyaları Hazır!</h1>
          <p className="text-gray-500 max-w-sm mx-auto text-sm leading-relaxed">
            Android doğrulama projesi dosyaları bu çalışma alanının içerisine başarıyla oluşturuldu. GitHub Actions iş akışı (.github/workflows/build.yml) dahil her şey hazır, derleme işlemi doğrudan GitHub üzerinde gerçekleşecek.
          </p>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Şimdi Ne Yapacaksınız?
          </h2>
          
          <div className="space-y-4 text-sm text-gray-600">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 relative">
              <div className="absolute -left-3 -top-3 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm border-4 border-white shadow-sm">1</div>
              <p className="ml-2 font-medium">Bu projeyi kendi GitHub hesabınıza aktarın.</p>
              <p className="ml-2 text-gray-500 mt-1">AI Studio menüsünden <strong>(Üç nokta &gt; Export to GitHub)</strong> seçeneğini kullanarak bu çalışma alanını doğrudan GitHub Repository'nize gönderin.</p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 relative">
              <div className="absolute -left-3 -top-3 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm border-4 border-white shadow-sm">2</div>
              <p className="ml-2 font-medium">GitHub'da şifrelerinizi Secret olarak ekleyin.</p>
              <p className="ml-2 text-gray-500 mt-1">Deponuzun <strong className="text-gray-700">Settings &gt; Secrets and variables &gt; Actions</strong> sayfasına gidip şu 3 sabiti <strong>Repository Secret</strong> olarak oluşturun:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-700 font-mono text-xs">
                <li>KEYSTORE_PASSWORD <span className="font-sans text-gray-400 ml-1">(JKS şifreniz)</span></li>
                <li>KEY_ALIAS <span className="font-sans text-gray-400 ml-1">(JKS takma adınız)</span></li>
                <li>KEY_PASSWORD <span className="font-sans text-gray-400 ml-1">(Takma ad şifreniz)</span></li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-green-50 border border-green-100 relative">
              <div className="absolute -left-3 -top-3 w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm border-4 border-white shadow-sm">3</div>
              <p className="ml-2 font-medium text-green-900">Actions sekmesinden APK'yı oluşturun.</p>
              <p className="ml-2 text-green-800/80 mt-1">GitHub sayfanızın üstündeki <strong>Actions</strong> sekmesine tıklayın. Sol menüden <strong>Build Release APK</strong>'yi seçip sağdaki <strong>Run workflow</strong> butonuna basın. Birkaç dakika içinde APK dosyanız Artifacts listesinde belirecek!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
