"""add stripe_account_id field into users table

Revision ID: 92dfc80cedc9
Revises: b90e24d1acb2
Create Date: 2025-06-19 15:13:23.402410

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '92dfc80cedc9'
down_revision: Union[str, None] = 'b90e24d1acb2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
   op.add_column('users',  sa.Column('stripe_account_id', sa.String(length=255), nullable=True))


def downgrade():
   op.drop_column('users','stripe_account_id')