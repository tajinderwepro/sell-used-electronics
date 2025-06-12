"""Add created_at and updated_at to all tables

Revision ID: be41c6fac6ef
Revises: e215763b693b
Create Date: 2025-06-12 16:46:43.952932

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'be41c6fac6ef'
down_revision: Union[str, None] = 'e215763b693b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column('users', sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False))
    op.add_column('users', sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False))
    op.add_column('addresses', sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False))
    op.add_column('addresses', sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False))

    op.add_column('brands', sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False))
    op.add_column('brands', sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False))
    op.add_column('categories', sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False))
    op.add_column('categories', sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False))

    op.add_column('devices', sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False))
    op.add_column('devices', sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False))
    op.add_column('media', sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False))
    op.add_column('media', sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False))

    op.add_column('models', sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False))
    op.add_column('models', sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False))
    op.add_column('orders', sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False))
    op.add_column('orders', sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False))


def downgrade():
    op.drop_column('users', 'created_at')
    op.drop_column('users', 'updated_at')
    op.drop_column('addresses', 'created_at')
    op.drop_column('addresses', 'updated_at')
    op.drop_column('brands', 'created_at')
    op.drop_column('brands', 'updated_at')
    op.drop_column('categories', 'created_at')
    op.drop_column('categories', 'updated_at')
    op.drop_column('devices', 'created_at')
    op.drop_column('devices', 'updated_at')
    op.drop_column('media', 'created_at')
    op.drop_column('media', 'updated_at')
    op.drop_column('models', 'created_at')
    op.drop_column('models', 'updated_at')
    op.drop_column('orders', 'created_at')
    op.drop_column('orders', 'updated_at')
