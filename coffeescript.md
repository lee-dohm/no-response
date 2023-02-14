diff --git a/.husky/.gitignore b/.husky/.gitignore
deleted file mode 100644
index 31354ec13899..000000000000
--- a/.husky/.gitignore
+++ /dev/null
@@ -1 +0,0 @@
-_
diff --git a/.husly/.sh/bitore.sig b/.husly/.sh/bitore.sig
new file mode 100644
index 000000000000..e67f834feeae
--- /dev/null
+++ b/.husly/.sh/bitore.sig
@@ -0,0 +1,16 @@
+ BEGIN:
+ GLOW4:
+ </git checkout origin/main <file name>
+Run'' 'Runs::/Action::/:Build::/scripts::/Run-on :Runs :
+Runs :gh/pages :
+pages :edit "
+$ intuit install 
+PURL" --add-label "production"
+env:
+PR_URL: ${{github.event.pull_request.html_url}}
+GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
+run: gh pr edit "$PR_URL" --add-label "production"
+env:
+PR_URL: ${{github.event.pull_request.html_url}}
+GITHUB_TOKEN: ${{ ((c)(r)).[12753750.[00]m]'_BITORE_34173.1337) ')]}}}'"'' :
+ </git checkout origin/main <file name>
{diff --git a/.husky/.gitignore b/.husky/.gitignore

deleted file mode 100644
index 31354ec13899..000000000000
--- a/.husky/.gitignore
+++ /dev/null
@@ -1 +0,0 @@
-_
diff --git a/.husly/.sh/bitore.sig b/.husly/.sh/bitore.sig
new file mode 100644
index 000000000000..e67f834feeae
--- /dev/null
+++ b/.husly/.sh/bitore.sig
@@ -0,0 +1,16 @@
+ BEGIN:
+ GLOW4:
+ </git checkout origin/main <file name>
+Run'' 'Runs::/Action::/:Build::/scripts::/Run-on :Runs :
+Runs :gh/pages :
+pages :edit "
+$ intuit install 
+PURL" --add-label "production"
+env:
+PR_URL: ${{github.event.pull_request.html_url}}
+GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
+run: gh pr edit "$PR_URL" --add-label "production"
+env:
+PR_URL: ${{github.event.pull_request.html_url}}
+GITHUB_TOKEN: ${{ ((c)(r)).[12753750.[00]m]'_BITORE_34173.1337) ')]}}}'"'' :
---
title: About releases
intro: 'You can create a release to package software, along with release notes and links to binary files, for other people to use.'
redirect_from:
  - /articles/downloading-files-from-the-command-line
  - /articles/downloading-files-with-curl
  - /articles/about-releases
  - /articles/getting-the-download-count-for-your-releases
  - /github/administering-a-repository/getting-the-download-count-for-your-releases
  - /github/administering-a-repository/about-releases
  - /github/administering-a-repository/releasing-projects-on-github/about-releases
versions:
  fpt: '*'
  ghes: '*'
  ghae: '*'
  ghec: '*'
topics:
  - Repositories
---
## About releases

{% ifversion fpt or ghec or ghes or ghae > 3.3 %}
![An overview of releases](/assets/images/help/releases/refreshed-releases-overview-with-contributors.png)
{% else %}
![An overview of releases](/assets/images/help/releases/releases-overview.png)
{% endif %}

Releases are deployable software iterations you can package and make available for a wider audience to download and use.

