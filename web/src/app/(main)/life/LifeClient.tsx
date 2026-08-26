'use client';

import { useEffect } from 'react';
import './life.css';

export default function LifeClient() {
  useEffect(() => {
    // Reveal animations on scroll
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOnScroll = () => {
      revealElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top < windowHeight * 0.85) {
          el.classList.add('revealed');
        }
      });
    };

    revealOnScroll();
    window.addEventListener('scroll', revealOnScroll);
    
    return () => {
      window.removeEventListener('scroll', revealOnScroll);
    };
  }, []);

  return (
    <main id="main" className="life-page">
      {/* Page Hero */}
      <section className="page-hero">
        <svg className="page-hero__peaks" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 400 L0 250 L300 120 L560 260 L820 90 L1120 240 L1440 120 L1440 400Z" fill="#1C4E8A" opacity=".2"/>
          <path d="M0 400 L0 300 L360 200 L680 320 L980 210 L1280 300 L1440 240 L1440 400Z" fill="#143560" opacity=".45"/>
        </svg>
        <div className="wrap-wide page-hero__inner">
          <nav className="crumbs" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
            <span>Life at PCM</span>
          </nav>
          <h1>Life at PCM</h1>
          <p>A degree is only part of the story. Here&rsquo;s what four years at PCM really feels like.</p>
        </div>
      </section>

      {/* Events & Tours Section */}
      <section className="section" id="events">
        <div className="wrap-wide">
          <div className="section-head reveal">
            <span className="eyebrow">Events &amp; Tours</span>
            <h2 className="section-title">Beyond the classroom</h2>
            <p className="section-sub">From flagship fests to educational tours, campus life at PCM is full, varied and genuinely fun.</p>
          </div>
          <div className="grid g-2" style={{ marginTop: '2rem', gap: '1.5rem' }}>
            <div className="feature reveal" style={{ transitionDelay: '0ms' }}>
              <div className="feature__ic">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="m12 2 2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2Z"/>
                </svg>
              </div>
              <h3>Annual Fest</h3>
              <p>The highlight of the year — performances, contests, food and the whole college together in one place.</p>
            </div>
            <div className="feature reveal" style={{ transitionDelay: '60ms' }}>
              <div className="feature__ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="6" cy="19" r="3"/>
                  <circle cx="18" cy="5" r="3"/>
                  <path d="M9 19h5a4 4 0 0 0 0-8H10a4 4 0 0 1 0-8h5"/>
                </svg>
              </div>
              <h3>Educational tours</h3>
              <p>Field trips across Pokhara and beyond that turn theory into first-hand experience.</p>
            </div>
            <div className="feature reveal" style={{ transitionDelay: '120ms' }}>
              <div className="feature__ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2"/>
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                </svg>
              </div>
              <h3>Industry visits</h3>
              <p>Behind-the-scenes access to banks, tech companies and enterprises that hire our graduates.</p>
            </div>
            <div className="feature reveal" style={{ transitionDelay: '180ms' }}>
              <div className="feature__ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9"/>
                  <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"/>
                </svg>
              </div>
              <h3>Cultural programs</h3>
              <p>Celebrating Nepal&rsquo;s diversity through dance, music, dress and shared traditions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Workshops & Seminars Section */}
      <section className="section tone-sky" id="workshops">
        <div className="wrap-wide">
          <div className="section-head reveal">
            <span className="eyebrow">Workshops &amp; Seminars</span>
            <h2 className="section-title">Skills that set you apart</h2>
            <p className="section-sub">Regular workshops and seminars keep your learning current and connected to industry.</p>
          </div>
          <div className="grid g-2" style={{ marginTop: '2rem', gap: '1.5rem' }}>
            <div className="feature reveal" style={{ transitionDelay: '0ms' }}>
              <div className="feature__ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18"/>
                  <path d="m7 14 3-4 3 3 5-6"/>
                </svg>
              </div>
              <h3>Data analytics workshop</h3>
              <p>Hands-on sessions with the tools shaping modern decision-making.</p>
            </div>
            <div className="feature reveal" style={{ transitionDelay: '60ms' }}>
              <div className="feature__ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="2" width="6" height="12" rx="3"/>
                  <path d="M5 10a7 7 0 0 0 14 0M12 17v4"/>
                </svg>
              </div>
              <h3>Communication &amp; public speaking</h3>
              <p>Model press conferences and presentation clinics that build real confidence.</p>
            </div>
            <div className="feature reveal" style={{ transitionDelay: '120ms' }}>
              <div className="feature__ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 4l-4 16"/>
                </svg>
              </div>
              <h3>Tech &amp; coding bootcamps</h3>
              <p>Practical, project-based skill-building beyond the core BCSIT syllabus.</p>
            </div>
            <div className="feature reveal" style={{ transitionDelay: '180ms' }}>
              <div className="feature__ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="8" cy="8" r="6"/>
                  <path d="M18.09 10.37A6 6 0 1 1 10.34 18M7 6h1v4M16.71 13.88l.7.71-2.82 2.82"/>
                </svg>
              </div>
              <h3>Financial literacy seminars</h3>
              <p>Guest experts on markets, investing and personal finance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Student Clubs Section */}
      <section className="section" id="clubs">
        <div className="wrap-wide">
          <div className="section-head reveal">
            <span className="eyebrow">Student Clubs</span>
            <h2 className="section-title">Find your people</h2>
            <p className="section-sub">PCM has always encouraged student clubs to lead, organise and create.</p>
          </div>
          <div className="grid g-4" style={{ marginTop: '2rem' }}>
            <div className="feature reveal" style={{ transitionDelay: '0ms' }}>
              <div className="feature__ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/>
                </svg>
              </div>
              <h3>Innovation &amp; Idea Club</h3>
              <p>Where startup ideas are pitched, challenged and refined.</p>
            </div>
            <div className="feature reveal" style={{ transitionDelay: '60ms' }}>
              <div className="feature__ic">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21s-7-4.35-9.5-8.5C.5 9 2.5 5 6 5c2 0 3.2 1.2 4 2.3C10.8 6.2 12 5 14 5c3.5 0 5.5 4 3.5 7.5C19 16.65 12 21 12 21Z"/>
                </svg>
              </div>
              <h3>Social Service Club</h3>
              <p>Blood drives, clean-ups and community initiatives.</p>
            </div>
            <div className="feature reveal" style={{ transitionDelay: '120ms' }}>
              <div className="feature__ic">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="m12 2 2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2Z"/>
                </svg>
              </div>
              <h3>Sports Club</h3>
              <p>Football, futsal, cricket and the annual athletics meet.</p>
            </div>
            <div className="feature reveal" style={{ transitionDelay: '180ms' }}>
              <div className="feature__ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>
                </svg>
              </div>
              <h3>Literature &amp; Arts Club</h3>
              <p>Writing, debate, music and creative expression.</p>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="gallery">
            <a className="g-item" href="/gallery" data-cat="events">
              <img className="g-item__visual" src="/assets/img/hero-4.jpg" alt="Annual Fest 2083" loading="lazy"/>
              <div className="g-item__overlay">
                <span className="tag">Annual Fest</span>
                <b>Annual Fest 2083</b>
              </div>
            </a>
            <a className="g-item" href="/gallery" data-cat="campus">
              <img className="g-item__visual" src="/assets/img/about-1.jpg" alt="Our Nadipur Campus" loading="lazy"/>
              <div className="g-item__overlay">
                <span className="tag">Campus</span>
                <b>Our Nadipur Campus</b>
              </div>
            </a>
            <a className="g-item" href="/gallery" data-cat="academics">
              <img className="g-item__visual" src="/assets/img/hero-6.jpg" alt="Guest Lecture Series" loading="lazy"/>
              <div className="g-item__overlay">
                <span className="tag">Seminar</span>
                <b>Guest Lecture Series</b>
              </div>
            </a>
            <a className="g-item" href="/gallery" data-cat="tours">
              <img className="g-item__visual" src="/assets/img/about-2.jpg" alt="Annapurna Field Trip" loading="lazy"/>
              <div className="g-item__overlay">
                <span className="tag">Educational Tour</span>
                <b>Annapurna Field Trip</b>
              </div>
            </a>
          </div>

          <div className="center" style={{ marginTop: '1.5rem' }}>
            <a className="btn btn-primary" href="/gallery">
              See the full gallery
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 4h-5L8 6H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-4l-1.5-2Z"/>
                <circle cx="12" cy="13" r="3.5"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="section">
        <div className="wrap-wide">
          <div className="cta-band reveal">
            <div className="cta-band__inner">
              <div>
                <span className="eyebrow on-dark">Enter to Learn • Go Forth to Serve</span>
                <h2>Come and be part of it</h2>
                <p>Applications for BBA, BBA-Finance and BCSIT are open now.</p>
              </div>
              <div className="cta-band__actions">
                <a className="btn btn-gold" href="/admission">
                  Apply Now
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6"/>
                  </svg>
                </a>
                <a className="btn btn-ghost on-dark" href="/about">More Info</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
