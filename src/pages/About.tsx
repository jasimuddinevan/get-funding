import { motion } from "framer-motion";
import { Shield, TrendingUp, Users, Globe, Target, Heart, Lightbulb, Award, Linkedin, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const values = [
  {
    icon: Shield,
    title: "Trust & Transparency",
    description: "Every business on our platform undergoes rigorous admin verification, so investors can make decisions with confidence.",
  },
  {
    icon: Heart,
    title: "Inclusive Growth",
    description: "We believe in democratizing investment — empowering everyday people to build wealth through revenue-sharing opportunities.",
  },
  {
    icon: Lightbulb,
    title: "Innovation First",
    description: "From AI-powered analytics to smart portfolio tools, we continuously innovate to deliver the best experience.",
  },
  {
    icon: Globe,
    title: "Local & Global",
    description: "Rooted in Bangladesh, expanding globally. We connect local businesses with investors from around the world.",
  },
];

const team = [
  {
    name: "Arif Rahman",
    role: "Co-Founder & CEO",
    bio: "Serial entrepreneur with 12+ years in fintech. Previously built two successful startups in Dhaka.",
    avatar: "AR",
  },
  {
    name: "Sarah Mitchell",
    role: "Co-Founder & CTO",
    bio: "Former Google engineer. Leads our platform architecture, security infrastructure, and data systems.",
    avatar: "SM",
  },
  {
    name: "Nadia Akter",
    role: "Head of Operations",
    bio: "10 years in business operations across South Asia. Manages verification and onboarding processes.",
    avatar: "NA",
  },
  {
    name: "James Park",
    role: "Head of Investor Relations",
    bio: "Background in investment banking. Ensures our investors receive top-tier support and insights.",
    avatar: "JP",
  },
  {
    name: "Tanvir Hossain",
    role: "Lead Designer",
    bio: "Award-winning UX designer focused on building intuitive, accessible financial products.",
    avatar: "TH",
  },
  {
    name: "Priya Das",
    role: "Compliance Officer",
    bio: "Legal and regulatory expert ensuring FundBridge operates within all applicable frameworks.",
    avatar: "PD",
  },
];

const milestones = [
  { year: "2022", event: "FundBridge founded in Dhaka, Bangladesh" },
  { year: "2023", event: "First 50 businesses listed and funded" },
  { year: "2024", event: "Crossed ৳10 Cr in total investments" },
  { year: "2025", event: "Expanded to global markets with 3,200+ investors" },
  { year: "2026", event: "120+ verified businesses, ৳25 Cr+ invested" },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative py-20 sm:py-28 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/3 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-primary/8 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-80 h-48 sm:h-80 bg-primary/5 rounded-full blur-3xl" />
          </div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-4 block">About FundBridge</span>
              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-5 leading-tight">
                Bridging Businesses <br className="hidden sm:block" />
                <span className="text-gradient-gold">& Investors</span>
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                FundBridge is Bangladesh's leading revenue-sharing investment platform, connecting verified businesses 
                with investors seeking consistent, transparent returns.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">Our Mission</span>
                <h2 className="font-display text-2xl sm:text-4xl font-bold text-foreground mb-4">
                  Democratizing Investment for Everyone
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4 text-sm sm:text-base">
                  We're on a mission to make investing accessible, transparent, and rewarding for everyone — regardless of 
                  their background or portfolio size. By connecting verified businesses directly with investors through 
                  revenue-sharing agreements, we eliminate intermediaries and create a win-win ecosystem.
                </p>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  Every business listed on FundBridge undergoes rigorous admin verification, ensuring that investors 
                  can make informed decisions with confidence. Our platform handles everything from onboarding to 
                  payout tracking, so both parties can focus on what matters — growth.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 gap-3 sm:gap-4"
              >
                {[
                  { icon: TrendingUp, value: "৳25Cr+", label: "Total Invested" },
                  { icon: Users, value: "3,200+", label: "Active Investors" },
                  { icon: Award, value: "120+", label: "Businesses Funded" },
                  { icon: Target, value: "18%", label: "Avg. Returns" },
                ].map((stat, i) => (
                  <Card key={stat.label} className="bg-card border-border/60 shadow-md shadow-foreground/[0.03]">
                    <CardContent className="p-4 sm:p-5 text-center">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2 shadow-inner">
                        <stat.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="font-display text-xl sm:text-2xl font-bold text-foreground">{stat.value}</div>
                      <div className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 sm:py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-10 sm:mb-14"
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">Our Values</span>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-foreground">What Drives Us</h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {values.map((value, i) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-card border-border/60 shadow-md shadow-foreground/[0.03] hover:shadow-lg hover:border-primary/20 transition-all h-full">
                    <CardContent className="p-5 sm:p-6">
                      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 shadow-inner">
                        <value.icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-display text-base sm:text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-10 sm:mb-14"
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">Our Journey</span>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-foreground">Key Milestones</h2>
            </motion.div>
            <div className="max-w-2xl mx-auto">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  viewport={{ once: true }}
                  className="flex gap-4 sm:gap-6 mb-6 last:mb-0"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center text-xs font-bold text-primary shadow-sm shrink-0">
                      {m.year.slice(2)}
                    </div>
                    {i < milestones.length - 1 && <div className="w-px flex-1 bg-border mt-2" />}
                  </div>
                  <div className="pb-6">
                    <span className="text-xs font-semibold text-primary">{m.year}</span>
                    <p className="text-sm sm:text-base text-foreground mt-0.5">{m.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 sm:py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-10 sm:mb-14"
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">Our Team</span>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-foreground mb-3">Meet the People Behind FundBridge</h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
                A passionate team of entrepreneurs, engineers, and finance professionals building the future of investing.
              </p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {team.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-card border-border/60 shadow-md shadow-foreground/[0.03] hover:shadow-lg hover:border-primary/20 transition-all h-full">
                    <CardContent className="p-5 sm:p-6">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shadow-inner shrink-0">
                          {member.avatar}
                        </div>
                        <div>
                          <h3 className="font-display text-base font-semibold text-foreground">{member.name}</h3>
                          <p className="text-xs text-primary font-medium">{member.role}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
                      <div className="flex gap-2 mt-4">
                        <button className="w-8 h-8 rounded-lg bg-secondary/60 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                          <Linkedin className="w-3.5 h-3.5" />
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-secondary/60 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                          <Mail className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <div className="h-16" />
      <Footer />
    </div>
  );
};

export default About;
