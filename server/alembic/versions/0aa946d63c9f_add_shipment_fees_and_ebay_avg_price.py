"""add shipment_fees and ebay_avg_price

Revision ID: 0aa946d63c9f
Revises: ed547c24dd01
Create Date: 2025-06-24 12:10:46.290561

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = '0aa946d63c9f'
down_revision: Union[str, None] = 'ed547c24dd01'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column('orders', sa.Column('shipment_fees', postgresql.ARRAY(sa.Float), nullable=True))
    op.add_column('orders', sa.Column('ebay_avg_price', sa.String(), nullable=True))

def downgrade():
    op.drop_column('orders', 'ebay_avg_price')
    op.drop_column('orders', 'shipment_fees')
