'use client';
import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutUs() {
  return (
    <div className="min-h-screen  bg-zinc-950 text-white/90">
      {/* Hero Section */}
      <section className=" bg-zinc-950 py-20 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Image
              src="/heidelai.png"
              alt="HeidelAI Logo"
              width={120}
              height={120}
              className="rounded-lg mb-8 mx-auto"
            />
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white/90">
              About HeidelAI
            </h1>
            <p className="text-xl text-white/50 max-w-3xl mx-auto">
              Empowering businesses with cutting-edge AI solutions that transform customer communications and unlock data-driven insights.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-8 py-16">
        <div className="space-y-16">
          {/* Our Story */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6 text-white/90">Our Story</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-white/60  leading-relaxed mb-4">
                HeidelAI Limited was founded with a vision to bridge the gap between businesses and their customers through intelligent, AI-powered communication solutions. Based in the United Kingdom, we are a registered company (16116925) headquartered in Mildenhall, Bury St. Edmunds, England.
              </p>
              <p className="text-white/60 leading-relaxed">
                Our journey began with a simple observation: businesses were struggling to manage customer communications across multiple platforms while extracting meaningful insights from their data. We set out to create a unified solution that would not only streamline these processes but also leverage artificial intelligence to enhance customer experiences and drive business growth.
              </p>
            </div>
          </motion.section>

          {/* Our Mission */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white/5 rounded-2xl p-8"
          >
            <h2 className="text-3xl font-bold mb-6 text-white/90">Our Mission</h2>
            <p className="text-white/60 text-lg leading-relaxed">
              To democratize AI-powered business intelligence and customer communication, making sophisticated technology accessible to businesses of all sizes. We believe that every interaction should be meaningful, every insight should be actionable, and every business should have the tools to thrive in the digital age.
            </p>
          </motion.section>

          {/* Our Products */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-8 text-white/90">Our Solutions</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-2xl font-semibold mb-4 text-white/90">Talkative</h3>
                <p className="text-white/70 mb-4">
                  A multi-platform, AI-powered chat solution that unifies customer communications across WhatsApp, Telegram, Facebook Messenger, Instagram, and web applications.
                </p>
                <ul className="space-y-2 text-white/80">
                  <li>• Intelligent customer interactions</li>
                  <li>• Automated sales assistance</li>
                  <li>• 24/7 customer support</li>
                  <li>• Smart follow-up automation</li>
                </ul>
              </div>
              
              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-2xl font-semibold mb-4 text-white/90">Understandative</h3>
                <p className="text-white/70 mb-4">
                  An AI analytics platform that transforms raw data into actionable insights across website metrics, conversations, advertising, and social media.
                </p>
                <ul className="space-y-2 text-white/80">
                  <li>• Real-time data processing</li>
                  <li>• Predictive analytics</li>
                  <li>• Performance optimization</li>
                  <li>• Actionable recommendations</li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* Our Values */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-8 text-white/90">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16  rounded-full flex items-center justify-center mx-auto mb-4">
                  <Image
                    src="/emojis/lock.png"
                    alt="Privacy Icon"
                    width={50}
                    height={50}
                  />
                </div>
                <h3 className="text-xl font-semibold mb-3">Privacy First</h3>
                <p className="text-white/60">
                  We maintain 100% data privacy for our clients. Your data belongs to you, and we never share it with third parties.
                </p>
              </div>
              
              <div className="text-center">
               <div className="w-16 h-16  rounded-full flex items-center justify-center mx-auto mb-4">
                  <Image
                    src="/emojis/rocket.png"
                    alt="Innovation Icon"
                    width={50}
                    height={50}
                  />
                </div>
                <h3 className="text-xl font-semibold mb-3">Innovation</h3>
                <p className="text-white/60">
                  We continuously push the boundaries of AI technology to deliver cutting-edge solutions that drive real business results.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16  rounded-full flex items-center justify-center mx-auto mb-4">
                  <Image
                    src="/emojis/handshake.png"
                    alt="Partnership Icon"
                    width={50}
                    height={50}
                  />
                </div>
                <h3 className="text-xl font-semibold mb-3">Partnership</h3>
                <p className="text-white/60">
                  We build lasting relationships with our clients, working as partners to achieve their business objectives and growth goals.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Why Choose Us */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white/5 rounded-2xl p-8"
          >
            <h2 className="text-3xl font-bold mb-6 text-white/90">Why Choose HeidelAI?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-white/90">Enterprise-Grade Security</h3>
                <p className="text-white/60 mb-4">
                  Built with compliance in mind, adhering to UK GDPR, Data Protection Act 2018, and international data protection standards.
                </p>
                
                <h3 className="text-xl font-semibold mb-3 text-white/90">Seamless Integration</h3>
                <p className="text-white/60">
                  Our solutions integrate effortlessly with your existing workflows and systems, minimizing disruption while maximizing value.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3 text-white/90">24/7 Support</h3>
                <p className="text-white/60 mb-4">
                  Our dedicated support team is available around the clock to ensure your success with our platform.
                </p>
                
                <h3 className="text-xl font-semibold mb-3 text-white/90">Continuous Innovation</h3>
                <p className="text-white/60">
                  We regularly update our AI models and features based on the latest research and customer feedback.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Technology & AI */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6 text-white/90">Our Technology</h2>
            <p className="text-white/60 text-lg leading-relaxed mb-6">
              At the heart of HeidelAI lies sophisticated artificial intelligence powered by machine learning and natural language processing. Our AI systems are designed to understand context, predict customer behavior, and generate meaningful insights that drive business decisions.
            </p>
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 text-white/90">AI Capabilities</h3>
              <ul className="grid md:grid-cols-2 gap-3 text-white/60">
                <li>• Automated conversation management</li>
                <li>• Intent and sentiment analysis</li>
                <li>• Predictive customer insights</li>
                <li>• Intelligent segmentation</li>
                <li>• Real-time recommendation engine</li>
                <li>• Multi-language support</li>
              </ul>
            </div>
          </motion.section>

          {/* Contact Section */}
          {/*  */}
        </div>
      </div>
    </div>
  );
}