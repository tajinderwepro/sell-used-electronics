"""Add status field into quote table

Revision ID: 9b128330ca72
Revises: efab10c90f9a
Create Date: 2025-06-18 13:05:05.557693

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '9b128330ca72'
down_revision: Union[str, None] = 'efab10c90f9a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column('quotes', sa.Column('status', sa.String(length=50), nullable=False, server_default='pending'))


def downgrade():
    op.drop_column('quotes', 'status') 