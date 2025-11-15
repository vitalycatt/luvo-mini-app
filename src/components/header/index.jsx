import { THEME } from "@/constants";
import { useWebAppStore } from "@/store";
import { useTelegramInitData } from "@/hooks/useTelegramInitData";
import { useLocation, useNavigate } from "react-router-dom";

import LogoDarkIcon from "@/assets/icons/logo-dark.svg";
import LogoLightIcon from "@/assets/icons/logo-light.svg";

const excludedPaths = ["loading"];

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { theme } = useWebAppStore();
  const { initData } = useTelegramInitData();

  const isDark = theme === THEME.DARK;
  const LogoIcon = isDark ? LogoLightIcon : LogoDarkIcon;

  if (excludedPaths.includes(location.pathname.substring(1))) return null;

  return (
    <div className="relative z-10 w-full pt-[66px] pb-2 flex justify-center bg-white/90 dark:bg-black/90 border-[#A29C9B4D]">
      <img
        src={LogoIcon}
        alt="logo-icon"
        width={60}
        onClick={() => {
          if (initData) {
            navigator.clipboard.writeText(initData);
          }
          navigate("/feed");
        }}
      />
    </div>
  );
};
