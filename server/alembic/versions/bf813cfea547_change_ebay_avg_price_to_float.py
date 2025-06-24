"""Change ebay_avg_price to float

Revision ID: bf813cfea547
Revises: 6e4169f6c19a
Create Date: 2025-06-24 15:01:31.528228

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'bf813cfea547'
down_revision: Union[str, None] = '6e4169f6c19a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.alter_column(
        'orders',
        'ebay_avg_price',
        existing_type=sa.String(),
        type_=sa.Float(),
        postgresql_using="ebay_avg_price::double precision"
    )

def downgrade():
    op.alter_column(
        'orders',
        'ebay_avg_price',
        existing_type=sa.Float(),
        type_=sa.String(),
        postgresql_using="ebay_avg_price::text"
    )