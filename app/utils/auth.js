export const getToken = () => {
  if (typeof window === "undefined") return null;

  return (
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token")
  );
};

export const getTokenType = () => {
  if (typeof window === "undefined") return null;

  return (
    localStorage.getItem("token_type") || sessionStorage.getItem("token_type")
  );
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("token_type");
  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem("token_type");
};

export const getAuthHeaders = () => {
  const token = getToken();
  const tokenType = getTokenType();

  if (!token || !tokenType) return {};

  return {
    Authorization: `${tokenType} ${token}`,
  };
};
