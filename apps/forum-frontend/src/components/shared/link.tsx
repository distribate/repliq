import { forwardRef } from 'react'
import { createLink } from '@tanstack/react-router'
import type { LinkComponent, LinkProps } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'

const LinkComponent = forwardRef<HTMLAnchorElement, LinkProps & { className?: string, onClick?: React.MouseEventHandler<HTMLAnchorElement> | undefined }>((props, ref) =>
  <Link ref={ref} onClick={props.onClick} {...props} />
)

const CreatedLinkComponent = createLink(LinkComponent)

export const CustomLink: LinkComponent<typeof LinkComponent> = (props) => {
  return <CreatedLinkComponent viewTransition {...props} />
}