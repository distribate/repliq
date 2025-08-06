import { usePageContext } from 'vike-react/usePageContext'

export default function Page() {
  const pageContext = usePageContext()

  let msg: string

  const { abortReason, abortStatusCode } = pageContext

  if (typeof abortReason === 'string') {
    msg = abortReason
  } else if (abortStatusCode === 403) {
    msg = "You cannot access this page because you don't have enough privileges."
  } else if (abortStatusCode === 401) {
    msg = "You cannot access this page because you aren't logged in. Please log in."
  } else {
    msg = pageContext.is404 ?
      "This page doesn't exist." :
      "Something went wrong. Try again (later)."
  }

  return (
    <p>{msg}</p>
  )
}