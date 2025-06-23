"""create notes table

Revision ID: a3b555e10225
Revises: 332dda5a2aec
Create Date: 2025-06-20 14:33:10.965867

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a3b555e10225'
down_revision: Union[str, None] = 'cadda064ebc8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.create_table(
        'notes',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('notiable_id', sa.Integer, nullable=True),
        sa.Column('notiable_type', sa.String(length=255), nullable=True),
        sa.Column('user_id', sa.Integer, nullable=True),
        sa.Column('added_by', sa.Integer, nullable=True),
        sa.Column('content', sa.Text, nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now(), nullable=False),
    )


def downgrade():
    op.drop_table('notes')



