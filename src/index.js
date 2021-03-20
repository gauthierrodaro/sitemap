const fs = require("fs")

const globby = require("globby")
const prettier = require("prettier")

module.exports = {
  genSitemap: async (url) => {
    const pages = await globby(["src/pages/*.{js,tsx}", "public/**/*.mdx"])

    const sitemap = `
        <?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${pages
              .map((page) =>
                page
                  .replace("src/pages", "")
                  .replace(".tsx", "")
                  .replace(".js", "")
                  .replace(".mdx", "")
              )
              .filter((path) => !["/_app", "/_document"].includes(path))
              .map((path) => {
                const route = path === "/index" ? "" : path

                return `
                        <url>
                            <loc>${`${url}${route}`}</loc>
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
