import { Settings, AlertTriangle } from 'lucide-react';

export function TechMaintenance() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="relative inline-block mb-6">
          <Settings className="w-24 h-24 text-cyan-400 animate-spin-slow" />
          <AlertTriangle className="w-12 h-12 text-yellow-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">
          Технические работы
        </h1>
        <p className="text-xl text-gray-300 mb-4">
          Сайт временно недоступен
        </p>
        <p className="text-gray-400">
          Мы проводим плановое обслуживание системы для улучшения качества сервиса.
          Пожалуйста, вернитесь позже.
        </p>
        <div className="mt-8 p-4 bg-gray-800/50 border border-cyan-500/30 rounded-lg">
          <p className="text-sm text-gray-400">
            Приносим извинения за временные неудобства
          </p>
        </div>
      </div>
    </div>
  );
}
