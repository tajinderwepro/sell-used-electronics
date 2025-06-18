"""Create quote_histories table

Revision ID: efab10c90f9a
Revises: 425dab9622e2
Create Date: 2025-06-18 12:27:20.446859

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'efab10c90f9a'
down_revision: Union[str, None] = '425dab9622e2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.create_table(
        'quote_histories',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('model_id', sa.Integer(), sa.ForeignKey('models.id'), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('NOW()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('NOW()'), nullable=False)
    )


def downgrade():
    op.drop_table('quote_histories')