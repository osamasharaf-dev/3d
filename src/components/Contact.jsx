import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import React, { useRef, useState } from "react";
import {
  FaLinkedin,
  FaGithub,
  FaFacebook,
  FaInstagram,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

import { SectionWrapper } from "../hoc";
import useMagnetic from "../reactbits/hooks/useMagnetic";
import useSoundCue from "../reactbits/hooks/useSoundCue";
import { styles } from "../styles";
import { slideIn } from "../utils/motion";
import { EarthCanvas } from "./canvas";
import Toast from "./ui/toast";

const SOCIAL_LINKS = [
  {
    icon: FaLinkedin,
    label: "LinkedIn",
    href: "https://linkedin.com/in/osamasharaf",
    color: "#0A66C2",
  },
  {
    icon: FaGithub,
    label: "GitHub",
    href: "https://github.com/osamasharaf",
    color: "#ffffff",
  },
  {
    icon: FaFacebook,
    label: "Facebook",
    href: "https://facebook.com/osamasharaf",
    color: "#1877F2",
  },
  {
    icon: FaInstagram,
    label: "Instagram",
    href: "https://instagram.com/osamasharaf",
    color: "#E4405F",
  },
];

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", type: "success" });
  const { play } = useSoundCue("notification");
  const { ref: submitButtonRef } = useMagnetic({
    radius: 90,
    strength: 0.35,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      play("notification");
      setToast({ open: true, message: "Please fill in all fields before submitting.", type: "error" });
      return;
    }
    setLoading(true);

    const serviceId = import.meta.env.VITE_APP_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setLoading(false);
      play("error");
      setToast({ open: true, message: "EmailJS configuration is missing. Please check your environment variables.", type: "error" });
      return;
    }

    emailjs
      .send(serviceId, templateId, {
        user_name: form.name,
        my_name: "Osama Sharaf",
        user_email: form.email,
        my_email: "osamaabdulhalimsharaf@gmail.com",
        user_message: form.message,
      }, publicKey)
      .then(() => {
        setLoading(false);
        play("success");
        setToast({ open: true, message: "Thank you. I will get back to you as soon as possible.", type: "success" });
        setForm({ name: "", email: "", message: "" });
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
        play("error");
        setToast({ open: true, message: "Ahh, something went wrong. Please try again.", type: "error" });
      });
  };

  return (
    <>
      {toast.open && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast((t) => ({ ...t, open: false }))}
        />
      )}
      <div className="w-full min-h-screen">
        <h2 className="text-white text-center font-black md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px] px-4">
          Let's Work Together
        </h2>

        {/* Contact info bar */}
        <div className="flex flex-wrap justify-center gap-6 mt-6 mb-2 px-4">
          <a
            href="mailto:osamaabdulhalimsharaf@gmail.com"
            className="flex items-center gap-2 text-[#8ec5ff] hover:text-white transition-colors duration-200 text-sm sm:text-base"
          >
            <FaEnvelope className="text-lg" />
            <span>osamaabdulhalimsharaf@gmail.com</span>
          </a>
          <a
            href="tel:+963935562470"
            className="flex items-center gap-2 text-[#8ec5ff] hover:text-white transition-colors duration-200 text-sm sm:text-base"
          >
            <FaPhone className="text-lg" />
            <span>+963 935 562 470</span>
          </a>
        </div>

        {/* Social media links */}
        <div className="flex justify-center gap-4 mt-4 mb-6">
          {SOCIAL_LINKS.map(({ icon: Icon, label, href, color }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              whileHover={{ scale: 1.15, y: -3 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="w-11 h-11 rounded-xl bg-[#111522] border border-white/[0.08] hover:border-white/20 flex items-center justify-center transition-all duration-300"
              style={{ color }}
            >
              <Icon className="text-xl" />
            </motion.a>
          ))}
        </div>

        <div className="xl:mt-8 flex xl:flex-row flex-col-reverse gap-6 lg:gap-10 overflow-hidden text-white px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={slideIn("left", "tween", 0.2, 1)}
            className="flex-[0.75] w-full xl:w-[40rem] bg-[#111522] p-4 sm:p-6 lg:p-8 rounded-2xl"
          >
            <p className={`text-[#8ec5ff] ${styles.sectionSubText}`}>
              Get in touch
            </p>
            <h3 className={`${styles.sectionHeadText} text-[28px] sm:text-[32px] lg:text-[36px]`}>
              Contact.
            </h3>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="mt-6 flex flex-col gap-6 sm:gap-8"
              id="contact"
            >
              <label className="flex flex-col">
                <span className="font-medium text-[#8ec5ff] mb-2 sm:mb-4 text-sm sm:text-base">
                  Full name
                </span>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="bg-[#07080d] py-3 sm:py-4 px-4 sm:px-6 placeholder:text-[#fafafa8a] rounded-lg outline-none border-none font-medium text-sm sm:text-base w-full text-white"
                />
              </label>
              <label className="flex flex-col">
                <span className="font-medium text-[#8ec5ff] mb-2 sm:mb-4 text-sm sm:text-base">
                  Email Address
                </span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="bg-[#07080d] py-3 sm:py-4 px-4 sm:px-6 placeholder:text-[#fafafa8a] rounded-lg outline-none border-none font-medium text-sm sm:text-base w-full text-white"
                />
              </label>
              <label className="flex flex-col">
                <span className="font-medium text-[#8ec5ff] mb-2 sm:mb-4 text-sm sm:text-base">
                  Your Message
                </span>
                <textarea
                  rows={5}
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project..."
                  className="bg-[#07080d] py-3 sm:py-4 px-4 sm:px-6 placeholder:text-[#fafafa8a] rounded-lg outline-none border-none font-medium text-sm sm:text-base w-full resize-none text-white"
                />
              </label>

              <button
                ref={submitButtonRef}
                type="submit"
                className="bg-[#07080d] py-3 px-6 sm:px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md shadow-primary text-sm sm:text-base hover:bg-[#0a0b12] transition-colors duration-200"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </motion.div>

          <motion.div
            variants={slideIn("right", "tween", 0.2, 1)}
            className="xl:flex-1 my-auto h-[300px] sm:h-[350px] md:h-[450px] lg:h-[550px] w-full"
          >
            <EarthCanvas />
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default SectionWrapper(Contact, "contact");
