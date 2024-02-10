export default interface LoginResponse {
  tokens: {
    access_token: string;
  };
  username: string;
  user_id: number;
}
