"""Make risk_score nullable

Revision ID: 425dab9622e2
Revises: 7c04258803d9
Create Date: 2025-06-18 12:12:09.184334

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '425dab9622e2'
down_revision: Union[str, None] = '7c04258803d9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.alter_column('quotes', 'created_at',
        existing_type=sa.DateTime(timezone=True),
        server_default=sa.text('now()')
    )
    op.alter_column('quotes', 'updated_at',
        existing_type=sa.DateTime(timezone=True),
        server_default=sa.text('now()')
    )
    op.alter_column('quotes', 'risk_score', nullable=True)

def downgrade():
    op.alter_column('quotes', 'created_at',
        existing_type=sa.DateTime(timezone=True),
        server_default=None
    )
    op.alter_column('quotes', 'updated_at',
        existing_type=sa.DateTime(timezone=True),
        server_default=None
    )
    op.alter_column('quotes', 'risk_score', nullable=False)