from datetime import timedelta
from typing import Any, Dict
from restack_ai.workflow import workflow
from ..functions.daily import daily_message

@workflow.defn(name="DailyMessage")
class DailyMessage:
    @workflow.run
    async def daily_message(self, input: Dict[str, Any]):
        conversation_id = input.get("conversation_id")
        return await workflow.step(daily_message, {"conversation_id": conversation_id}, start_to_close_timeout=timedelta(seconds=30))

