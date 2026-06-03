import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Building2, 
  Smartphone, 
  UserPlus, 
  User, 
  Phone, 
  Globe, 
  ShieldCheck, 
  Users, 
  Shield, 
  CheckCircle2,
  Headset,
  Fingerprint
} from "lucide-react";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

type Mode = "login" | "register";

export function AuthScreen({ onSuccess }: { onSuccess: () => void }) {
  const { setUser } = useApp();
  const [mode, setMode] = useState<Mode>("login");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  
  const [contact, setContact] = useState("");

  const sendOtp = () => {
    if (!contact) return toast.error("Enter mobile or email");
    setOtpSent(true);
    toast.success("OTP sent: 123456 (demo)");
  };

  const verify = () => {
    if (otp.length !== 6) return toast.error("Enter 6-digit OTP");
    setUser({
      name: "Citizen",
      contact: contact,
      role: "citizen",
    });
    toast.success("Login successful");
    onSuccess();
  };

  return (
    <div className="min-h-[100dvh] w-full bg-white relative flex flex-col font-sans overflow-x-hidden">
      
      {/* Background Section */}
      <div className="fixed inset-0 z-0 flex overflow-hidden pointer-events-none">
        {/* Left Gradient Box for Mobile/Fallback */}
        <div className="w-full lg:w-0 h-full bg-gradient-to-br from-[#273852] to-[#8f9baf] lg:hidden"></div>
        
        {/* The Orange Wavy Line & Gradient Fill (Desktop) */}
        <svg className="absolute left-0 top-0 w-full h-full pointer-events-none hidden lg:block" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path d="M 52 0 C 58 25, 45 75, 52 100 L 0 100 L 0 0 Z" fill="url(#bgGrad)" />
          <path d="M 52 0 C 58 25, 45 75, 52 100" fill="none" stroke="#ea580c" strokeWidth="0.6" />
          <defs>
            <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#273852" />
              <stop offset="100%" stopColor="#8f9baf" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row w-full relative z-10">
        
        {/* Left Side (Text & Features) */}
        <div className="flex flex-col w-full lg:w-[52%] xl:w-[55%] p-6 lg:p-10 pb-0 text-white">
          {/* Header */}
          <div className="flex items-center mt-2 lg:mt-0">
            <div>
              <h1 className="font-bold text-sm lg:text-[1.1rem] leading-tight tracking-wide">Greater Chennai Corporation</h1>
              <p className="text-[10px] lg:text-[13px] font-medium text-white/90 font-tamil mt-0.5">சென்னை மாநகராட்சி</p>
            </div>
          </div>
          
          {/* Hero Text (Desktop Only) */}
          <div className="hidden lg:block mt-8 xl:mt-12 max-w-lg">
            <h2 className="text-4xl xl:text-[3.25rem] font-bold leading-[1.2]">
              “Digital Services for<br/>Every Citizen.”
            </h2>
            <div className="flex gap-2 mt-8 mb-6 h-1.5 w-64">
              <div className="flex-1 bg-[#ea580c] rounded-full"></div>
              <div className="flex-1 bg-[#1e40af] rounded-full"></div>
              <div className="flex-1 bg-[#3b82f6] rounded-full"></div>
              <div className="flex-1 bg-[#22c55e] rounded-full"></div>
            </div>
            <p className="text-[1.1rem] font-medium leading-relaxed tracking-wide">
              One Portal for all Government Services<br/>and Citizen Welfare
            </p>
          </div>

          {/* Feature Glass panel (Desktop Only) */}
          <div className="hidden lg:flex mt-auto mb-8 w-full max-w-[600px] bg-white/10 backdrop-blur-md border border-white/20 rounded-[1.5rem] p-6 lg:p-8 justify-between gap-2 text-center shadow-[0_8px_32px_rgba(0,0,0,0.1)] relative">
            
            <div className="flex flex-col items-center flex-1">
              <div className="mb-3 bg-[#3b82f6] rounded-full p-3.5 shadow-md"><ShieldCheck className="h-5 w-5"/></div>
              <div className="font-bold text-[13px]">Secure</div>
              <div className="text-[10px] opacity-80 mt-1">Your data is safe with us</div>
            </div>
            <div className="w-px bg-white/20 my-2"></div>
            
            <div className="flex flex-col items-center flex-1">
              <div className="mb-3 bg-[#22c55e] rounded-full p-3.5 shadow-md"><Users className="h-5 w-5"/></div>
              <div className="font-bold text-[13px]">Accessible</div>
              <div className="text-[10px] opacity-80 mt-1">Anytime, Anywhere</div>
            </div>
            <div className="w-px bg-white/20 my-2"></div>
            
            <div className="flex flex-col items-center flex-1">
              <div className="mb-3 bg-[#f59e0b] rounded-full p-3.5 shadow-md"><Globe className="h-5 w-5"/></div>
              <div className="font-bold text-[13px]">Simplified</div>
              <div className="text-[10px] opacity-80 mt-1">Easy Access to services</div>
            </div>
            <div className="w-px bg-white/20 my-2"></div>
            
            <div className="flex flex-col items-center flex-1">
              <div className="mb-3 bg-[#ef4444] rounded-full p-3.5 shadow-md"><Shield className="h-5 w-5"/></div>
              <div className="font-bold text-[13px]">Trusted</div>
              <div className="text-[10px] opacity-80 mt-1">Official Govt. Platform</div>
            </div>
          </div>
        </div>

        {/* Right Side (Login Form) */}
        <div className="w-full lg:w-[48%] xl:w-[45%] flex flex-col py-6 lg:py-8 px-4 lg:px-8 items-center relative justify-center z-20">
          
          {/* Top Actions */}
          <div className="absolute top-6 lg:top-8 right-6 lg:right-10 flex gap-3 lg:gap-4 text-slate-600 mb-6 lg:mb-10 z-50">
            <div className="flex border border-slate-200 rounded-full overflow-hidden text-[11px] font-bold bg-white shadow-sm">
              <button className="px-3 lg:px-4 py-1.5 hover:bg-slate-50 transition">A-</button>
              <button className="px-3 lg:px-4 py-1.5 hover:bg-slate-50 transition border-l border-slate-200">A</button>
              <button className="px-3 lg:px-4 py-1.5 hover:bg-slate-50 transition border-l border-slate-200">A+</button>
            </div>
            <button className="flex items-center gap-1.5 border border-slate-200 rounded-full px-3 lg:px-4 py-1.5 text-[11px] font-bold hover:bg-slate-50 transition bg-white shadow-sm">
              <Globe className="h-3.5 w-3.5" /> <span className="hidden sm:inline">English</span> ▾
            </button>
          </div>
          
          {/* Form Card Container */}
          <div className="w-full max-w-[460px] flex flex-col mt-4 lg:mt-0 relative z-20">
            <h2 className="text-[1.8rem] lg:text-[2.2rem] font-black text-center mb-6 text-[#0f172a] tracking-tight">Log Into Your Account</h2>
            
            {!otpSent && (
              <div className="w-full">
                {/* Tabs */}
                <div className="flex bg-[#f1f5f9] rounded-2xl p-1.5 mb-8 border border-slate-100">
                  <button 
                    onClick={() => setMode("login")}
                    className={`flex-1 py-3 text-sm font-bold rounded-[0.85rem] transition-all flex items-center justify-center gap-2
                      ${mode === "login" ? "bg-white text-[#1e3a8a] shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-600"}
                    `}>
                    <Smartphone className="h-4 w-4" /> Login with OTP
                  </button>
                  <button 
                    onClick={() => setMode("register")}
                    className={`flex-1 py-3 text-sm font-bold rounded-[0.85rem] transition-all flex items-center justify-center gap-2
                      ${mode === "register" ? "bg-white text-[#1e3a8a] shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-600"}
                    `}>
                    <UserPlus className="h-4 w-4" /> Register
                  </button>
                </div>

                {/* Form Elements */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-slate-800 block">Username</label>
                    <div className="relative">
                      <User className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                      <Input className="pl-11 h-[3.25rem] rounded-xl border-slate-200 focus-visible:ring-blue-600 text-sm font-medium bg-white placeholder:text-slate-400 shadow-sm" placeholder="Enter your User Name" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-slate-800 block">Mobile Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                      <Input 
                        value={contact} 
                        onChange={(e) => setContact(e.target.value)} 
                        className="pl-11 h-[3.25rem] rounded-xl border-slate-200 focus-visible:ring-blue-600 text-sm font-medium bg-white placeholder:text-slate-400 shadow-sm" 
                        placeholder="Enter your Mobile Number" 
                      />
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Button onClick={sendOtp} className="w-full h-[3.25rem] bg-white text-[#1e3a8a] hover:bg-slate-50 border-2 border-[#1e3a8a] rounded-xl font-bold text-[15px] shadow-sm" variant="outline">
                      Send OTP
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {otpSent && (
              <div className="w-full">
                 <div className="bg-white rounded-2xl p-8 shadow-[0_5px_25px_rgba(0,0,0,0.05)] border border-slate-100">
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="flex flex-col items-center justify-center space-y-6">
                       <div className="bg-blue-50 p-4 rounded-full">
                         <Fingerprint className="h-10 w-10 text-blue-600" />
                       </div>
                       <p className="text-[15px] text-slate-600 text-center font-medium">
                         We've sent a 6-digit OTP to your mobile number.
                       </p>
                       
                       <div className="py-2">
                         <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                           <InputOTPGroup className="gap-2">
                             {[0,1,2,3,4,5].map(i => (
                               <InputOTPSlot key={i} index={i} className="h-14 w-12 text-xl border-slate-300 rounded-lg font-bold text-blue-900 shadow-sm" />
                             ))}
                           </InputOTPGroup>
                         </InputOTP>
                       </div>
                       
                       <div className="w-full pt-4 flex flex-col gap-3">
                         <Button onClick={verify} className="bg-[#1e3a8a] hover:bg-[#152a6a] text-white h-[3.25rem] rounded-xl font-bold text-base w-full shadow-sm">
                           Verify & Login
                         </Button>
                         <button onClick={() => setOtpSent(false)} className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition">
                           Change mobile number
                         </button>
                       </div>
                    </div>
                  </div>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="bg-[#f8fafc] min-h-[5rem] lg:min-h-[6rem] w-full relative z-20 flex flex-wrap justify-around lg:justify-between items-center py-4 lg:py-0 px-4 lg:px-16 border-t border-slate-100 mt-auto">
        <div className="flex items-center gap-3 p-2 text-left">
          <div className="bg-blue-50/80 text-blue-500 p-2.5 rounded-full"><ShieldCheck className="h-5 w-5 stroke-[2.5]"/></div>
          <div>
            <div className="font-bold text-slate-800 text-[13px] leading-tight mb-1">100 % Secure</div>
            <div className="text-[11px] text-slate-500 font-semibold leading-tight">End to End Encryption</div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-2 text-left">
          <div className="bg-green-50/80 text-green-500 p-2.5 rounded-full"><CheckCircle2 className="h-5 w-5 stroke-[2.5]"/></div>
          <div>
            <div className="font-bold text-slate-800 text-[13px] leading-tight mb-1">Verified Platform</div>
            <div className="text-[11px] text-slate-500 font-semibold leading-tight">Official Government Website</div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-2 text-left">
          <div className="bg-orange-50/80 text-orange-500 p-2.5 rounded-full"><Headset className="h-5 w-5 stroke-[2.5]"/></div>
          <div>
            <div className="font-bold text-slate-800 text-[13px] leading-tight mb-1">24*7 Access</div>
            <div className="text-[11px] text-slate-500 font-semibold leading-tight">Services available round the clock</div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-2 text-left">
          <div className="bg-purple-50/80 text-purple-500 p-2.5 rounded-full"><Users className="h-5 w-5 stroke-[2.5]"/></div>
          <div>
            <div className="font-bold text-slate-800 text-[13px] leading-tight mb-1">Citizen First</div>
            <div className="text-[11px] text-slate-500 font-semibold leading-tight">Committed to serve you</div>
          </div>
        </div>
      </div>

      {/* Dark Bottom Links Footer */}
      <div className="bg-[#0f172a] text-white py-3 flex flex-wrap justify-center items-center gap-4 text-sm w-full relative z-20">
        <a href="#" className="hover:text-blue-300 transition-colors">Privacy Policy</a>
        <span className="text-white/30">|</span>
        <a href="#" className="hover:text-blue-300 transition-colors">Terms and Conditions</a>
        <span className="text-white/30">|</span>
        <a href="#" className="hover:text-blue-300 transition-colors">Help</a>
        <span className="text-white/30">|</span>
        <a href="#" className="hover:text-blue-300 transition-colors">Contact Us</a>
      </div>
    </div>
  );
}
