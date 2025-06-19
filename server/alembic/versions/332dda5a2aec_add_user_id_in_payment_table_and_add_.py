"""add user_id in  payment_table and add some field in user table

Revision ID: 332dda5a2aec
Revises: 92dfc80cedc9
Create Date: 2025-06-19 15:43:17.816480

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '332dda5a2aec'
down_revision: Union[str, None] = '92dfc80cedc9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade():
    op.add_column('users', sa.Column('charges_enabled', sa.Boolean(), nullable=True))
    op.add_column('users', sa.Column('payouts_enabled', sa.Boolean(), nullable=True))
    op.add_column('users', sa.Column('details_submitted', sa.Boolean(), nullable=True))
    op.add_column('users', sa.Column('stripe_account_status', sa.String(), nullable=True))
    op.add_column('users', sa.Column('onboarding_completed_at', sa.DateTime(), nullable=True))

    # payments 
    op.add_column('payments', sa.Column('user_id', sa.Integer(), nullable=True))
    op.add_column('payments', sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False))
    op.add_column('payments', sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False))


def downgrade():
    op.drop_column('users', 'onboarding_completed_at')
    op.drop_column('users', 'details_submitted')
    op.drop_column('users', 'payouts_enabled')
    op.drop_column('users', 'charges_enabled')
    op.drop_column('users', 'stripe_account_status')
 # payment
    op.drop_column('payments', 'user_id')
    op.drop_column('payments', 'created_at')
    op.drop_column('payments', 'updated_at')
