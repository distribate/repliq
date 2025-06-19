import { ArrowRight, Gamepad2, Globe, Heart, Sparkles, Trophy, Users, Zap } from "lucide-react"
import { motion } from 'framer-motion'
import { CustomLink } from "#components/shared/link"
import { Button } from "@repo/ui/src/components/button"
import { Footer } from "./footer"
import { reatomResource, withCache, withDataAtom, withStatusesAtom } from "@reatom/async"
import { forumSharedClient } from "@repo/shared/api/forum-client"
import { reatomComponent } from "@reatom/npm-react"
import { AnimatedNumber } from "./animated-number"

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

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
}).pipe(withStatusesAtom(), withCache(), withDataAtom({
  users: 0,
  threads: 0,
  posts: 0
}))

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

export const PublicVariant = () => {
  return (
    <div className="min-h-screen landing-background *:px-2">
      <div className="absolute bg-center min-h-[1400px] h-full w-full !px-0" style={{ backgroundImage: `url("/images/rays.png")` }}></div>
      <section id="hero" className="container pt-12 mx-auto py-20 sm:py-28 relative">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="flex flex-col relative items-center justify-center mb-8">
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
              Fasberry - это платформа, где творчество встречается с играми, а идеи превращаются в реальность.
              Делись своими проектами, находи вдохновение и строй связи с единомышленниками.
            </p>
          </motion.div>
          <motion.div
            variants={fadeInUp}
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
          </motion.div>
          <motion.div
            variants={fadeInUp} className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            <ForumStats />
          </motion.div>
        </motion.div>
      </section>
      <section id="about" className="container mx-auto relative py-20 sm:py-28">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Безграничные возможности для творчества
            </h2>
            <p className="text-xl text-shark-200 max-w-2xl mx-auto">
              Fasberry предоставляет все инструменты для воплощения твоих идей в жизнь
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
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
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
      <section className="container mx-auto py-20 sm:py-28">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Почему выбирают Fasberry?
            </h2>
            <p className="text-xl text-shark-200 max-w-2xl mx-auto">
              Мы создали платформу, где каждый может найти свое место и реализовать потенциал
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <div className="rounded-lg border bg-white/10 border-white/20 transition-all duration-300 h-full">
                  <div className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-biloba-flower-500/20 flex items-center justify-center text-biloba-flower-400">
                      {benefit.icon}
                    </div>
                    <h3 className="text-white font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-biloba-flower-200 text-sm leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
      <section className="container mx-auto py-20 sm:py-32">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r border rounded-lg from-biloba-flower-600/20 to-pink-600/20 border-biloba-flower-500/30 max-w-3xl mx-auto">
            <div className="p-4 sm:p-12">
              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
                Готов присоединиться к Fasberry?
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
        </motion.div>
      </section>
      <section className="container pb-2 mx-auto">
        <Footer />
      </section>
    </div>
  )
}