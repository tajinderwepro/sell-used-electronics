"""merge branches 1ce147f762d4 and 45fbb584fc97

Revision ID: be3b437fc984
Revises: 1ce147f762d4, 45fbb584fc97
Create Date: 2025-06-24 10:08:55.367303

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'be3b437fc984'
down_revision: Union[str, None] = ('1ce147f762d4', '45fbb584fc97')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
