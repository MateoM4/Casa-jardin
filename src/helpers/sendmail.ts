export const sendEmail = async (email: string): Promise<Response> => {
    const response = await fetch("/api/sendMail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ receptor: email }),
    });
  
    if (!response.ok) {
      throw new Error("Error sending email");
    }
<<<<<<< Updated upstream
  };
=======
    return response
};

export const sendEmailCustom = async (email: string, titulo?: string, texto?: string): Promise<Response> => {
  const response = await fetch("/api/sendMailcustom", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ receptor: email, titulo: titulo, texto: texto }),
  });

  if (!response.ok) {
    throw new Error("Error sending email");
  }

  return response
};
>>>>>>> Stashed changes
