"""update the order table

Revision ID: 3858bf2b2433
Revises: 9b128330ca72
Create Date: 2025-06-19 12:01:14.257203
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '3858bf2b2433'
down_revision: Union[str, None] = '9b128330ca72'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Change orders.status from ENUM to VARCHAR (String)."""
    # First, alter the column type from enum to string
    op.alter_column(
        'orders',
        'status',
        type_=sa.String(),
        server_default='pending',
        existing_type=postgresql.ENUM(
            'pending', 'approved', 'shipped', 'delivered', name='order_statuses'),
        postgresql_using="status::text"
    )

    # Then, drop the ENUM type
    op.execute('DROP TYPE IF EXISTS order_statuses')


def downgrade() -> None:
    """Revert orders.status back to ENUM."""
    # Re-create the ENUM type
    enum_type = postgresql.ENUM('pending', 'approved', 'shipped', 'delivered', name='order_statuses')
    enum_type.create(op.get_bind(), checkfirst=True)

    # Change the column type back to ENUM
    op.alter_column(
        'orders',
        'status',
        type_=enum_type,
        existing_type=sa.String(),
        postgresql_using="status::order_statuses"
    )
