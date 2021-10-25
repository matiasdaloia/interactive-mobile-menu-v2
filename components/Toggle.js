import { SettingToggle, TextStyle, Spinner, Banner } from "@shopify/polaris";
import React, { useState, useEffect } from "react";
import ThemeHelpers from "../helpers/themeHelpers";
import axios from "axios";

const Toggle = ({ themeid, token }) => {
  const [loading, setLoading] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {

    async function isAppInstalled() {
      await axios
        .get(`/api/${themeid}/isAppInstalled`, {
          headers: { "Authorization": `Bearer ${token}` }
        })
        .then((res) => setInstalled(res.data));
    }

    isAppInstalled();
  }, [themeid, installed]);


  const handleInstall = async () => {
    setLoading(true);

    if (installed === true) {
      console.log("app is already installed....");
    } else {
      await ThemeHelpers.installApp(themeid, token).then(() => {
        setLoading(false);
        setDone(true);
      });
    }
  };

  const contentStatus = loading ? (
    <Spinner accessibilityLabel="Installing app..." size="small" />
  ) : (
    "Install the app"
  );
  const textStatus = done ? "Installed" : "Uninstalled";
  return (
    <>
      {installed ? (
        <Banner
          title="App is already installed in your store."
          action={{ content: "Installation Guide", url: "#" }}
          status="info"
        >
          <p>
            Please click on the link below and follow the step by step to get
            started
          </p>
        </Banner>
      ) : done ? (
        <Banner
          title="The app has been succesfully installed. Please follow the step by step below to get started."
          status="success"
        />
      ) : (
        <SettingToggle
          action={{
            content: contentStatus,
            onAction: handleInstall,
          }}
          enabled={done}
        >
          Click here to enable the custom mobile menu:{" "}
          <TextStyle variation="strong">{textStatus}</TextStyle>
        </SettingToggle>
      )}
    </>
  );
};

export default Toggle;
