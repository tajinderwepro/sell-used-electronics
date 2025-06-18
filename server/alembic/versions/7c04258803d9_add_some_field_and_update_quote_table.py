"""Add some field and update quote table

Revision ID: 7c04258803d9
Revises: ed6393bc2f22
Create Date: 2025-06-18 11:12:23.052444

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '7c04258803d9'
down_revision: Union[str, None] = 'ed6393bc2f22'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade():
    # 🔁 Drop old column
    op.drop_column('quotes', 'device_id')
    op.drop_column('quotes', 'created_at')

    # ➕ Add new foreign keys
    op.add_column('quotes', sa.Column('category_id', sa.Integer(), nullable=True))
    op.add_column('quotes', sa.Column('model_id', sa.Integer(), nullable=True))
    op.add_column('quotes', sa.Column('brand_id', sa.Integer(), nullable=True))

    # ➕ Add name fields
    op.add_column('quotes', sa.Column('category_name', sa.String(), nullable=True))
    op.add_column('quotes', sa.Column('model_name', sa.String(), nullable=True))
    op.add_column('quotes', sa.Column('brand_name', sa.String(), nullable=True))
    op.add_column('quotes', sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False))
    op.add_column('quotes', sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False))
    # ➕ Add relationship fields (already in model)
    op.create_foreign_key('fk_quotes_category_id', 'quotes', 'categories', ['category_id'], ['id'])
    op.create_foreign_key('fk_quotes_model_id', 'quotes', 'models', ['model_id'], ['id'])
    op.create_foreign_key('fk_quotes_brand_id', 'quotes', 'brands', ['brand_id'], ['id'])


def downgrade():
    op.drop_constraint('fk_quotes_brand_id', 'quotes', type_='foreignkey')
    op.drop_constraint('fk_quotes_model_id', 'quotes', type_='foreignkey')
    op.drop_constraint('fk_quotes_category_id', 'quotes', type_='foreignkey')

    op.drop_column('quotes', 'brand_name')
    op.drop_column('quotes', 'model_name')
    op.drop_column('quotes', 'category_name')
    op.drop_column('quotes', 'brand_id')
    op.drop_column('quotes', 'model_id')
    op.drop_column('quotes', 'category_id')
    op.drop_column('quotes', 'created_at')
    op.drop_column('quotes', 'updated_at')

    # ➕ Re-add old column
    op.add_column('quotes', sa.Column('device_id', sa.Integer(), nullable=True))
    op.add_column('quotes', sa.Column('created_at', sa.Integer(), nullable=True))


