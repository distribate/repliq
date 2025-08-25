import { ArrowRight, Globe, Heart, Trophy, Zap } from "lucide-react"
import { CustomLink } from "#shared/components/link"
import { Button } from "@repo/ui/src/components/button"
import { Footer } from "#components/layout/components/default/footer"
import { ForumStats } from "#components/layout/components/widgets/forum-stats/components/forum-stats"
import { IconBrandThreads, IconSparkles, IconUserCheck, IconUsersGroup } from "@tabler/icons-react"

const features = [
  {
    icon: <IconSparkles className="w-6 h-6" />,
    title: "Соцсеть без лишнего шума",
    description: "Общайся, делись мыслями и читай только то, что тебе интересно.",
    color: "bg-gradient-to-t from-green-700 to-green-600"
  },
  {
    icon: <IconBrandThreads className="w-6 h-6" />,
    title: "Формат тредов",
    description: "Находи единомышленников и строй настоящие связи",
    color: "bg-gradient-to-b from-helper-background to-helper-background"
  },
  {
    icon: <IconUserCheck className="w-6 h-6" />,
    title: "Профиль под твой стиль",
    description: "Настраивай внешний вид и функционал своего профиля под себя.",
    color: "bg-gradient-to-b from-gold-400 to-gold-700"
  },
  {
    icon: <IconUsersGroup className="w-6 h-6" />,
    title: "Друзья и приватность",
    description: "Добавляй друзей, управляй запросами и контролируй доступ к контенту.",
    color: "bg-gradient-to-br from-pink-400 to-pink-700"
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen landing-background *:px-2">
      <div
        className="absolute bg-center min-h-[1400px] h-full w-full !px-0"
        style={{ backgroundImage: `url("/images/rays.png")` }}
      >
      </div>
      <section id="hero" className="container pt-12 mx-auto py-20 sm:py-28 relative">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex flex-col relative items-center justify-center mb-8">
            <div className="flex select-none 
              items-center border w-fit rounded-lg justify-center px-2 py-0.5 mb-4 
            bg-biloba-flower-500/20 text-biloba-flower-300 border-biloba-flower-500/30"
            >
              🎉 Присоединяйся к творческому сообществу
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Создавай и
              <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                {" "}Общайся
              </span>
            </h1>
            <p className="text-xl text-shark-200 mb-6 max-w-2xl mx-auto leading-relaxed">
              Repliq — это платформа для общения в формате тредов.
              Создавай обсуждения, обменивайся мнениями и находи интересных собеседников на форуме нового поколения.
            </p>
          </div>
          <div
            className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12"
          >
            <CustomLink to="/auth">
              <Button
                size="lg"
                className="rounded-2xl text-shark-950 hover:text-shark-50  hover:bg-pink-600 bg-shark-50 text-lg py-4 h-auto"
              >
                Начать творить
              </Button>
            </CustomLink>
          </div>
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <ForumStats />
          </div>
        </div>
      </section>
      <section id="about" className="container mx-auto relative py-20 sm:py-28">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Безграничные возможности для творчества
          </h2>
          <p className="text-xl text-shark-200 max-w-2xl mx-auto">
            Repliq предоставляет все инструменты для воплощения твоих идей в жизнь
          </p>
        </div>
        <div className="flex gap-8 pb-4 overflow-x-auto rounded-xl items-stretch
         [&::-webkit-scrollbar-thumb]:bg-green-800 [&::-webkit-scrollbar]:bg-transparent [&::-webkit-scrollbar]:rounded-lg [&::-webkit-scrollbar]:h-2 overflow-y-visible">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-start justify-between rounded-3xl snap-x snap-mandatory scroll-smooth
                p-6 sm:p-8 gap-3 flex-shrink-0 w-[80%] sm:w-[45%] lg:w-[30%]  ${feature.color}`}
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
          ))}
        </div>
      </section>
      <section className="container mx-auto py-20 sm:py-32">
        <div className="text-center">
          <div className="bg-gradient-to-r border rounded-lg from-biloba-flower-500/20
             to-pink-500/20 border-biloba-flower-500/30 max-w-3xl mx-auto">
            <div className="p-4 sm:p-12">
              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
                Готов присоединиться к Repliq?
              </h2>
              <p className="text-base sm:text-xl text-shark-200 mb-8 leading-relaxed">
                Начни свое творческое путешествие уже сегодня. Создай аккаунт за минуту и
                окунись в мир безграничных возможностей.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center">
                <CustomLink to="/auth">
                  <Button
                    size="lg"
                    className="font-semibold bg-shark-50 text-wrap text-md sm:text-lg text-shark-950 py-2 sm:py-3 h-auto"
                  >
                    Создать аккаунт бесплатно
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </CustomLink>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="container pb-2 mx-auto">
        <Footer />
      </section>
    </div>
  )
}