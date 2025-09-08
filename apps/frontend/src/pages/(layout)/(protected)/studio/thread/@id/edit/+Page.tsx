import { usePageContext } from "vike-react/usePageContext"

export default function Page() {
  const context = usePageContext().routeParams;

  return (
    <>
      Редактирование треда {context.id}
    </>
  )
}