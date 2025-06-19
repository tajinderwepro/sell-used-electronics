"""Create logs table

Revision ID: 80411fe7cc61
Revises: 9b128330ca72
Create Date: 2025-06-19 11:52:56.433491

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '80411fe7cc61'
down_revision: Union[str, None] = '3858bf2b2433'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.create_table(
        'logs',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('action', sa.String(), index=True),
        sa.Column('description', sa.Text()),
        sa.Column('ip_address', sa.String()),
        sa.Column('os', sa.String()),
        sa.Column('browser', sa.String()),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
    ) 


def downgrade():
    op.drop_table('logs')
