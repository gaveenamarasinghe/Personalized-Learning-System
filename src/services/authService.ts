export const loginWithGoogle = async (idToken: string) => {
  const response = await fetch("http://localhost:5000/api/auth/google", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Authentication failed");
  }

  return response.json();
};