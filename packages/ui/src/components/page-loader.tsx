export const PageLoader = () => {
  return (
    <div className="page-loader">
      {[...Array(14)].map((_, i) => (
        // @ts-ignore
        <span key={i} style={{ '--i': i }}></span>
      ))}
    </div>
  )
}