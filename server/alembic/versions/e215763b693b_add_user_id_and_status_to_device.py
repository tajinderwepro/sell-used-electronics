"""Add user_id and status to Device

Revision ID: e215763b693b
Revises: cff9db3e63ab
Create Date: 2025-06-12 12:17:36.984184

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'e215763b693b'
down_revision: Union[str, None] = 'cff9db3e63ab'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column('devices', sa.Column('user_id', sa.Integer(), nullable=True))
    op.add_column('devices', sa.Column('status', sa.String(), nullable=True))
    op.create_foreign_key('fk_devices_user_id', 'devices', 'users', ['user_id'], ['id'])

def downgrade():
    op.drop_constraint('fk_devices_user_id', 'devices', type_='foreignkey')
    op.drop_column('devices', 'status')
    op.drop_column('devices', 'user_id')
