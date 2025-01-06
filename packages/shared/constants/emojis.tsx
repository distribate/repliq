import { Heart } from "lucide-react";

export const THREAD_REACTIONS: Record<string, JSX.Element | string> = {
  "like": "👍", 
  "love": "❤️",
  "laugh": "😂",
  "sad": "😢",
  "heart": <Heart size={16} />,
  "ghost": "👻",
  "clap": "👏",  
  "fire": "🔥",
  "star": "⭐",  
  "party": "🥳",  
  "thumbs_up": "👍",  
  "wink": "😉",  
  "kiss": "💋",  
  "thinking": "🤔", 
  "trophy": "🏆",  
} as const;