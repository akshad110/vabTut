import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout/Layout";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  BookOpen,
  MessageSquare,
  Video,
  Coins,
  Trophy,
  Users,
  Zap,
  Star,
  ArrowRight,
  Play,
  Sparkles,
  Brain,
  Lightbulb,
  UserPlus,
  FileText,
  HelpCircle,
  Gift,
  CheckCircle,
  Quote,
  GraduationCap,
  Mic,
  Bot,
} from "lucide-react";

export default function Index() {
  const heroRef = useRef(null);
  const howItWorksRef = useRef(null);
  const featuresRef = useRef(null);
  const testimonialsRef = useRef(null);

  const isHeroInView = useInView(heroRef, { once: true });
  const isHowItWorksInView = useInView(howItWorksRef, { once: true });
  const isFeaturesInView = useInView(featuresRef, { once: true });
  const isTestimonialsInView = useInView(testimonialsRef, { once: true });

  const howItWorksSteps = [
    {
      icon: FileText,
      step: "01",
      title: "Post a Doubt",
      description:
        "Share your question with detailed description and get matched with the right tutor instantly.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Users,
      step: "02",
      title: "Get Help",
      description:
        "Connect with expert peer tutors through voice, video, or chat for personalized learning.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Coins,
      step: "03",
      title: "Earn Coins",
      description:
        "Receive coin rewards for helping others and build your reputation in the community.",
      color: "from-yellow-500 to-orange-500",
    },
  ];

  const features = [
    {
      icon: Video,
      title: "Real-time Communication",
      description:
        "Connect instantly through voice, video calls, and chat powered by advanced Vapi technology",
      color: "text-blue-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
    },
    {
      icon: Bot,
      title: "AI-Powered Quizzes",
      description:
        "Personalized quiz generation with AI to test and improve your understanding",
      color: "text-purple-500",
      bgGradient: "from-purple-500/10 to-pink-500/10",
    },
    {
      icon: Gift,
      title: "Reward System",
      description:
        "Earn coins and badges for helping others, creating a motivating learning ecosystem",
      color: "text-yellow-500",
      bgGradient: "from-yellow-500/10 to-orange-500/10",
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Computer Science Student",
      university: "IIT Delhi",
      image: "👩‍💻",
      content:
        "VabTut helped me understand complex algorithms through peer tutoring. The coin system motivated me to help others too!",
      rating: 5,
    },
    {
      name: "Aarav Patel",
      role: "Mathematics Student",
      university: "BITS Pilani",
      image: "👨‍🎓",
      content:
        "The AI quizzes are incredibly accurate and the real-time doubt solving saved my exams. Highly recommended!",
      rating: 5,
    },
    {
      name: "Kavya Reddy",
      role: "Physics Student",
      university: "NIT Warangal",
      image: "👩‍🔬",
      content:
        "Found the best study group here. The voice calls make learning so much more interactive and fun.",
      rating: 5,
    },
  ];

  const stats = [
    { label: "Active Students", value: "50K+", icon: Users },
    { label: "Doubts Solved", value: "1M+", icon: CheckCircle },
    { label: "Success Rate", value: "96%", icon: Star },
    { label: "Avg Response", value: "< 2min", icon: Zap },
  ];

  return (
    <Layout>
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/20 via-background to-amber-50/20 dark:from-orange-950/20 dark:via-background dark:to-amber-950/20" />

        {/* Floating Academic Orbs */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-orange-400/10 to-amber-400/10 rounded-full blur-3xl"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-2xl"
          animate={{
            y: [0, 30, 0],
            x: [0, -10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8"
        >
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={
                isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
              }
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Badge className="mb-6 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/50 dark:to-amber-900/50 text-orange-800 dark:text-orange-200 border-orange-200/50 dark:border-orange-700/50 backdrop-blur-sm">
                <GraduationCap className="w-3 h-3 mr-1" />
                Where Students Empower Students
              </Badge>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
              initial={{ opacity: 0, y: 50 }}
              animate={
                isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
              }
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            >
              <span className="text-slate-900 dark:text-slate-100">
                Learn Together.
              </span>
              <br />
              <motion.span
                className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  backgroundSize: "200% 200%",
                }}
              >
                Grow Together.
              </motion.span>
            </motion.h1>

            <motion.p
              className="mt-8 text-xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={
                isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
              }
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              Connect with brilliant peers, solve academic doubts through voice,
              video & chat, and earn rewards while building a supportive
              learning community.
            </motion.p>

            <motion.div
              className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={
                isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
              }
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  size="lg"
                  className="text-lg px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg relative overflow-hidden group"
                  asChild
                >
                  <Link to="/signup">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                    <UserPlus className="mr-2 h-5 w-5" />
                    Join as a Student
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-4 border-2 border-orange-300 dark:border-orange-700 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/20 group"
                >
                  <GraduationCap className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  Start Tutoring
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  className="text-center group"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                >
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/50 dark:to-amber-900/50 group-hover:from-orange-200 dark:group-hover:from-orange-800/50 group-hover:to-amber-200 dark:group-hover:to-amber-800/50 transition-all duration-300 shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Icon className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                  </motion.div>
                  <motion.div
                    className="text-3xl font-bold text-slate-900 dark:text-slate-100"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                    viewport={{ once: true }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* How It Works Section */}
        <section
          ref={howItWorksRef}
          className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8 bg-gradient-to-r from-slate-50/50 to-orange-50/50 dark:from-slate-900/50 dark:to-orange-950/50 rounded-3xl my-16"
        >
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={
              isHowItWorksInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Get started in three simple steps and join our thriving academic
              community
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {howItWorksSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  className="relative text-center group"
                  initial={{ opacity: 0, y: 50 }}
                  animate={
                    isHowItWorksInView
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 50 }
                  }
                  transition={{
                    duration: 0.6,
                    delay: index * 0.2,
                    ease: "easeOut",
                  }}
                  whileHover={{ y: -10 }}
                >
                  {/* Step Number */}
                  <motion.div
                    className={`absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    {step.step}
                  </motion.div>

                  <Card className="pt-8 pb-6 px-6 h-full border-2 border-slate-200/50 dark:border-slate-700/50 hover:border-orange-300/50 dark:hover:border-orange-700/50 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                    <CardContent className="p-0">
                      <motion.div
                        className={`inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br ${step.color} text-white shadow-lg`}
                        whileHover={{ rotate: 10, scale: 1.05 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 17,
                        }}
                      >
                        <Icon className="h-10 w-10" />
                      </motion.div>
                      <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
                        {step.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Connecting Arrow */}
                  {index < howItWorksSteps.length - 1 && (
                    <motion.div
                      className="hidden md:block absolute top-1/2 -right-6 lg:-right-8 w-12 lg:w-16 h-1 bg-gradient-to-r from-orange-300 to-amber-300 dark:from-orange-700 dark:to-amber-700 rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={
                        isHowItWorksInView ? { scaleX: 1 } : { scaleX: 0 }
                      }
                      transition={{ duration: 0.8, delay: index * 0.2 + 0.5 }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Features Section */}
        <section
          ref={featuresRef}
          className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8"
        >
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={
              isFeaturesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Everything you need for effective peer-to-peer learning and
              academic success
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={
                    isFeaturesInView
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 50 }
                  }
                  transition={{
                    duration: 0.6,
                    delay: index * 0.2,
                    ease: "easeOut",
                  }}
                  whileHover={{ y: -10 }}
                >
                  <Card
                    className={`relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-2 border-slate-200/50 dark:border-slate-700/50 hover:border-orange-300/50 dark:hover:border-orange-700/50 h-full bg-gradient-to-br ${feature.bgGradient} backdrop-blur-sm`}
                  >
                    <CardContent className="p-8">
                      <motion.div
                        className={`inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                        whileHover={{ rotate: 10 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 17,
                        }}
                      >
                        <Icon className={`h-8 w-8 ${feature.color}`} />
                      </motion.div>
                      <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                        {feature.description}
                      </p>
                    </CardContent>
                    <motion.div
                      className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/10 to-amber-400/10 rounded-full blur-2xl"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: index * 0.5,
                      }}
                    />
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          ref={testimonialsRef}
          className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8 bg-gradient-to-r from-slate-50/50 to-orange-50/50 dark:from-slate-900/50 dark:to-orange-950/50 rounded-3xl my-16"
        >
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={
              isTestimonialsInView
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              What Students Say
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Real experiences from students who've transformed their learning
              journey with VabTut
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={
                  isTestimonialsInView
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 50 }
                }
                transition={{
                  duration: 0.6,
                  delay: index * 0.2,
                  ease: "easeOut",
                }}
                whileHover={{ y: -10 }}
              >
                <Card className="relative h-full p-6 border-2 border-slate-200/50 dark:border-slate-700/50 hover:border-orange-300/50 dark:hover:border-orange-700/50 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <Quote className="h-8 w-8 text-orange-400 mb-4" />
                    <p className="text-slate-700 dark:text-slate-300 mb-6 text-lg leading-relaxed italic">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{testimonial.image}</div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                          {testimonial.role}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {testimonial.university}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Card className="relative overflow-hidden border-2 border-orange-300/50 dark:border-orange-700/50 hover:border-orange-400/70 dark:hover:border-orange-600/70 transition-colors duration-500 bg-gradient-to-br from-orange-50/80 to-amber-50/80 dark:from-orange-950/50 dark:to-amber-950/50 backdrop-blur-sm">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-orange-200/20 via-amber-200/20 to-orange-200/20 dark:from-orange-800/20 dark:via-amber-800/20 dark:to-orange-800/20"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  backgroundSize: "200% 200%",
                }}
              />

              <CardContent className="relative p-12 sm:p-16 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.2,
                    type: "spring",
                    stiffness: 200,
                  }}
                  viewport={{ once: true }}
                >
                  <div className="relative inline-block mb-8">
                    <div className="text-6xl mb-4">🎓</div>
                    <motion.div
                      className="absolute -inset-8 bg-gradient-to-r from-orange-400/20 to-amber-400/20 rounded-full blur-2xl"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </div>
                </motion.div>

                <motion.h2
                  className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-slate-100"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  Ready to Transform Your Learning?
                </motion.h2>

                <motion.p
                  className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  viewport={{ once: true }}
                >
                  Join thousands of students who are already excelling with
                  peer-to-peer learning. Start your journey today and discover
                  the power of collaborative education.
                </motion.p>

                <motion.div
                  className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      className="text-lg px-10 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-xl relative overflow-hidden group"
                      asChild
                    >
                      <Link to="/signup">
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "100%" }}
                          transition={{ duration: 0.6 }}
                        />
                        <UserPlus className="mr-2 h-5 w-5" />
                        Join as a Student
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="text-lg px-10 py-4 border-2 border-orange-400 dark:border-orange-600 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/20 shadow-lg group"
                    >
                      <GraduationCap className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                      Start Tutoring
                    </Button>
                  </motion.div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </section>
      </div>
    </Layout>
  );
}
