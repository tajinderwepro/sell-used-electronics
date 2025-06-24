"""Add Shipment id into Orders table

Revision ID: 6e4169f6c19a
Revises: 5f8e41b64cd9
Create Date: 2025-06-24 13:27:58.589533

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '6e4169f6c19a'
down_revision: Union[str, None] = '5f8e41b64cd9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('quotes', sa.Column('shipment_id', sa.String(), nullable=True))
    op.add_column('quotes', sa.Column('shipment_retry_status', sa.Boolean(), nullable=False, server_default='false'))


def downgrade() -> None:
    op.drop_column('quotes', 'shipment_id')
    op.drop_column('quotes', 'shipment_retry_status')