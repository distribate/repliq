import { HTTPException } from 'hono/http-exception';
import { HTTPError } from 'ky';

export function throwError(e: unknown): string {
  let error = 'Internal Server Error';
  
  const errorTypes = [ HTTPException, HTTPError ];
  
  if (errorTypes.some((ErrorType) => e instanceof ErrorType)) {
    return (e as { message: string }).message;
  }
  
  if (
    typeof e === 'object' &&
    e !== null &&
    'message' in e &&
    typeof (e as any).message === 'string'
  ) {
    return (e as { message: string }).message;
  }
  
  if (typeof e === 'string') {
    return e;
  }
  
  return error;
}