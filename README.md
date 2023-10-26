# Sarabot

## Development

1. Clone the repo

```
git clone [github https url]
```

2. Install packages

```
npm install
```

3. Set up your `.env` file

- Copy `.env.production` into `.env`

- Visit [openai](https://help.openai.com/en/articles/4936850-where-do-i-find-my-secret-api-key) to retrieve API keys and insert into your `.env` file.
- Visit [supabase](https://supabase.com/) to create a database and retrieve your keys in the user dashboard as per [docs instructions](https://supabase.com/docs)

4. In the `config` folder, replace the urls in the array with your website urls (the script requires more than one url).

The `pageContent` and `metadata` will later be stored in your supabase database table.

- Add the `documents` table in the database and `match_documents` function in the supabase.

## 🧑 Instructions for scraping and embedding

To run the scraping and embedding script in `scripts/scraper.ts` simply run:

`npm run scraper`

## Run the app

Once you've verified that the embeddings and content have been successfully added to your supabase table, you can run the app `npm run dev` and type a question to ask your website.