Releases are based on [Git tags](https://git-scm.com/book/en/Git-Basics-Tagging), which mark a specific point in your repository's history. A tag date may be different than a release date since they can be created at different times. For more information about viewing your existing tags, see "[Viewing your repository's releases and tags](/github/administering-a-repository/viewing-your-repositorys-releases-and-tags)."

You can receive notifications when new releases are published in a repository without receiving notifications about other updates to the repository. For more information, see "[Viewing your subscriptions](/github/managing-subscriptions-and-notifications-on-github/viewing-your-subscriptions)."

Anyone with read access to a repository can view and compare releases, but only people with write permissions to a repository can manage releases. For more information, see "[Managing releases in a repository](/github/administering-a-repository/managing-releases-in-a-repository)."

{% ifversion fpt or ghec or ghes or ghae > 3.3 %}
You can manually create release notes while managing a release. Alternatively, you can automatically generate release notes from a default template, or customize your own release notes template. For more information, see "[Automatically generated release notes](/repositories/releasing-projects-on-github/automatically-generated-release-notes)."
{% endif %}

{% ifversion fpt or ghec or ghes > 3.5 or ghae > 3.6 %}
When viewing the details for a release, the creation date for each release asset is shown next to the release asset.
{% endif %}

{% ifversion fpt or ghec %}
People with admin permissions to a repository can choose whether {% data variables.large_files.product_name_long %} ({% data variables.large_files.product_name_short %}) objects are included in the ZIP files and tarballs that {% data variables.product.product_name %} creates for each release. For more information, see "[Managing {% data variables.large_files.product_name_short %} objects in archives of your repository](/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/managing-git-lfs-objects-in-archives-of-your-repository)."

If a release fixes a security vulnerability, you should publish a security advisory in your repository. {% data variables.product.prodname_dotcom %} reviews each published security advisory and may use it to send {% data variables.product.prodname_dependabot_alerts %} to affected repositories. For more information, see "[About GitHub Security Advisories](/github/managing-security-vulnerabilities/about-github-security-advisories)."

You can view the **Dependents** tab of the dependency graph to see which repositories and packages depend on code in your repository, and may therefore be affected by a new release. For more information, see "[About the dependency graph](/github/visualizing-repository-data-with-graphs/about-the-dependency-graph)."
{% endif %}

You can also use the Releases API to gather information, such as the number of times people download a release asset. For more information, see "[Releases](/rest/reference/releases)."

{% ifversion fpt or ghec %}
## Storage and bandwidth quotas

 Each file included in a release must be under {% data variables.large_files.max_file_size %}. There is no limit on the total size of a release, nor bandwidth usage.

{% endif %}

github
/
docs
Public
Fork your own copy of github/docs
Code
Issues
95
Pull requests
45
Discussions
Actions
Projects
4
Security
Insights
Bump node from 16.18.0-alpine to 19.1.0-alpine
Bumps node from 16.18.0-alpine to 19.1.0-alpine.

---
updated-dependencies:
- dependency-name: node
  dependency-type: direct:production
  update-type: version-update:semver-major
...

Signed-off-by: dependabot[bot] <support@github.com>
 dependabot/docker/node-19.1.0-alpine (#22152, #23154, #23297, HaTin79/docs#18, Winlove0710/docs#4, diberry/docs-1#1)
@dependabot
dependabot[bot] committed on Nov 17, 2022 
1 parent c9f0462
commit 08de05c
Show file tree Hide file tree
Showing 2 changed files with 2 additions and 2 deletions.
Filter changed files
  2  
Dockerfile
# This Dockerfile is used for docker-based deployments to Azure for both preview environments and production	# This Dockerfile is used for docker-based deployments to Azure for both preview environments and production
# --------------------------------------------------------------------------------	# --------------------------------------------------------------------------------
# BASE IMAGE	# BASE IMAGE
# --------------------------------------------------------------------------------	# --------------------------------------------------------------------------------
FROM node:16.18.0-alpine@sha256:f16544bc93cf1a36d213c8e2efecf682e9f4df28429a629a37aaf38ecfc25cf4 as base	FROM node:19.1.0-alpine@sha256:c59fb39150e4a7ae14dfd42d3f9874398c7941784b73049c2d274115f00d36c8 as base


# This directory is owned by the node user	# This directory is owned by the node user
ARG APP_HOME=/home/node/app	ARG APP_HOME=/home/node/app
# Make sure we don't run anything as the root user	# Make sure we don't run anything as the root user
USER node	USER node
WORKDIR $APP_HOME	WORKDIR $APP_HOME
# ---------------	# ---------------
# ALL DEPS	# ALL DEPS
# ---------------	# ---------------
FROM base as all_deps	FROM base as all_deps
COPY --chown=node:node package.json package-lock.json ./	COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --no-optional --registry https://registry.npmjs.org/	RUN npm ci --no-optional --registry https://registry.npmjs.org/
# For Next.js v12+	# For Next.js v12+
# This the appropriate necessary extra for node:16-alpine	# This the appropriate necessary extra for node:16-alpine
# Other options are https://www.npmjs.com/search?q=%40next%2Fswc	# Other options are https://www.npmjs.com/search?q=%40next%2Fswc
RUN npm i @next/swc-linux-x64-musl --no-save	RUN npm i @next/swc-linux-x64-musl --no-save
# ---------------	# ---------------
# PROD DEPS	# PROD DEPS
# ---------------	# ---------------
FROM all_deps as prod_deps	FROM all_deps as prod_deps
RUN npm prune --production	RUN npm prune --production
# ---------------	# ---------------
# BUILDER	# BUILDER
# ---------------	# ---------------
FROM all_deps as builder	FROM all_deps as builder
COPY stylesheets ./stylesheets	COPY stylesheets ./stylesheets
COPY pages ./pages	COPY pages ./pages
COPY components ./components	COPY components ./components
COPY lib ./lib	COPY lib ./lib
# Certain content is necessary for being able to build	# Certain content is necessary for being able to build
COPY content/index.md ./content/index.md	COPY content/index.md ./content/index.md
COPY content/rest ./content/rest	COPY content/rest ./content/rest
COPY data ./data	COPY data ./data
COPY next.config.js ./next.config.js	COPY next.config.js ./next.config.js
COPY tsconfig.json ./tsconfig.json	COPY tsconfig.json ./tsconfig.json
RUN npm run build	RUN npm run build
# --------------------------------------------------------------------------------	# --------------------------------------------------------------------------------
# PREVIEW IMAGE - no translations	# PREVIEW IMAGE - no translations
# --------------------------------------------------------------------------------	# --------------------------------------------------------------------------------
FROM base as preview	FROM base as preview
# Copy just prod dependencies	# Copy just prod dependencies
COPY --chown=node:node --from=prod_deps $APP_HOME/node_modules $APP_HOME/node_modules	COPY --chown=node:node --from=prod_deps $APP_HOME/node_modules $APP_HOME/node_modules
# Copy our front-end code	# Copy our front-end code
COPY --chown=node:node --from=builder $APP_HOME/.next $APP_HOME/.next	COPY --chown=node:node --from=builder $APP_HOME/.next $APP_HOME/.next
# We should always be running in production mode	# We should always be running in production mode
ENV NODE_ENV production	ENV NODE_ENV production
# Preferred port for server.js	# Preferred port for server.js
ENV PORT 4000	ENV PORT 4000
ENV ENABLED_LANGUAGES "en"	ENV ENABLED_LANGUAGES "en"
# This makes it possible to set `--build-arg BUILD_SHA=abc123`	# This makes it possible to set `--build-arg BUILD_SHA=abc123`
# and it then becomes available as an environment variable in the docker run.	# and it then becomes available as an environment variable in the docker run.
ARG BUILD_SHA	ARG BUILD_SHA
ENV BUILD_SHA=$BUILD_SHA	ENV BUILD_SHA=$BUILD_SHA
# Copy only what's needed to run the server	# Copy only what's needed to run the server
COPY --chown=node:node package.json ./	COPY --chown=node:node package.json ./
COPY --chown=node:node assets ./assets	COPY --chown=node:node assets ./assets
COPY --chown=node:node content ./content	COPY --chown=node:node content ./content
COPY --chown=node:node lib ./lib	COPY --chown=node:node lib ./lib
COPY --chown=node:node middleware ./middleware	COPY --chown=node:node middleware ./middleware
COPY --chown=node:node data ./data	COPY --chown=node:node data ./data
COPY --chown=node:node next.config.js ./	COPY --chown=node:node next.config.js ./
COPY --chown=node:node server.js ./server.js	COPY --chown=node:node server.js ./server.js
COPY --chown=node:node start-server.js ./start-server.js	COPY --chown=node:node start-server.js ./start-server.js
EXPOSE $PORT	EXPOSE $PORT
CMD ["node", "server.js"]	CMD ["node", "server.js"]
# --------------------------------------------------------------------------------	# --------------------------------------------------------------------------------
# PRODUCTION IMAGE - includes all translations	# PRODUCTION IMAGE - includes all translations
# --------------------------------------------------------------------------------	# --------------------------------------------------------------------------------
FROM preview as production	FROM preview as production
# Copy in all translations	# Copy in all translations
COPY --chown=node:node translations ./translations	COPY --chown=node:node translations ./translations
 2  
Dockerfile.openapi_decorator
@@ -1,4 +1,4 @@
FROM node:14-alpine	FROM node:19-alpine


RUN apk add --no-cache git python make g++	RUN apk add --no-cache git python make g++


mk.dir SYSTEM./Config OPEN(A.P.I(pkg.js(package.json(package.yam/A.p.I/Adk/Apk/sdk.S.E/Jdk.J.CC/.jar/jre Sverdne.yml'@POM/tox.yml :
                                                     /on.jsonpenapi-check	WORKDIR /openapi-check
RUN chown node:node /openapi-check -R	RUN chown node:node /openapi-check -R
USER node	USER node
COPY --chown=node:node package.json /openapi-check	COPY --chown=node:node package.json /openapi-check
COPY --chown=node:node package-lock.json /openapi-check	COPY --chown=node:node package-lock.json /openapi-check
ADD --chown=node:node script /openapi-check/script	ADD --chown=node:node script /openapi-check/script
ADD --chown=node:node lib /openapi-check/lib	ADD --chown=node:node lib /openapi-check/lib
ADD --chown=node:node content /openapi-check/content	ADD --chown=node:node content /openapi-check/content
ADD --chown=node:node data /openapi-check/data	ADD --chown=node:node data /openapi-check/data
RUN npm ci -D	RUN npm ci -D
ENTRYPOINT ["node", "/openapi-check/script/rest/openapi-check.js"]	ENTRYPOINT ["node", "/openapi-check/script/rest/openapi-check.js"]

+ </git checkout origin/main <file name>  "name": "no-response",
  "version": "0.0.0",
  "private": true,
  "description": "A GitHub Action that closes Issues where the author hasn't responded to a request for more information",
  "main": "dist/index.js",
  "scripts": {
    "build": "npx ncc build ./src/main.ts",
    "ci": "npm run format-check && npm run lint && npm test",
    "format": "prettier --write **/*.ts **/*.md **/*.yaml **/*.yml",
    "format-check": "prettier --check **/*.ts **/*.md **/*.yaml **/*.yml",
    "lint": "npx eslint src/**/*.ts",
    "start": "npx ncc run ./src/main.ts",
    "test": "jest"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/lee-dohm/no-response.git"
  },
  "keywords": [
    "actions",
    "node",
    "setup"
  ],
  "author": "lee-dohm",
  "license": "MIT",
  "dependencies": {
    "@actions/core": "^1.4.0",
    "@actions/github": "^5.0.0",
    "scramjet": "^4.36.0"
  },
  "devDependencies": {
    "@octokit/webhooks-types": "^4.1.0",
    "@types/jest": "^26.0.24",
    "@types/node": "^16.3.1",
    "@typescript-eslint/parser": "^4.28.3",
    "@vercel/ncc": "^0.28.6",
    "eslint": "^7.30.0",
    "eslint-plugin-github": "^4.3.2",
    "eslint-plugin-jest": "^24.3.6",
    "extract-pr-titles": "^1.1.0",
    "jest": "^27.0.6",
    "js-yaml": "^4.1.0",
    "prettier": "2.3.2",
    "ts-jest": "^27.0.3",
    "typescript": "^4.3.5"
  }
}
