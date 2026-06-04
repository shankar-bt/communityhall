import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Phone,
  ShieldCheck,
  Globe,
  Clock3,
  BadgeCheck,
  Users,
  CheckCircle,
  UserPlus,
} from "lucide-react";
import { useState, useEffect } from "react";
import "./AuthPage.css";

const translations = {
  en: {
    heroTitle: (
      <>
        Digital Services for
        <br />
        Every Citizen.
      </>
    ),
    heroSubtitle: (
      <>
        One Portal for all Government Services
        <br />
        and Citizen Welfare
      </>
    ),
    secure: "Secure",
    secureSub: "Your data is safe with us",
    accessible: "Accessible",
    accessibleSub: "Anytime, Anywhere",
    simplified: "Simplified",
    simplifiedSub: "Easy Access to services",
    trusted: "Trusted",
    trustedSub: "Official Govt. Platform",
    loginTitle: "Log Into Your Account",
    loginTab: "Login with OTP",
    registerTab: "Register",
    username: "Username",
    usernamePlaceholder: "Enter your User Name",
    mobileNumber: "Mobile Number",
    mobilePlaceholder: "Enter your Mobile Number",
    sendOtp: "Send OTP",
    loginBtn: "Login",
    fullName: "Full Name",
    fullNamePlaceholder: "Enter your Full Name",
    email: "Email Address",
    emailPlaceholder: "Enter your Email",
    registerBtn: "Register",
    enterOtp: "Enter OTP",
    enterOtpPlaceholder: "Enter 6-digit OTP",
    verifyLoginBtn: "Verify & Login",
    verifyRegisterBtn: "Verify & Register",
    resendOtp: "Resend OTP",
    trustSecure: "100 % Secure",
    trustSecureSub: "End to End Encryption",
    trustVerified: "Verified Platform",
    trustVerifiedSub: "Official Government Website",
    trustAccess: "24*7 Access",
    trustAccessSub: "Services available round the clock",
    trustCitizen: "Citizen First",
    trustCitizenSub: "Committed to serve you",
    privacy: "Privacy Policy",
    terms: "Terms and Conditions",
    help: "Help",
    contact: "Contact Us",
    usernameError: "Username must contain only letters (A-Z, a-z)",
    mobileError: "Mobile number must be exactly 10 digits",
    fullNameError: "Full Name must contain only letters (A-Z, a-z)",
    requiredError: "This field is required",
  },
  ta: {
    heroTitle: (
      <>
        ஒவ்வொரு குடிமகனுக்கும்
        <br />
        டிஜிட்டல் சேவைகள்.
      </>
    ),
    heroSubtitle: (
      <>
        அனைத்து அரசு சேவைகள் மற்றும்
        <br />
        மக்கள் நலனுக்கான ஒரே தளம்
      </>
    ),
    secure: "பாதுகாப்பானது",
    secureSub: "உங்கள் தரவு பாதுகாப்பாக உள்ளது",
    accessible: "அணுகக்கூடியது",
    accessibleSub: "எந்த நேரத்திலும், எங்கும்",
    simplified: "எளிமையானது",
    simplifiedSub: "சேவைகளை எளிதாக பெறலாம்",
    trusted: "நம்பகமானது",
    trustedSub: "அதிகாரப்பூர்வ அரசு தளம்",
    loginTitle: "உங்கள் கணக்கில் உள்நுழைக",
    loginTab: "OTP மூலம் உள்நுழைக",
    registerTab: "பதிவு செய்க",
    username: "பயனர் பெயர்",
    usernamePlaceholder: "உங்கள் பயனர் பெயரை உள்ளிடவும்",
    mobileNumber: "மொபைல் எண்",
    mobilePlaceholder: "உங்கள் மொபைல் எண்ணை உள்ளிடவும்",
    sendOtp: "OTP அனுப்புக",
    loginBtn: "உள்நுழைக",
    fullName: "முழு பெயர்",
    fullNamePlaceholder: "உங்கள் முழு பெயரை உள்ளிடவும்",
    email: "மின்னஞ்சல் முகவரி",
    emailPlaceholder: "உங்கள் மின்னஞ்சலை உள்ளிடவும்",
    registerBtn: "பதிவு செய்க",
    enterOtp: "OTP-ஐ உள்ளிடவும்",
    enterOtpPlaceholder: "6-இலக்க OTP-ஐ உள்ளிடவும்",
    verifyLoginBtn: "சரிபார்த்து உள்நுழைக",
    verifyRegisterBtn: "சரிபார்த்து பதிவு செய்க",
    resendOtp: "OTP-ஐ மீண்டும் அனுப்புக",
    trustSecure: "100% பாதுகாப்பானது",
    trustSecureSub: "முழுமையான குறியாக்கம்",
    trustVerified: "சரிபார்க்கப்பட்ட தளம்",
    trustVerifiedSub: "அதிகாரப்பூர்வ அரசு வலைத்தளம்",
    trustAccess: "24*7 அணுகல்",
    trustAccessSub: "எந்நேரமும் சேவைகள் கிடைக்கும்",
    trustCitizen: "Citizen First",
    trustCitizenSub: "உங்களுக்கு சேவை செய்ய அர்ப்பணிக்கப்பட்டுள்ளது",
    privacy: "தனியுரிமைக் கொள்கை",
    terms: "விதிமுறைகள் மற்றும் நிபந்தனைகள்",
    help: "உதவி",
    contact: "தொடர்பு கொள்ள",
    usernameError: "பயனர் பெயர் எழுத்துக்களை (A-Z, a-z) மட்டுமே கொண்டிருக்க வேண்டும்",
    mobileError: "கைபேசி எண் சரியாக 10 இலக்கங்களாக இருக்க வேண்டும்",
    fullNameError: "முழு பெயர் எழுத்துக்களை (A-Z, a-z) மட்டுமே கொண்டிருக்க வேண்டும்",
    requiredError: "இப்புலம் தேவையானது",
  },
} as const;

