"""update phone datatype to bigInteger in users  table

Revision ID: ed6393bc2f22
Revises: 3cb8c77a7b1e
Create Date: 2025-06-13 17:05:52.699526

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'ed6393bc2f22'
down_revision: Union[str, None] = '3cb8c77a7b1e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.alter_column('users', 'phone', existing_type=sa.INTEGER(), type_=sa.BigInteger(), existing_nullable=True)

def downgrade():
    op.alter_column('users', 'phone', existing_type=sa.BigInteger(), type_=sa.INTEGER(), existing_nullable=True)


