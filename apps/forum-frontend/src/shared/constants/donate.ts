import { IconBrandThreads, IconDeviceDesktopAnalytics, IconEyeClosed, IconMoodSpark, IconPalette, IconStar } from "@tabler/icons-react";

export const DONATE_FEATURES = [
  {
    title: "Кастомизация профиля",
    description: "Настройте свой профиль так, как хотите – сделайте его уникальным.",
    icon: IconPalette
  },
  {
    title: "Расширенная статистика",
    description: "Отслеживайте подробную статистику своего профиля и тредов.",
    icon: IconDeviceDesktopAnalytics
  },
  {
    title: "Контроль над тредами",
    description: "Настройте видимость своих тредов – только для друзей или выделенных персон.",
    icon: IconBrandThreads
  },
  {
    title: "Повышенный лимит на реакции",
    description: "Выражайте больше эмоций! Возможность ставить до 3 реакций вместо 1 на треды.",
    icon: IconMoodSpark
  },
  {
    title: "Скрывать последнее время посещения",
    description: "Возможность скрывать отображение своей активности.",
    icon: IconEyeClosed
  },
  {
    title: "Значок у имени",
    description: "Эксклюзивный значок у имени показывает что вы владелец Repliq+.",
    icon: IconStar
  }
]

export const URL_FOR_REPLIQ = `/store?target=repliq+`