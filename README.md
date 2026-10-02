# tg3 — Telegram photo text bot

A Telegram bot that writes styled text onto a photo and sends the result back without the user ever opening an image editor. The user picks a style, types the text, and receives a finished image.

## Features

- Renders text onto an image with Pillow, no external editing required
- Several text styles to choose from
- Result returned to the chat as a photo
- Session state stored in Upstash Redis, so an in-progress edit survives a restart
- Webhook mode with a Flask application fronted by Gunicorn
- Blueprint definition for one-click provisioning on Render

## Tech stack

| Layer | Technology |
| --- | --- |
| Language | Python 3 |
| Web layer | Flask 3.1 |
| WSGI server | Gunicorn 23 |
| Imaging | Pillow 11.1 |
| Session storage | Upstash Redis |
| Configuration | python-dotenv |
| HTTP client | requests |
| Hosting | Render |

## Getting started

### Requirements

- Python 3.11 or newer
- A bot token from [@BotFather](https://t.me/BotFather)
- An Upstash Redis database, used as a free alternative to managed storage

### Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `BOT_TOKEN` | yes | Token issued by BotFather |
| `BOT_USERNAME` | yes | Bot username, without the leading `@` |
| `EXTERNAL_URL` | webhook mode | Public HTTPS URL of the deployed instance |
| `REDIS_URL` | yes | Upstash Redis connection string |
| `REDIS_TOKEN` | yes | Upstash Redis access token |

Create a `.env` file in the project root:

```
BOT_TOKEN=123456:ABCDEF...
BOT_USERNAME=my_photo_bot
REDIS_URL=rediss://default:token@host.upstash.io:6379
REDIS_TOKEN=token
EXTERNAL_URL=https://your-instance.onrender.com
```

### Installation

```bash
git clone https://github.com/glcskl/tg3.git
cd tg3
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Running

Local development:

```bash
python app.py
```

Webhook mode, which is what the hosting platform uses:

```bash
gunicorn webhook_app:app
```

## Project structure

```
app.py             local entry point and message handlers
webhook_app.py     Flask application serving the Telegram webhook
image_processor.py text rendering and image composition
render.yaml        Render service blueprint
Procfile           process definition for the hosting platform
requirements.txt   pinned dependencies
```

## Deployment

`render.yaml` lets Render provision the service straight from the blueprint. The `Procfile` starts Gunicorn on `webhook_app:app`, and the webhook URL must be registered with Telegram before traffic arrives.

## Notes

This project is personal. It performs no image recognition and no machine learning; every effect is deterministic image composition done with Pillow.