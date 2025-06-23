"""merge multiple heads

Revision ID: bf6b557ac8b4
Revises: a3b555e10225, cadda064ebc8
Create Date: 2025-06-23 11:42:56.574671

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'bf6b557ac8b4'
down_revision: Union[str, None] = ('a3b555e10225', 'cadda064ebc8')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
