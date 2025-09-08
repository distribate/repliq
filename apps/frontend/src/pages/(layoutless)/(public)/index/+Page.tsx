import { ArrowRight } from "lucide-react"
import { CustomLink } from "#shared/components/link"
import { Button } from "@repo/ui/src/components/button"
import { Footer } from "#components/layout/footer/footer"
import { Stat, transformData } from "#components/widgets/forum-stats/components/forum-stats"
import { IconBrandThreads, IconDownload, IconSparkles, IconUserCheck, IconUsersGroup } from "@tabler/icons-react"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react"
import { useData } from "vike-react/useData"
import { Data } from "./+data"

const features = [
  {
    icon: <IconSparkles className="w-6 h-6" />,
    title: "Соцсеть без лишнего шума",
    description: "Общайся, делись мыслями и читай только то, что тебе интересно",
  },
  {
    icon: <IconBrandThreads className="w-6 h-6" />,
    title: "Формат тредов",
    description: "Находи единомышленников и строй настоящие связи",
  },
  {
    icon: <IconUserCheck className="w-6 h-6" />,
    title: "Профиль под твой стиль",
    description: "Настраивай внешний вид и функционал своего профиля под себя",
  },
  {
    icon: <IconUsersGroup className="w-6 h-6" />,
    title: "Друзья и приватность",
    description: "Добавляй друзей, управляй запросами и контролируй доступ к контенту",
  },
]

const DEFAULT_TALL_CLASS = 'min-h-[22rem]';
const DEFAULT_NORMAL_CLASS = 'min-h-[12rem]';

function chunkArray(arr: any[], size = 2) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

const MasonryGrid = ({
  items = [],
  renderItem,
  keyFn = (it, idx) => it.id ?? it.key ?? idx,
  gap = 16,
}: {
  items: any[];
  renderItem: (item: any) => React.ReactNode;
  keyFn?: (item: any, index: number) => string | number;
  gap?: number;
}) => {
  const rows = chunkArray(items, 2);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: `${gap}px` }}>
        <AnimatePresence>
          {rows.map((pair, rowIndex) => {
            const wideLeft = rowIndex % 2 === 0;
            const rowKey = `row-${rowIndex}`;

            if (pair.length === 1) {
              const item = pair[0];
              const key = keyFn(item, rowIndex * 2);

              return (
                <motion.div
                  key={rowKey}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="col-span-3"
                >
                  <motion.div
                    layout
                    key={key}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className={`w-full ${DEFAULT_TALL_CLASS}`}
                  >
                    {renderItem(item)}
                  </motion.div>
                </motion.div>
              );
            }

            const [a, b] = pair;
            const aKey = keyFn(a, rowIndex * 2);
            const bKey = keyFn(b, rowIndex * 2 + 1);

            return (
              <motion.div
                key={rowKey}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="col-span-1 md:col-span-3"
              >
                <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: `${gap}px` }}>
                  {wideLeft ? (
                    <>
                      <motion.div
                        layout
                        key={aKey}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className={`md:col-span-2 col-span-1 ${DEFAULT_TALL_CLASS}`}
                      >
                        {renderItem(a)}
                      </motion.div>
                      <motion.div
                        layout
                        key={bKey}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className={`md:col-span-1 col-span-1 ${DEFAULT_NORMAL_CLASS}`}
                      >
                        {renderItem(b)}
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <motion.div
                        layout
                        key={aKey}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className={`md:col-span-1 col-span-1 ${DEFAULT_NORMAL_CLASS}`}
                      >
                        {renderItem(a)}
                      </motion.div>
                      <motion.div
                        layout
                        key={bKey}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className={`md:col-span-2 col-span-1 ${DEFAULT_TALL_CLASS}`}
                      >
                        {renderItem(b)}
                      </motion.div>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}

const InstallAppButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    setDeferredPrompt(null);
  };

  return (
    deferredPrompt && (
      <Button
        size="lg"
        className="font-semibold border-2 border-blue-500 hover:bg-blue-500 text-wrap text-md sm:text-lg text-shark-50 py-2 sm:py-3 h-auto"
        onClick={handleInstallClick}
      >
        Установить приложение
        <IconDownload className="ml-2 w-5 h-5" />
      </Button>
    )
  )
}

export default function Page() {
  const { data } = useData<Data>();

  const stats = transformData(data);

  return (
    <div className="min-h-screen landing-background">
      <div
        className="absolute bg-center min-h-[1400px] h-full w-full !px-0"
        style={{ backgroundImage: `url("/images/rays.png")` }}
      >
      </div>
      <section id="hero" className="container pt-12 mx-auto py-20 sm:py-28 relative px-2">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex flex-col relative items-center justify-center mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Создавай и
              <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                {" "}Общайся
              </span>
            </h1>
            <p className="text-xl text-shark-200 mb-6 max-w-4xl mx-auto leading-relaxed">
              Repliq — это платформа для общения в формате тредов.
              Создавай обсуждения, обменивайся мнениями и находи интересных собеседников на платформе нового поколения.
            </p>
          </div>
          <div
            className="flex flex-col sm:flex-row justify-center items-center mb-12"
          >
            <CustomLink to="/home">
              <Button
                size="lg"
                className="rounded-xl font-semibold text-shark-950 hover:text-shark-50  hover:bg-green-600 bg-shark-50 text-xl py-3 h-auto"
              >
                Присоединиться
              </Button>
            </CustomLink>
          </div>
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {stats.map((item) => <Stat key={item.title} {...item} />)}
          </div>
        </div>
      </section>
      <section id="about" className="container mx-auto relative py-20 sm:py-28 px-2">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Безграничные возможности для творчества
          </h2>
          <p className="text-xl text-shark-200 max-w-2xl mx-auto">
            Repliq предоставляет все инструменты для воплощения твоих идей в жизнь
          </p>
        </div>
        <MasonryGrid
          items={features}
          renderItem={(feature) => (
            <div
              className={`flex flex-col items-start justify-between rounded-3xl
                p-6 sm:p-8 gap-3 h-full bg-shark-50/10`}
            >
              <div className="flex items-start h-full justify-start w-full">
                <div className="flex flex-col gap-2 w-full">
                  <p className="text-white font-bold text-2xl sm:text-3xl">
                    {feature.title}
                  </p>
                  <p className="text-shark-50 text-base sm:text-lg font-semibold text-left leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
              <div className={`flex items-center justify-center aspect-square bg-shark-50 h-12 rounded-lg text-shark-950`}>
                {feature.icon}
              </div>
            </div>
          )}
        />
      </section>
      <section className="container mx-auto py-20 sm:py-32 px-2">
        <div className="text-center">
          <div className="bg-gradient-to-r rounded-lg from-biloba-flower-500/20
             to-blue-500/20 max-w-3xl mx-auto">
            <div className="p-4 sm:p-12">
              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
                Готов присоединиться к Repliq?
              </h2>
              <p className="text-base sm:text-xl text-shark-200 mb-8 leading-relaxed">
                Начни свое творческое путешествие уже сегодня. Создай аккаунт за минуту и
                окунись в мир безграничных возможностей.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row justify-center items-center">
                <CustomLink to="/auth">
                  <Button
                    size="lg"
                    className="font-semibold bg-shark-50 text-wrap text-md sm:text-lg text-shark-950 py-2 sm:py-3 h-auto"
                  >
                    Создать аккаунт
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </CustomLink>
                <InstallAppButton />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="container pb-2 mx-auto px-2">
        <Footer />
      </section>
    </div>
  )
}