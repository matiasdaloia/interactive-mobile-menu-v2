import React, { useEffect, useState } from "react";
import Toggle from "../components/Toggle";
import axios from "axios";
import { useAppBridge } from "@shopify/app-bridge-react";
import { getSessionToken } from "@shopify/app-bridge-utils";

const Index = () => {
  const [theme, setTheme] = useState({
    currentTheme: "",
    currentThemeId: 0,
  });

  const [token, setToken] = useState();

  const app = useAppBridge();

  useEffect(() => {
    async function fetchThemes() {
      const token = await getSessionToken(app);

      setToken(token);

      await axios.get("/api/themes", {
        headers: { "Authorization": `Bearer ${token}` }
      }).then((res) => {
        res.data.themes.map((theme) =>
          theme.role === "main"
            ? setTheme({ currentTheme: theme, currentThemeId: theme.id })
            : null
        );
      });
    }

    fetchThemes();
  }, []);

  return (
    <div>
      <Toggle themeid={theme.currentThemeId} token={token}/>
    </div>
  );
};

export default Index;
