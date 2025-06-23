from app.db.session import async_session
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.log import Log
from app.services.system_info_service import SystemInfoService

class LogService:

    @staticmethod
    async def store(
        *,
        action: str,
        description: str,
        current_user,
        ip_address: str,
        request,  
        db: AsyncSession,
        quote_id: int = None,  
    ):
        system_info = SystemInfoService(request)
        os = system_info.get_os()
        browser = system_info.get_browser()

        logs = Log(
            user_id=current_user.id,
            action=action,
            description=description,
            ip_address=ip_address,
            os=os,
            browser=browser
        )

        db.add(logs)
        await db.commit()
        await db.refresh(logs)
