import asyncio
from src.functions.daily import daily_message
from src.client import client
from src.workflows.workflow import DailyMessage
from daily import Daily


async def main():
    Daily.init()
    await client.start_service({
        "workflows": [DailyMessage],
        "functions": [daily_message]
    })

def run_services():
    asyncio.run(main())

if __name__ == "__main__":
    run_services()