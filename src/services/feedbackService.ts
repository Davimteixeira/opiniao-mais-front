import api from './api';
import type { FeedbackStats, RecentFeedback, Period } from '../types/feedback';

/**
 * Submit user feedback with rating
 */
export const submitFeedback = async (rating: number) => {
  try {
    await api.post('/feedbacks/submit/feedback/', { rating });
    return { success: true, message: 'Feedback enviado com sucesso!' };
  } catch (error: any) {
    if (error.response?.status === 401) {
      return {
        success: false,
        message: 'Sessão expirada. Por favor, faça login novamente.',
      };
    }
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao enviar feedback.',
    };
  }
};

/**
 * Get feedback statistics for the specified period
 */
export const getFeedbackStats = async (
  period: Period
): Promise<FeedbackStats> => {
  const response = await api.get('/feedbacks/stats/', {
    params: { period },
  });
  return response.data;
};

/**
 * Get recent user feedbacks
 */
export const getRecentFeedbacks = async (): Promise<RecentFeedback[]> => {
  const response = await api.get('/feedbacks/recent/');
  return response.data;
};

/**
 * Export feedbacks to CSV for the specified period
 */
export const exportFeedbackCSV = async (period: Period): Promise<void> => {
  const response = await api.get('/feedbacks/export-csv/', {
    params: { period },
    responseType: 'blob',
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `feedbacks_${period}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
