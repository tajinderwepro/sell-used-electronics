"""add user_id and total_amount field into orders table

Revision ID: a0b1ea8a6de2
Revises: bf6b557ac8b4
Create Date: 2025-06-23 11:47:10.095995

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a0b1ea8a6de2'
down_revision: Union[str, None] = 'bf6b557ac8b4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column('orders', sa.Column('user_id', sa.Integer(), nullable=True))
    op.add_column('orders', sa.Column('total_amount', sa.String(), nullable=True))
    op.create_foreign_key('fk_orders_user_id', 'orders', 'users', ['user_id'], ['id'])


def downgrade():
    op.drop_constraint('fk_orders_user_id', 'orders', type_='foreignkey')
    op.drop_column('orders', 'total_amount')
    op.drop_column('orders', 'user_id')