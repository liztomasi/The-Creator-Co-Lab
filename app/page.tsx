'use client';

import { useEffect, useState } from 'react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  orgType: string;
  service: string;
  message: string;
}

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    orgType: '',
    service: '',
    message: '',
  });
  const [submitState, setSubmitState] = useState<SubmitState>('idle');

  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 80);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitState('loading');
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitState('success');
        setFormData({ firstName: '', lastName: '', email: '', orgType: '', service: '', message: '' });
      } else {
        setSubmitState('error');
      }
    } catch {
      setSubmitState('error');
    }
  }

  return (
    <>
      {/* NAV */}
      <nav>
        <a href="#" className="nav-logo">
          The Creator <span>Co-Lab</span>
        </a>
        <ul>
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#process">Process</a></li>
          <li><a href="#contact">Work With Me</a></li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-eyebrow">Remote Consulting · Nationwide</span>
          <h1>Let&apos;s build systems that actually <em>work.</em></h1>
          <p className="hero-desc">
            I help nonprofits, small businesses, and startups streamline their operations, use their
            data intentionally, and show up powerfully — online and beyond.
          </p>
          <div className="hero-cta">
            <a href="#contact" className="btn-primary">Let&apos;s Work Together</a>
            <a href="#services" className="btn-secondary">Explore Services</a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-badge">✦ Now Accepting Clients</div>
          <div className="hero-card">
            <span className="card-tag">Current Focus</span>
            <h2 className="card-title">Helping organizations grow smarter</h2>
            <p className="card-body">
              From building your first CRM to training your team on AI tools — I bring clarity,
              structure, and creativity to the way you work.
            </p>
            <div className="card-pills">
              {['Operations', 'Salesforce & CRM', 'Asana · Notion', 'AI Integration', 'Social Media', 'Remote-First'].map(
                (tag) => (
                  <span key={tag} className="pill">{tag}</span>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about">
        <div className="about-visual reveal">
          <div className="about-block">
            <p className="about-quote">
              &ldquo;Good systems don&apos;t just save time — they{' '}
              <span>free up your people</span> to do their best work.&rdquo;
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--mid-gray)' }}>— Liz Tomasi, Founder</p>
            <div className="about-stats">
              {[
                { num: '4+', label: 'Years in Ops & PM' },
                { num: '100%', label: 'Remote Delivery' },
                { num: '∞', label: 'Tools in Toolkit' },
                { num: 'NH', label: 'Based, US-Wide' },
              ].map(({ num, label }) => (
                <div key={label} className="stat">
                  <span className="stat-number">{num}</span>
                  <span className="stat-label">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="about-content reveal">
          <p className="section-label">About Liz</p>
          <h2 className="section-title">
            A collaborator who <em>gets it done</em>
          </h2>
          <p>
            Hi, I&apos;m Liz — the founder of The Creator Co-Lab. I&apos;ve spent years working inside
            nonprofits as a project manager, data coordinator, and operations lead, which means
            I&apos;ve seen firsthand what it looks like when systems work beautifully — and when they
            completely fall apart.
          </p>
          <p>
            I&apos;ve designed programs, built Salesforce workflows from scratch, managed grant
            reporting, coordinated outreach campaigns, and helped teams adopt tools like Asana,
            Notion, and Google Workspace. Now I bring all of that to{' '}
            <strong>organizations ready to level up.</strong>
          </p>
          <p>
            I work fully remotely with clients across the US, and I bring the same warmth,
            creativity, and precision to every engagement — whether it&apos;s a quick systems audit or
            an ongoing partnership.
          </p>
          <a
            href="#contact"
            className="btn-primary"
            style={{ marginTop: '1rem', display: 'inline-block' }}
          >
            Say Hello →
          </a>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services">
        <div className="services-header">
          <div className="reveal">
            <p className="section-label">What I Do</p>
            <h2 className="section-title">
              Four ways I can <em>help you</em>
            </h2>
          </div>
          <div className="reveal">
            <p className="section-desc">
              Whether you need a one-time project or an ongoing partner, I offer flexible
              engagements built around what your organization actually needs.
            </p>
          </div>
        </div>
        <div className="services-grid">
          {[
            {
              icon: '⚙️',
              iconClass: 'icon-terracotta',
              title: 'Operations & Systems',
              desc: "I'll assess how your organization currently runs, identify the friction points, and set up tools and processes that keep everyone aligned and moving forward.",
              items: [
                'Workflow design & documentation',
                'Asana, Notion & Google Workspace setup',
                'Program guides & process manuals',
                'Team coordination systems',
              ],
            },
            {
              icon: '📊',
              iconClass: 'icon-sage',
              title: 'Data & CRM Strategy',
              desc: 'Stop guessing about your customers or constituents. I help you capture the right data, set up CRM systems that actually get used, and build reports that drive real decisions.',
              items: [
                'Salesforce setup & customization',
                'Data capture strategy',
                'Reporting dashboards',
                'CRM cleanup & optimization',
              ],
            },
            {
              icon: '📱',
              iconClass: 'icon-blue',
              title: 'Social Media & Outreach',
              desc: "Show up consistently and creatively online. I help you build a content system that connects your social presence to your broader goals — without the chaos.",
              items: [
                'Content strategy & planning',
                'Social media systems & scheduling',
                'Community outreach campaigns',
                'Brand voice development',
              ],
            },
            {
              icon: '🤖',
              iconClass: 'icon-purple',
              title: 'AI Integration & Training',
              desc: 'AI tools can save your team hours every week — but only if people know how to use them well. I help organizations identify where AI fits and train teams to use it confidently.',
              items: [
                'AI tools audit & recommendations',
                'Workflow automation with AI',
                'Team training & workshops',
                'Ongoing support as tools evolve',
              ],
            },
          ].map(({ icon, iconClass, title, desc, items }) => (
            <div key={title} className="service-card reveal">
              <div className={`service-icon ${iconClass}`}>{icon}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
              <ul className="service-list">
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section id="process">
        <div className="process-header">
          <div className="reveal">
            <p className="section-label">How It Works</p>
            <h2 className="section-title">
              Simple, <em>collaborative,</em> results-driven
            </h2>
          </div>
          <div className="reveal">
            <p className="section-desc">
              I keep things straightforward. No jargon, no unnecessary complexity — just clear work
              that moves your organization forward.
            </p>
          </div>
        </div>
        <div className="process-steps">
          {[
            {
              num: '01',
              title: 'Discovery Call',
              desc: "We talk through where you are, what's not working, and what you actually need. No pressure, just an honest conversation about whether we're a good fit.",
            },
            {
              num: '02',
              title: 'Proposal & Plan',
              desc: "I put together a clear scope of work — what we'll do, what it costs, and what the timeline looks like. Project-based or ongoing retainer, whatever suits your needs.",
            },
            {
              num: '03',
              title: 'Build & Deliver',
              desc: "We get to work. I keep communication clear and consistent, and deliver systems and strategies your team can actually use and sustain long after our engagement ends.",
            },
          ].map(({ num, title, desc }) => (
            <div key={num} className="step reveal">
              <div className="step-num">{num}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <div className="reveal">
          <p className="section-label">Get In Touch</p>
          <h2 className="section-title">
            Ready to build something <em>better?</em>
          </h2>
          <p className="section-desc">
            Whether you have a specific project in mind or just want to explore what&apos;s possible,
            I&apos;d love to hear from you.
          </p>
          <div className="contact-highlight">
            <h3>Currently accepting new clients</h3>
            <p>
              I work with nonprofits, small businesses, and startups across the US — fully remote.
              Engagements range from one-time projects to ongoing monthly partnerships.
            </p>
            <div className="contact-details">
              <div className="contact-detail">
                <span>✦</span>
                <span>Remote · Nationwide</span>
              </div>
              <div className="contact-detail">
                <span>✦</span>
                <span>Based in New Hampshire</span>
              </div>
              <div className="contact-detail">
                <span>✦</span>
                <span>The Creator Co-Lab LLC</span>
              </div>
            </div>
          </div>
        </div>

        <div className="reveal">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Jane"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Smith"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="jane@yourorg.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="orgType">Organization Type</label>
              <select
                id="orgType"
                name="orgType"
                value={formData.orgType}
                onChange={handleChange}
              >
                <option value="">Select one...</option>
                <option>Nonprofit</option>
                <option>Small Business</option>
                <option>Startup</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="service">I&apos;m most interested in...</label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
              >
                <option value="">Select a service...</option>
                <option>Operations &amp; Systems</option>
                <option>Data &amp; CRM Strategy</option>
                <option>Social Media &amp; Outreach</option>
                <option>AI Integration &amp; Training</option>
                <option>Multiple Services</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="message">Tell me about your project</label>
              <textarea
                id="message"
                name="message"
                placeholder="What's going on, and what do you need help with?"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            {submitState === 'error' && (
              <p className="form-error">
                Something went wrong sending your message. Please try again or email directly.
              </p>
            )}

            <button
              type="submit"
              className={`form-submit${submitState === 'success' ? ' success' : ''}`}
              disabled={submitState === 'loading' || submitState === 'success'}
            >
              {submitState === 'loading'
                ? 'Sending...'
                : submitState === 'success'
                ? '✓ Message Sent!'
                : 'Send Message →'}
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <p>
          <strong>The Creator Co-Lab LLC</strong> · Liz Tomasi · New Hampshire · Remote Consulting
          Nationwide
        </p>
        <p style={{ marginTop: '0.5rem' }}>© 2025 The Creator Co-Lab LLC. All rights reserved.</p>
      </footer>
    </>
  );
}
