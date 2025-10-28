# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Admin image uploads

- De beheerderspagina (`/admin`) ondersteunt drag-and-drop uploads naast elk afbeeldingsveld. Zodra een geauthenticeerde admin een bestand neerzet of kiest, wordt het automatisch verstuurd naar `/admin/upload` en de JSON-URL bijgewerkt.
- Bestanden worden opgeslagen in `CONTENT_DIR/uploads` (in Docker standaard `/app/storage/uploads`). Zorg dat deze directory via een volume behouden blijft tussen deploys.
- Geüploade assets zijn publiek bereikbaar via `/uploads/<bestandsnaam>`. De `uploads`-route streamt bestanden rechtstreeks vanaf de schijf en zet langetermijncacheheaders.
- De uploader accepteert alleen afbeeldingsmimetypes (JPG, PNG, WEBP, GIF, SVG) tot maximaal 5 MB per bestand.
