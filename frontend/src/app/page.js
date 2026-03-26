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
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedCounter({ value, label, icon, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay }}
      style={{
        textAlign: 'center',
        padding: '24px'
      }}
    >
      <div style={{ fontSize: '32px', marginBottom: '8px' }}>{icon}</div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: delay + 0.2 }}
        style={{
          fontSize: '36px',
          fontWeight: 800,
          color: 'var(--color-primary-500)',
          lineHeight: 1
        }}
      >
        {value}
      </motion.div>
      <div style={{
        fontSize: '13px',
        color: 'var(--color-text-muted)',
        fontWeight: 500,
        marginTop: '6px'
      }}>
        {label}
      </div>
    </motion.div>
  );
}

const GRADES = [
  {
    grade: 'Platinum',
    icon: '💎',
    range: 'Skor > 90',
    desc: 'Sapi terbaik dengan kualitas premium di semua kriteria penilaian.',
    color: '#818cf8',
    bg: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)'
  },
  {
    grade: 'Gold',
    icon: '🥇',
    range: 'Skor 75 - 90',
    desc: 'Sapi berkualitas tinggi, ideal untuk qurban dengan standar terbaik.',
    color: '#f59e0b',
    bg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)'
  },
  {
    grade: 'Silver',
    icon: '🥈',
    range: 'Skor 60 - 74',
    desc: 'Sapi berkualitas baik yang telah memenuhi standar syarat qurban.',
    color: '#64748b',
    bg: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
  }
];

const KRITERIA = [
  { kode: 'C1', nama: 'Bobot Hidup', bobot: '30%', icon: '⚖️', desc: 'Berat badan sapi dalam kilogram' },
  { kode: 'C2', nama: 'Body Condition Score', bobot: '20%', icon: '💪', desc: 'Kondisi tubuh dan cadangan lemak' },
  { kode: 'C3', nama: 'Konformasi & Postur', bobot: '15%', icon: '📐', desc: 'Bentuk fisik yang proporsional' },
  { kode: 'C4', nama: 'Vitalitas', bobot: '15%', icon: '❤️', desc: 'Tingkat kesehatan dan keaktifan' },
  { kode: 'C5', nama: 'Kekokohan Kaki', bobot: '10%', icon: '🦵', desc: 'Kekuatan dan kekokohan kaki' },
  { kode: 'C6', nama: 'Temperamen', bobot: '10%', icon: '🧘', desc: 'Ketenangan dan kemudahan diatur' }
];

