import asyncio
from typing import Any, Dict
from restack_ai.function import function, log

@function.defn(name="daily_message")
async def daily_message(input: Dict[str, Any]) -> str:
    try:
        from daily import CallClient
        call_client = CallClient()
        call_client.join(f"https://tavus.daily.co/{input.get('conversation_id')}")

        future = asyncio.get_running_loop().create_future()

        call_client.send_app_message({
          "message_type": "conversation",
          "event_type": "conversation.echo",
          "conversation_id": input.get("conversation_id"),
          "properties": {
              "text": "Hey Philippe, sorry to interrupt, you have a Docusign that is urgent."
          }
        }, completion=lambda f: future.set_result(None))

        await future

        # call_client.leave()
        return "joined room and sent message"
    except Exception as e:
        print(f"Error joining room: {e}")
        raise
