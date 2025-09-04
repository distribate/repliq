export const CustomLink = (props: any) => {
  return (
    <a
      href={props.to ?? props.href ?? "/"}
      keep-scroll-position={true}
      {...props}
    />
  )
}