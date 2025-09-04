type IdLinks =
  | "thread" 
  | "user" 
  | "category"

type GlobalLinks = IdLinks | "auth"

const LINKS_MAP: Record<IdLinks, string> = {
  "thread": "thread/",
  "user": "user/",
  "category": "category/",
} as const

function isIdLink(type: string): type is IdLinks {
  return type in LINKS_MAP;
}

export const createIdLink = (type: GlobalLinks, value?: string): string => {
  let basePath: string;

  if (isIdLink(type)) {
    basePath = `/${LINKS_MAP[type]}`;
  } else {
    if (type.startsWith('/')) {
      basePath = type;
    } else if (type === "" as string) {
      basePath = "/";
    }

    else {
      basePath = `/${type}`;
    }
  }

  if (value !== undefined && value !== null && value !== '') {
    const basePathEndsWithSlash = basePath.endsWith('/');
    const valueStartsWithSlash = value.startsWith('/');

    if (basePathEndsWithSlash && valueStartsWithSlash) {
      return basePath + value.substring(1);
    } else if (!basePathEndsWithSlash && !valueStartsWithSlash) {
      if (basePath === "/") {
        return basePath + value;
      }

      return basePath + '/' + value;
    } else {
      return basePath + value;
    }
  } else {
    return basePath;
  }
}