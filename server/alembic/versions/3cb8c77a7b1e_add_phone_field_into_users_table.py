"""add phone field into  users table

Revision ID: 3cb8c77a7b1e
Revises: b01d4254ad66
Create Date: 2025-06-13 13:15:46.498469

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '3cb8c77a7b1e'
down_revision: Union[str, None] = 'b01d4254ad66'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None



def upgrade():
    op.add_column('users', sa.Column('phone', sa.Integer(), nullable=True))

def downgrade():
    op.drop_column('users', 'phone')
