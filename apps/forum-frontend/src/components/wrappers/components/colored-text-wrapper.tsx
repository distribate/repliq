import { HTMLAttributes } from "react";

const colorMap: Record<string, string> = {
  "0": "#000000",
  "1": "#0000AA",
  "2": "#00AA00",
  "3": "#00AAAA",
  "4": "#AA0000",
  "5": "#AA00AA",
  "6": "#FFAA00",
  "7": "#AAAAAA",
  "8": "#555555",
  "9": "#5555FF",
  a: "#55FF55",
  b: "#55FFFF",
  c: "#FF5555",
  d: "#FF55FF",
  e: "#FFFF55",
  f: "#FFFFFF",
};

type ColoredTextProps = {
  text: string;
} & HTMLAttributes<HTMLDivElement>

export const ColoredText = ({ text, className, ...props }: ColoredTextProps) => {
  let parts: JSX.Element[] = [];

  let currentColor: string = "inherit";
  let buffer: string = "";

  for (let i = 0; i < text.length; i++) {
    if (text[i] === "&" && i + 1 < text.length) {
      if (buffer) {
        parts.push(
          <span style={{ color: currentColor }} key={parts.length}>
            {buffer}
          </span>
        );

        buffer = "";
      }

      const colorCode = text[i + 1];

      if (colorMap[colorCode]) {
        currentColor = colorMap[colorCode];
        i++;

        continue;
      }
    }

    buffer += text[i];
  }

  if (buffer) {
    parts.push(
      <span style={{ color: currentColor }} key={parts.length}>
        {buffer}
      </span>
    );
  }

  return <div className={`${className} inline`} {...props}>{parts}</div>;
};