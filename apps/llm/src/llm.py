from __future__ import annotations
import asyncio
import json
import os
import time
import traceback
from pydantic import BaseModel

import aiohttp
from dotenv import load_dotenv
from flask import Flask, Response, request, stream_with_context
from openai import OpenAI

load_dotenv()

app = Flask(__name__)

# Set up your OpenAI API key and client
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)

# Open Notify API endpoint for ISS location
ISS_LOCATION_ENDPOINT = "http://api.open-notify.org/iss-now.json"

class GetISSLocation(BaseModel):
    pass  # No parameters needed for ISS location

async def get_iss_location_async():
    async with aiohttp.ClientSession() as session:
        async with session.get(ISS_LOCATION_ENDPOINT) as response:
            return await response.json()


def run_async(coro):
    loop = asyncio.new_event_loop()
    return loop.run_until_complete(coro)


@app.route("/chat/completions", methods=["POST"])
def chat_completion():
    try:
        
        # Log that a request has been received
        print("Received a POST request at /chat/completions")

        # Log request headers
        print("Request headers:", request.headers)
        
        start_time = time.perf_counter()
        data = request.json
        messages = data.get("messages", [])
        print("Received messages:", messages)

        # Log request headers
        print("Request headers:", request.headers)

        # Start the completion stream
        completion_stream = client.chat.completions.create(
            model="gpt-4o-mini", messages=messages, stream=True
        )

        print(f"Time taken to start streaming: {time.perf_counter() - start_time}")

        def generate():
            for chunk in completion_stream:
                if chunk.choices[0].delta.content is not None:
                    content = chunk.choices[0].delta.content
                    print(content)
                    yield f"data: {json.dumps({'choices': [{'delta': {'content': content}}]})}\n\n"
            yield "data: [DONE]\n\n"

        return Response(stream_with_context(generate()), content_type="text/plain")

    except Exception as e:
        print(f"CHATBOT_STEP: {traceback.format_exc()}")
        return Response(str(e), content_type="text/plain", status=500)


@app.route("/test", methods=["GET"])
def test_route():
    print("Test route accessed")
    return "Test route is working", 200
    
if __name__ == "__main__":
    app.run(debug=True)

def run_llm():
    app.run(debug=True, host='0.0.0.0', port=1337)
