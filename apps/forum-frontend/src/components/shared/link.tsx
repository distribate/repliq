export const CustomLink = (props: any) => {
  return <a href={props.to ?? props.href ?? "/"} {...props} />
}