"""Add FK relations to device for category, brand, model

Revision ID: b01d4254ad66
Revises: be41c6fac6ef
Create Date: 2025-06-12 17:21:04.840500

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'b01d4254ad66'
down_revision: Union[str, None] = 'be41c6fac6ef'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column('devices', sa.Column('category_id', sa.Integer(), nullable=True))
    op.add_column('devices', sa.Column('brand_id', sa.Integer(), nullable=True))
    op.add_column('devices', sa.Column('model_id', sa.Integer(), nullable=True))

    op.create_foreign_key(
        'fk_devices_category_id', 'devices', 'categories', ['category_id'], ['id']
    )
    op.create_foreign_key(
        'fk_devices_brand_id', 'devices', 'brands', ['brand_id'], ['id']
    )
    op.create_foreign_key(
        'fk_devices_model_id', 'devices', 'models', ['model_id'], ['id']
    )

def downgrade():
    op.drop_constraint('fk_devices_model_id', 'devices', type_='foreignkey')
    op.drop_constraint('fk_devices_brand_id', 'devices', type_='foreignkey')
    op.drop_constraint('fk_devices_category_id', 'devices', type_='foreignkey')

    op.drop_column('devices', 'model_id')
    op.drop_column('devices', 'brand_id')
    op.drop_column('devices', 'category_id')