export default function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  // Parallax transforms for the hero image
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.8], [0.45, 0.85]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <>
      <Navbar />
      <main>
        {/* ==========================================
            HERO SECTION - Full Background Image with Parallax
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
          {/* Background Image with Parallax */}
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
              style={{
                objectFit: 'cover',
                objectPosition: 'center'
              }}
            />
          </motion.div>

          {/* Dark gradient overlay - darkens on scroll */}
          <motion.div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.6) 100%)',
            zIndex: 1,
            opacity: overlayOpacity
          }} />

          {/* Content on top of image - fades & slides up on scroll */}
          <motion.div style={{ maxWidth: '750px', position: 'relative', zIndex: 2, y: contentY, opacity: contentOpacity }}>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 20px',
                borderRadius: '999px',
                background: 'rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.95)',
                fontSize: '13px',
                fontWeight: 500,
                marginBottom: '24px',
                border: '1px solid rgba(255,255,255,0.2)',
                backdropFilter: 'blur(12px)',
                letterSpacing: '0.3px'
              }}>
                <span style={{ fontWeight: 700 }}>PT Ghaffar Farm Bersaudara</span>
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.5)' }} />
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>Est. 2012</span>
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              style={{
                fontSize: 'clamp(34px, 5.5vw, 56px)',
                fontWeight: 800,
                lineHeight: 1.15,
                color: '#ffffff',
                marginBottom: '20px',
                textShadow: '0 2px 20px rgba(0,0,0,0.3)'
              }}
            >
              Sistem Penunjang Keputusan{' '}
              <span style={{
                background: 'linear-gradient(135deg, #38bdf8 0%, #7dd3fc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Sapi Qurban Terbaik
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              style={{
                fontSize: '17px',
                color: 'rgba(255,255,255,0.85)',
                lineHeight: 1.7,
                marginBottom: '36px',
                maxWidth: '580px',
                margin: '0 auto 36px',
                textShadow: '0 1px 8px rgba(0,0,0,0.2)'
              }}
            >
              Pilih sapi qurban berkualitas yang dinilai secara transparan menggunakan
              metode <strong style={{ color: '#ffffff' }}>SAW</strong> (Simple Additive Weighting) dengan 6 kriteria penilaian profesional.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}
            >
              <Link href="/katalog" style={{
                padding: '14px 32px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-600) 100%)',
                color: 'white',
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: 600,
                boxShadow: '0 4px 20px rgba(14, 165, 233, 0.4)',
                transition: 'all 0.3s ease'
              }}>
                Lihat Katalog Sapi →
              </Link>
              <Link href="/cek-pemesanan" style={{
                padding: '14px 32px',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid rgba(255,255,255,0.4)',
                backgroundColor: 'rgba(255,255,255,0.12)',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: 600,
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(8px)'
              }}>
                Cek Pemesanan
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* ==========================================
            STATS SECTION
           ========================================== */}
        <section style={{
          padding: '40px 24px',
          backgroundColor: 'var(--color-bg)'
        }}>
          <div style={{
            maxWidth: '900px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
            backgroundColor: 'var(--color-bg-card)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-border-light)',
            boxShadow: 'var(--shadow-md)',
            overflow: 'hidden'
          }}>
            <AnimatedCounter value="6" label="Kriteria Penilaian" icon="📊" delay={0} />
            <AnimatedCounter value="3" label="Level Grade" icon="🏆" delay={0.1} />
            <AnimatedCounter value="SAW" label="Metode Ilmiah" icon="📐" delay={0.2} />
            <AnimatedCounter value="48j" label="Masa Booking" icon="⏰" delay={0.3} />
          </div>
        </section>

        {/* ==========================================
            HOW IT WORKS
           ========================================== */}
        <section style={{
          padding: '80px 24px',
          backgroundColor: 'var(--color-bg-secondary)'
        }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <AnimatedSection>
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  backgroundColor: 'var(--color-primary-100)',
                  color: 'var(--color-primary-700)',
                  fontSize: '12px',
                  fontWeight: 600,
                  marginBottom: '12px'
                }}>
                  BAGAIMANA CARA KERJANYA?
                </span>
                <h2 style={{
                  fontSize: '30px',
                  fontWeight: 800,
                  color: 'var(--color-text)'
                }}>
                  Metode SAW yang Transparan
                </h2>
                <p style={{
                  fontSize: '15px',
                  color: 'var(--color-text-secondary)',
                  marginTop: '8px',
                  maxWidth: '500px',
                  margin: '8px auto 0'
                }}>
                  Setiap sapi dinilai berdasarkan 6 kriteria dengan bobot ilmiah
                </p>
              </div>
            </AnimatedSection>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px'
            }}>
              {KRITERIA.map((k, i) => (
                <AnimatedSection key={k.kode} delay={i * 0.08}>
                  <motion.div
                    whileHover={{ y: -4, boxShadow: '0 8px 25px rgba(0,0,0,0.08)' }}
                    transition={{ duration: 0.2 }}
                    style={{
                      backgroundColor: 'var(--color-bg-card)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '24px',
                      border: '1px solid var(--color-border-light)',
                      boxShadow: 'var(--shadow-card)',
                      cursor: 'default'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px'
                    }}>
                      <span style={{ fontSize: '28px' }}>{k.icon}</span>
                      <span style={{
                        padding: '3px 10px',
                        borderRadius: '999px',
                        backgroundColor: 'var(--color-primary-50)',
                        color: 'var(--color-primary-600)',
                        fontSize: '12px',
                        fontWeight: 700
                      }}>
                        {k.bobot}
                      </span>
                    </div>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: 'var(--color-primary-500)',
                      marginBottom: '4px',
                      letterSpacing: '0.5px'
                    }}>
                      {k.kode}
                    </div>
                    <div style={{
                      fontSize: '15px',
                      fontWeight: 700,
                      color: 'var(--color-text)',
                      marginBottom: '6px'
                    }}>
                      {k.nama}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: 'var(--color-text-muted)',
                      lineHeight: 1.5
                    }}>
                      {k.desc}
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
          backgroundColor: 'var(--color-bg)'
        }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <AnimatedSection>
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  backgroundColor: 'var(--color-primary-100)',
                  color: 'var(--color-primary-700)',
                  fontSize: '12px',
                  fontWeight: 600,
                  marginBottom: '12px'
                }}>
                  SISTEM GRADING
                </span>
                <h2 style={{
                  fontSize: '30px',
                  fontWeight: 800,
                  color: 'var(--color-text)'
                }}>
                  Tiga Level Kualitas
                </h2>
                <p style={{
                  fontSize: '15px',
                  color: 'var(--color-text-secondary)',
                  marginTop: '8px'
                }}>
                  Sapi dikelompokkan berdasarkan skor SAW yang diperoleh
                </p>
              </div>
            </AnimatedSection>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px'
            }}>
              {GRADES.map((g, i) => (
                <AnimatedSection key={g.grade} delay={i * 0.12}>
                  <motion.div
                    whileHover={{ y: -6, boxShadow: `0 12px 30px ${g.color}20` }}
                    transition={{ duration: 0.25 }}
                    style={{
                      background: g.bg,
                      borderRadius: 'var(--radius-xl)',
                      padding: '32px 24px',
                      textAlign: 'center',
                      border: `1px solid ${g.color}25`,
                      cursor: 'default'
                    }}
                  >
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>{g.icon}</div>
                    <div style={{
                      fontSize: '22px',
                      fontWeight: 800,
                      color: g.color,
                      marginBottom: '6px'
                    }}>
                      {g.grade}
                    </div>
                    <div style={{
                      display: 'inline-block',
                      padding: '3px 12px',
                      borderRadius: '999px',
                      backgroundColor: `${g.color}18`,
                      color: g.color,
                      fontSize: '12px',
                      fontWeight: 700,
                      marginBottom: '14px'
                    }}>
                      {g.range}
                    </div>
                    <div style={{
                      fontSize: '14px',
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
          padding: '80px 24px',
          background: 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-700) 100%)',
          textAlign: 'center'
        }}>
          <AnimatedSection>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h2 style={{
                fontSize: '28px',
                fontWeight: 800,
                color: 'white',
                marginBottom: '12px'
              }}>
                Siap Memilih Sapi Qurban Terbaik?
              </h2>
              <p style={{
                fontSize: '15px',
                color: 'rgba(255,255,255,0.8)',
                marginBottom: '28px',
                lineHeight: 1.6
              }}>
                Lihat katalog sapi kami yang sudah dinilai secara transparan dengan metode SAW.
                Anda yang menentukan pilihan terbaik.
              </p>
              <Link href="/katalog" style={{
                display: 'inline-block',
                padding: '14px 36px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'white',
                color: 'var(--color-primary-600)',
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: 700,
                boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                transition: 'all 0.3s ease'
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
