import React from "react";

export default function TechPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-black text-center px-6">

      <div className="bg-white/5 backdrop-blur-lg p-10 rounded-2xl shadow-2xl border border-white/10 max-w-xl">
        <h1 className="text-5xl font-extrabold text-cyan-400 drop-shadow-md mb-6">
          ⚙️ Технические работы
        </h1>

        <p className="text-gray-300 text-lg leading-relaxed mb-6">
          Наш сервис временно недоступен.  
          Мы проводим обновление системы и вернёмся к работе в ближайшее время.
        </p>

        <p className="text-gray-400 text-sm">
          Приносим извинения за временные неудобства.
        </p>
      </div>

      <footer className="mt-10 text-gray-500 text-sm">
        © {new Date().getFullYear()} STEAMPAY
      </footer>
    </div>
  );
}
