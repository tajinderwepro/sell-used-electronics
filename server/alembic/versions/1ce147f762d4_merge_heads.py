"""Merge heads

Revision ID: 1ce147f762d4
Revises: a3b555e10225, cadda064ebc8
Create Date: 2025-06-23 11:15:24.745643

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1ce147f762d4'
down_revision: Union[str, None] = ('a3b555e10225', 'cadda064ebc8')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
