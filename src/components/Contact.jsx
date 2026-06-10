import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import React, { useRef, useState } from "react";
import {
  FaLinkedin,
  FaGithub,
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import { useContactInfo } from "../lib/useContactInfo";

import { SectionWrapper } from "../hoc";
import useMagnetic from "../reactbits/hooks/useMagnetic";
import useSoundCue from "../reactbits/hooks/useSoundCue";
import { styles } from "../styles";
import { slideIn } from "../utils/motion";
import { EarthCanvas } from "./canvas";
import Toast from "./ui/toast";

const Contact = () => {
  const formRef = useRef();
  const { data: contactInfo } = useContactInfo();

  const socialLinks = [
    contactInfo.linkedin  && { icon: FaLinkedin,  label: "LinkedIn",  href: contactInfo.linkedin,  color: "#0A66C2" },
    contactInfo.github    && { icon: FaGithub,    label: "GitHub",    href: contactInfo.github,    color: "#1e293b" },
    contactInfo.facebook  && { icon: FaFacebook,  label: "Facebook",  href: contactInfo.facebook,  color: "#1877F2" },
    contactInfo.instagram && { icon: FaInstagram, label: "Instagram", href: contactInfo.instagram, color: "#E4405F" },
    contactInfo.whatsapp  && { icon: FaWhatsapp,  label: "WhatsApp",  href: contactInfo.whatsapp,  color: "#25D366" },
  ].filter(Boolean);

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", type: "success" });
  const { play } = useSoundCue("notification");
  const { ref: submitButtonRef } = useMagnetic({ radius: 90, strength: 0.35 });

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
        <h2 className="text-slate-900 text-center font-black md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px] px-4">
          Let's Work Together
        </h2>

        {/* Contact info bar */}
        <div className="flex flex-wrap justify-center gap-6 mt-6 mb-2 px-4">
          {contactInfo.email && (
            <a
              href={`mailto:${contactInfo.email}`}
              className="flex items-center gap-2 text-sky-500 hover:text-sky-700 transition-colors duration-200 text-sm sm:text-base font-medium"
            >
              <FaEnvelope className="text-lg" />
              <span>{contactInfo.email}</span>
            </a>
          )}
          {contactInfo.phone && (
            <a
              href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-2 text-sky-500 hover:text-sky-700 transition-colors duration-200 text-sm sm:text-base font-medium"
            >
              <FaPhone className="text-lg" />
              <span>{contactInfo.phone}</span>
            </a>
          )}
        </div>

        {/* Social links */}
        <div className="flex justify-center gap-4 mt-4 mb-6">
          {socialLinks.map(({ icon: Icon, label, href, color }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              whileHover={{ scale: 1.15, y: -3 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="w-11 h-11 rounded-xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-md flex items-center justify-center transition-all duration-300"
              style={{ color, boxShadow: "0 2px 8px rgba(14,165,233,0.07)" }}
            >
              <Icon className="text-xl" />
            </motion.a>
          ))}
        </div>

        <div className="xl:mt-8 flex xl:flex-row flex-col-reverse gap-6 lg:gap-10 overflow-hidden px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={slideIn("left", "tween", 0.2, 1)}
            className="flex-[0.75] w-full xl:w-[40rem] rounded-2xl p-4 sm:p-6 lg:p-8"
            style={{
              background: "#ffffff",
              border: "1.5px solid rgba(14,165,233,0.15)",
              boxShadow: "0 8px 40px rgba(14,165,233,0.08)",
            }}
          >
            <p className={`text-sky-500 ${styles.sectionSubText}`}>Get in touch</p>
            <h3 className={`${styles.sectionHeadText} text-[28px] sm:text-[32px] lg:text-[36px]`}>
              Contact.
            </h3>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="mt-6 flex flex-col gap-6 sm:gap-8"
              id="contact"
            >
              {[
                { label: "Full name",      name: "name",    type: "text",  placeholder: "Your Name" },
                { label: "Email Address",  name: "email",   type: "email", placeholder: "you@example.com" },
              ].map(({ label, name, type, placeholder }) => (
                <label key={name} className="flex flex-col">
                  <span className="font-semibold text-sky-500 mb-2 text-sm">{label}</span>
                  <input
                    type={type}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="py-3 sm:py-4 px-4 sm:px-6 rounded-xl outline-none font-medium text-sm sm:text-base w-full text-slate-800 placeholder:text-slate-400 transition-all duration-200"
                    style={{
                      background: "#f8faff",
                      border: "1.5px solid rgba(14,165,233,0.18)",
                    }}
                    onFocus={e => { e.target.style.borderColor = "#0ea5e9"; e.target.style.boxShadow = "0 0 0 3px rgba(14,165,233,0.12)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(14,165,233,0.18)"; e.target.style.boxShadow = "none"; }}
                  />
                </label>
              ))}
              <label className="flex flex-col">
                <span className="font-semibold text-sky-500 mb-2 text-sm">Your Message</span>
                <textarea
                  rows={5}
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project..."
                  className="py-3 sm:py-4 px-4 sm:px-6 rounded-xl outline-none font-medium text-sm sm:text-base w-full resize-none text-slate-800 placeholder:text-slate-400 transition-all duration-200"
                  style={{ background: "#f8faff", border: "1.5px solid rgba(14,165,233,0.18)" }}
                  onFocus={e => { e.target.style.borderColor = "#0ea5e9"; e.target.style.boxShadow = "0 0 0 3px rgba(14,165,233,0.12)"; }}
                  onBlur={e => { e.target.style.borderColor = "rgba(14,165,233,0.18)"; e.target.style.boxShadow = "none"; }}
                />
              </label>

              <button
                ref={submitButtonRef}
                type="submit"
                disabled={loading}
                className="py-3 px-6 sm:px-8 rounded-xl outline-none w-fit text-white font-bold text-sm sm:text-base transition-all duration-200 hover:opacity-90 disabled:opacity-60"
                style={{
                  background: "linear-gradient(135deg, #0ea5e9, #4f46e5)",
                  boxShadow: "0 4px 18px rgba(14,165,233,0.3)",
                }}
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
