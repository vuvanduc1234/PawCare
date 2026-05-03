import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/common';
import Footer from '../components/common/Footer';
import f3 from '../images/f3.png';
import serviceServiceModule from '../services/serviceService';

const serviceService = serviceServiceModule.default || serviceServiceModule;

const CATEGORY_ICONS = {
  spa: '🛁',
  clinic: '🏥',
  hotel: '🏨',
  grooming: '✂️',
  vet: '🩺',
  training: '🎯',
  default: '🐾',
};

const HomePage = () => {
  const [latestServices, setLatestServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        setServicesLoading(true);
        const res = await (
          serviceService.searchServices || serviceService.getServicesByCategory
        )({ limit: 6, page: 1 });
        setLatestServices(res?.data || []);
      } catch (e) {
        setLatestServices([]);
      } finally {
        setServicesLoading(false);
      }
    };
    fetchLatest();
  }, []);

  const stats = [
    { num: '2,400+', label: 'Khách hài lòng', icon: '😊' },
    { num: '24/7', label: 'Pet care online', icon: '🕐' },
    { num: '4.9★', label: 'Đánh giá trung bình', icon: '⭐' },
    { num: '1 phút', label: 'Đặt lịch nhanh', icon: '⚡' },
  ];

  const services = [
    {
      icon: '🩺',
      title: 'Tìm dịch vụ',
      desc: 'Khám phá spa, grooming, khám bệnh và dịch vụ tại nhà cho bé yêu của bạn.',
      path: '/services',
      color: '#e8f4f4',
      accent: 'var(--teal)',
    },
    {
      icon: '📅',
      title: 'Đặt lịch nhanh',
      desc: 'Chọn thời gian, thanh toán an toàn, nhận nhắc lịch tự động ngay lập tức.',
      path: '/bookings',
      color: '#fde8e0',
      accent: 'var(--coral)',
    },
    {
      icon: '⭐',
      title: 'Đánh giá thật',
      desc: 'Đọc review, xem ảnh thật từ khách hàng và chọn nơi phù hợp nhất cho bé.',
      path: '/services',
      color: '#fff3e0',
      accent: '#e6a020',
    },
  ];

  const categories = [
    {
      icon: '🛁',
      label: 'Spa & Grooming',
      path: '/services?category=spa',
      color: '#e8f4f4',
    },
    {
      icon: '🏥',
      label: 'Phòng khám',
      path: '/services?category=clinic',
      color: '#fde8e0',
    },
    {
      icon: '🏨',
      label: 'Pet Hotel',
      path: '/services?category=hotel',
      color: '#f0f0ff',
    },
    {
      icon: '✂️',
      label: 'Cắt tỉa lông',
      path: '/services?category=grooming',
      color: '#fff3e0',
    },
  ];

  const fallbackProducts = [
    { icon: '🧳', label: 'Pet carrier' },
    { icon: '🥣', label: 'Pet bowl' },
    { icon: '🍜', label: 'Designer bowl' },
    { icon: '🍪', label: 'Healthy treat' },
    { icon: '🧸', label: 'Smart toy' },
    { icon: '🟣', label: 'Pet accessory' },
  ];

  const formatPrice = (price) => {
    if (!price && price !== 0) return '';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      <Header />

      {/* HERO */}
      <section style={{ background: '#FDF3EF', position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            opacity: 0.07,
            fontSize: '8rem',
            transform: 'rotate(-20deg)',
          }}
        >
          🐾
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '15%',
            left: '15%',
            opacity: 0.05,
            fontSize: '5rem',
            transform: 'rotate(15deg)',
          }}
        >
          🐾
        </div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 min-h-[75vh] items-center gap-8 py-12">
            <div className="flex flex-col justify-center">
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(29,110,110,0.1)',
                  color: 'var(--teal)',
                  borderRadius: '2rem',
                  padding: '0.4rem 1rem',
                  marginBottom: '1.5rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  width: 'fit-content',
                }}
              >
                🐾 Dịch vụ thú cưng chuyên nghiệp
              </div>
              <h1
                style={{
                  fontFamily: 'Quicksand, sans-serif',
                  fontWeight: 800,
                  color: 'var(--teal-dark)',
                  lineHeight: 1.1,
                  marginBottom: '0.3rem',
                }}
                className="text-5xl sm:text-6xl"
              >
                Nâng Tầm
              </h1>
              <h1
                style={{
                  fontFamily: 'Quicksand, sans-serif',
                  fontWeight: 800,
                  color: 'var(--coral)',
                  lineHeight: 1.1,
                  marginBottom: '0.8rem',
                }}
                className="text-5xl sm:text-6xl"
              >
                Cuộc Sống
              </h1>
              <h2
                style={{
                  fontFamily: 'Quicksand, sans-serif',
                  fontWeight: 700,
                  color: 'var(--teal)',
                  lineHeight: 1.2,
                  marginBottom: '1.2rem',
                }}
                className="text-3xl sm:text-4xl"
              >
                Thú Cưng Của Bạn
              </h2>
              <p
                style={{
                  color: 'var(--text-mid)',
                  fontSize: '1rem',
                  lineHeight: 1.8,
                  maxWidth: '30rem',
                  marginBottom: '2rem',
                }}
              >
                Dịch vụ y tế chuyên sâu, sản phẩm cao cấp và tình yêu thương
                trọn vẹn dành cho người bạn lông xù của bạn.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <Link
                  to="/bookings"
                  style={{
                    background: 'var(--coral)',
                    color: '#fff',
                    borderRadius: '2rem',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    boxShadow: '0 4px 16px rgba(224,112,85,0.35)',
                  }}
                  className="px-8 py-3.5 hover:opacity-85 transition-all"
                >
                  ĐẶT LỊCH KHÁM NGAY
                </Link>
                <Link
                  to="/services"
                  style={{
                    background: '#fff',
                    color: 'var(--teal)',
                    border: '2px solid var(--teal)',
                    borderRadius: '2rem',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                  }}
                  className="px-8 py-3.5 hover:bg-teal-50 transition-all"
                >
                  Khám phá dịch vụ
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <Link
                    key={c.label}
                    to={c.path}
                    style={{
                      background: c.color,
                      color: 'var(--teal-dark)',
                      borderRadius: '2rem',
                      border: '1.5px solid transparent',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 hover:border-teal-400 transition-all"
                  >
                    <span style={{ fontSize: '1.1rem' }}>{c.icon}</span>
                    <span>{c.label}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div
              style={{
                position: 'relative',
                height: '500px',
                alignItems: 'flex-end',
              }}
              className="hidden lg:flex justify-center"
            >
              <div
                style={{
                  width: '420px',
                  height: '420px',
                  background: '#FDF3EF',
                  borderRadius: '50%',
                  position: 'absolute',
                  bottom: '0',
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
              />
              <img
                src={f3}
                alt="PawCare pets"
                loading="eager"
                style={{
                  position: 'relative',
                  width: '440px',
                  objectFit: 'contain',
                  zIndex: 1,
                  marginTop: '40px',
                  marginBottom: '-10px',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '2rem',
                  left: '-1rem',
                  background: '#fff',
                  borderRadius: '1rem',
                  padding: '1rem 1.4rem',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                  borderLeft: '4px solid var(--teal)',
                }}
              >
                <p
                  style={{
                    fontFamily: 'Quicksand, sans-serif',
                    color: 'var(--teal-dark)',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                  }}
                >
                  😊 Happy pets, happy life
                </p>
                <p
                  style={{
                    color: 'var(--text-light)',
                    fontSize: '0.72rem',
                    marginTop: '0.2rem',
                  }}
                >
                  Mở cửa 09:00 – 21:00 hàng ngày
                </p>
              </div>
              <div
                style={{
                  position: 'absolute',
                  top: '2rem',
                  right: '0',
                  background: 'var(--coral)',
                  color: '#fff',
                  borderRadius: '1rem',
                  padding: '0.6rem 1rem',
                  boxShadow: '0 4px 16px rgba(224,112,85,0.35)',
                }}
              >
                <p style={{ fontWeight: 800, fontSize: '1.1rem' }}>4.9 ⭐</p>
                <p style={{ fontSize: '0.7rem', opacity: 0.9 }}>
                  2,400+ khách hài lòng
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div style={{ background: 'var(--teal)' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={i}
              className="px-8 py-5 text-center"
              style={{
                borderRight:
                  i < 3 ? '1px solid rgba(255,255,255,0.15)' : 'none',
              }}
            >
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  background: 'rgba(255,255,255,0.18)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                  fontSize: '1.85rem',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.12)',
                }}
              >
                {s.icon}
              </div>
              <p
                style={{
                  fontFamily: 'Quicksand, sans-serif',
                  color: '#fff',
                  fontSize: '1.65rem',
                  fontWeight: 800,
                  lineHeight: 1,
                }}
              >
                {s.num}
              </p>
              <p
                style={{
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '0.73rem',
                  letterSpacing: '0.05em',
                  marginTop: '0.3rem',
                  fontWeight: 500,
                }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* SẢN PHẨM / DỊCH VỤ MỚI NHẤT */}
      <section style={{ background: '#fff', padding: '4rem 0' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <div
              style={{
                width: '2.5rem',
                height: '3px',
                background: 'var(--teal)',
                margin: '0 auto 1rem',
                borderRadius: '2px',
              }}
            />
            <h2
              style={{
                fontFamily: 'Quicksand, sans-serif',
                fontWeight: 800,
                color: 'var(--teal-dark)',
                fontSize: '2rem',
              }}
            >
              DỊCH VỤ MỚI NHẤT
            </h2>
            <p
              style={{
                color: 'var(--text-light)',
                fontSize: '0.88rem',
                marginTop: '0.5rem',
              }}
            >
              Khám phá các dịch vụ y tế & chăm sóc thú cưng mới nhất
            </p>
          </div>

          {servicesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    background: 'var(--teal-pale)',
                    borderRadius: '1.2rem',
                    padding: '1.6rem 1rem',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '70px',
                      height: '70px',
                      background: '#e0e0e0',
                      borderRadius: '50%',
                      margin: '0 auto 1rem',
                      animation: 'pulse 1.5s infinite',
                    }}
                  />
                  <div
                    style={{
                      height: '14px',
                      background: '#e0e0e0',
                      borderRadius: '4px',
                      width: '80%',
                      margin: '0 auto',
                    }}
                  />
                </div>
              ))}
            </div>
          ) : latestServices.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {latestServices.map((svc, i) => (
                <Link
                  to={`/services/${svc._id}`}
                  key={svc._id || i}
                  style={{
                    background: 'var(--teal-pale)',
                    borderRadius: '1.2rem',
                    textAlign: 'center',
                    padding: '1.6rem 1rem',
                    transition: 'all .2s',
                    display: 'block',
                    textDecoration: 'none',
                  }}
                  className="hover:-translate-y-1 hover:shadow-md group"
                >
                  <div
                    style={{
                      width: '70px',
                      height: '70px',
                      background: '#fff',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1rem',
                      fontSize: svc.images?.[0] ? '0' : '2.6rem',
                      boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
                      overflow: 'hidden',
                    }}
                    className="group-hover:scale-110 transition-transform"
                  >
                    {svc.images?.[0] ? (
                      <img
                        src={svc.images[0]?.url || svc.images[0]}
                        alt={svc.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <span>
                        {CATEGORY_ICONS[svc.category] || CATEGORY_ICONS.default}
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--teal-dark)',
                      marginBottom: '0.25rem',
                      lineHeight: 1.3,
                    }}
                    className="line-clamp-2"
                  >
                    {svc.name}
                  </p>
                  {svc.price && (
                    <p
                      style={{
                        fontSize: '0.7rem',
                        color: 'var(--coral)',
                        fontWeight: 700,
                      }}
                    >
                      {formatPrice(svc.price)}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {fallbackProducts.map((p, i) => (
                <Link
                  to="/services"
                  key={i}
                  style={{
                    background: 'var(--teal-pale)',
                    borderRadius: '1.2rem',
                    textAlign: 'center',
                    padding: '1.6rem 1rem',
                    transition: 'all .2s',
                    display: 'block',
                  }}
                  className="hover:-translate-y-1 hover:shadow-md group"
                >
                  <div
                    style={{
                      width: '70px',
                      height: '70px',
                      background: '#fff',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1rem',
                      fontSize: '2.6rem',
                      boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
                    }}
                    className="group-hover:scale-110 transition-transform"
                  >
                    {p.icon}
                  </div>
                  <p
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: 'var(--teal-dark)',
                    }}
                  >
                    {p.label}
                  </p>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              to="/services"
              style={{
                color: 'var(--teal)',
                fontSize: '0.88rem',
                fontWeight: 700,
                borderBottom: '2px solid var(--teal)',
                paddingBottom: '2px',
              }}
            >
              Xem tất cả dịch vụ →
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICES CARDS */}
      <section style={{ background: 'var(--cream)', padding: '5rem 0' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '3rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div
                style={{
                  width: '2.5rem',
                  height: '3px',
                  background: 'var(--coral)',
                  borderRadius: '2px',
                  marginBottom: '1rem',
                }}
              />
              <h2
                style={{
                  fontFamily: 'Quicksand, sans-serif',
                  color: 'var(--teal-dark)',
                  fontSize: '2.2rem',
                  fontWeight: 800,
                  lineHeight: 1.2,
                  maxWidth: '26rem',
                }}
              >
                Mọi thứ thú cưng cần, đều có tại đây
              </h2>
            </div>
            <Link
              to="/services"
              style={{
                color: 'var(--teal)',
                fontSize: '0.85rem',
                fontWeight: 700,
                borderBottom: '2px solid var(--teal)',
              }}
            >
              Xem tất cả →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {services.map((s, idx) => (
              <Link
                key={idx}
                to={s.path}
                style={{
                  background: s.color,
                  borderRadius: '1.3rem',
                  padding: '2.4rem 2rem',
                  display: 'block',
                  transition: 'all .2s',
                }}
                className="hover:-translate-y-2 hover:shadow-lg group"
              >
                <div
                  style={{
                    width: '78px',
                    height: '78px',
                    background: '#fff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem',
                    fontSize: '2.8rem',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                    border: '5px solid rgba(255,255,255,0.95)',
                  }}
                >
                  {s.icon}
                </div>
                <p
                  style={{
                    fontFamily: 'Quicksand, sans-serif',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: 'var(--teal-dark)',
                    marginBottom: '0.8rem',
                  }}
                >
                  {s.title}
                </p>
                <p
                  style={{
                    fontSize: '0.87rem',
                    lineHeight: 1.75,
                    color: 'var(--text-mid)',
                  }}
                >
                  {s.desc}
                </p>
                <div
                  style={{
                    display: 'inline-block',
                    marginTop: '1.6rem',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: s.accent,
                    borderBottom: `2px solid ${s.accent}`,
                    paddingBottom: '2px',
                  }}
                >
                  Xem thêm →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div
        style={{
          background:
            'linear-gradient(135deg, var(--teal) 0%, var(--teal-light) 100%)',
          padding: '3rem 0',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-6 flex-wrap">
          <div>
            <h3
              style={{
                fontFamily: 'Quicksand, sans-serif',
                fontSize: '1.8rem',
                fontWeight: 800,
                color: '#fff',
                marginBottom: '0.5rem',
              }}
            >
              Chăm sóc thú cưng của bạn ngay hôm nay
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem' }}>
              🐾 Đội ngũ bác sĩ thú y chuyên nghiệp, tận tâm và yêu thương động
              vật
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link
              to="/community"
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                borderRadius: '2rem',
                fontWeight: 700,
                border: '2px solid rgba(255,255,255,0.4)',
              }}
              className="px-6 py-3 hover:bg-white hover:text-teal-700 transition-all"
            >
              Cộng đồng PawCare
            </Link>
            <Link
              to="/bookings"
              style={{
                background: 'var(--coral)',
                color: '#fff',
                borderRadius: '2rem',
                fontWeight: 700,
                boxShadow: '0 4px 16px rgba(224,112,85,0.4)',
              }}
              className="px-6 py-3 hover:opacity-85 transition-all"
            >
              📅 Đặt lịch hẹn ngay
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
