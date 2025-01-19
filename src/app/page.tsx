"use client"

import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Layers,
  BarChart2,
  Clock,
  DropletsIcon as DragDropIcon,
  TrendingUp,
  Target,
  Star,
  GitBranch,
  Bell,
  Zap,
} from "lucide-react"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
}

export default function Home() {
  const headerRef = useRef(null)
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const testimonialsRef = useRef(null)
  const ctaRef = useRef(null)
  const benefitsRef = useRef(null)

  const isHeaderInView = useInView(headerRef, { once: true })
  const isHeroInView = useInView(heroRef, { once: true })
  const isFeaturesInView = useInView(featuresRef, { once: true })
  const isTestimonialsInView = useInView(testimonialsRef, { once: true })
  const isCtaInView = useInView(ctaRef, { once: true })
  const isBenefitsInView = useInView(benefitsRef, { once: true })

  return (
    <div className="min-h-screen bg-white">
      <motion.header
        ref={headerRef}
        initial={{ y: -100, opacity: 0 }}
        animate={isHeaderInView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white shadow-sm fixed w-full z-50"
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
          <div className="w-full py-6 flex items-center justify-between border-b border-indigo-500 lg:border-none">
            <div className="flex items-center">
              <Link href="/">
                <span className="sr-only">YaruKoto</span>
                <img className="h-10 w-auto" src="/logo.png" alt="YaruKoto" />
              </Link>
            </div>
            <div className="ml-10 space-x-4">
              <Link href="/dashboard">
                <Button variant="outline">Get Started</Button>
              </Link>
            </div>
          </div>
        </nav>
      </motion.header>

      <main>
        {/* Hero section */}
        <motion.div
          ref={heroRef}
          initial="hidden"
          animate={isHeroInView ? "visible" : "hidden"}
          variants={fadeIn}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative pt-16"
        >
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gray-100"></div>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="relative shadow-xl sm:rounded-2xl sm:overflow-hidden">
              <div className="absolute inset-0">
                <Image
                  className="h-full w-full object-cover"
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2850&q=80"
                  alt="People working on laptops"
                  layout="fill"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-800 to-indigo-700 mix-blend-multiply"></div>
              </div>
              <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
                <h1 className="text-center text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                  <span className="block text-white">Take control of your</span>
                  <span className="block text-indigo-200">daily tasks</span>
                </h1>
                <p className="mt-6 max-w-lg mx-auto text-center text-xl text-indigo-200 sm:max-w-3xl">
                  YaruKoto is your personal task management companion, designed to boost productivity and help you
                  achieve your goals.
                </p>
                <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
                  <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
                    <Link href="/dashboard">
                      <Button size="lg" className="w-full">
                        Get started
                      </Button>
                    </Link>
                    <a href="#learn-more">
                      <Button variant="outline" size="lg" className="w-full bg-white/10">
                        Learn more
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Benefits section */}
        <motion.div
          ref={benefitsRef}
          initial="hidden"
          animate={isBenefitsInView ? "visible" : "hidden"}
          variants={stagger}
          className="bg-white py-24 sm:py-32"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <motion.h2 variants={fadeIn} className="text-base font-semibold leading-7 text-indigo-600">
                Work Smarter
              </motion.h2>
              <motion.p variants={fadeIn} className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need to manage your tasks
              </motion.p>
              <motion.p variants={fadeIn} className="mt-6 text-lg leading-8 text-gray-600">
                Streamline your workflow, track your progress, and achieve your goals with our comprehensive task
                management solution.
              </motion.p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                {[
                  {
                    name: "Smart Task Management",
                    description:
                      "Organize tasks with our intuitive Kanban board system. Drag and drop tasks between columns for seamless workflow management.",
                    icon: GitBranch,
                  },
                  {
                    name: "Real-time Updates",
                    description:
                      "Stay informed with instant notifications and real-time updates on task progress and team collaboration.",
                    icon: Bell,
                  },
                  {
                    name: "Productivity Analytics",
                    description:
                      "Gain insights into your productivity patterns with detailed analytics and progress tracking.",
                    icon: Zap,
                  },
                ].map((benefit) => (
                  <motion.div key={benefit.name} variants={fadeIn} className="flex flex-col">
                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                      <benefit.icon className="h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
                      {benefit.name}
                    </dt>
                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                      <p className="flex-auto">{benefit.description}</p>
                    </dd>
                  </motion.div>
                ))}
              </dl>
            </div>
          </div>
        </motion.div>

        {/* Features section */}
        <motion.div
          ref={featuresRef}
          initial="hidden"
          animate={isFeaturesInView ? "visible" : "hidden"}
          variants={stagger}
          className="py-24 bg-gray-50"
          id="learn-more"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div variants={fadeIn} className="lg:text-center">
              <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                A better way to manage your tasks
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                YaruKoto combines the power of a Kanban board with advanced analytics to help you stay on top of your
                work.
              </p>
            </motion.div>

            <div className="mt-20">
              <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                {[
                  {
                    name: "Drag-and-drop interface",
                    description: "Easily move tasks between columns as your work progresses.",
                    icon: DragDropIcon,
                  },
                  {
                    name: "Time tracking",
                    description: "Track time spent on tasks to optimize your workflow and improve productivity.",
                    icon: Clock,
                  },
                  {
                    name: "Advanced analytics",
                    description: "Gain insights into your productivity patterns with detailed analytics.",
                    icon: BarChart2,
                  },
                  {
                    name: "Customizable workflow",
                    description: "Tailor your board to fit your unique workflow and project needs.",
                    icon: Layers,
                  },
                ].map((feature) => (
                  <motion.div key={feature.name} variants={fadeIn} className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                        <feature.icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
                  </motion.div>
                ))}
              </dl>
            </div>
          </div>
        </motion.div>

        {/* Testimonials section */}
        <motion.div
          ref={testimonialsRef}
          initial="hidden"
          animate={isTestimonialsInView ? "visible" : "hidden"}
          variants={stagger}
          className="bg-white py-24 sm:py-32"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div variants={fadeIn} className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Loved by users worldwide</h2>
              <p className="mt-4 text-lg leading-8 text-gray-600">
                Hear what our users have to say about how YaruKoto has transformed their productivity.
              </p>
            </motion.div>
            <div className="mx-auto mt-16 grid max-w-2xl lg:max-w-4xl grid-cols-1 gap-8 text-sm leading-6 text-gray-600 sm:mt-20 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: "Sarah Johnson",
                  role: "Product Manager",
                  image: "/placeholder.svg?height=100&width=100",
                  quote:
                    "YaruKoto has revolutionized the way I manage my team's tasks. The Kanban board is intuitive, and the analytics provide invaluable insights.",
                },
                {
                  name: "Michael Chen",
                  role: "Freelance Designer",
                  image: "/placeholder.svg?height=100&width=100",
                  quote:
                    "As a freelancer, keeping track of multiple projects used to be a nightmare. YaruKoto has made it a breeze. I love the time tracking feature!",
                },
                {
                  name: "Emily Rodriguez",
                  role: "Marketing Specialist",
                  image: "/placeholder.svg?height=100&width=100",
                  quote:
                    "The productivity insights have helped me optimize my workflow. I'm now able to take on more projects without feeling overwhelmed.",
                },
              ].map((testimonial, index) => (
                <motion.figure
                  key={index}
                  variants={fadeIn}
                  className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5"
                >
                  <blockquote className="text-gray-900">
                    <p>{`"${testimonial.quote}"`}</p>
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-x-4">
                    <Image
                      className="h-10 w-10 rounded-full bg-gray-50"
                      src={testimonial.image || "/placeholder.svg"}
                      alt=""
                      width={40}
                      height={40}
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-gray-600">{testimonial.role}</div>
                    </div>
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA section */}
        <motion.div
          ref={ctaRef}
          initial="hidden"
          animate={isCtaInView ? "visible" : "hidden"}
          variants={fadeIn}
          className="bg-indigo-50"
        >
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-24 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
              <span className="block">Ready to boost your productivity?</span>
              <span className="block text-indigo-600">Start using YaruKoto today.</span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link href="/dashboard">
                  <Button size="lg">Get started</Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Product</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Resources</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">
                    Guides
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">
                    API Reference
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              <a href="https://github.com/stephengade" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="https://twitter.com/stephen_olgade" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
            <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
              &copy; {new Date().getFullYear()} YaruKoto. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

