import React, { useState } from 'react';
import { Mail, Github, Linkedin, Send, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';
import { sendContactMessage } from '../../../lib/supabase';
import { CornerBrackets } from '../../common/CornerBrackets';
import { EnsoOrbital } from '../../common/EnsoOrbital';
import { useSiteData } from '../../../context/SiteDataContext';
import { SectionSideBackdrop } from '../../common/SectionSideBackdrop';
import { SectionDivider } from '../../common/SectionDivider';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [touched, setTouched] = useState<{ name?: boolean; email?: boolean; message?: boolean }>({});

  const validateField = (field: 'name' | 'email' | 'message', value: string): string | undefined => {
    const trimmed = value.trim();
    if (field === 'name') {
      if (!trimmed) return 'Name is required to initiate dialogue.';
      if (trimmed.length < 2) return 'Please provide at least 2 characters.';
    }
    if (field === 'email') {
      if (!trimmed) return 'Email address is required.';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmed)) return 'Please provide a valid email address.';
    }
    if (field === 'message') {
      if (!trimmed) return 'Message content cannot be blank.';
      if (trimmed.length < 10) return 'Please enter at least 10 characters.';
    }
    return undefined;
  };

  const handleBlur = (field: 'name' | 'email' | 'message') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const val = field === 'name' ? name : field === 'email' ? email : message;
    const err = validateField(field, val);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleFieldChange = (field: 'name' | 'email' | 'message', val: string) => {
    if (field === 'name') setName(val);
    if (field === 'email') setEmail(val);
    if (field === 'message') setMessage(val);
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, val) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formName = (formData.get('name') as string) || name;
    const formEmail = (formData.get('email') as string) || email;
    const formMessage = (formData.get('message') as string) || message;
    const formHoneypot = (formData.get('website_check') as string) || '';
    const defaultTopic = `[Portfolio Dialogue] ${formName.trim() || 'Direct Inquiry'}`;

    const nameErr = validateField('name', formName);
    const emailErr = validateField('email', formEmail);
    const messageErr = validateField('message', formMessage);

    setTouched({ name: true, email: true, message: true });
    setErrors({ name: nameErr, email: emailErr, message: messageErr });

    if (nameErr || emailErr || messageErr) {
      if (nameErr) document.getElementById('contact-name')?.focus();
      else if (emailErr) document.getElementById('contact-email')?.focus();
      else if (messageErr) document.getElementById('contact-message')?.focus();
      return;
    }

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
      setErrors({});
      setTouched({});
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

  const handleCopyEmail = () => {
    if (!contactEmail) return;
    navigator.clipboard.writeText(contactEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const mailtoHref = contactEmail ? `mailto:${contactEmail}?subject=${encodeURIComponent(
    `[Portfolio Dialogue] ${name.trim() || 'Direct Inquiry'}`
  )}` : '#';

  return (
    <section id="contact" className="relative w-full pt-8 sm:pt-12 pb-24 lg:pb-32 mb-8 scroll-mt-12 bg-light-canvas dark:bg-dark-canvas">
      {/* Architectural Background Chamber for Contact */}
      <div className="absolute inset-0 bg-gradient-to-b from-light-canvas via-light-surface-card/40 to-light-canvas dark:from-dark-canvas dark:via-dark-surface-card/40 dark:to-dark-canvas pointer-events-none z-0" />
      <div className="absolute inset-0 bg-radial-[at_50%_40%] from-terracotta/[0.03] dark:from-terracotta/[0.02] to-transparent pointer-events-none z-0" />

      {/* 16:9 Cedar Wood Ground & Asymmetric Sumi-e Bamboo Art (Anchored Left for alternating rhythm) */}
      <SectionSideBackdrop
        textureDay="./background/white wood.jpg"
        textureNight="./background/black wood.jpg"
        painting="./decorators/bamboo.jpg"
        paintingAlt="Sumi-e bamboo ink wash painting"
        placement="left"
        artworkWidth="w-full lg:w-[48%]"
        maskCenter="at 25% 50%"
        textureOpacityDay={0.65}
        textureOpacityNight={0.45}
        paintingOpacityDay={0.35}
        paintingOpacityNight={0.14}
      />

      {/* Section Divider on Top of Section */}
      <div className="relative z-10 w-full mb-10 sm:mb-14">
        <SectionDivider label="INITIATE A DIALOGUE · 対話" shortLabel="DIALOGUE · 対話" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="interactive-card group relative bg-light-surface-card dark:bg-dark-surface-card craft-card border border-light-border dark:border-dark-border hover:border-light-border-strong dark:hover:border-dark-border-strong rounded-[3px] p-5 sm:p-8 lg:p-10 xl:p-12 overflow-visible shadow-sm classical-card-frame transition-colors duration-300">
          {/* Celestial Ensō Orbital Circle with Brushstroke (Appears strictly on card hover) */}
          <EnsoOrbital
            placement="top-left"
            size={132}
            hoverOnly={true}
          />

          {/* Corner Hairline Brackets (Subtle) */}
          <CornerBrackets size="lg" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start">
            {/* Left Column: Narrative & Direct Links */}
            <div className="lg:col-span-6 flex flex-col gap-4 sm:gap-6">
              <div>
                <div className="flex items-center gap-2 mb-1.5 sm:mb-2 flex-wrap">
                  <span className="font-mono text-[11px] sm:text-xs text-light-ink-muted dark:text-dark-ink-muted font-medium whitespace-nowrap">06 //</span>
                  <span className="font-mono text-[11px] sm:text-xs font-semibold text-light-ink-muted dark:text-dark-ink-muted uppercase tracking-wider">
                    Dialogue · 対話と通信
                  </span>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-light-ink dark:text-dark-ink leading-tight font-normal tracking-tight">
                  Initiate Dialogue{' '}
                  <span className="font-serif font-light text-light-ink-muted dark:text-dark-ink-muted text-xl sm:text-2xl lg:text-3xl ml-1.5 sm:ml-2 whitespace-nowrap inline-block">
                    対話
                  </span>
                </h2>
              </div>

              <p className="font-sans text-xs sm:text-sm text-light-ink-muted dark:text-dark-ink-muted leading-relaxed font-normal max-w-prose">
                Open to software engineering roles, autonomous systems research, and technical collaboration. Transmit a message or reach out through direct channels.
              </p>

              {/* Direct Contact Links */}
              {(contactEmail || contactGithub || contactLinkedin) && (
                <div className="pt-1 flex flex-wrap items-center gap-2">
                  {contactEmail && (
                    <div className="inline-flex items-center rounded-[2px] bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border shadow-2xs text-xs font-mono group/email hover:border-terracotta/60 dark:hover:border-[#D4A853]/60 transition-colors">
                      <a
                        href={mailtoHref}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-light-ink dark:text-dark-ink hover:text-terracotta dark:hover:text-[#D4A853] transition-colors"
                        title="Send direct email"
                      >
                        <Mail className="w-3.5 h-3.5 text-terracotta dark:text-[#D4A853]" />
                        <span className="truncate max-w-[190px] sm:max-w-none">{contactEmail}</span>
                      </a>
                      <button
                        type="button"
                        onClick={handleCopyEmail}
                        className="px-2.5 py-2 border-l border-light-border dark:border-dark-border hover:bg-light-surface-raised dark:hover:bg-dark-surface-raised text-light-ink-muted dark:text-dark-ink-muted hover:text-light-ink dark:hover:text-dark-ink transition-colors cursor-pointer"
                        title="Copy email to clipboard"
                        aria-label="Copy email address"
                      >
                        {copiedEmail ? (
                          <span className="inline-flex items-center gap-1 text-bamboo text-[11px] font-medium">
                            <Check className="w-3 h-3" />
                            <span>Copied</span>
                          </span>
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}

                  {contactGithub && (
                    <a
                      href={contactGithub}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border hover:border-terracotta/60 dark:hover:border-[#D4A853]/60 text-light-ink dark:text-dark-ink hover:text-terracotta dark:hover:text-[#D4A853] font-mono text-xs rounded-[2px] shadow-2xs transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>GitHub</span>
                    </a>
                  )}

                  {contactLinkedin && (
                    <a
                      href={contactLinkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border hover:border-terracotta/60 dark:hover:border-[#D4A853]/60 text-light-ink dark:text-dark-ink hover:text-terracotta dark:hover:text-[#D4A853] font-mono text-xs rounded-[2px] shadow-2xs transition-colors"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Inquiries Form */}
            <div className="lg:col-span-6 w-full lg:pl-8 lg:border-l lg:border-light-border/60 lg:dark:border-dark-border/60 pt-6 lg:pt-0 border-t lg:border-t-0 border-light-border/60 dark:border-dark-border/60">
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <h3 className="font-serif text-base sm:text-lg text-light-ink dark:text-dark-ink font-medium">
                  Send a Message
                </h3>
                <span className="font-mono text-[10px] sm:text-[11px] text-light-ink-muted dark:text-dark-ink-muted uppercase tracking-wider">
                  Direct Inquiries
                </span>
              </div>

              {status === 'success' ? (
                <div role="status" aria-live="polite" className="p-5 rounded-[2px] bg-bamboo/10 border border-bamboo/30 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-bamboo mx-auto" />
                  <h4 className="font-serif text-base text-light-ink dark:text-dark-ink">
                    Message Delivered Directly
                  </h4>
                  <p className="font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted">
                    Your transmission was delivered directly to Vincent's inbox. He will review it and respond promptly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
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
                        Your Name <span className="text-terracotta dark:text-[#D4A853]">*</span>
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        required
                        placeholder="e.g. Kenji Tanaka"
                        value={name}
                        onChange={(e) => handleFieldChange('name', e.target.value)}
                        onBlur={() => handleBlur('name')}
                        aria-invalid={Boolean(touched.name && errors.name)}
                        aria-describedby={touched.name && errors.name ? 'contact-name-error' : undefined}
                        className={`w-full px-3 py-2 rounded-[2px] text-sm bg-light-surface dark:bg-dark-surface border text-light-ink dark:text-dark-ink focus:outline-none focus-visible:ring-2 transition-colors ${
                          touched.name && errors.name
                            ? 'border-red-500/80 dark:border-red-400/80 focus:border-red-500 focus-visible:ring-red-500/30'
                            : 'border-light-border dark:border-dark-border focus:border-terracotta dark:focus:border-[#D4A853] focus-visible:ring-terracotta/40 dark:focus-visible:ring-[#D4A853]/40'
                        }`}
                      />
                      {touched.name && errors.name && (
                        <p id="contact-name-error" className="mt-1 text-[11px] text-red-600 dark:text-red-400 font-sans flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>{errors.name}</span>
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block font-sans text-xs font-medium text-light-ink dark:text-dark-ink mb-1">
                        Email Address <span className="text-terracotta dark:text-[#D4A853]">*</span>
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        placeholder="e.g. kenji@studio.jp"
                        value={email}
                        onChange={(e) => handleFieldChange('email', e.target.value)}
                        onBlur={() => handleBlur('email')}
                        aria-invalid={Boolean(touched.email && errors.email)}
                        aria-describedby={touched.email && errors.email ? 'contact-email-error' : undefined}
                        className={`w-full px-3 py-2 rounded-[2px] text-sm bg-light-surface dark:bg-dark-surface border text-light-ink dark:text-dark-ink focus:outline-none focus-visible:ring-2 transition-colors ${
                          touched.email && errors.email
                            ? 'border-red-500/80 dark:border-red-400/80 focus:border-red-500 focus-visible:ring-red-500/30'
                            : 'border-light-border dark:border-dark-border focus:border-terracotta dark:focus:border-[#D4A853] focus-visible:ring-terracotta/40 dark:focus-visible:ring-[#D4A853]/40'
                        }`}
                      />
                      {touched.email && errors.email && (
                        <p id="contact-email-error" className="mt-1 text-[11px] text-red-600 dark:text-red-400 font-sans flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block font-sans text-xs font-medium text-light-ink dark:text-dark-ink mb-1">
                      Your Message <span className="text-terracotta dark:text-[#D4A853]">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      required
                      placeholder="Briefly describe what you would like to create or explore together..."
                      value={message}
                      onChange={(e) => handleFieldChange('message', e.target.value)}
                      onBlur={() => handleBlur('message')}
                      aria-invalid={Boolean(touched.message && errors.message)}
                      aria-describedby={touched.message && errors.message ? 'contact-message-error' : undefined}
                      className={`w-full px-3 py-2.5 rounded-[2px] text-sm bg-light-surface dark:bg-dark-surface border text-light-ink dark:text-dark-ink focus:outline-none focus-visible:ring-2 transition-colors resize-none ${
                        touched.message && errors.message
                          ? 'border-red-500/80 dark:border-red-400/80 focus:border-red-500 focus-visible:ring-red-500/30'
                          : 'border-light-border dark:border-dark-border focus:border-terracotta dark:focus:border-[#D4A853] focus-visible:ring-terracotta/40 dark:focus-visible:ring-[#D4A853]/40'
                      }`}
                    />
                    {touched.message && errors.message && (
                      <p id="contact-message-error" className="mt-1 text-[11px] text-red-600 dark:text-red-400 font-sans flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.message}</span>
                      </p>
                    )}
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
                    className="w-full py-2.5 px-4 rounded-[2px] font-sans text-sm font-medium bg-light-button-dark dark:bg-dark-button-light text-light-on-dark dark:text-dark-on-light hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-terracotta dark:focus-visible:ring-[#D4A853] focus-visible:outline-none"
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
