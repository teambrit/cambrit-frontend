export const isLoggedIn = () => !!localStorage.getItem("token");

export const logout = (navigate) => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  navigate("/");
};