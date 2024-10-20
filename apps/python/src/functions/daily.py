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

        call_client.set_user_name("restack")
        call_client.send_app_message({
          "message_type": "conversation",
          "event_type": "conversation.echo",
          "conversation_id": input.get("conversation_id"),
          "properties": {
              "text": input.get("message")
          }
        }, completion=lambda f: future.set_result(f))

        log.info("Waiting for future to complete...")
        await future
        log.info("Future completed.")

        # Add logging and error handling
        try:
            log.info("Attempting to leave the room.")
            call_client.leave()
            log.info("Successfully left the room.")
        except Exception as e:
            log.error(f"Error leaving the room: {e}")

        try:
            log.info("Attempting to release resources.")
            call_client.release()
            log.info("Successfully released resources.")
        except Exception as e:
            log.error(f"Error releasing resources: {e}")

        return "joined room and sent message"
    except Exception as e:
        log.error(f"Error joining room: {e}")
        return e
