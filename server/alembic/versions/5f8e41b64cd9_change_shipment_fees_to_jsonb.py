"""Change shipment_fees to JSONB

Revision ID: 5f8e41b64cd9
Revises: 3a5af76bb05e
Create Date: 2025-06-24 12:46:50.140069

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '5f8e41b64cd9'
down_revision: Union[str, None] = '3a5af76bb05e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Drop the existing column (type: ARRAY(Float))
    op.drop_column("orders", "shipment_fees")

    # Add a new column with JSONB type
    op.add_column("orders", sa.Column("shipment_fees", postgresql.JSONB(), nullable=True))


def downgrade() -> None:
    # Drop the JSONB column
    op.drop_column("orders", "shipment_fees")

    # Recreate the old ARRAY(Float) column
    op.add_column("orders", sa.Column("shipment_fees", postgresql.ARRAY(sa.Float), nullable=True))
