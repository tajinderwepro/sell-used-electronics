"""add score to risk management

Revision ID: dc0d9f661180
Revises: bf813cfea547
Create Date: 2025-06-24 16:38:43.223155

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'dc0d9f661180'
down_revision: Union[str, None] = 'bf813cfea547'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column('risk_managements', sa.Column('score', sa.Integer(), nullable=True))


def downgrade():
    op.drop_column('risk_managements', 'score')