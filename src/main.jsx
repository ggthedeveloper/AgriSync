import { useState } from "react";
import { S } from "./utils/storage";
import Auth from "./pages/Auth";
import App  from "./App";

export default function AgriSync() {
  const [user, setUser] = useState(() => {
    const u = S.get("user", null);
    // Clear any stale cached session with old default name
    if (u && u.name === "Ravi Kumar") { S.del("user"); S.del("farm"); return null; }
    return u;
  });
  const [initLang, setInitLang] = useState(() => S.get("lang", "en"));

  const login = (u, lang) => {
    S.set("user", u);
    S.set("lang", lang || "en");
    setInitLang(lang || "en");
    setUser(u);
  };

  const logout = () => {
    S.del("user");
    setUser(null);
  };

  if (!user) return <Auth onLogin={login} />;
  return <App user={user} onLogout={logout} initLang={initLang} />;
}
