import { useEffect, useState } from 'react';
import {
  BarChart3,
  Download,
  Frown,
  Meh,
  Smile,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  getFeedbackStats,
  getRecentFeedbacks,
  exportFeedbackCSV,
} from '../services/feedbackService';
import type { FeedbackStats, RecentFeedback, Period } from '../types/feedback';

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('30d');
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [recentFeedbacks, setRecentFeedbacks] = useState<RecentFeedback[]>([]);
  const [loading, setLoading] = useState(false);

  const periods = [
    { value: '7d', label: 'Últimos 7 dias' },
    { value: '30d', label: 'Últimos 30 dias' },
    { value: '90d', label: 'Últimos 90 dias' },
    { value: '12m', label: 'Últimos 12 meses' },
  ];

  const getEmojiForRating = (value: number) => {
    const baseClass = 'w-8 h-8';
    switch (value) {
      case 1:
        return <Frown className={`${baseClass} text-red-500`} />;
      case 2:
        return <Meh className={`${baseClass} text-red-400`} />;
      case 3:
        return <Meh className={`${baseClass} text-yellow-500`} />;
      case 4:
        return <Smile className={`${baseClass} text-green-400`} />;
      case 5:
        return <Smile className={`${baseClass} text-green-500`} />;
      default:
        return null;
    }
  };

  const getTrendIcon = (change: number) => {
    const baseClass = 'w-5 h-5 ml-1';
    if (change > 0) {
      return <TrendingUp className={`${baseClass} text-green-500`} />;
    } else if (change < 0) {
      return <TrendingDown className={`${baseClass} text-red-500`} />;
    }
    return <Minus className={`${baseClass} text-gray-400`} />;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsData, feedbacksData] = await Promise.all([
          getFeedbackStats(selectedPeriod),
          getRecentFeedbacks(),
        ]);
        setStats(statsData);
        setRecentFeedbacks(feedbacksData);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedPeriod]);

  const handleExportCSV = async () => {
    try {
      await exportFeedbackCSV(selectedPeriod);
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="bg-white shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Painel de Feedback
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Análise de Feedbacks</h1>
            <div className="flex gap-4">
              <select
                className="px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as Period)}
              >
                {periods.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                onClick={handleExportCSV}
              >
                <Download className="w-4 h-4" />
                <span>Exportar CSV</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-3 text-center py-12">
                <div className="animate-pulse text-gray-600">Carregando...</div>
              </div>
            ) : (
              <>
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium text-gray-600">NPS Geral</p>
                    {getTrendIcon(stats?.nps_change ?? 0)}
                  </div>
                  <h3 className="text-3xl font-bold mt-2 text-gray-900">{stats?.nps.toFixed(1) ?? '--'}</h3>
                  <div className="w-full bg-gray-100 rounded-full h-3 mt-4">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(0, Math.min(100, stats?.nps ?? 0))}%` }}
                    ></div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium text-gray-600">Total de Respostas</p>
                    {getTrendIcon(stats?.response_rate_change ?? 0)}
                  </div>
                  <h3 className="text-3xl font-bold mt-2 text-gray-900">
                    {stats?.total_responses ?? '--'}
                  </h3>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium text-gray-600">Avaliação Média</p>
                    {getTrendIcon(stats?.average_rating_change ?? 0)}
                  </div>
                  <h3 className="text-3xl font-bold mt-2 text-gray-900">
                    {stats?.average_rating.toFixed(1) ?? '--'}
                  </h3>
                </div>
              </>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Feedbacks Recentes</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avaliação
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {recentFeedbacks.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {format(new Date(item.submitted_at), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </td>
                      <td className="px-6 py-4">{getEmojiForRating(item.rating)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}