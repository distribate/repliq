import { usePageContext } from "vike-react/usePageContext"

export default function StudioThreadsEditThreadPage() {
  const context = usePageContext().routeParams;

  return (
    <>
      Редактирование треда {context.id}
    </>
  )
}