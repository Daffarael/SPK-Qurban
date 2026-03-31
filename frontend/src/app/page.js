'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

function AnimatedSection({ children, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

const STATS = [
  { value: '✓', label: 'Dinilai Tim Ahli' },
  { value: '3', label: 'Kelas Kualitas' },
  { value: '100%', label: 'Transparan' },
  { value: '48j', label: 'Masa Booking' }
];

const GRADES = [
  {
    grade: 'Platinum',
    range: 'Kualitas Premium',
    desc: 'Sapi pilihan terbaik dengan kondisi sehat, berat ideal, dan postur sempurna. Cocok untuk qurban premium.',
    color: '#818cf8',
    bg: '#eef2ff',
    borderColor: '#c7d2fe'
  },
  {
    grade: 'Gold',
    range: 'Kualitas Tinggi',
    desc: 'Sapi berkualitas tinggi yang sudah memenuhi semua standar qurban dengan sangat baik.',
    color: '#d97706',
    bg: '#fffbeb',
    borderColor: '#fde68a'
  },
  {
    grade: 'Silver',
    range: 'Kualitas Baik',
    desc: 'Sapi berkualitas baik dengan harga lebih terjangkau. Tetap layak untuk qurban.',
    color: '#64748b',
    bg: '#f8fafc',
    borderColor: '#e2e8f0'
  }
];

const LANGKAH = [
  {
    step: '01',
    title: 'Pilih Sapi',
    desc: 'Telusuri katalog sapi yang sudah dinilai kualitasnya oleh tim ahli kami.'
  },
  {
    step: '02',
    title: 'Bandingkan Kualitas',
    desc: 'Lihat skor, grade, berat, dan harga setiap sapi untuk perbandingan yang mudah.'
  },
  {
    step: '03',
    title: 'Pesan Langsung',
    desc: 'Booking sapi favorit Anda langsung dari website dalam hitungan detik.'
  }
];

export default function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.8], [0.45, 0.85]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <>
      <Navbar />
      <main>
        {/* ==========================================
            HERO SECTION
           ========================================== */}
        <section
          ref={heroRef}
          style={{
            position: 'relative',
            height: 'calc(100vh - 70px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '60px 24px',
            overflow: 'hidden'
          }}
        >
          {/* Background Image */}
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 0,
              scale: imageScale,
              y: imageY
            }}
          >
            <Image
              src="/Sapi-Landing Page.jpg"
              alt="Sapi Qurban Berkualitas - PT Ghaffar Farm Bersaudara"
              fill
              priority
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
          </motion.div>

          {/* Overlay */}
          <motion.div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.55) 100%)',
            zIndex: 1,
            opacity: overlayOpacity
          }} />

          {/* Hero Content */}
          <motion.div style={{ maxWidth: '680px', position: 'relative', zIndex: 2, y: contentY, opacity: contentOpacity }}>
            {/* Company badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: '999px',
                background: 'rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.9)',
                fontSize: '13px',
                fontWeight: 500,
                marginBottom: '24px',
                border: '1px solid rgba(255,255,255,0.15)',
                backdropFilter: 'blur(16px)',
                letterSpacing: '0.3px'
              }}>
                <span style={{ fontWeight: 600 }}>PT Ghaffar Farm Bersaudara</span>
                <span style={{ opacity: 0.4 }}>·</span>
                <span style={{ opacity: 0.7 }}>Est. 2012</span>
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              style={{
                fontSize: 'clamp(32px, 5vw, 52px)',
                fontWeight: 800,
                lineHeight: 1.15,
                color: '#ffffff',
                marginBottom: '18px',
                letterSpacing: '-0.02em'
              }}
            >
              Pilih{' '}
              <span style={{
                background: 'linear-gradient(135deg, #7dd3fc, #38bdf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Sapi Qurban Terbaik
              </span>
              {' '}Untuk Ibadah Anda
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              style={{
                fontSize: '16px',
                color: 'rgba(255,255,255,0.8)',
                lineHeight: 1.7,
                marginBottom: '32px',
                maxWidth: '520px',
                margin: '0 auto 32px'
              }}
            >
              Setiap sapi dinilai kualitasnya oleh tim ahli.
              Anda tinggal <strong style={{ color: '#ffffff' }}>pilih yang paling sesuai</strong> dengan kebutuhan Anda.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}
            >
              <Link href="/katalog" style={{
                padding: '13px 28px',
                borderRadius: '10px',
                background: 'var(--color-primary-500)',
                color: 'white',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 600,
                boxShadow: '0 4px 16px rgba(14, 165, 233, 0.35)',
                transition: 'all 0.2s ease',
                letterSpacing: '0.2px'
              }}>
                Lihat Katalog →
              </Link>
              <Link href="/cek-pemesanan" style={{
                padding: '13px 28px',
                borderRadius: '10px',
                border: '1.5px solid rgba(255,255,255,0.3)',
                backgroundColor: 'rgba(255,255,255,0.08)',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 600,
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(8px)'
              }}>
                Cek Pemesanan
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* ==========================================
            STATS BAR
           ========================================== */}
        <section style={{
          padding: '0 24px',
          backgroundColor: 'var(--color-bg)',
          marginTop: '-32px',
          position: 'relative',
          zIndex: 3
        }}>
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            backgroundColor: 'var(--color-bg-card)',
            borderRadius: '14px',
            border: '1px solid var(--color-border-light)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            overflow: 'hidden'
          }}>
            {STATS.map((stat, i) => (
              <AnimatedSection key={i} delay={i * 0.08}>
                <div style={{
                  textAlign: 'center',
                  padding: '24px 16px',
                  borderRight: i < STATS.length - 1 ? '1px solid var(--color-border-light)' : 'none'
                }}>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: 800,
                    color: 'var(--color-primary-500)',
                    lineHeight: 1,
                    marginBottom: '6px'
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--color-text-muted)',
                    fontWeight: 500
                  }}>
                    {stat.label}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* ==========================================
            HOW IT WORKS
           ========================================== */}
        <section style={{
          padding: '80px 24px',
          backgroundColor: 'var(--color-bg)'
        }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <AnimatedSection>
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 14px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--color-primary-50)',
                  color: 'var(--color-primary-600)',
                  fontSize: '11px',
                  fontWeight: 700,
                  marginBottom: '14px',
                  letterSpacing: '0.8px',
                  textTransform: 'uppercase'
                }}>
                  Cara Memilih
                </span>
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: 800,
                  color: 'var(--color-text)',
                  letterSpacing: '-0.02em'
                }}>
                  Semudah 3 Langkah
                </h2>
                <p style={{
                  fontSize: '14px',
                  color: 'var(--color-text-secondary)',
                  marginTop: '8px',
                  maxWidth: '420px',
                  margin: '8px auto 0'
                }}>
                  Pilih, bandingkan, dan pesan langsung dari rumah
                </p>
              </div>
            </AnimatedSection>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px'
            }}>
              {LANGKAH.map((l, i) => (
                <AnimatedSection key={l.step} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      backgroundColor: 'var(--color-bg-card)',
                      borderRadius: '14px',
                      padding: '28px 22px',
                      border: '1px solid var(--color-border-light)',
                      boxShadow: 'var(--shadow-card)',
                      cursor: 'default',
                      height: '100%'
                    }}
                  >
                    {/* Step number */}
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--color-primary-50)',
                      color: 'var(--color-primary-600)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 800,
                      marginBottom: '16px'
                    }}>
                      {l.step}
                    </div>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: 'var(--color-text)',
                      marginBottom: '8px'
                    }}>
                      {l.title}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: 'var(--color-text-muted)',
                      lineHeight: 1.6
                    }}>
                      {l.desc}
                    </div>
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================
            GRADE EXPLANATION
           ========================================== */}
        <section style={{
          padding: '80px 24px',
          backgroundColor: 'var(--color-bg-secondary)'
        }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <AnimatedSection>
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 14px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--color-primary-50)',
                  color: 'var(--color-primary-600)',
                  fontSize: '11px',
                  fontWeight: 700,
                  marginBottom: '14px',
                  letterSpacing: '0.8px',
                  textTransform: 'uppercase'
                }}>
                  Sistem Grading
                </span>
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: 800,
                  color: 'var(--color-text)',
                  letterSpacing: '-0.02em'
                }}>
                  Pilih Sesuai Budget Anda
                </h2>
                <p style={{
                  fontSize: '14px',
                  color: 'var(--color-text-secondary)',
                  marginTop: '8px'
                }}>
                  Semua sapi sudah lolos seleksi. Pilih kelas yang sesuai kebutuhan Anda.
                </p>
              </div>
            </AnimatedSection>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px'
            }}>
              {GRADES.map((g, i) => (
                <AnimatedSection key={g.grade} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      backgroundColor: g.bg,
                      borderRadius: '14px',
                      padding: '28px 22px',
                      border: `1px solid ${g.borderColor}`,
                      cursor: 'default',
                      height: '100%'
                    }}
                  >
                    {/* Grade icon */}
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: `linear-gradient(135deg, ${g.color}18, ${g.color}08)`,
                      border: `1.5px solid ${g.color}25`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '16px'
                    }}>
                      {g.grade === 'Platinum' ? (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2L14.5 8.5L21 9.5L16.5 14.5L17.5 21L12 18L6.5 21L7.5 14.5L3 9.5L9.5 8.5L12 2Z" fill={g.color} opacity="0.85"/>
                          <path d="M12 2L14.5 8.5L21 9.5L16.5 14.5L17.5 21L12 18L6.5 21L7.5 14.5L3 9.5L9.5 8.5L12 2Z" stroke={g.color} strokeWidth="1" strokeLinejoin="round" fill="none" opacity="0.4"/>
                        </svg>
                      ) : g.grade === 'Gold' ? (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                          <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5Z" fill={g.color} opacity="0.85"/>
                          <rect x="4" y="17" width="16" height="3" rx="1" fill={g.color} opacity="0.7"/>
                          <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5Z" stroke={g.color} strokeWidth="1" strokeLinejoin="round" fill="none" opacity="0.3"/>
                        </svg>
                      ) : (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                          <path d="M12 3L20 7V13C20 17.4 16.5 21.5 12 22.5C7.5 21.5 4 17.4 4 13V7L12 3Z" fill={g.color} opacity="0.85"/>
                          <path d="M12 3L20 7V13C20 17.4 16.5 21.5 12 22.5C7.5 21.5 4 17.4 4 13V7L12 3Z" stroke={g.color} strokeWidth="1" strokeLinejoin="round" fill="none" opacity="0.3"/>
                          <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: 700,
                      color: g.color,
                      marginBottom: '4px'
                    }}>
                      {g.grade}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: g.color,
                      opacity: 0.7,
                      marginBottom: '12px'
                    }}>
                      {g.range}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.6
                    }}>
                      {g.desc}
                    </div>
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================
            CTA BOTTOM
           ========================================== */}
        <section style={{
          padding: '72px 24px',
          background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
          textAlign: 'center'
        }}>
          <AnimatedSection>
            <div style={{ maxWidth: '500px', margin: '0 auto' }}>
              <h2 style={{
                fontSize: '26px',
                fontWeight: 800,
                color: 'white',
                marginBottom: '10px',
                letterSpacing: '-0.02em'
              }}>
                Qurban Tahun Ini, Pilih Yang Terbaik
              </h2>
              <p style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.75)',
                marginBottom: '24px',
                lineHeight: 1.7
              }}>
                Sapi sudah dinilai oleh tim ahli, Anda yang menentukan.
              </p>
              <Link href="/katalog" style={{
                display: 'inline-block',
                padding: '12px 28px',
                borderRadius: '10px',
                backgroundColor: 'white',
                color: 'var(--color-primary-600)',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 700,
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease'
              }}>
                Lihat Katalog Sekarang →
              </Link>
            </div>
          </AnimatedSection>
        </section>
      </main>
      <Footer />
    </>
  );
}
