import axios from "axios";

const ThemeHelpers = {};

ThemeHelpers.installApp = async (themeid, token) => {
  axios.defaults.headers = {
    Authorization: `Bearer ${token}`,
  };

  await axios
    .put(`/api/${themeid}/installLiquidFile`)
    .then((res) => console.log(res));

  await axios.put(`/api/${themeid}/installCss`).then((res) => console.log(res));

  await axios
    .put(`/api/${themeid}/installRequiredLibraries`)
    .then((res) => console.log(res));

  await axios.put(`/api/${themeid}/installHeaderSnippet`).then((res) => {
    console.log(res);
  });
};

ThemeHelpers.uninstallApp = (themeid) => {
  console.log("Uninstalling..." + themeid);
};

export default ThemeHelpers;