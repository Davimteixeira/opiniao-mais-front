const API_URL = "http://localhost:8001/api/feedbacks/submit/feedback/";

export const submitFeedback = async (rating: number) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      return { success: false, message: "Usuário não autenticado. Faça login." };
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
      body: JSON.stringify({ rating }),
    });

    if (response.status === 201) {
      return { success: true, message: "Feedback enviado com sucesso!" };
    } else if (response.status === 401) {
      return { success: false, message: "Sessão expirada. Faça login novamente." };
    } else {
      const data = await response.json();
      return { success: false, message: data.message || "Erro ao enviar feedback." };
    }
  } catch (error) {
    return { success: false, message: "Erro ao conectar ao servidor." };
  }
};
