import { appErrorAtom, appIsErrorAtom } from "#shared/models/error.model";
import { reatomComponent } from "@reatom/npm-react";
import { Button } from "@repo/ui/src/components/button";
import { ErrorInfo, PropsWithChildren } from "react"
import { ErrorBoundary as Boundary, FallbackProps } from "react-error-boundary";

function fallbackRender({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex flex-col gap-2 h-[100dvh] items-center justify-center bg-shark-950 p-4 w-full">
      <p className="text-2xl font-semibold">
        Что-то пошло не так...
      </p>
      <Button
        className="bg-shark-50 text-shark-950 px-3 py-0.5 rounded-lg"
        onClick={resetErrorBoundary}
      >
        <p className="text-lg font-semibold">Обновить</p>
      </Button>
      <pre className="mt-3 p-2 rounded-lg bg-red-500 text-black text-sm">
        {error.message}
      </pre>
    </div>
  );
}

const logError = (error: Error, { componentStack, digest }: ErrorInfo) => {
  console.error("Error", error.message, digest, componentStack)
};

const ThrowErrorComponent = reatomComponent(({ ctx }) => {
  const isError = ctx.spy(appIsErrorAtom);
  const error = ctx.spy(appErrorAtom);

  if (isError && error) {
    throw new Error(error.message);
  }

  return null
}, "ThrowErrorComponent")

export const ErrorBoundary = ({ children }: PropsWithChildren) => {
  return (
    <Boundary
      fallbackRender={fallbackRender}
      onError={logError}
    >
      <ThrowErrorComponent />
      {children}
    </Boundary>
  )
}