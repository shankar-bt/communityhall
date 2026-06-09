import { useLanguage } from "@/contexts/LanguageContext";
import "./LanguageSwitch.css";

const LanguageSwitch = () => {
  const { lang, setLang } = useLanguage();

  return (
    <div className="lang-switch-wrapper">
      <label htmlFor="lang-filter" className="switch" aria-label="Toggle Language">
        <input 
          type="checkbox" 
          id="lang-filter" 
          checked={lang === 'en'} 
          onChange={(e) => setLang(e.target.checked ? 'en' : 'ta')} 
        />
        <span>தமிழ்</span>
        <span>English</span>
      </label>
    </div>
  );
}
 
export default LanguageSwitch;
