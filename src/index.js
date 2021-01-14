#!/usr/bin/env node
const fs = require("fs")

const globby = require("globby")
const prettier = require("prettier")

module.export = {
  genSitemap: async (url) => {
    const pages = await globby(["src/pages/*.{js,tsx}"])

    const sitemap = `
        <?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${pages
              .map((page) => {
                const path = page.replace(".tsx", "").replace(".js", "")
                const route = path === "/index" ? "" : path

                return `
                        <url>
                            <loc>${`https://${url}${route}`}</loc>
                        </url>
                    `
              })
              .join("")}
        </urlset>
    `

    const formatted = prettier.format(sitemap, {
      parser: "html",
    })

    // eslint-disable-next-line no-sync
    fs.writeFileSync("public/sitemap.xml", formatted)
  },
}
