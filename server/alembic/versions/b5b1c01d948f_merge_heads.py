"""merge heads

Revision ID: b5b1c01d948f
Revises: 1ce147f762d4, 45fbb584fc97
Create Date: 2025-06-23 18:03:06.548286

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b5b1c01d948f'
down_revision: Union[str, None] = ('1ce147f762d4', '45fbb584fc97')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
