# Just get it done already

This is a task tracker with diamond dependency tree support!

![Dependency tree](manual/tree.jpg)

Try it! [https://anmi.github.io/just-get-it-done-already/](https://anmi.github.io/just-get-it-done-already/)

To add existing task to opened task, just drag'n' drop task name to opened task list!

## Problem statement

Simple TODO lists are acually working fine, but it's not easy to plan big features
and refactor dependencies, braking down into subtasks and not beign overwhelmed by long list
of tasks.

I was inspired by RPG games with ability trees where you can always find a shortest path to your goal.
And easily track what should be your next task to get to your goal.

It's more a focus control tracker than time management, but you can also postpone tasks to focus
on something you are not blocked.

## Security concerns

Everything is stored in localStorage, but you can create a backup using *Save...* button.

## Usage

Those templates dependencies are maintained via [pnpm](https://pnpm.io) via `pnpm up -Lri`.

This is the reason you see a `pnpm-lock.yaml`. That being said, any package manager will work. This file can be safely be removed once you clone a template.

```bash
$ npm install # or pnpm install or yarn install
```

### Learn more on the [Solid Website](https://solidjs.com) and come chat with us on our [Discord](https://discord.com/invite/solidjs)

## Available Scripts

In the project directory, you can run:

### `npm run dev` or `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>

### `npm run build`

Builds the app for production to the `dist` folder.<br>
It correctly bundles Solid in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

## Deployment

You can deploy the `dist` folder to any static host provider (netlify, surge, now, etc.)

To deploy on github pages run `npm run build-deploy`
