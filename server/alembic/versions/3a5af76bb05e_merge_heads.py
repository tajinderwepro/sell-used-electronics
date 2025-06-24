"""Merge heads

Revision ID: 3a5af76bb05e
Revises: 0aa946d63c9f, be3b437fc984
Create Date: 2025-06-24 12:21:36.300790

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3a5af76bb05e'
down_revision: Union[str, None] = ('0aa946d63c9f', 'be3b437fc984')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
