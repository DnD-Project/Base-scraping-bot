# Base-scraping-bot

This is the base repo for scraping bots at our project and it also provides an example for a better understanding of it. But first, let's understand why this was made. This base is to keep our code `tidy`, but even more important, this repo is focused on `productivity`.

On our strategy to get this project done, scraping bots are currently serving the only purpose to inject cached data in our system, so they would be "1 use only". With that on mind, instead of having `TDD` for failure-proof code, we use fast deployable environments to get things tested ASAP. However, if you find yourself more comfy using tests, we provided them as well using the `jest` lib, also make sure to get rid of the `bot` folder at the `test` folder if you are not using tests, so you can pass the PR checking.

Finally, our recomendation is to use `nodemon`, as it will refresh the bot with every change, letting you see the formatting you are working on, or if the data is getting scraped correctly. To give this tip a try, just run the `dev` script as shown in the following part.

## Running
To install and run this example, just clone the repo and run the following commands, and you are ready to go! Every change will be automatically reflected whenever you change the code.

```sh
npm install
npm run dev
```

Having problems on your computer with any dependencies? Then go for a container build, to do it run the following commands: (remember to turn on your daemon before)

```sh
docker build -t pptr .
docker run -p 8080:8080 --name bot pptr
```

With those commands executed on one terminal, you can test your work with any HTTP request service, such as Postman or cURL. (you may need the same strategy for the `dev` script) This last one is highly encourage, as it can be ran on other terminal in which you can terminate your container instance as it is provided with a name. Something like this:

```sh
curl localhost:8080/update/bard
# see that glorious output
docker rm -f bot
```

Take on mind that this running method may be the slower possible, so always try a local run instead, just use the container as a last resource, or for a final test so you don't come with an "it works on my machine" to the team later!

## Structure
The folder structure is quite simple, everything is already setup, so only the `bot` folder should be edited, and maybe the `tools` folder if required. On the index there is an `express` app, which is configured with environment variables from the config file, on the `routes` folder there is already a logic of cache and concurrency which can help on understanding the state of the bot, they also handle any posible error from the `bot` folder and output it on the server side. This graph may help anyways.

```
src
 ├── bot (You work here!)
 ├── routes
 ├── tools (...and surely here as well)
 ├── config.ts
 └── index.ts
```

So, how do you setup your own bot? Just make yourself on both folders pointed in the graph above, but make sure to export default an async function with the contract provided in the example. If by any means, you require more data than a string to make the bot work, you can make those changes on the rest of the `src` folder. However, this practice is to be avoided, as there is a high possibility that you can make it work with just a name, because of the use case of our bots.

### The example
As it can be seen on the index of the `bot` folder, this example shows a bunch of things related on how to work with `puppeteer`. Disclaimer, we are not experts, but the experience working with some really messy DOMs made us get a point or two about how to make it work well. First, always take on mind what URL are you visiting, often you can gain a lot of info just choosing well your requirements to the site.

```ts
export default async function (page: Page, name: string) {
    const url = `https://www.5esrd.com/database/class/${name}`;
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    const space = await page.$('.page-center');
    const content = await space?.$('#article-content');
    if (!content) throw Error('Article not found');
    const result = await content.$eval('h1', getTextValue);
    return { name: result } as Example;
}
```

Right after the URL, goes the redirection, in which we recommend the option set, however, if you are not getting your info, then it may be because the way the page load its data, so, to make sure, change that option to `'networkidle2'`, if the problem remains, then maybe you should review your code. Also take in mind that there are a good amount of way to use the selectors, (if you are using the DOM of course) so try to access every container on the way to make your selection the most precise possible.

You may notice the `getTextValue` function on this example being used to get a value from a tag selection, using named function to retrieve data can help on getting a more concise code, we provided an example of it on `tools/utils.ts`, so take a look at it. Finally, remember to just throw your errors, the system already handles them, so you can be "dirty" wiht that! Also you can test them with jest as shown in the `bot` test example.

## Quality
We are not forgiving 100% of code quality over our productivity, to make our work readable there is a github workflow for every PR which requires the code to meet the exigencies of a linter and a format at least, it will check tests also, so, again, clear the `bot` test folder if you are not using tests. 
