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
import { verifyOfficialLogin, sendLoginOtp, verifyLoginOtp, registerCitizen, checkMobileExists } from "@/lib/authApi";
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
    officialTab: "Official Login",
    registerTab: "Register",
    username: "Username",
    usernamePlaceholder: "Enter your User Name",
    password: "Password",
    passwordPlaceholder: "Enter your Password",
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
    officialTab: "அதிகாரப்பூர்வ உள்நுழைவு",
    registerTab: "பதிவு செய்க",
    username: "பயனர் பெயர்",
    usernamePlaceholder: "உங்கள் பயனர் பெயரை உள்ளிடவும்",
    password: "கடவுச்சொல்",
    passwordPlaceholder: "உங்கள் கடவுச்சொல்லை உள்ளிடவும்",
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

export function AuthScreen({ onSuccess }: { onSuccess?: (userData?: any) => void }) {
  const [activeTab, setActiveTab] = useState<"login" | "register" | "official">("login");
  const [fontSize, setFontSize] = useState(16);
  const [lang, setLang] = useState<Lang>("en");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Form State
  const [loginUsername, setLoginUsername] = useState("");
  const [loginMobile, setLoginMobile] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginOtp, setLoginOtp] = useState("");
  const [registerFullName, setRegisterFullName] = useState("");
  const [registerMobile, setRegisterMobile] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerAadhar, setRegisterAadhar] = useState("");
  const [registerDoorNo, setRegisterDoorNo] = useState("");
  const [registerStreet, setRegisterStreet] = useState("");
  const [registerArea, setRegisterArea] = useState("");
  const [registerLocation, setRegisterLocation] = useState("");
  const [registerPincode, setRegisterPincode] = useState("");
  const [registerOtp, setRegisterOtp] = useState("");

  // Error State
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
    loginMobile?: string;
    fullName?: string;
    registerMobile?: string;
    registerAadhar?: string;
    registerDoorNo?: string;
    registerStreet?: string;
    registerArea?: string;
    registerLocation?: string;
    registerPincode?: string;
  }>({});

  // Reset OTP & input states when changing tabs
  useEffect(() => {
    setOtpSent(false);
    setErrors({});
    setLoginUsername("");
    setLoginMobile("");
    setLoginPassword("");
    setRegisterFullName("");
    setRegisterMobile("");
    setRegisterEmail("");
    setRegisterAadhar("");
    setRegisterDoorNo("");
    setRegisterStreet("");
    setRegisterArea("");
    setRegisterLocation("");
    setRegisterPincode("");
    setRegisterOtp("");
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
                  onClick={() => setActiveTab("official")}
                  className={`auth-tab ${activeTab === "official" ? "active" : ""}`}
                >
                  <ShieldCheck size={15} />
                  {t.officialTab}
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
                              onClick={async () => {
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
                                  setIsLoggingIn(true);
                                  try {
                                    const isRegistered = await checkMobileExists(Number(loginMobile));
                                    if (!isRegistered) {
                                      alert(lang === "en" ? "This mobile number is not registered. Please register first." : "இந்த மொபைல் எண் பதிவு செய்யப்படவில்லை. முதலில் பதிவு செய்யவும்.");
                                      setIsLoggingIn(false);
                                      return;
                                    }
                                    await sendLoginOtp(Number(loginMobile));
                                    setOtpSent(true);
                                  } catch (err: any) {
                                    alert(err.message || "Failed to send OTP");
                                  } finally {
                                    setIsLoggingIn(false);
                                  }
                                }
                              }}
                              className="btn-send-otp"
                              disabled={isLoggingIn}
                            >
                              {isLoggingIn ? "Sending..." : t.sendOtp}
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
                                value={loginOtp}
                                onChange={(e) => setLoginOtp(e.target.value.trim())}
                              />
                            </div>
                            <div style={{ textAlign: "right", marginTop: "0.5rem" }}>
                              <button type="button" className="resend-otp-btn">
                                {t.resendOtp}
                              </button>
                            </div>
                          </div>
                          <button type="button" disabled={isLoggingIn} onClick={async () => {
                            if (!loginOtp) return alert("Enter OTP");
                            setIsLoggingIn(true);
                            try {
                              await verifyLoginOtp(Number(loginMobile), loginOtp);
                              onSuccess?.({ name: loginUsername, contact: loginMobile, role: "citizen" });
                            } catch (err: any) {
                              alert(err.message || "Invalid OTP");
                            } finally {
                              setIsLoggingIn(false);
                            }
                          }} className="btn-login">
                            {isLoggingIn ? "Verifying..." : t.verifyLoginBtn}
                          </button>
                        </motion.div>
                      )}
                    </motion.div>
                  ) : activeTab === "official" ? (
                    <motion.div
                      key="official"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="auth-fields"
                    >
                      <div className="field-group">
                        <label className="field-label">{t.username}</label>
                        <div className={`field-input-wrapper ${errors.username ? "has-error" : ""}`}>
                          <User size={18} className="field-icon" />
                          <input
                            type="text"
                            placeholder={t.usernamePlaceholder}
                            className="field-input"
                            value={loginUsername}
                            onChange={(e) => {
                              setLoginUsername(e.target.value);
                              if (errors.username) setErrors((prev) => ({ ...prev, username: undefined }));
                            }}
                          />
                        </div>
                        {errors.username && <span className="field-error-msg">{errors.username}</span>}
                      </div>

                      <div className="field-group">
                        <label className="field-label">{t.password}</label>
                        <div className={`field-input-wrapper ${errors.password ? "has-error" : ""}`}>
                          <ShieldCheck size={18} className="field-icon" />
                          <input
                            type="password"
                            placeholder={t.passwordPlaceholder}
                            className="field-input"
                            value={loginPassword}
                            onChange={(e) => {
                              setLoginPassword(e.target.value);
                              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                            }}
                          />
                        </div>
                        {errors.password && <span className="field-error-msg">{errors.password}</span>}
                      </div>

                      <button
                        type="button"
                        disabled={isLoggingIn}
                        onClick={async () => {
                          if (!loginUsername || !loginPassword) {
                            setErrors((prev) => ({
                              ...prev,
                              username: !loginUsername ? t.requiredError : undefined,
                              password: !loginPassword ? t.requiredError : undefined,
                            }));
                            return;
                          }
                          setIsLoggingIn(true);
                          try {
                            const res = await verifyOfficialLogin(loginUsername, loginPassword);
                            if (res) {
                              onSuccess?.({ name: loginUsername, role: res.userType || "official" });
                            }
                          } catch (err: any) {
                            alert(err.message || "Invalid credentials");
                          } finally {
                            setIsLoggingIn(false);
                          }
                        }}
                        className="btn-send-otp"
                        style={{ marginTop: "1rem" }}
                      >
                        {isLoggingIn ? "Logging in..." : "Login"}
                      </button>
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
                            <label className="field-label">Aadhar Number</label>
                            <div className={`field-input-wrapper ${errors.registerAadhar ? "has-error" : ""}`}>
                              <UserPlus size={18} className="field-icon" />
                              <input
                                type="text"
                                maxLength={12}
                                placeholder="Enter 12-digit Aadhar"
                                className="field-input"
                                value={registerAadhar}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/\D/g, "");
                                  setRegisterAadhar(val);
                                  if (errors.registerAadhar) setErrors((prev) => ({ ...prev, registerAadhar: undefined }));
                                }}
                              />
                            </div>
                            {errors.registerAadhar && (
                              <span className="field-error-msg">{errors.registerAadhar}</span>
                            )}
                          </div>

                          <div className="field-group">
                            <label className="field-label">Door No</label>
                            <div className={`field-input-wrapper ${errors.registerDoorNo ? "has-error" : ""}`}>
                              <input
                                type="text"
                                placeholder="Enter Door No"
                                className="field-input"
                                value={registerDoorNo}
                                onChange={(e) => {
                                  setRegisterDoorNo(e.target.value);
                                  if (errors.registerDoorNo) setErrors((prev) => ({ ...prev, registerDoorNo: undefined }));
                                }}
                              />
                            </div>
                            {errors.registerDoorNo && (
                              <span className="field-error-msg">{errors.registerDoorNo}</span>
                            )}
                          </div>

                          <div className="field-group">
                            <label className="field-label">Street</label>
                            <div className={`field-input-wrapper ${errors.registerStreet ? "has-error" : ""}`}>
                              <input
                                type="text"
                                placeholder="Enter Street"
                                className="field-input"
                                value={registerStreet}
                                onChange={(e) => {
                                  setRegisterStreet(e.target.value);
                                  if (errors.registerStreet) setErrors((prev) => ({ ...prev, registerStreet: undefined }));
                                }}
                              />
                            </div>
                            {errors.registerStreet && (
                              <span className="field-error-msg">{errors.registerStreet}</span>
                            )}
                          </div>

                          <div className="field-group">
                            <label className="field-label">Area</label>
                            <div className={`field-input-wrapper ${errors.registerArea ? "has-error" : ""}`}>
                              <input
                                type="text"
                                placeholder="Enter Area"
                                className="field-input"
                                value={registerArea}
                                onChange={(e) => {
                                  setRegisterArea(e.target.value);
                                  if (errors.registerArea) setErrors((prev) => ({ ...prev, registerArea: undefined }));
                                }}
                              />
                            </div>
                            {errors.registerArea && (
                              <span className="field-error-msg">{errors.registerArea}</span>
                            )}
                          </div>

                          <div className="field-group">
                            <label className="field-label">Location</label>
                            <div className={`field-input-wrapper ${errors.registerLocation ? "has-error" : ""}`}>
                              <input
                                type="text"
                                placeholder="Enter Location"
                                className="field-input"
                                value={registerLocation}
                                onChange={(e) => {
                                  setRegisterLocation(e.target.value);
                                  if (errors.registerLocation) setErrors((prev) => ({ ...prev, registerLocation: undefined }));
                                }}
                              />
                            </div>
                            {errors.registerLocation && (
                              <span className="field-error-msg">{errors.registerLocation}</span>
                            )}
                          </div>

                          <div className="field-group">
                            <label className="field-label">Pincode</label>
                            <div className={`field-input-wrapper ${errors.registerPincode ? "has-error" : ""}`}>
                              <input
                                type="text"
                                maxLength={6}
                                placeholder="Enter 6-digit Pincode"
                                className="field-input"
                                value={registerPincode}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/\D/g, "");
                                  setRegisterPincode(val);
                                  if (errors.registerPincode) setErrors((prev) => ({ ...prev, registerPincode: undefined }));
                                }}
                              />
                            </div>
                            {errors.registerPincode && (
                              <span className="field-error-msg">{errors.registerPincode}</span>
                            )}
                          </div>

                          <div className="field-group">
                            <button
                              type="button"
                              onClick={async () => {
                                const newErrors: typeof errors = {};
                                if (!registerFullName.trim()) {
                                  newErrors.fullName = t.requiredError;
                                } else if (!/^[a-zA-Z\s]+$/.test(registerFullName)) {
                                  newErrors.fullName = t.fullNameError;
                                }

                                if (!registerMobile.trim()) {
                                  newErrors.registerMobile = t.requiredError;
                                } else if (registerMobile.length !== 10) {
                                  newErrors.registerMobile = t.mobileError;
                                }

                                if (!registerAadhar.trim() || registerAadhar.length !== 12) {
                                  newErrors.registerAadhar = "Valid 12-digit Aadhar required";
                                }
                                if (!registerDoorNo.trim()) newErrors.registerDoorNo = t.requiredError;
                                if (!registerStreet.trim()) newErrors.registerStreet = t.requiredError;
                                if (!registerArea.trim()) newErrors.registerArea = t.requiredError;
                                if (!registerLocation.trim()) newErrors.registerLocation = t.requiredError;
                                if (!registerPincode.trim() || registerPincode.length !== 6) {
                                  newErrors.registerPincode = "Valid 6-digit Pincode required";
                                }

                                if (Object.keys(newErrors).length > 0) {
                                  setErrors(newErrors);
                                } else {
                                  setErrors({});
                                  setIsLoggingIn(true);
                                  try {
                                    await sendLoginOtp(Number(registerMobile));
                                    setOtpSent(true);
                                  } catch (err: any) {
                                    alert(err.message || "Failed to send OTP");
                                  } finally {
                                    setIsLoggingIn(false);
                                  }
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
                                value={registerOtp}
                                onChange={(e) => setRegisterOtp(e.target.value.trim())}
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
                            disabled={isLoggingIn}
                            onClick={async () => {
                              if (!registerOtp) return alert("Enter OTP");
                              setIsLoggingIn(true);
                              try {
                                // 1. Verify OTP
                                await verifyLoginOtp(Number(registerMobile), registerOtp);

                                // 2. Submit Registration Data
                                const formData = new FormData();
                                formData.append("name", registerFullName);
                                formData.append("mobileNo", registerMobile);
                                formData.append("email", registerEmail);
                                formData.append("usertype", "PUBLIC");

                                // Provide form data
                                formData.append("aadharnumber", registerAadhar);
                                formData.append("doorNo", registerDoorNo);
                                formData.append("street", registerStreet);
                                formData.append("area", registerArea);
                                formData.append("location", registerLocation);
                                formData.append("pinCode", registerPincode);

                                await registerCitizen(formData);
                                alert("Registration Successful!");
                                onSuccess?.({ name: registerFullName, contact: registerMobile, role: "citizen" });
                              } catch (err: any) {
                                alert(err.message || "Invalid OTP or Registration Failed");
                              } finally {
                                setIsLoggingIn(false);
                              }
                            }}
                            className="btn-login btn-register"
                          >
                            {isLoggingIn ? "Verifying..." : t.verifyRegisterBtn}
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
