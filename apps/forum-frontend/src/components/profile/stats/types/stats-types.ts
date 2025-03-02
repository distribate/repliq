export type StatsRequest = {
  nickname: string;
};

export type ResponseType<T> = {
  errorMessage: string;
  isSuccess: boolean;
  errorCode: number;
  data: T;
};
