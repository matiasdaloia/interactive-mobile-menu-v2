import Shopify from "@shopify/shopify-api";
import axios from 'axios';
const Store = require('../models/Store')


// Import the required assets to be created in Shopify theme code.
const interactiveMobileMenu = require("../files/interactive-mobilemenu");
const interactiveMobileMenuCss = require("../files/interactive-mobilemenu-css");
const theme = require("../files/theme");
const headerSnippet = require("../files/header");

/**
 * Returns list of themes available in the current store
 * @param  {Object} ctx context
 * @returns {Array} array of themes
 */
export const getThemes = async (ctx) => {
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
};


/**
 * Returns list of theme assets available in the current store
 * @param  {Object} ctx context
 * @returns {Array} List of theme assets
 */
export const getThemeAssets = async (ctx) => {
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
};


export const installLiquidFile = async (ctx) => {
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
};

export const installCss = async (ctx) => {
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
};

export const installRequiredLibraries = async (ctx) => {
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
};

export const installHeaderSnippet = async (ctx) => {
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
};