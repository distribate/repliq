export type ResponseType<T> = {
  errorMessage: string;
  isSuccess: boolean;
  errorCode: number;
  data: T;
};