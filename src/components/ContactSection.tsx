import React, { useState } from 'react';
import { Mail, Github, Linkedin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { sendContactMessage } from '../lib/supabase';
import { BambooArt } from './BambooArt';
import { EnsoOrbital } from './EnsoOrbital';
import { HankoStamp } from './HankoStamp';
import { CornerBrackets } from './CornerBrackets';
import { useSiteData } from '../context/SiteDataContext';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formName = (formData.get('name') as string) || name;
    const formEmail = (formData.get('email') as string) || email;
    const formMessage = (formData.get('message') as string) || message;
    const formHoneypot = (formData.get('website_check') as string) || '';
    const defaultTopic = `[Portfolio Dialogue] ${formName.trim() || 'Direct Inquiry'}`;

    if (!formName || !formEmail || !formMessage) return;

    setStatus('sending');
    const res = await sendContactMessage({
      name: formName,
      email: formEmail,
      topic: defaultTopic,
      message: formMessage,
      honeypot: formHoneypot,
    });

    if (res.success) {
      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => setStatus('idle'), 6000);
    } else {
      setStatus('error');
      setErrorMessage(res.error || 'Failed to submit message.');
    }
  };

  const { profile } = useSiteData();
  const contactEmail = profile?.email || '';
  const contactGithub = profile?.github || '';
  const contactLinkedin = profile?.linkedin || '';

  const mailtoHref = contactEmail ? `mailto:${contactEmail}?subject=${encodeURIComponent(
    `[Portfolio Dialogue] ${name.trim() || 'Direct Inquiry'}`
  )}` : '#';

  return (
    <section id="contact" className="relative w-full overflow-hidden py-14 lg:py-20 mb-8">
      {/* Background Japanese Sumi-e Arts in Left & Right Empty Margins */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none">
        {/* Left Margin Bamboo */}
        <div className="absolute left-0 xl:left-4 bottom-0 top-12 w-32 xl:w-48 pointer-events-none z-0 hidden lg:block">
          <img
            src="./images/sumie-tall-vertical-bamboo.jpg"
            alt="Sumi-e bamboo contact flank"
            className="w-full h-full object-contain object-bottom opacity-35 dark:opacity-20 mix-blend-multiply dark:mix-blend-screen dark:invert animate-bamboo-sway"
            style={{
              maskImage: 'radial-gradient(ellipse 85% 85% at 40% 60%, black 40%, transparent 85%)',
              WebkitMaskImage: 'radial-gradient(ellipse 85% 85% at 40% 60%, black 40%, transparent 85%)',
            }}
          />
        </div>

        {/* Right Margin Bamboo */}
        <div className="absolute right-0 xl:right-4 bottom-0 top-12 w-32 xl:w-48 pointer-events-none z-0 hidden lg:block">
          <img
            src="./images/sumie-tall-vertical-bamboo.jpg"
            alt="Sumi-e bamboo contact flank"
            className="w-full h-full object-contain object-bottom opacity-35 dark:opacity-20 mix-blend-multiply dark:mix-blend-screen dark:invert scale-x-[-1]"
            style={{
              maskImage: 'radial-gradient(ellipse 85% 85% at 60% 60%, black 40%, transparent 85%)',
              WebkitMaskImage: 'radial-gradient(ellipse 85% 85% at 60% 60%, black 40%, transparent 85%)',
            }}
          />
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 relative z-10">
        <div className="interactive-card group relative bg-light-surface-card dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-2xl p-8 sm:p-12 overflow-visible shadow-akari dark:shadow-night-glow classical-card-frame hover:border-terracotta/40 transition-colors duration-500">
          {/* Celestial Ensō Orbital Circle: appears ONLY on the hovered card */}
          <EnsoOrbital
            placement="top-left"
            size={120}
            hoverOnly={true}
          />

          {/* Corner Hairline Brackets */}
          <CornerBrackets size="lg" />

          {/* Komorebi Japanese Landscape Mask Backdrop — Anchored Clearly on Left Side */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-full lg:w-[50%] select-none overflow-hidden opacity-75 dark:opacity-55 mix-blend-multiply dark:mix-blend-screen dark:invert animate-gentle-drift rounded-l-2xl">
            <img
              src="./images/komorebi-spatial.jpg"
              alt="Komorebi Japanese landscape backdrop"
              className="w-full h-full object-cover object-[65%_center]"
              style={{
                maskImage: 'radial-gradient(ellipse 95% 90% at 35% 50%, black 55%, transparent 95%)',
                WebkitMaskImage: 'radial-gradient(ellipse 95% 90% at 35% 50%, black 55%, transparent 95%)',
              }}
            />
          </div>

          {/* Architectural Corner Bamboo Art with Gentle Sway */}
          <div className="absolute top-4 left-4 w-10 h-14 opacity-35 dark:opacity-25 pointer-events-none">
            <BambooArt className="w-full h-full" sway={true} opacity={0.75} />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Narrative & Direct Links */}
            <div className="lg:col-span-6 flex flex-col space-y-6">
              <div className="flex items-center gap-2.5">
                <HankoStamp className="h-6 w-6 animate-seal-breathe" />
                <span className="font-serif text-terracotta text-sm">05 //</span>
                <span className="font-sans text-[11px] font-semibold text-light-ink-subtle dark:text-dark-ink-subtle uppercase tracking-widest">
                  INITIATE A DIALOGUE
                </span>
              </div>

              <h2 className="font-serif text-2xl sm:text-4xl text-light-ink dark:text-dark-ink leading-tight font-normal">
                Interested in building something deliberate together?
              </h2>

              <p className="font-sans text-sm sm:text-base text-light-ink-muted dark:text-dark-ink-muted leading-relaxed font-light">
                Currently open to engineering collaborations, distributed systems design, generative AI architectures, and technical dialogue. Let us discuss possibilities over a message.
              </p>

              {/* Direct Contact Links */}
              {(contactEmail || contactGithub || contactLinkedin) && (
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  {contactEmail && (
                    <a
                      href={mailtoHref}
                      className="btn-bloom inline-flex items-center gap-2 px-6 py-3.5 bg-terracotta hover:bg-terracotta-hover text-white font-sans text-xs uppercase tracking-widest rounded-lg shadow-sm"
                    >
                      <Mail className="w-4 h-4" />
                      <span>{contactEmail}</span>
                    </a>
                  )}

                  {contactGithub && (
                    <a
                      href={contactGithub}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3.5 bg-light-surface-raised dark:bg-[#1B1C22] border border-light-border dark:border-[#2D3039] hover:bg-light-surface dark:hover:bg-[#252831] hover:border-ochre/50 text-light-ink dark:text-[#EDEAE4] font-sans text-xs uppercase tracking-widest rounded-lg shadow-xs transition-all duration-200"
                    >
                      <Github className="w-4 h-4" />
                      <span className="tracking-widest">Github</span>
                    </a>
                  )}

                  {contactLinkedin && (
                    <a
                      href={contactLinkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3.5 bg-light-surface-raised dark:bg-[#1B1C22] border border-light-border dark:border-[#2D3039] hover:bg-light-surface dark:hover:bg-[#252831] hover:border-ochre/50 text-light-ink dark:text-[#EDEAE4] font-sans text-xs uppercase tracking-widest rounded-lg shadow-xs transition-all duration-200"
                    >
                      <Linkedin className="w-4 h-4" />
                      <span className="tracking-widest">Linkedin</span>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Inquiries Form */}
            <div className="lg:col-span-6 w-full bg-light-surface/70 dark:bg-dark-surface-card/60 p-5 sm:p-7 rounded-xl border border-light-border/60 dark:border-dark-border/60 shadow-xs">
              <h3 className="font-serif text-lg text-light-ink dark:text-dark-ink mb-5">
                Send a Message
              </h3>

              {status === 'success' ? (
                <div role="status" aria-live="polite" className="p-5 rounded bg-bamboo/10 border border-bamboo/30 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-bamboo mx-auto" />
                  <h4 className="font-serif text-base text-light-ink dark:text-dark-ink">
                    Message Delivered Directly
                  </h4>
                  <p className="font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted">
                    Your transmission was delivered directly to Vincent's inbox. He will review it and respond promptly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  {/* Honeypot field for bot protection - invisible to human visitors */}
                  <div className="absolute opacity-0 -z-10 select-none pointer-events-none w-0 h-0 overflow-hidden" aria-hidden="true">
                    <label htmlFor="website_check">Leave this field blank</label>
                    <input
                      id="website_check"
                      type="text"
                      name="website_check"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block font-sans text-xs font-medium text-light-ink dark:text-dark-ink mb-1">
                        Your Name
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        required
                        placeholder="e.g. Kenji Tanaka"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 rounded text-sm bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-ink dark:text-dark-ink focus:outline-none focus:border-terracotta focus-visible:ring-2 focus-visible:ring-terracotta/40 transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block font-sans text-xs font-medium text-light-ink dark:text-dark-ink mb-1">
                        Email Address
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        placeholder="e.g. kenji@studio.jp"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded text-sm bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-ink dark:text-dark-ink focus:outline-none focus:border-terracotta focus-visible:ring-2 focus-visible:ring-terracotta/40 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block font-sans text-xs font-medium text-light-ink dark:text-dark-ink mb-1">
                      Your Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      required
                      placeholder="Briefly describe what you would like to create or explore together..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3 py-2.5 rounded text-sm bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-ink dark:text-dark-ink focus:outline-none focus:border-terracotta focus-visible:ring-2 focus-visible:ring-terracotta/40 transition-colors resize-none"
                    />
                  </div>

                  {status === 'error' && (
                    <div role="alert" aria-live="assertive" className="flex items-center gap-2 text-xs text-red-500">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full py-2.5 px-4 rounded font-sans text-sm font-medium bg-light-button-dark dark:bg-dark-button-light text-light-on-dark dark:text-dark-on-light hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{status === 'sending' ? 'Transmitting...' : 'Send Message'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
