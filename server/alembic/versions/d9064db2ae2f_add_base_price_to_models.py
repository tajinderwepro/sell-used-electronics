"""add base_price to models

Revision ID: d9064db2ae2f
Revises: 865ce77f559f
Create Date: 2025-06-11 11:52:03.200060

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd9064db2ae2f'
down_revision: Union[str, None] = '865ce77f559f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('models', sa.Column('base_price', sa.Float(), nullable=False, server_default="0.0"))
    op.alter_column('models', 'base_price', server_default=None)


def downgrade() -> None:
    op.drop_column('models', 'base_price')

