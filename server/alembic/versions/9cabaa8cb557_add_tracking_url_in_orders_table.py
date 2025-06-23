"""add tracking_url in orders table

Revision ID: 9cabaa8cb557
Revises: a0b1ea8a6de2
Create Date: 2025-06-23 12:58:37.486892

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9cabaa8cb557'
down_revision: Union[str, None] = 'a0b1ea8a6de2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() :
    """Upgrade schema."""
    # Add tracking_url column to orders table
    op.add_column(
        'orders',
        sa.Column('tracking_url', sa.String(), nullable=True)
    )



def downgrade() :
    """Downgrade schema."""
    # Remove tracking_url column from orders table
    op.drop_column('orders', 'tracking_url')





    