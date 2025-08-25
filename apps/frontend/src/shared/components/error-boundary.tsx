import { ErrorInfo, PropsWithChildren } from "react"
import { ErrorBoundary as Boundary, FallbackProps } from "react-error-boundary";

function fallbackRender({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex flex-col h-[80dvh] items-center justify-center bg-shark-950 p-4 w-full">
      <p className="text-2xl font-semibold">
        Что-то пошло не так...
      </p>
      <p
        className="text-shark-300"
        onClick={resetErrorBoundary} 
      >
        Обновить
      </p>
      <pre className="text-red-500 text-sm">
        {error.message}
      </pre>
    </div>
  );
}

const logError = (error: Error, { componentStack, digest }: ErrorInfo) => {
  console.error("Error", error.message, digest, componentStack)
};

export const ErrorBoundary = ({ children }: PropsWithChildren) => {
  return (
    <Boundary
      fallbackRender={fallbackRender}
      onError={logError}
    >
      {children}
    </Boundary>
  )
}