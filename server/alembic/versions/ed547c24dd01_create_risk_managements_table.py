"""create  risk_managements table

Revision ID: ed547c24dd01
Revises: b5b1c01d948f
Create Date: 2025-06-23 18:03:50.713887

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ed547c24dd01'
down_revision: Union[str, None] = 'b5b1c01d948f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.create_table(
        'risk_managements',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('key', sa.String(), nullable=True),
        sa.Column('value', sa.Text(), nullable=True),  
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('NOW()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('NOW()'), nullable=False)
    )

def downgrade():
    op.drop_table('risk_managements')


