import asyncio
import time
from restack_ai import Restack

async def main(conversation_id: str):

    client = Restack()

    print(client)

    workflow_id = f"{int(time.time() * 1000)}-DailyMessage"
    runId = await client.schedule_workflow(
        workflow_name="DailyMessage",
        workflow_id=workflow_id,
        input={
            "conversation_id": conversation_id
        }
    )

    result = await client.get_workflow_result(
        workflow_id=workflow_id,
        run_id=runId
    )
    print(result)

    exit(0)

def run_schedule_workflow():
    asyncio.run(main(conversation_id="c43355af"))

if __name__ == "__main__":
    run_schedule_workflow()
