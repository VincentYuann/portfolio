import React, { useState } from 'react';
import { Mail, Github, Linkedin, Send, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';
import { sendContactMessage } from '../../../lib/supabase';
import { BambooArt } from '../../common/BambooArt';
import { EnsoOrbital } from '../../common/EnsoOrbital';
import { CornerBrackets } from '../../common/CornerBrackets';
import { useSiteData } from '../../../context/SiteDataContext';

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
  const contactEmail = profile?.email || 'vincentyuan1020@gmail.com';
  const contactGithub = profile?.github || 'https://github.com/VincentYuann';
  const contactLinkedin = profile?.linkedin || 'https://linkedin.com';

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
    <section id="contact" className="relative w-full overflow-hidden py-14 lg:py-20 mb-8">
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

          {/* Komorebi Japanese Landscape Mask Backdrop: Anchored Clearly on Left Side */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-full lg:w-[50%] select-none overflow-hidden opacity-75 dark:opacity-55 mix-blend-multiply dark:mix-blend-screen dark:invert animate-gentle-drift rounded-l-2xl">
            <img
              src="./images/komorebi-spatial.jpg"
              alt="Komorebi Japanese landscape backdrop"
              className="w-full h-full object-cover object-[65%_center]"
              loading="lazy"
              decoding="async"
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
            <div className="lg:col-span-6 flex flex-col gap-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-serif text-terracotta text-sm">06 //</span>
                <span className="font-sans text-[11px] font-semibold text-light-ink-subtle dark:text-dark-ink-subtle uppercase tracking-widest">
                  DIALOGUE &amp; CORRESPONDENCE · 対話と通信
                </span>
              </div>

              <h2 className="font-serif text-2xl sm:text-4xl text-light-ink dark:text-dark-ink leading-tight font-normal tracking-tight">
                Initiate Dialogue{' '}
                <span className="font-serif font-light text-light-ink-muted dark:text-dark-ink-muted text-xl sm:text-3xl ml-2 whitespace-nowrap inline-block">
                  対話
                </span>
              </h2>

              <p className="font-sans text-sm sm:text-base text-light-ink-muted dark:text-dark-ink-muted leading-relaxed font-light">
                Currently open to engineering collaborations, distributed systems design, generative AI architectures, and technical dialogue. Let us discuss possibilities over a message.
              </p>

              {/* Direct Contact Links */}
              {(contactEmail || contactGithub || contactLinkedin) && (
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  {contactEmail && (
                    <>
                      <a
                        href={mailtoHref}
                        className="btn-bloom inline-flex items-center gap-2 px-5 sm:px-6 py-3 bg-terracotta hover:bg-terracotta-hover text-white font-sans text-xs uppercase tracking-widest rounded-lg shadow-sm"
                      >
                        <Mail className="w-4 h-4" />
                        <span>{contactEmail}</span>
                      </a>

                      <button
                        type="button"
                        onClick={handleCopyEmail}
                        className="inline-flex items-center gap-1.5 px-4 py-3 bg-light-surface-raised dark:bg-dark-surface-card border border-light-border dark:border-dark-border hover:bg-light-surface dark:hover:bg-dark-surface-raised hover:border-ochre/50 text-light-ink dark:text-dark-ink font-sans text-xs uppercase tracking-widest rounded-lg shadow-xs transition-all duration-200 cursor-pointer"
                        title="Copy email to clipboard"
                      >
                        {copiedEmail ? (
                          <>
                            <Check className="w-4 h-4 text-bamboo" />
                            <span className="text-bamboo font-medium">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-light-ink-muted" />
                            <span>Copy Email</span>
                          </>
                        )}
                      </button>
                    </>
                  )}

                  {contactGithub && (
                    <a
                      href={contactGithub}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-3 bg-light-surface-raised dark:bg-dark-surface-card border border-light-border dark:border-dark-border hover:bg-light-surface dark:hover:bg-dark-surface-raised hover:border-ochre/50 text-light-ink dark:text-dark-ink font-sans text-xs uppercase tracking-widest rounded-lg shadow-xs transition-all duration-200"
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
                      className="inline-flex items-center gap-2 px-4 py-3 bg-light-surface-raised dark:bg-dark-surface-card border border-light-border dark:border-dark-border hover:bg-light-surface dark:hover:bg-dark-surface-raised hover:border-ochre/50 text-light-ink dark:text-dark-ink font-sans text-xs uppercase tracking-widest rounded-lg shadow-xs transition-all duration-200"
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
                        Your Name <span className="text-terracotta">*</span>
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
                        className={`w-full px-3 py-2 rounded text-sm bg-light-surface dark:bg-dark-surface border text-light-ink dark:text-dark-ink focus:outline-none focus-visible:ring-2 transition-colors ${
                          touched.name && errors.name
                            ? 'border-red-500/80 dark:border-red-400/80 focus:border-red-500 focus-visible:ring-red-500/30'
                            : 'border-light-border dark:border-dark-border focus:border-terracotta focus-visible:ring-terracotta/40'
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
                        Email Address <span className="text-terracotta">*</span>
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
                        className={`w-full px-3 py-2 rounded text-sm bg-light-surface dark:bg-dark-surface border text-light-ink dark:text-dark-ink focus:outline-none focus-visible:ring-2 transition-colors ${
                          touched.email && errors.email
                            ? 'border-red-500/80 dark:border-red-400/80 focus:border-red-500 focus-visible:ring-red-500/30'
                            : 'border-light-border dark:border-dark-border focus:border-terracotta focus-visible:ring-terracotta/40'
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
                      Your Message <span className="text-terracotta">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      required
                      placeholder="Briefly describe what you would like to create or explore together..."
                      value={message}
                      onChange={(e) => handleFieldChange('message', e.target.value)}
                      onBlur={() => handleBlur('message')}
                      aria-invalid={Boolean(touched.message && errors.message)}
                      aria-describedby={touched.message && errors.message ? 'contact-message-error' : undefined}
                      className={`w-full px-3 py-2.5 rounded text-sm bg-light-surface dark:bg-dark-surface border text-light-ink dark:text-dark-ink focus:outline-none focus-visible:ring-2 transition-colors resize-none ${
                        touched.message && errors.message
                          ? 'border-red-500/80 dark:border-red-400/80 focus:border-red-500 focus-visible:ring-red-500/30'
                          : 'border-light-border dark:border-dark-border focus:border-terracotta focus-visible:ring-terracotta/40'
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
