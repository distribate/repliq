import { ArrowRight, Gamepad2, Globe, Heart, Sparkles, Trophy, Users, Zap } from "lucide-react"
import { CustomLink } from "#components/shared/link"
import { Button } from "@repo/ui/src/components/button"
import { reatomResource, withCache, withDataAtom, withStatusesAtom } from "@reatom/async"
import { forumSharedClient } from "#shared/forum-client"
import { reatomComponent } from "@reatom/npm-react"
import { Footer } from "#components/layout/components/default/footer"
import { AnimatedNumber } from "#ui/animated-number"

const benefits = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Быстрый старт",
    description: "Присоединяйся за секунды и сразу начинай творить"
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Бесплатно навсегда",
    description: "Все основные функции доступны без платы"
  },
  {
    icon: <Trophy className="w-6 h-6" />,
    title: "Система достижений",
    description: "Получай награды за активность и творчество"
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Мировое сообщество",
    description: "Пользователи из более чем 50 стран"
  }
]

const features = [
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "Создавай",
    description: "Твори уникальный контент, делись творчеством и вдохновляй других",
    color: "from-biloba-flower-500 to-pink-500"
  },
  {
    icon: <Gamepad2 className="w-8 h-8" />,
    title: "Играй",
    description: "Участвуй в играх, соревнованиях и интерактивных активностях",
    color: "from-contessa-500 to-shark-500"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Общайся",
    description: "Находи единомышленников и строй настоящие связи",
    color: "from-green-500 to-green-500"
  }
]

const publicStatsResource = reatomResource(async (ctx) => {
  return await ctx.schedule(async () => {
    const res = await forumSharedClient.shared["get-public-stats"].$get()
    const data = await res.json()

    if ("error" in data) {
      return null;
    }

    return {
      threads: Number(data.data.threads_count),
      users: Number(data.data.users_count),
      posts: Number(data.data.posts_count)
    }
  })
}).pipe(withStatusesAtom(), withCache(), withDataAtom({ users: 0, threads: 0, posts: 0 }))

const ForumStats = reatomComponent(({ ctx }) => {
  const data = ctx.spy(publicStatsResource.dataAtom)

  return (
    <>
      <div className="text-center">
        <AnimatedNumber
          className='text-3xl font-bold text-pink-300 mb-1'
          springOptions={{
            bounce: 0,
            duration: 2000,
          }}
          value={data?.users ?? 50}
        />
        <div className="text-shark-50">Участников</div>
      </div>
      <div className="text-center">
        <AnimatedNumber
          className='text-3xl font-bold text-pink-300 mb-1'
          springOptions={{
            bounce: 0,
            duration: 2000,
          }}
          value={data?.threads ?? 50}
        />
        <div className="text-shark-50">Тредов</div>
      </div>
      <div className="text-center">
        <AnimatedNumber
          className='text-3xl font-bold text-pink-300 mb-1'
          springOptions={{
            bounce: 0,
            duration: 2000,
          }}
          value={data?.posts ?? 50}
        />
        <div className="text-shark-50">Постов</div>
      </div>
    </>
  )
}, "ForumStats")

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
              Создавай • Играй •
              <span className="bg-gradient-to-r from-biloba-flower-400 to-pink-400 bg-clip-text text-transparent">
                {" "}Общайся
              </span>
            </h1>
            <p className="text-xl text-shark-200 mb-6 max-w-2xl mx-auto leading-relaxed">
              Repliq - это платформа, где творчество встречается с играми, а идеи превращаются в реальность.
              Делись своими проектами, находи вдохновение и строй связи с единомышленниками.
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
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
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
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index}>
              <div className="flex flex-col items-center justify-center 
                rounded-lg px-2 py-6 bg-white/10 border border-white/20 duration-300 h-full">
                <div className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white`}>
                    {feature.icon}
                  </div>
                  <p className="text-white text-xl">{feature.title}</p>
                </div>
                <div>
                  <p className="text-biloba-flower-200 text-center leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="container mx-auto py-20 sm:py-28">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Почему выбирают Repliq?
          </h2>
          <p className="text-xl text-shark-200 max-w-2xl mx-auto">
            Мы создали платформу, где каждый может найти свое место и реализовать потенциал
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} >
              <div className="rounded-lg border bg-white/10 border-white/20 transition-all duration-300 h-full">
                <div className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-biloba-flower-500/20 flex items-center justify-center text-biloba-flower-400">
                    {benefit.icon}
                  </div>
                  <h3 className="text-white font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-biloba-flower-200 text-sm leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="container mx-auto py-20 sm:py-32">
        <div className="text-center">
          <div className="bg-gradient-to-r border rounded-lg from-biloba-flower-600/20 to-pink-600/20 border-biloba-flower-500/30 max-w-3xl mx-auto">
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
                    className="bg-gradient-to-br text-wrap from-shark-50 to-shark-100 text-md sm:text-lg text-shark-950 py-2 sm:py-4 h-auto"
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