type Lang = keyof typeof translations;

export function AuthScreen({ onSuccess }: { onSuccess?: () => void }) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [fontSize, setFontSize] = useState(16);
  const [lang, setLang] = useState<Lang>("en");
  const [otpSent, setOtpSent] = useState(false);

  // Form State
  const [loginUsername, setLoginUsername] = useState("");
  const [loginMobile, setLoginMobile] = useState("");
  const [registerFullName, setRegisterFullName] = useState("");
  const [registerMobile, setRegisterMobile] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");

  // Error State
  const [errors, setErrors] = useState<{
    username?: string;
    loginMobile?: string;
    fullName?: string;
    registerMobile?: string;
  }>({});

  // Reset OTP & input states when changing tabs
  useEffect(() => {
    setOtpSent(false);
    setErrors({});
    setLoginUsername("");
    setLoginMobile("");
    setRegisterFullName("");
    setRegisterMobile("");
    setRegisterEmail("");
  }, [activeTab]);

  const t = translations[lang];

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
    return () => {
      document.documentElement.style.fontSize = "";
    };
  }, [fontSize]);

  const changeFontSize = (delta: number) => {
    setFontSize((prev) => Math.min(24, Math.max(12, prev + delta)));
  };

  return (
    <div className="auth-page">
      {/* ===== MAIN SPLIT LAYOUT ===== */}
      <div className="auth-main">
        {/* ---- LEFT SECTION (Hero with Image) ---- */}
        <div className="auth-hero">
          {/* Background Image */}
          {/* <img
            src="https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=1200&q=80"
            alt="Chennai Heritage"
            className="auth-hero-bg"
          /> */}
          {/* Dark gradient overlay */}
          <div className="auth-hero-overlay" />

          {/* Orange decorative wave on right edge */}
          <div className="auth-wave-divider">
            <svg viewBox="0 0 120 800" preserveAspectRatio="none">
              <path
                d="M30,0 C80,150 10,300 60,400 C110,500 20,650 70,800 L120,800 L120,0 Z"
                fill="#ffffff"
              />
              <path
                d="M20,0 C70,150 0,300 50,400 C100,500 10,650 60,800 L70,800 C20,650 110,500 60,400 C10,300 80,150 30,0 Z"
                fill="#e8872b"
              />
            </svg>
          </div>

          {/* GCC Logo */}
          <div className="auth-gcc-logo">
            {/* <img
              src="https://chennaicorporation.gov.in/gcc/images/270-2709575_greater-chennai-corporation-dr-greater-chennai-corporation-logo.png"
              alt="GCC Logo"
              className="auth-gcc-logo-img"
            /> */}
            <div>
              <h3 className="auth-gcc-title">Greater Chennai Corporation</h3>
              <p className="auth-gcc-subtitle">சென்னை மாநகராட்சி</p>
            </div>
          </div>

          {/* Hero Text Content */}
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="auth-hero-content"
          >
            <h1 className="auth-hero-title">
              <span className="quote-mark">&ldquo;</span>
              {t.heroTitle}
              <span className="quote-mark">&rdquo;</span>
            </h1>

            {/* Tri-color accent bar */}
            <div className="auth-tricolor">
              <div className="tricolor-bar orange" />
              <div className="tricolor-bar blue" />
              <div className="tricolor-bar green" />
            </div>

            <p className="auth-hero-subtitle">{t.heroSubtitle}</p>
          </motion.div>

          {/* Glass Features Card at bottom */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="auth-glass-card-wrapper"
          >
            <div className="auth-glass-card">
              <div className="auth-glass-grid">
                {[
                  {
                    icon: <ShieldCheck size={22} />,
                    label: t.secure,
                    sub: t.secureSub,
                    colorClass: "feature-blue",
                  },
                  {
                    icon: <Users size={22} />,
                    label: t.accessible,
                    sub: t.accessibleSub,
                    colorClass: "feature-green",
                  },
                  {
                    icon: <Globe size={22} />,
                    label: t.simplified,
                    sub: t.simplifiedSub,
                    colorClass: "feature-orange",
                  },
                  {
                    icon: <CheckCircle size={22} />,
                    label: t.trusted,
                    sub: t.trustedSub,
                    colorClass: "feature-red",
                  },
                ].map((item, i) => (
                  <div key={i} className="auth-glass-item">
                    <div className={`auth-glass-icon ${item.colorClass}`}>{item.icon}</div>
                    <p className="auth-glass-label">{item.label}</p>
                    <p className="auth-glass-sub">{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ---- RIGHT SECTION (Form) ---- */}
        <div className="auth-form-section">
          {/* Top bar: font size + language */}
          <div className="auth-topbar">
            <div className="font-size-controls">
              <button onClick={() => changeFontSize(-2)} className="font-btn">
                A-
              </button>
              <button onClick={() => setFontSize(16)} className="font-btn font-btn-mid">
                A
              </button>
              <button onClick={() => changeFontSize(2)} className="font-btn">
                A+
              </button>
            </div>

            <div className="lang-dropdown-wrapper">
              <button className="lang-btn" onClick={() => setLang(lang === "en" ? "ta" : "en")}>
                <Globe size={14} />
                {lang === "en" ? "தமிழ்" : "English"}
              </button>
            </div>
          </div>

          {/* Login Form - Centered */}
          <div className="auth-form-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="auth-form-card"
            >
              <h2 className="auth-form-title">{t.loginTitle}</h2>

              {/* Tabs */}
              <div className="auth-tabs">
                <button
                  onClick={() => setActiveTab("login")}
                  className={`auth-tab ${activeTab === "login" ? "active" : ""}`}
                >
                  <Phone size={15} />
                  {t.loginTab}
                </button>
                <button
                  onClick={() => setActiveTab("register")}
                  className={`auth-tab ${activeTab === "register" ? "active" : ""}`}
                >
                  <UserPlus size={15} />
                  {t.registerTab}
                </button>
              </div>

              {/* Form Content */}
              <div className="auth-form-inner">
                <AnimatePresence mode="wait">
                  {activeTab === "login" ? (
                    <motion.div
                      key="login"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                      className="auth-fields"
                    >
                      {!otpSent ? (
                        <>
                          <div className="field-group">
                            <label className="field-label">{t.username}</label>
                            <div
                              className={`field-input-wrapper ${errors.username ? "has-error" : ""}`}
                            >
                              <User size={18} className="field-icon" />
                              <input
                                type="text"
                                placeholder={t.usernamePlaceholder}
                                className="field-input"
                                value={loginUsername}
                                onChange={(e) => {
                                  // Capital & small letters (Aa-Zz) only
                                  const val = e.target.value.replace(/[^a-zA-Z]/g, "");
                                  setLoginUsername(val);
                                  if (errors.username) {
                                    setErrors((prev) => ({ ...prev, username: undefined }));
                                  }
                                }}
                              />
                            </div>
                            {errors.username && (
                              <span className="field-error-msg">{errors.username}</span>
                            )}
                          </div>

                          <div className="field-group">
                            <label className="field-label">{t.mobileNumber}</label>
                            <div
                              className={`field-input-wrapper ${errors.loginMobile ? "has-error" : ""}`}
                            >
                              <Phone size={18} className="field-icon" />
                              <input
                                type="tel"
                                placeholder={t.mobilePlaceholder}
                                className="field-input"
                                value={loginMobile}
                                onChange={(e) => {
                                  // numbers only, max 10 digits
                                  const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                                  setLoginMobile(val);
                                  if (errors.loginMobile) {
                                    setErrors((prev) => ({ ...prev, loginMobile: undefined }));
                                  }
                                }}
                              />
                            </div>
                            {errors.loginMobile && (
                              <span className="field-error-msg">{errors.loginMobile}</span>
                            )}
                          </div>

                          <div className="field-group">
                            <button
                              type="button"
                              onClick={() => {
                                const newErrors: typeof errors = {};
                                if (!loginUsername.trim()) {
                                  newErrors.username = t.requiredError;
                                } else if (!/^[a-zA-Z]+$/.test(loginUsername)) {
                                  newErrors.username = t.usernameError;
                                }

                                if (!loginMobile.trim()) {
                                  newErrors.loginMobile = t.requiredError;
                                } else if (loginMobile.length !== 10) {
                                  newErrors.loginMobile = t.mobileError;
                                }

                                if (Object.keys(newErrors).length > 0) {
                                  setErrors(newErrors);
                                } else {
                                  setErrors({});
                                  setOtpSent(true);
                                }
                              }}
                              className="btn-send-otp"
                            >
                              {t.sendOtp}
                            </button>
                          </div>
                        </>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="auth-fields"
                        >
                          <div className="field-group">
                            <label className="field-label">{t.enterOtp}</label>
                            <div className="field-input-wrapper">
                              <ShieldCheck size={18} className="field-icon" />
                              <input
                                type="text"
                                maxLength={6}
                                placeholder={t.enterOtpPlaceholder}
                                className="field-input otp-input"
                              />
                            </div>
                            <div style={{ textAlign: "right", marginTop: "0.5rem" }}>
                              <button type="button" className="resend-otp-btn">
                                {t.resendOtp}
                              </button>
                            </div>
                          </div>
                          <button type="button" onClick={() => onSuccess?.()} className="btn-login">
                            {t.verifyLoginBtn}
                          </button>
                        </motion.div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="register"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="auth-fields"
                    >
                      {!otpSent ? (
                        <>
                          <div className="field-group">
                            <label className="field-label">{t.fullName}</label>
                            <div
                              className={`field-input-wrapper ${errors.fullName ? "has-error" : ""}`}
                            >
                              <User size={18} className="field-icon" />
                              <input
                                type="text"
                                placeholder={t.fullNamePlaceholder}
                                className="field-input"
                                value={registerFullName}
                                onChange={(e) => {
                                  // Capital & small letters (Aa-Zz) only
                                  const val = e.target.value.replace(/[^a-zA-Z]/g, "");
                                  setRegisterFullName(val);
                                  if (errors.fullName) {
                                    setErrors((prev) => ({ ...prev, fullName: undefined }));
                                  }
                                }}
                              />
                            </div>
                            {errors.fullName && (
                              <span className="field-error-msg">{errors.fullName}</span>
                            )}
                          </div>

                          <div className="field-group">
                            <label className="field-label">{t.mobileNumber}</label>
                            <div
                              className={`field-input-wrapper ${errors.registerMobile ? "has-error" : ""}`}
                            >
                              <Phone size={18} className="field-icon" />
                              <input
                                type="tel"
                                placeholder={t.mobilePlaceholder}
                                className="field-input"
                                value={registerMobile}
                                onChange={(e) => {
                                  // numbers only, max 10 digits
                                  const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                                  setRegisterMobile(val);
                                  if (errors.registerMobile) {
                                    setErrors((prev) => ({ ...prev, registerMobile: undefined }));
                                  }
                                }}
                              />
                            </div>
                            {errors.registerMobile && (
                              <span className="field-error-msg">{errors.registerMobile}</span>
                            )}
                          </div>

                          <div className="field-group">
                            <label className="field-label">{t.email}</label>
                            <div className="field-input-wrapper">
                              <Globe size={18} className="field-icon" />
                              <input
                                type="email"
                                placeholder={t.emailPlaceholder}
                                className="field-input"
                                value={registerEmail}
                                onChange={(e) => setRegisterEmail(e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="field-group">
                            <button
                              type="button"
                              onClick={() => {
                                const newErrors: typeof errors = {};
                                if (!registerFullName.trim()) {
                                  newErrors.fullName = t.requiredError;
                                } else if (!/^[a-zA-Z]+$/.test(registerFullName)) {
                                  newErrors.fullName = t.fullNameError;
                                }

                                if (!registerMobile.trim()) {
                                  newErrors.registerMobile = t.requiredError;
                                } else if (registerMobile.length !== 10) {
                                  newErrors.registerMobile = t.mobileError;
                                }

                                if (Object.keys(newErrors).length > 0) {
                                  setErrors(newErrors);
                                } else {
                                  setErrors({});
                                  setOtpSent(true);
                                }
                              }}
                              className="btn-send-otp"
                            >
                              {t.sendOtp}
                            </button>
                          </div>
                        </>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="auth-fields"
                        >
                          <div className="field-group">
                            <label className="field-label">{t.enterOtp}</label>
                            <div className="field-input-wrapper">
                              <ShieldCheck size={18} className="field-icon" />
                              <input
                                type="text"
                                maxLength={6}
                                placeholder={t.enterOtpPlaceholder}
                                className="field-input otp-input"
                              />
                            </div>
                            <div style={{ textAlign: "right", marginTop: "0.5rem" }}>
                              <button type="button" className="resend-otp-btn">
                                {t.resendOtp}
                              </button>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => onSuccess?.()}
                            className="btn-login btn-register"
                          >
                            {t.verifyRegisterBtn}
                          </button>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ===== FOOTER TRUST BAR ===== */}
      <div className="auth-trust-bar">
        <div className="auth-trust-grid">
          {[
            {
              icon: <ShieldCheck size={22} />,
              cls: "trust-blue",
              title: t.trustSecure,
              sub: t.trustSecureSub,
            },
            {
              icon: <BadgeCheck size={22} />,
              cls: "trust-green",
              title: t.trustVerified,
              sub: t.trustVerifiedSub,
            },
            {
              icon: <Clock3 size={22} />,
              cls: "trust-orange",
              title: t.trustAccess,
              sub: t.trustAccessSub,
            },
            {
              icon: <Users size={22} />,
              cls: "trust-purple",
              title: t.trustCitizen,
              sub: t.trustCitizenSub,
            },
          ].map((item, i) => (
            <div key={i} className="trust-item">
              <div className={`trust-icon ${item.cls}`}>{item.icon}</div>
              <div>
                <h4 className="trust-title">{item.title}</h4>
                <p className="trust-sub">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== FOOTER LINKS ===== */}
      <div className="auth-footer">
        <div className="auth-footer-links">
          <a href="#">{t.privacy}</a>
          <span className="footer-divider">|</span>
          <a href="#">{t.terms}</a>
          <span className="footer-divider">|</span>
          <a href="#">{t.help}</a>
          <span className="footer-divider">|</span>
          <a href="#">{t.contact}</a>
        </div>
      </div>
    </div>
  );
}
