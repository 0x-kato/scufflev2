export default interface LoginResponse {
  tokens: {
    access_token: string;
    refresh_token: string;
  };
  username: string;
}
