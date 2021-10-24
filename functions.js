import axios from "axios";

export const installApp = async (themeid, token) => {
  axios.defaults.headers = {
    "Authorization": `Bearer ${token}`
  }
  console.log("Installing...");
  // Install Liquid File
  await axios
    .put(`/api/${themeid}/installLiquidFile`)
    .then((res) => console.log(res));

  // Install Css File
  await axios.put(`/api/${themeid}/installCss`).then((res) => console.log(res));

  // Install required libraries
  await axios
    .put(`/api/${themeid}/installRequiredLibraries`)
    .then((res) => console.log(res));

  // Install header snippet
  await axios.put(`/api/${themeid}/installHeaderSnippet`).then((res) => {
    console.log(res);
  });
};

export const uninstallApp = (themeid) => {
  console.log("Uninstalling...");
};
