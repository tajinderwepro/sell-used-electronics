"""add ebay_tokens table

Revision ID: cadda064ebc8
Revises: 332dda5a2aec
Create Date: 2025-06-20 15:20:32.077898

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'cadda064ebc8'
down_revision: Union[str, None] = '332dda5a2aec'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.create_table(
        'ebay_tokens',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('environment', sa.String(length=20), unique=True, nullable=False),
        sa.Column('access_token', sa.Text, nullable=True),
        sa.Column('expires_at', sa.DateTime, nullable=True),
    )


def downgrade():
    op.drop_table('ebay_tokens')