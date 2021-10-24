import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import Shopify, { ApiVersion } from "@shopify/shopify-api";
import Koa from "koa";
import next from "next";
import Router from "koa-router";
import axios from 'axios';

// DB
const connectDB = require("../config/db");
const Store = require("../models/Store");

// Import the required assets to be created in Shopify theme code.
const interactiveMobileMenu = require("../files/interactive-mobilemenu");
const interactiveMobileMenuCss = require("../files/interactive-mobilemenu-css");
const theme = require("../files/theme");
const headerSnippet = require("../files/header");

dotenv.config();
const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});
const handle = app.getRequestHandler();

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https:\/\//, ""),
  API_VERSION: ApiVersion.October20,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
const ACTIVE_SHOPIFY_SHOPS = {};

app.prepare().then(async () => {
  const server = new Koa();
  const router = new Router();
  server.keys = [Shopify.Context.API_SECRET_KEY];
  server.use(
    createShopifyAuth({
      async afterAuth(ctx) {
        // Access token and shop available in ctx.state.shopify
        const { shop, accessToken, scope } = ctx.state.shopify;
        const host = ctx.query.host;
        ACTIVE_SHOPIFY_SHOPS[shop] = scope;

        const response = await Shopify.Webhooks.Registry.register({
          shop,
          accessToken,
          path: "/webhooks",
          topic: "APP_UNINSTALLED",
          webhookHandler: async (topic, shop, body) =>
            delete ACTIVE_SHOPIFY_SHOPS[shop],
        });

        if (!response.success) {
          console.log(
            `Failed to register APP_UNINSTALLED webhook: ${response.result}`
          );
        }

        // Redirect to app with shop parameter upon auth
        ctx.redirect(`/?shop=${shop}&host=${host}`);
      },
    })
  );

  connectDB();

  const handleRequest = async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };

  router.post("/webhooks", async (ctx) => {
    try {
      await Shopify.Webhooks.Registry.process(ctx.req, ctx.res);
      console.log(`Webhook processed, returned status code 200`);
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
    }
  });

  router.post(
    "/graphql",
    verifyRequest({ returnHeader: true }),
    async (ctx, next) => {
      await Shopify.Utils.graphqlProxy(ctx.req, ctx.res);
    }
  );

  // GET List of Store Themes
  router.get("/api/themes", verifyRequest(), async (ctx) => {

    const session = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);

    const { shop, accessToken } = session;

    const url = `https://${shop}/admin/api/2021-01/themes.json`;

    const shopifyHeader = (accessToken) => ({
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
    });

    try {
      const getThemes = await axios.get(url, {
        headers: shopifyHeader(accessToken),
      });

      ctx.body = getThemes.data;

      ctx.res.statusCode = 200;
    } catch (error) {
      console.log(error);
    }
  });

  // Get the assets list with theme id
  router.get("/api/:themeid/assets", verifyRequest(), async (ctx) => {

    const session = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);

    const { shop, accessToken } = session;

    const url = `https://${shop}/admin/api/2021-01/themes/${ctx.params.themeid}/assets.json`;

    const shopifyHeader = (accessToken) => ({
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
    });

    try {
      const getAssets = await axios.get(url, {
        headers: shopifyHeader(accessToken),
      });

      ctx.body = getAssets.data;
      ctx.res.statusCode = 200;
    } catch (error) {
      console.log(error);
      ctx.res.statusCode = 404;
    }
  });

  // Create liquid file after installing the app
  router.put(
    "/api/:themeid/installLiquidFile",
    verifyRequest(),
    async (ctx) => {
      const session = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);

      const { shop, accessToken } = session;

      const url = `https://${shop}/admin/api/2021-01/themes/${ctx.params.themeid}/assets.json`;

      const shopifyHeader = (accessToken) => ({
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      });

      try {
        // install liquid file
        const installLiquid = await axios.put(
          url,
          JSON.stringify({
            asset: {
              key: "snippets/interactive-mobilemenu.liquid",
              value: interactiveMobileMenu,
            },
          }),
          {
            headers: shopifyHeader(accessToken),
          }
        );

        ctx.body = installLiquid.data;
        ctx.res.statusCode = 200;
      } catch (error) {
        console.log(error);
        ctx.res.statusCode = 404;
      }
    }
  );

  router.put("/api/:themeid/installCss", verifyRequest(), async (ctx) => {
    const session = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);

    const { shop, accessToken } = session;

    const url = `https://${shop}/admin/api/2021-01/themes/${ctx.params.themeid}/assets.json`;

    const shopifyHeader = (accessToken) => ({
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
    });

    try {
      // install css
      const installCss = await axios.put(
        url,
        JSON.stringify({
          asset: {
            key: "assets/interactive-mobilemenu.css",
            value: interactiveMobileMenuCss,
          },
        }),
        {
          headers: shopifyHeader(accessToken),
        }
      );

      ctx.body = installCss.data;
      ctx.res.statusCode = 200;
    } catch (error) {
      console.log(error);
      ctx.res.statusCode = 404;
    }
  });

  // Install required libraries in theme.liquid
  router.put(
    "/api/:themeid/installRequiredLibraries",
    verifyRequest(),
    async (ctx) => {
      const session = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);

      const { shop, accessToken } = session;

      const url = `https://${shop}/admin/api/2021-01/themes/${ctx.params.themeid}/assets.json?asset[key]=layout/theme.liquid`;

      const putUrl = `https://${shop}/admin/api/2021-01/themes/${ctx.params.themeid}/assets.json`;

      const shopifyHeader = (accessToken) => ({
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      });

      try {
        const asset = await axios.get(url, {
          headers: shopifyHeader(accessToken),
        });

        const assetContent = asset.data.asset.value;

        const splittedAssetContent = assetContent.split("</head>");

        const topContent = splittedAssetContent[0];
        const bottomContent = splittedAssetContent[1];

        const newAssetContent = topContent + theme + "</head>" + bottomContent;

        // install newAssetContent file
        const installNewAssetContent = await axios.put(
          putUrl,
          JSON.stringify({
            asset: {
              key: "layout/theme.liquid",
              value: newAssetContent,
            },
          }),
          {
            headers: shopifyHeader(accessToken),
          }
        );

        ctx.body = installNewAssetContent.data;
        ctx.res.statusCode = 200;
      } catch (error) {
        console.log(error);
        ctx.res.statusCode = 404;
      }
    }
  );

  // Install snippet in header.liquid
  router.put(
    "/api/:themeid/installHeaderSnippet",
    verifyRequest(),
    async (ctx) => {
      const session = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);

      const { shop, accessToken } = session;

      const url = `https://${shop}/admin/api/2021-01/themes/${ctx.params.themeid}/assets.json?asset[key]=sections/header.liquid`;

      const putUrl = `https://${shop}/admin/api/2021-01/themes/${ctx.params.themeid}/assets.json`;

      const shopifyHeader = (accessToken) => ({
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      });

      try {
        const asset = await axios.get(url, {
          headers: shopifyHeader(accessToken),
        });

        const assetContent = asset.data.asset.value;

        const newAssetContent = headerSnippet + assetContent;

        // install header snippet file
        const installNewAssetContent = await axios.put(
          putUrl,
          JSON.stringify({
            asset: {
              key: "sections/header.liquid",
              value: newAssetContent,
            },
          }),
          {
            headers: shopifyHeader(accessToken),
          }
        );

        const newStore = new Store({
          storeUrl: shop,
          accessToken: accessToken,
          themeId: ctx.params.themeid,
          installed: true,
        });

        await newStore.save().then((res) => console.log(res, "saved to db"));

        ctx.body = installNewAssetContent.data;
        ctx.res.statusCode = 200;
      } catch (error) {
        console.log(error);
        ctx.res.statusCode = 404;
      }
    }
  );

  router.get("(/_next/static/.*)", handleRequest); // Static content is clear
  router.get("/_next/webpack-hmr", handleRequest); // Webpack content is clear
  router.get("(.*)", async (ctx) => {
    const shop = ctx.query.shop;

    // This shop hasn't been seen yet, go through OAuth to create a session
    if (ACTIVE_SHOPIFY_SHOPS[shop] === undefined) {
      ctx.redirect(`/auth?shop=${shop}`);
    } else {
      await handleRequest(ctx);
    }
  });

  server.use(router.allowedMethods());
  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
