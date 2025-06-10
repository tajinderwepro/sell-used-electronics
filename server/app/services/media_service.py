from sqlalchemy.ext.asyncio import AsyncSession
from app.models.media import Media
from app.utils.file_utils import save_file_with_unique_name


class MediaService:
    @staticmethod
    async def store_media(
        file_data: bytes,
        original_filename: str,
        mediable_type: str,
        mediable_id: int,
        db: AsyncSession
    ) -> int:
        stored_path = save_file_with_unique_name(file_data, original_filename)

        media = Media(
            path=stored_path,
            mediable_type=mediable_type,
            mediable_id=mediable_id
        )
        db.add(media)
        await db.commit()
        await db.refresh(media)

        return media.id
