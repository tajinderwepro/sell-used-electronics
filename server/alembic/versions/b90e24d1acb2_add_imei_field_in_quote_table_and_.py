"""add imei field in quote table and specification field in model table

Revision ID: b90e24d1acb2
Revises: 80411fe7cc61
Create Date: 2025-06-19 12:58:47.747045

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'b90e24d1acb2'
down_revision: Union[str, None] = '80411fe7cc61'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column('models', sa.Column('specifications', sa.Text(), nullable=True))
    op.add_column('quotes', sa.Column('imei', sa.String(length=50), nullable=True))
    op.add_column('quotes', sa.Column('specifications', sa.Text(), nullable=True))


def downgrade():
    op.drop_column('quotes', 'imei')
    op.drop_column('quotes', 'specifications')
    op.drop_column('models', 'specifications')