import asyncio
from datetime import timedelta
from typing import Any, Dict
from restack_ai.workflow import workflow
from ..functions.daily import daily_message

@workflow.defn(name="DailyMessage")
class DailyMessage:
    @workflow.run
    async def daily_message(self, input: Dict[str, Any]):
        conversation_id = input.get("conversation_id")
        await workflow.step(daily_message, {"conversation_id": conversation_id, "message": "Hey Philippe, sorry to interrupt, you have a Docusign that is urgent."}, start_to_close_timeout=timedelta(seconds=30))

        await asyncio.sleep(1000)

        await workflow.step(daily_message, {"conversation_id": conversation_id, "message": "Hey Philippe, you have an urgent email that needs a reply."}, start_to_close_timeout=timedelta(seconds=30))

        await asyncio.sleep(1000)

        await workflow.step(daily_message, {"conversation_id": conversation_id, "message": "Hey Philippe, your meeting with John Doe was cancelled and postponed to next week same time."}, start_to_close_timeout=timedelta(seconds=30))

        await asyncio.sleep(1000)

        await workflow.step(daily_message, {"conversation_id": conversation_id, "message": "Hey Philippe, somebody just tweeted about you, do you want me to reply?"}, start_to_close_timeout=timedelta(seconds=30))

        return True
